// ============================================================
// useOnlineRoom — hook de alto nível do duelo 1v1 ONLINE
// ============================================================
// Encapsula a sala online sobre o useRoom genérico:
//   • cria o estado inicial (host) a partir do código da sala;
//   • dispara o `join` automático ao conectar (registra meu nick no estado oficial);
//   • reconcilia PRESENCE → players (quem some do presence sai da lista oficial,
//     decisão do host) pra o lobby refletir quem está realmente online;
//   • expõe ações claras (setReady, setConfig, start, leave).
//
// O código da sala É a seed (seedFromCode) — host e convidado recriam o mesmo
// torneio deterministicamente, sem o host precisar transmitir nada extra.

import { useCallback, useEffect, useRef } from "react";
import { useRoom } from "../../net/useRoom";
import type { RoomConfig } from "../tournamentReducer";
import type { Role } from "../../types";
import { ROLES } from "../../data/teams";
import {
  makeBots,
  buildBracket,
  propagate,
  applyResult,
  isTournamentOver,
  allMatches,
  type Bracket,
  type BracketMatch,
  type Competitor,
  type TournamentPick,
} from "../tournament";
import { makeRng, seedFromCode } from "../prng";
import { simulateBo5 } from "../series";
import { buildGameTimeline, type GameTimeline } from "../timeline";
import {
  BRACKET_SIZE,
  DRAFT_ROUNDS,
  allPickedThisRound,
  humansOf,
  initialRoomState,
  pendingThisRound,
  reduceRoom,
  type AutoPick,
  type CardChoice,
  type RoomIntent,
  type RoomState,
  type RoomPlayer,
  type SeriesCards,
  type SeriesState,
  type SideMatch as SideMatchT,
} from "./roomState";
import { playerRng, randomAutoPick } from "./draftPool";
import { seriesNarrationMs } from "./seriesNarration";
import { rollSymmetricEvent, bestCardIndex, botTarget } from "./cardEngine";
import { applyCardsToCompetitors } from "./seriesCards";

export interface UseOnlineRoom {
  /** snapshot oficial da sala (null até conectar/receber). */
  state: RoomState | null;
  /** sou o host autoritativo? */
  isHost: boolean;
  /** meu playerId (identidade do ticket). */
  myId: string | null;
  /** estado da conexão. */
  conn: string;
  /** sala encerrada (host saiu). */
  ended: boolean;
  /** presentes pela rede (presence) — pode divergir momentaneamente de players. */
  onlineCount: number;
  // ações
  setReady: (ready: boolean) => void;
  setConfig: (patch: Partial<RoomConfig>) => void;
  start: () => void;
  /** draft: registra meu pick da rodada atual. */
  draftPick: (role: Role, pick: TournamentPick) => void;
  /** host: inicia a série pendente do bracket (botão "Iniciar"). */
  startBracketSeries: () => void;
  /** subfase de cartas: registra MINHA escolha (carta + alvo) na minha série. */
  pickCard: (choice: CardChoice) => void;
  leave: () => void;
}

export function useOnlineRoom(opts: {
  room: string | null;
  isHost: boolean;
  nick: string;
}): UseOnlineRoom {
  const { room, isHost, nick } = opts;

  const reduce = useCallback(reduceRoom, []);
  const initial = room ? initialRoomState(room) : ({} as RoomState);

  const { view, dispatch, setHostState, leave } = useRoom<RoomState, RoomIntent>({
    room,
    isHost,
    nick,
    initialState: initial,
    reduce,
  });

  const myId = view?.me.playerId ?? null;

  // JOIN automático: re-dispara em INTERVALO enquanto EU não constar na lista
  // oficial do host. (Não basta uma vez só: se o 1º join se perder na corrida,
  // nada re-renderiza e o slot fica "conectando…" pra sempre. Um retry ativo a
  // cada 600ms resolve, e para assim que o host me registra.)
  const joined = view?.conn === "joined";
  const inOfficial = !!(view?.state && myId && view.state.players.some((p) => p.playerId === myId));
  useEffect(() => {
    if (!joined || !myId || inOfficial) return;
    dispatch({ kind: "join", nick }); // tenta já
    const id = setInterval(() => dispatch({ kind: "join", nick }), 600);
    return () => clearInterval(id);
  }, [joined, myId, nick, dispatch, inOfficial]);

  // RECONCILIAÇÃO presence → players (só o host, e só no LOBBY): remove quem sumiu
  // do presence. No draft/série NÃO removemos (a line "joga sozinha" se cair, §5.1).
  // Bônus: ver alguém NOVO no presence que ainda não pediu join faz o host reenviar
  // o snapshot (o cliente então re-dispara o join). Fecha a corrida do "conectando…".
  const hostReannounce = useRef("");
  // contador de ausências consecutivas no presence por jogador (carência p/ remoção).
  const absentCount = useRef(new Map<string, number>());
  useEffect(() => {
    if (!view?.isHost || !view.state) return;
    const st = view.state;
    const present = new Set(view.members.map((m) => m.playerId));
    present.add(view.me.playerId);

    if (st.phase === "lobby") {
      // CARÊNCIA: só remove um humano após ele ficar ausente do presence por 2
      // ciclos seguidos. Sem isso, um convidado que acabou de dar `join` mas cujo
      // presence ainda não chegou ao host era removido na hora (e travava a entrada).
      const ac = absentCount.current;
      const filtered = st.players.filter((p) => {
        if (p.isBot || present.has(p.playerId)) { ac.delete(p.playerId); return true; }
        const n = (ac.get(p.playerId) ?? 0) + 1;
        ac.set(p.playerId, n);
        return n < 2; // tolera 1 ciclo ausente; remove no 2º
      });
      if (filtered.length !== st.players.length) {
        setHostState({ ...st, players: filtered });
        return;
      }
    }
    // humano no presence ainda não registrado em players → reenvia o snapshot
    // (assina pelo conjunto presente pra não floodar). Bots não contam.
    const known = new Set(st.players.map((p) => p.playerId));
    const ghosts = [...present].filter((id) => !known.has(id));
    const sig = ghosts.sort().join(",");
    if (ghosts.length && hostReannounce.current !== sig) {
      hostReannounce.current = sig;
      setHostState({ ...st }); // rebroadcast → clientes não-registrados re-dão join
    } else if (!ghosts.length) {
      hostReannounce.current = "";
    }
  }, [view, setHostState]);

  // ── CONTROLE DO DRAFT (só o host) ──
  // O host é o relógio: quando os dois já escolheram (avanço antecipado) OU o
  // deadline zera, ele aplica auto-pick aleatório aos pendentes e avança a rodada
  // (ou conclui o draft → série). Roda num efeito que reage a state + tempo.
  const st = view?.state ?? null;
  const isHostNow = view?.isHost ?? false;
  // guarda contra avanço DUPLO: a última rodada (chave fase+round) já avançada.
  const advancedKeyRef = useRef<string>("");

  useEffect(() => {
    if (!isHostNow || !st || st.phase !== "draft" || st.players.length < 2) return;

    const code = st.code;
    const pickSeconds = st.config.pickSeconds;
    const roundKey = `draft:${st.draftRound}`;

    // gera os auto-picks dos pendentes (RNG por jogador+rodada, reproduzível).
    const buildAutopicks = (): AutoPick[] => {
      const out: AutoPick[] = [];
      for (const p of pendingThisRound(st)) {
        const rng = playerRng(code, p.playerId, st.draftRound * 101 + 7);
        const ap = randomAutoPick(rng, p.picks);
        if (ap) out.push({ playerId: p.playerId, role: ap.role, pick: ap.pick });
      }
      return out;
    };

    const doAdvance = () => {
      // idempotente por rodada: se já avancei ESTA rodada, ignora (evita pular fase).
      if (advancedKeyRef.current === roundKey) return;
      advancedKeyRef.current = roundKey;
      const autopicks = buildAutopicks();
      if (st.draftRound >= DRAFT_ROUNDS) {
        // monta as 8 lines finais (com auto-picks da última rodada) → bracket de 8.
        const competitors = st.players.map((p) => competitorFrom(p, autopicks));
        const rng = makeRng(seedFromCode(`${code}:bracket`));
        const bracket = buildBracket(rng, competitors);
        const byId = new Map(competitors.map((c) => [c.id, c]));
        const queue = orderQueueOnline(rng, bracket.qf, byId);
        dispatch({ kind: "finishDraft", autopicks, bracket, queue });
      } else {
        const nextDeadline = pickSeconds > 0 ? Date.now() + pickSeconds * 1000 : null;
        dispatch({ kind: "advanceRound", round: st.draftRound + 1, deadline: nextDeadline, autopicks });
      }
    };

    // 1) avanço antecipado: os dois já escolheram → avança já.
    if (allPickedThisRound(st)) {
      const t = setTimeout(doAdvance, 400); // respiro curto pra ver o "✓"
      return () => clearTimeout(t);
    }
    // 2) deadline: arma o avanço pra quando o relógio zerar.
    if (st.roundDeadline != null) {
      const ms = Math.max(0, st.roundDeadline - Date.now());
      const t = setTimeout(doAdvance, ms);
      return () => clearTimeout(t);
    }
    // 3) sem limite e nem todos escolheram → espera (sem timer).
  }, [isHostNow, st, dispatch]);

  // ── CONTROLE DO BRACKET (só o host) ──
  // Orquestra o torneio de 8: resolve as bot×bot rápido no fundo, abre a série
  // COM humano da fila (countdown 10s), narra (os clientes narram localmente a
  // partir do estado pré-simulado), aplica o resultado, propaga vencedores e
  // avança a fila. Quando a final termina → pódio.
  // ÂNCORA do fim da narração: o prazo de resolução de uma série precisa ser
  // ESTÁVEL entre re-renders. Como o efeito re-roda a cada heartbeat/broadcast
  // (a cada 3s), recalcular `Date.now() + duraçãoTotal` empurrava o prazo pra
  // frente sem parar → o host NUNCA resolvia → o convidado travava na tela de
  // resultado. Guardamos `endsAt` (timestamp absoluto) por chave (seedSalt/fase),
  // calculado UMA vez; re-renders reusam o mesmo prazo. (era a causa-raiz do bug.)
  const narrationEndRef = useRef(new Map<string, number>());
  // chave da última fase paralela JÁ resolvida (idempotência — evita resolver 2x e
  // garante que o disparo não se perca se o efeito re-rodar/cair noutro branch).
  const resolvedPhaseRef = useRef<string>("");
  /** prazo absoluto (ms) pro fim da narração de uma série, calculado 1x por chave. */
  const endsAtFor = (key: string, computeMs: () => number): number => {
    const m = narrationEndRef.current;
    const cached = m.get(key);
    if (cached != null) return cached;
    const at = Date.now() + computeMs();
    m.set(key, at);
    return at;
  };
  useEffect(() => {
    if (!isHostNow || !st || st.phase !== "bracket" || !st.bracket) return;
    const imersivo = st.config.pace === "imersivo";
    const competitors = st.players.map((p) => competitorFrom(p, []));
    const byId = new Map(competitors.map((c) => [c.id, c]));
    const code = st.code;
    // o HOST foi eliminado? (já jogou e não está em nenhum confronto pendente). Se
    // sim, a fase auto-inicia (ele virou espectador e não vê o botão "Iniciar").
    const hostId = view?.me.playerId ?? null;
    const b = st.bracket;
    const hostEliminated = !!hostId && !isTournamentOver(b) &&
      [...b.qf, ...b.sf, b.gf].some((m) => m.done && (m.a === hostId || m.b === hostId)) &&
      ![...b.qf, ...b.sf, b.gf].some((m) => !m.done && (m.a === hostId || m.b === hostId));

    // ── MODO PARALELO (único): todas as séries com humano da fase rodam juntas,
    // cada jogador vê a SUA. (O modo coletivo "uma por vez" foi removido.)
    {
      // (P.0) subfase de CARTAS: se alguma série da fase ainda tem cartas pendentes,
      // espera os jogadores escolherem (cada um a sua, 10s) e SÓ ENTÃO simula todas.
      if (st.parallelSeries.length && st.parallelSeries.some((s) => s.cards && (!s.cards.pickA || !s.cards.pickB))) {
        // dirigido por interval fixo (mesma robustez do resolveParallel) — o disparo
        // não se perde se o efeito re-rodar/cair noutro branch. Resolve quando todos
        // os HUMANOS já escolheram (bots não bloqueiam) OU o deadline (10s) passou.
        const cardsKey = "cards:" + st.parallelSeries.map((s) => s.seedSalt).sort().join(",");
        const deadline = st.parallelSeries.reduce((mx, s) => Math.max(mx, s.cards?.deadline ?? 0), 0);
        const tryResolveCards = () => {
          if (resolvedPhaseRef.current === cardsKey) return;
          const cur = view?.state ?? st;
          const series = cur.parallelSeries;
          const humansPicked = series.every((s) => {
            if (!s.cards) return true;
            const aBot = byId.get(s.aId)?.isBot ?? false;
            const bBot = byId.get(s.bId)?.isBot ?? false;
            return (aBot || !!s.cards.pickA) && (bBot || !!s.cards.pickB);
          });
          if (!humansPicked && Date.now() < deadline) return; // ainda escolhendo
          resolvedPhaseRef.current = cardsKey;
          const start = Date.now() + 1200;
          const resolved = series.map((s) => (s.cards ? simulateSeriesState(s, byId, code, start) : s));
          const sideMatches = rebaseSideMatches(cur.sideMatches, start + 1000);
          dispatch({ kind: "resolveCardsParallel", series: resolved, sideMatches });
        };
        tryResolveCards();
        const id = setInterval(tryResolveCards, 300);
        return () => clearInterval(id);
      }
      // séries rodando? aguarda a mais longa + bot×bot, aplica TUDO e avança. Os
      // fins por série usam o startDeadline ABSOLUTO da própria série (estável).
      // ROBUSTEZ: dirigido por INTERVAL FIXO + relógio absoluto (não por um
      // setTimeout que o cleanup do efeito poderia cancelar e nunca re-armar — esse
      // era o bug que deixava o HOST preso na série que perdeu, sem avançar o
      // bracket). Idempotente por chave de fase (resolvedPhaseRef).
      if (st.parallelSeries.length && st.parallelSeries.every((s) => s.games.length > 0)) {
        const sideEnd = st.sideMatches.reduce((mx, sm) => Math.max(mx, sm.schedule[sm.schedule.length - 1] ?? 0), 0);
        const seriesEnd = st.parallelSeries.reduce((mx, s) => {
          const start = s.startDeadline ?? Date.now();
          const key = `paralelo:${s.seedSalt}:${start}`;
          const endAt = endsAtFor(key, () => (start - Date.now()) + seriesNarrationMs(withTimelines(s, byId, code, imersivo), imersivo));
          return Math.max(mx, endAt);
        }, 0);
        const endAt = Math.max(seriesEnd, sideEnd);
        const phaseKey = st.parallelSeries.map((s) => s.seedSalt).sort().join(",");
        const tryResolve = () => {
          if (resolvedPhaseRef.current === phaseKey) return; // já resolvi esta fase
          if (Date.now() < endAt) return; // ainda narrando
          resolvedPhaseRef.current = phaseKey;
          const next = resolveParallel(st, byId, code);
          if (next.done) dispatch({ kind: "finishTournament", winnerId: next.winnerId!, bracket: next.bracket });
          else dispatch({ kind: "resolveBracketSeries", bracket: next.bracket, queue: next.queue, queueIndex: 0 });
        };
        tryResolve(); // checa já (caso o prazo já tenha passado)
        const id = setInterval(tryResolve, 300);
        return () => clearInterval(id);
      }
      // fase ARMADA (parallelPending): o host ATIVO clica "Iniciar rodada" (controle
      // manual). Mas se o host está ELIMINADO (espectador, não vê o botão), a fase
      // AUTO-INICIA — senão os jogadores ainda ativos ficariam presos pra sempre.
      if (st.parallelPending) {
        if (hostEliminated) {
          const { series, sideMatches } = buildParallelPhase(st, byId, code, imersivo);
          const t = setTimeout(() => dispatch({ kind: "startParallel", series, sideMatches }), 1500);
          return () => clearTimeout(t);
        }
        return; // host ativo: espera o clique no botão
      }
      // calcula a fase: se há séries com humano, arma; senão resolve bot×bot/avança.
      const plan = planParallelPhase(st, byId, code);
      if (plan.kind === "tournamentOver") dispatch({ kind: "finishTournament", winnerId: plan.winnerId, bracket: plan.bracket });
      else if (plan.kind === "resolvedBots") dispatch({ kind: "resolveBracketSeries", bracket: plan.bracket, queue: plan.queue, queueIndex: 0 });
      else if (plan.kind === "arm") {
        const t = setTimeout(() => dispatch({ kind: "armParallel" }), 300);
        return () => clearTimeout(t);
      }
      return;
    }
  }, [isHostNow, st, dispatch]);

  return {
    state: view?.state ?? null,
    isHost: view?.isHost ?? isHost,
    myId,
    conn: view?.conn ?? "idle",
    ended: view?.ended ?? false,
    onlineCount: view?.members.length ?? 0,
    setReady: useCallback((ready: boolean) => dispatch({ kind: "setReady", ready }), [dispatch]),
    setConfig: useCallback((patch: Partial<RoomConfig>) => dispatch({ kind: "setConfig", patch }), [dispatch]),
    start: useCallback(() => {
      const cur = view?.state;
      const secs = cur?.config.pickSeconds ?? 0;
      const deadline = secs > 0 ? Date.now() + secs * 1000 : null;
      // gera os BOTS preenchedores (até completar BRACKET_SIZE), determinístico
      // pela seed da sala. Convertidos de Competitor → RoomPlayer.
      const humans = cur ? humansOf(cur) : [];
      const need = Math.max(0, BRACKET_SIZE - humans.length);
      const rng = makeRng(seedFromCode(`${cur?.code ?? ""}:bots`));
      const bots: RoomPlayer[] = makeBots(rng, need).map((c) => ({
        playerId: c.id,
        nick: c.name,
        isHost: false,
        isBot: true,
        ready: true,
        picks: lineToPicks(c.line),
        pickedThisRound: true,
      }));
      dispatch({ kind: "start", deadline, bots });
    }, [dispatch, view?.state]),
    draftPick: useCallback((role: Role, pick: TournamentPick) => dispatch({ kind: "draftPick", role, pick }), [dispatch]),
    pickCard: useCallback((choice: CardChoice) => dispatch({ kind: "pickCard", choice }), [dispatch]),
    /** host: dispara TODAS as séries com humano da fase de uma vez (cada um vê a sua). */
    startBracketSeries: useCallback(() => {
      const cur = view?.state;
      if (!cur) return;
      const code = cur.code;
      const imersivo = cur.config.pace === "imersivo";
      const byId = new Map(cur.players.map((p) => [p.playerId, competitorFrom(p, [])]));
      const { series, sideMatches } = buildParallelPhase(cur, byId, code, imersivo);
      dispatch({ kind: "startParallel", series, sideMatches });
    }, [dispatch, view?.state]),
    leave,
  };
}

// ── helpers puros ──

/** Converte uma line (lista) num mapa por role (formato dos picks). */
function lineToPicks(line: TournamentPick[]): Partial<Record<Role, TournamentPick>> {
  const out: Partial<Record<Role, TournamentPick>> = {};
  for (const p of line) out[p.role] = p;
  return out;
}

/** Monta um Competitor a partir de um RoomPlayer + auto-picks pendentes. Preserva
 * isBot (o bracket precisa distinguir bot×bot). */
function competitorFrom(p: RoomPlayer, autopicks: AutoPick[]): Competitor {
  const picks = { ...p.picks };
  for (const a of autopicks) if (a.playerId === p.playerId && !picks[a.role]) picks[a.role] = a.pick;
  const line = ROLES.map((r) => picks[r]).filter((x): x is TournamentPick => !!x);
  const avg = line.length ? Math.round(line.reduce((s, x) => s + x.rating, 0) / line.length) : 0;
  return { id: p.playerId, name: p.nick, isBot: p.isBot, line, avg, form: {} };
}

/** Competidores EFETIVOS de uma série (com as cartas resolvidas aplicadas, se
 * houver). Se as cartas ainda não foram escolhidas, usa as lines cruas. */
function effectiveCompetitors(s: SeriesState, byId: Map<string, Competitor>, code: string): { a: Competitor; b: Competitor } | null {
  const a = byId.get(s.aId);
  const b = byId.get(s.bId);
  if (!a || !b) return null;
  if (s.cards && s.cards.pickA && s.cards.pickB) {
    return applyCardsToCompetitors(a, b, s.cards, code, s.seedSalt);
  }
  return { a, b };
}

/** REGENERA as timelines de uma série (determinístico por seedSalt + competidores
 * + cartas escolhidas). O estado trafega SEM timelines; host e clientes reidratam
 * localmente aplicando as MESMAS cartas (que trafegam) antes de simular. */
export function withTimelines(s: SeriesState, byId: Map<string, Competitor>, code: string, imersivo: boolean): SeriesState {
  if (!imersivo || s.timelines.length || !s.games.length) return s; // rápido/sem jogos/já hidratada
  const eff = effectiveCompetitors(s, byId, code);
  if (!eff) return s;
  const rng = makeRng(seedFromCode(`${code}:series:${s.seedSalt}`));
  simulateBo5(rng, eff.a, eff.b); // consome o rng na MESMA ordem do simulateSeriesState
  const timelines: GameTimeline[] = s.games.map((aWon, gi) =>
    buildGameTimeline({
      rng, gameNumber: gi + 1, aWon,
      lineA: eff.a.line, lineB: eff.b.line,
      nameA: { label: eff.a.name }, nameB: { label: eff.b.name },
      pentas: s.pentasByGame[gi] ?? [],
    })
  );
  return { ...s, timelines };
}

/** Monta a SeriesState de um confronto. Se `cards` (subfase de cartas) for dado,
 * a série fica AGUARDANDO escolhas — NÃO simula ainda (games vazio). Senão,
 * pré-simula a Bo5 na hora (caminho sem cartas). TIMELINES nunca entram aqui
 * (cada cliente as regenera por seedSalt). */
export function buildConfrontSeries(a: Competitor, b: Competitor, code: string, salt: string, cards: SeriesCards | null, startDeadline: number): SeriesState {
  if (cards) {
    return {
      aId: a.id, bId: b.id, seedSalt: salt, cards,
      startDeadline,
      scoreA: 0, scoreB: 0, finalA: 0, finalB: 0,
      games: [], pentasByGame: [],
      timelines: [], gameIndex: 0, eventIndex: 0, finished: false,
    };
  }
  const rng = makeRng(seedFromCode(`${code}:series:${salt}`));
  const sim = simulateBo5(rng, a, b);
  return {
    aId: a.id, bId: b.id, seedSalt: salt, cards: null,
    startDeadline,
    scoreA: 0, scoreB: 0,
    finalA: sim.finalA, finalB: sim.finalB,
    games: sim.games, pentasByGame: sim.pentasByGame,
    timelines: [], gameIndex: 0, eventIndex: 0, finished: false,
  };
}

/** Resolve a subfase de cartas de uma série: completa picks faltantes (auto-pick
 * aleatório p/ humano ausente, MELHOR carta p/ bot), aplica os efeitos às lines e
 * SIMULA a Bo5 com as lines efetivas. Devolve a série pronta pra narrar (cartas
 * com deadline zerado, games preenchidos). `start` = countdown de início. */
function simulateSeriesState(s: SeriesState, byId: Map<string, Competitor>, code: string, start: number): SeriesState {
  const a = byId.get(s.aId);
  const b = byId.get(s.bId);
  if (!a || !b || !s.cards) return s;
  const cards = completePicks(s.cards, a, b, code, s.seedSalt);
  const eff = applyCardsToCompetitors(a, b, cards, code, s.seedSalt);
  const rng = makeRng(seedFromCode(`${code}:series:${s.seedSalt}`));
  const sim = simulateBo5(rng, eff.a, eff.b);
  return {
    ...s,
    cards: { ...cards, deadline: null },
    startDeadline: start,
    finalA: sim.finalA, finalB: sim.finalB,
    games: sim.games, pentasByGame: sim.pentasByGame,
    timelines: [], gameIndex: 0, eventIndex: 0, finished: false, scoreA: 0, scoreB: 0,
  };
}

/** Preenche escolhas faltantes: bot pega a MELHOR; humano ausente recebe auto-pick
 * ALEATÓRIO (§design — risco de demorar). Determinístico por seed. */
function completePicks(cards: SeriesCards, a: Competitor, b: Competitor, code: string, salt: string): SeriesCards {
  const rng = makeRng(seedFromCode(`${code}:cardpick:${salt}`));
  const choose = (trio: SeriesCards["trioA"], c: Competitor, opp: Competitor, existing: CardChoice | null): CardChoice => {
    if (existing) return existing;
    const idx = c.isBot ? bestCardIndex(trio) : rng.int(trio.length); // bot: melhor; humano ausente: aleatório
    const card = trio[idx];
    const target = card.needsTarget ? botTarget(card, c.line, opp.line) : null;
    return { cardId: card.id, target };
  };
  return {
    ...cards,
    pickA: choose(cards.trioA, a, b, cards.pickA),
    pickB: choose(cards.trioB, b, a, cards.pickB),
  };
}

/** Ordena a fila de confrontos COM humano de uma fase: humano×humano primeiro,
 * depois humano×bot (aleatório entre cada grupo). bot×bot fica de fora (resolve
 * rápido no fundo). */
function orderQueueOnline(rng: { shuffle: <T>(a: T[]) => T[] }, matches: BracketMatch[], byId: Map<string, Competitor>): string[] {
  const isHuman = (id: string | null) => !!id && !byId.get(id)?.isBot;
  const hxh: BracketMatch[] = [];
  const hxb: BracketMatch[] = [];
  for (const m of matches) {
    if (!m.a || !m.b || m.done) continue;
    const ah = isHuman(m.a);
    const bh = isHuman(m.b);
    if (ah && bh) hxh.push(m);
    else if (ah || bh) hxb.push(m);
  }
  return [...rng.shuffle(hxh), ...rng.shuffle(hxb)].map((m) => m.id);
}

/** A fase atual (matches ainda não resolvidos): qf → sf → gf. */
export function currentStageMatches(b: Bracket): BracketMatch[] {
  if (b.qf.some((m) => !m.done)) return b.qf;
  if (b.sf.some((m) => !m.done)) return b.sf;
  return [b.gf];
}

/** Resolve TODAS as bot×bot prontas e não-jogadas do bracket (resultado direto,
 * sem narrar). Retorna o bracket atualizado e se algo mudou. */
export function resolveBotMatches(b: Bracket, byId: Map<string, Competitor>, code: string): { bracket: Bracket; changed: boolean } {
  let bracket = b;
  let changed = false;
  for (const m of allMatches(bracket)) {
    if (m.done || !m.a || !m.b) continue;
    const ca = byId.get(m.a);
    const cb = byId.get(m.b);
    if (!ca || !cb || !ca.isBot || !cb.isBot) continue; // só bot×bot
    const rng = makeRng(seedFromCode(`${code}:botseries:${m.id}`));
    const sim = simulateBo5(rng, ca, cb);
    bracket = propagate(applyResult(bracket, byId, m.id, sim.finalA, sim.finalB), byId);
    changed = true;
  }
  return { bracket, changed };
}

/** Re-agenda os schedules das bot×bot pra começarem a partir de `baseStart`
 * (preservando o ritmo relativo entre os jogos). Usado após a janela de cartas. */
function rebaseSideMatches(sideMatches: SideMatchT[], baseStart: number): SideMatchT[] {
  return sideMatches.map((sm) => {
    const first = sm.schedule[0] ?? baseStart;
    const offset = baseStart - first;
    const schedule = sm.schedule.map((t) => t + offset);
    return { ...sm, schedule };
  });
}

/** Monta a subfase de cartas de um confronto, SE a sala tem cartas ligadas e há
 * humano no confronto. Decisão determinística por seed (host/clientes batem). */
function maybeCards(st: RoomState, a: Competitor, b: Competitor, code: string, decisive: boolean): SeriesCards | null {
  if (!st.config.cardsOn) return null;
  if (a.isBot && b.isBot) return null; // bot×bot resolve rápido (com cartas internas, não interativas)
  const vsBot = a.isBot || b.isBot;
  const ev = rollSymmetricEvent(code, `${a.id}|${b.id}`, vsBot, decisive);
  if (!ev) return null;
  return { rarity: ev.rarity, hostile: ev.hostile, trioA: ev.trioA, trioB: ev.trioB, pickA: null, pickB: null, deadline: null };
}

/** O confronto é decisivo (semi/final)? — sobe a chance/intensidade das cartas. */
function isDecisiveStage(bracket: Bracket, matchId: string): boolean {
  return bracket.sf.some((m) => m.id === matchId) || bracket.gf.id === matchId;
}

// ── modo PARALELO ──

/** Confrontos COM humano da fase atual (não resolvidos). */
export function humanMatchesOfPhase(bracket: Bracket, byId: Map<string, Competitor>): BracketMatch[] {
  const stage = currentStageMatches(bracket);
  return stage.filter((m) => {
    if (m.done || !m.a || !m.b) return false;
    const ah = !byId.get(m.a)?.isBot;
    const bh = !byId.get(m.b)?.isBot;
    return ah || bh;
  });
}

type ParallelPlan =
  | { kind: "arm" }
  | { kind: "resolvedBots"; bracket: Bracket; queue: string[] }
  | { kind: "tournamentOver"; winnerId: string; bracket: Bracket };

/** Decide o que o host faz na fase, no modo paralelo: armar (há séries com humano),
 * resolver bot×bot/avançar fase, ou encerrar. */
function planParallelPhase(st: RoomState, byId: Map<string, Competitor>, code: string): ParallelPlan {
  const bracket = st.bracket!;
  if (isTournamentOver(bracket)) return { kind: "tournamentOver", winnerId: bracket.gf.winner!, bracket };
  if (humanMatchesOfPhase(bracket, byId).length > 0) return { kind: "arm" };
  // fase sem humano (só bots ou já resolvida) → resolve e avança.
  const botRes = resolveBotMatches(bracket, byId, code);
  if (botRes.changed) return { kind: "resolvedBots", bracket: botRes.bracket, queue: [] };
  if (isTournamentOver(botRes.bracket)) return { kind: "tournamentOver", winnerId: botRes.bracket.gf.winner!, bracket: botRes.bracket };
  return { kind: "resolvedBots", bracket: botRes.bracket, queue: [] };
}

/** Resolve TODO o resto do bracket DETERMINISTICAMENTE (por seed), a partir do
 * estado atual — usado pelo CONVIDADO eliminado pra chegar ao campeão SEM depender
 * dos snapshots finais do host (que podem se perder no Realtime). As séries com
 * humano são simuladas pela mesma seed (sem cartas, idêntico ao host; com cartas
 * dos outros, é uma aproximação — só afeta a visualização do espectador). */
export function completeBracketLocally(bracket: Bracket, byId: Map<string, Competitor>, code: string): Bracket {
  let b = bracket;
  let guard = 0;
  while (!isTournamentOver(b) && guard < 20) {
    guard++;
    let changed = false;
    for (const m of allMatches(b)) {
      if (m.done || !m.a || !m.b) continue;
      const a = byId.get(m.a);
      const cb = byId.get(m.b);
      if (!a || !cb) continue;
      // mesma seed das séries (humanas e bot usam salts distintos no host).
      const salt = a.isBot && cb.isBot ? `botseries:${m.id}` : `series:${m.id}`;
      const rng = makeRng(seedFromCode(`${code}:${salt}`));
      const sim = simulateBo5(rng, a, cb);
      b = propagate(applyResult(b, byId, m.id, sim.finalA, sim.finalB), byId);
      changed = true;
    }
    if (!changed) break;
  }
  return b;
}

/** Gera TODAS as séries com humano da fase + as bot×bot, todas começando juntas. */
function buildParallelPhase(st: RoomState, byId: Map<string, Competitor>, code: string, imersivo: boolean): { series: SeriesState[]; sideMatches: SideMatchT[] } {
  const bracket = st.bracket!;
  const stage = currentStageMatches(bracket);
  const humanMatches = humanMatchesOfPhase(bracket, byId);
  const start = Date.now() + 5_000;
  const series: SeriesState[] = humanMatches.map((m) => {
    const a = byId.get(m.a!)!;
    const b = byId.get(m.b!)!;
    const cards = maybeCards(st, a, b, code, isDecisiveStage(bracket, m.id));
    // no paralelo não há `seriesTick` do host pra abrir a janela de cartas; já
    // deixamos o deadline armado pro fim do countdown (start) + 10s de escolha.
    const cardsWithDeadline = cards ? { ...cards, deadline: start + 10_000 } : null;
    return buildConfrontSeries(a, b, code, m.id, cardsWithDeadline, start);
  });
  // bot×bot da fase (matches sem humano) — todas em paralelo, casadas com o início.
  const humanIds = new Set(humanMatches.map((m) => m.id));
  const perGameMs = imersivo ? 5000 : 600;
  const sideStage = stage.filter((m) => !humanIds.has(m.id));
  const sideMatches: SideMatchT[] = [];
  for (const m of sideStage) {
    if (m.done || !m.a || !m.b) continue;
    const ca = byId.get(m.a), cb = byId.get(m.b);
    if (!ca || !cb || !ca.isBot || !cb.isBot) continue;
    const srng = makeRng(seedFromCode(`${code}:botseries:${m.id}`));
    const sim = simulateBo5(srng, ca, cb);
    const schedule = sim.games.map((_, k) => start + (k + 1) * perGameMs + (srng.next() * 6000 - 3000));
    for (let k = 1; k < schedule.length; k++) if (schedule[k] <= schedule[k - 1]) schedule[k] = schedule[k - 1] + 500;
    sideMatches.push({ matchId: m.id, games: sim.games, finalA: sim.finalA, finalB: sim.finalB, schedule });
  }
  return { series, sideMatches };
}

/** Aplica os resultados de TODAS as séries paralelas + bot×bot ao bracket. */
function resolveParallel(st: RoomState, byId: Map<string, Competitor>, code: string): { bracket: Bracket; queue: string[]; done: boolean; winnerId?: string } {
  let bracket = st.bracket!;
  // séries com humano.
  for (const s of st.parallelSeries) {
    const m = allMatches(bracket).find((mm) => !mm.done && ((mm.a === s.aId && mm.b === s.bId) || (mm.a === s.bId && mm.b === s.aId)));
    if (m) {
      const aIsMatchA = m.a === s.aId;
      bracket = propagate(applyResult(bracket, byId, m.id, aIsMatchA ? s.finalA : s.finalB, aIsMatchA ? s.finalB : s.finalA), byId);
    }
  }
  // bot×bot.
  for (const sm of st.sideMatches) {
    const m = allMatches(bracket).find((mm) => mm.id === sm.matchId);
    if (m && !m.done) bracket = propagate(applyResult(bracket, byId, sm.matchId, sm.finalA, sm.finalB), byId);
  }
  bracket = resolveBotMatches(bracket, byId, code).bracket;
  if (isTournamentOver(bracket)) return { bracket, queue: [], done: true, winnerId: bracket.gf.winner! };
  return { bracket, queue: [], done: false };
}


