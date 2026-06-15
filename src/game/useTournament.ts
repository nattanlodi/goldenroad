import { useCallback, useEffect, useReducer, useRef } from "react";
import type { Role } from "../types";
import { DRAFT_TEAMS, ROLES } from "../data/teams";
import { gameWinProb } from "./helpers";
import { makeRng, seedFromCode, type Rng } from "./prng";
import {
  allMatches,
  applyResult,
  buildBracket,
  competitorLabel,
  FINALIST_TEAMS,
  lineAvg,
  makeBots,
  rollBotLine,
  teamToLine,
  type Bracket,
  type BracketMatch,
  type Competitor,
  type TournamentPick,
} from "./tournament";
import { buildGameTimeline, type GameTimeline } from "./timeline";
import {
  initialTournamentState,
  tournamentReducer,
  type LiveSeries,
  type RoomConfig,
  type TourHl,
  type TourSeries,
} from "./tournamentReducer";
import { competitorSubtitle, teamShortOf } from "./tournament";

// pool de FINALISTAS pro draft do humano (mesmo dos bots) — "torneio de elite".
const FINALIST_POOL = FINALIST_TEAMS;

/** Código de sala fixo no offline (gera a seed determinística). */
function makeRoomCode(rng: Rng): string {
  const hex = "0123456789ABCDEF";
  let s = "";
  for (let i = 0; i < 4; i++) s += hex[rng.int(16)];
  return `GOLD-${s}`;
}

/** Sorteia um time do pool de finalistas pro humano rolar (evita repetir o último). */
function rollTeam(rng: Rng, excludeId?: string): { id: string; line: TournamentPick[] } {
  const pool = FINALIST_POOL.filter((t) => t.id !== excludeId);
  const t = rng.pick(pool.length ? pool : FINALIST_POOL);
  return { id: t.id, line: teamToLine(t) };
}

/**
 * Simula uma Bo5 COMPLETA de forma determinística (Rng), aplicando a forma do dia
 * de cada lado (deltas por role que persistem entre fases). Retorna placar final,
 * resultados jogo-a-jogo e os pentakills reais por jogo.
 */
function simulateBo5(
  rng: Rng,
  a: Competitor,
  b: Competitor,
): { finalA: number; finalB: number; games: boolean[]; pentasByGame: { side: "a" | "b"; name: string }[][] } {
  const formAvg = (c: Competitor) =>
    c.line.reduce((acc, p) => acc + p.rating + (c.form[p.role] ?? 0), 0) / c.line.length;
  const pA = gameWinProb(formAvg(a), formAvg(b));

  const games: boolean[] = [];
  let wa = 0;
  let wb = 0;
  const pentasByGame: { side: "a" | "b"; name: string }[][] = [];

  // peso de penta por lane (igual ao motor: carries fecham mais).
  const PENTA_W: Record<Role, number> = { BOT: 1.0, MID: 0.6, TOP: 0.3, JNG: 0.12, SUP: 0.02 };
  const pickPenta = (line: TournamentPick[]): TournamentPick => {
    const w = (p: TournamentPick) => PENTA_W[p.role] * Math.pow(Math.max(1, p.rating - 60), 1.6);
    const tot = line.reduce((acc, p) => acc + w(p), 0);
    let r = rng.next() * tot;
    for (const p of line) {
      r -= w(p);
      if (r < 0) return p;
    }
    return line[line.length - 1];
  };

  while (wa < 3 && wb < 3) {
    const aWon = rng.next() < pA;
    games.push(aWon);
    if (aWon) wa++;
    else wb++;
    // pentakills independentes por lado (~12%).
    const pk: { side: "a" | "b"; name: string }[] = [];
    if (rng.chance(0.12)) pk.push({ side: "a", name: pickPenta(a.line).name });
    if (rng.chance(0.12)) pk.push({ side: "b", name: pickPenta(b.line).name });
    pentasByGame.push(pk);
  }
  return { finalA: wa, finalB: wb, games, pentasByGame };
}

// peso de penta por lane (carries fecham mais) — usado pra MVP/penta.
const PENTA_W_ROLE: Record<Role, number> = { BOT: 1.0, MID: 0.6, TOP: 0.3, JNG: 0.12, SUP: 0.02 };

/** Carry de maior peso de uma line (proxy de quem "carrega"). */
function carryOf(line: TournamentPick[]): TournamentPick {
  return line.reduce((best, p) => (PENTA_W_ROLE[p.role] * p.rating > PENTA_W_ROLE[best.role] * best.rating ? p : best), line[0]);
}

/** MVP de UM jogo de um lado: o autor do penta (se houve no lado), senão o carry. */
function gameMvpName(line: TournamentPick[], pentasOfGame: { side: "a" | "b"; name: string }[], side: "a" | "b"): string {
  const myPenta = pentasOfGame.find((p) => p.side === side);
  return myPenta ? myPenta.name : carryOf(line).name;
}

/**
 * Atualiza a forma do dia 🔥/🧊 após uma série (persiste). Igual ao solo:
 *  🔥 fogo: um jogador do VENCEDOR foi MVP de 2+ jogos da Bo5 (+3).
 *  🧊 gelado: após derrota, o jogador de menor overall esfria (−3).
 */
function updateForma(c: Competitor, won: boolean, games: boolean[], side: "a" | "b", pentasByGame: { side: "a" | "b"; name: string }[][]): Partial<Record<Role, number>> {
  const form: Partial<Record<Role, number>> = {};
  if (won) {
    // conta MVPs de jogo por jogador (só nos jogos que ESTE lado venceu).
    const mvpCount = new Map<string, number>();
    games.forEach((aWon, gi) => {
      const winSide: "a" | "b" = aWon ? "a" : "b";
      if (winSide !== side) return;
      const name = gameMvpName(c.line, pentasByGame[gi] ?? [], side);
      mvpCount.set(name, (mvpCount.get(name) ?? 0) + 1);
    });
    for (const p of c.line) {
      if ((mvpCount.get(p.name) ?? 0) >= 2) form[p.role] = 3;
    }
  } else {
    const weakest = c.line.reduce((w, p) => (p.rating < w.rating ? p : w), c.line[0]);
    form[weakest.role] = -3;
  }
  return form;
}

/**
 * Ordena a fila de uma FASE: humano×humano primeiro, depois humano×bot
 * (aleatório entre elas). bot×bot fica de FORA da fila (resolve no fundo).
 */
function orderQueue(rng: Rng, matches: BracketMatch[], byId: Map<string, Competitor>): string[] {
  const isHuman = (id: string | null) => !!id && !byId.get(id)?.isBot;
  const hxh: BracketMatch[] = [];
  const hxb: BracketMatch[] = [];
  for (const m of matches) {
    if (!m.a || !m.b || m.done) continue;
    const ah = isHuman(m.a);
    const bh = isHuman(m.b);
    if (ah && bh) hxh.push(m);
    else if (ah || bh) hxb.push(m);
    // bot×bot: não entra na fila.
  }
  return [...rng.shuffle(hxh), ...rng.shuffle(hxb)].map((m) => m.id);
}

const ROOM_KEY = "w60_tourney_seed";

/** Sons reusados do useGame (mesma instância de áudio: mesmo mute/AudioContext). */
export interface TournamentSounds {
  sndTick: () => void;
  sndPick: () => void;
  sndReveal: () => void;
  sndWin: () => void;
  sndLose: () => void;
  sndPenta: () => void;
  sndMvp: () => void;
}
const noop = () => {};
const NO_SOUND: TournamentSounds = { sndTick: noop, sndPick: noop, sndReveal: noop, sndWin: noop, sndLose: noop, sndPenta: noop, sndMvp: noop };

/**
 * Controller do modo "Worlds ao Vivo" (Degrau 0 — offline). Orquestra lobby →
 * draft (timer global + auto-pick) → bracket persistente (uma série por vez,
 * com timeline imersiva) → pódio. Tudo derivado de uma seed (determinístico).
 */
export function useTournament(active: boolean, sounds: TournamentSounds = NO_SOUND) {
  const soundsRef = useRef(sounds);
  soundsRef.current = sounds;
  // seed estável por sessão de torneio (deriva de um código de sala).
  const seedRef = useRef<number>(0);
  if (seedRef.current === 0) {
    // seed inicial baseada num código fixo guardado (ou gerado preguiçoso).
    seedRef.current = seedFromCode(ROOM_KEY);
  }

  const [state, dispatch] = useReducer(tournamentReducer, undefined, () => initialTournamentState(seedRef.current));
  const stateRef = useRef(state);
  stateRef.current = state;

  // Rng "mestre" — recriado a cada fase a partir da seed + um contador, pra cada
  // etapa ter sua própria sequência reproduzível.
  const rngRef = useRef<Rng>(makeRng(seedRef.current));

  const codeRef = useRef<string>(makeRoomCode(makeRng(seedRef.current)));

  const tickTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sideTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(
    () => () => {
      clearInterval(tickTimer.current);
      clearTimeout(stepTimer.current);
      clearTimeout(rollTimer.current);
      clearInterval(sideTimer.current);
    },
    [],
  );

  const byId = useCallback(
    () => new Map(stateRef.current.competitors.map((c) => [c.id, c])),
    [],
  );

  // ── LOBBY ──
  const setConfig = useCallback((patch: Partial<RoomConfig>) => dispatch({ type: "setConfig", patch }), []);

  /** Começa o torneio: cria humano(s) + bots, entra no draft com timer. */
  const startTournament = useCallback((myNick: string) => {
    const cfg = stateRef.current.config;
    const rng = makeRng(seedRef.current + 1);
    rngRef.current = rng;
    const humanCount = Math.max(1, cfg.humanCount);
    // offline: 1 humano (eu) + bots. (online: vários humanos — futuro.)
    const me: Competitor = {
      id: "me",
      name: myNick.trim() || "Você",
      isBot: false,
      line: [],
      avg: 0,
      form: {},
    };
    const bots = makeBots(rng, 8 - humanCount);
    const competitors = [me, ...bots];
    // pickSeconds === 0 → SEM tempo (avança só quando todos pickam) → sem deadline.
    const deadline = cfg.pickSeconds > 0 ? Date.now() + cfg.pickSeconds * 1000 : null;
    dispatch({ type: "startDraft", competitors, myId: "me", deadline });
  }, []);

  // ── DRAFT ──
  /**
   * Roleta de sorteio (igual ao solo): ~15 passos embaralhando times, com tick a
   * cada passo e desaceleração; no fim trava o time final e toca o "reveal".
   */
  const rollSeq = useCallback((finalTeamId: string) => {
    clearTimeout(rollTimer.current);
    const { sndTick, sndReveal } = soundsRef.current;
    const randomId = () => FINALIST_POOL[Math.floor(Math.random() * FINALIST_POOL.length)].id;
    dispatch({ type: "rollStep", displayId: randomId() });
    let i = 0;
    const total = 15;
    const step = () => {
      i++;
      if (i >= total) {
        sndReveal();
        dispatch({ type: "rollEnd", teamId: finalTeamId });
        return;
      }
      sndTick();
      dispatch({ type: "rollStep", displayId: randomId() });
      const delay = 45 + Math.pow(i / total, 2.5) * 230;
      rollTimer.current = setTimeout(step, delay);
    };
    rollTimer.current = setTimeout(step, 60);
  }, []);

  const roll = useCallback(() => {
    const st = stateRef.current;
    if (st.rolling) return;
    const { id } = rollTeam(rngRef.current, st.currentRollId ?? undefined);
    rollSeq(id);
  }, [rollSeq]);

  /** Resorteia OUTRO time (gasta 1 resorteio). */
  const rerollOther = useCallback(() => {
    const st = stateRef.current;
    if (st.rolling || st.rerolls <= 0) return;
    const { id } = rollTeam(rngRef.current, st.currentRollId ?? undefined);
    dispatch({ type: "rerollDec" });
    rollSeq(id);
  }, [rollSeq]);

  /** Resorteia o MESMO time noutro ano (gasta 1 resorteio), se existir no pool. */
  const rerollSame = useCallback(() => {
    const st = stateRef.current;
    if (st.rolling || st.rerolls <= 0 || !st.currentRollId) return;
    const cur = DRAFT_TEAMS.find((t) => t.id === st.currentRollId);
    if (!cur) return;
    const others = FINALIST_POOL.filter((t) => t.team === cur.team && t.id !== cur.id);
    if (!others.length) return;
    const t = rngRef.current.pick(others);
    dispatch({ type: "rerollDec" });
    rollSeq(t.id);
  }, [rollSeq]);

  /** Monta o bracket a partir das lines completas e vai pra tela "ir pros playoffs". */
  const finalizeDraft = useCallback((picksArg?: Partial<Record<Role, TournamentPick>>) => {
    const st = stateRef.current;
    const rng = rngRef.current;
    const picks = picksArg ?? st.myPicks;
    const myLine = ROLES.map((r) => picks[r]).filter((p): p is TournamentPick => !!p);
    const competitors = st.competitors.map((c) =>
      c.id === st.myId ? { ...c, line: myLine, avg: lineAvg(myLine) } : c,
    );
    const idMap = new Map(competitors.map((c) => [c.id, c]));
    const bracket = buildBracket(rng, competitors);
    // NÃO resolve as bot×bot aqui — cada fase é simulada só quando TODAS as séries
    // assistíveis (com humano) daquela fase terminam (ver advanceAfterSeries).
    const queue = orderQueue(rng, bracket.qf, idMap);
    dispatch({
      type: "draftReady",
      competitors,
      bracket,
      queue,
      draftedDeadline: Date.now() + 30_000, // auto-avança em 30s se ninguém clicar
    });
  }, []);

  /** Entra de fato no bracket (todos confirmaram ou o timeout de 30s estourou). */
  const enterBracket = useCallback(() => {
    const st = stateRef.current;
    dispatch({ type: "enterBracket", startDeadline: st.queue.length ? Date.now() + 10_000 : Date.now() });
  }, []);

  /** O humano confirma "ir pros playoffs". Se todos os humanos confirmaram, entra já. */
  const confirmReady = useCallback(() => {
    const st = stateRef.current;
    if (st.phase !== "drafted") return;
    dispatch({ type: "confirmReady", id: st.myId });
    const humans = st.competitors.filter((c) => !c.isBot).map((c) => c.id);
    const ready = new Set([...st.readyIds, st.myId]);
    if (humans.every((h) => ready.has(h))) enterBracket();
  }, [enterBracket]);

  /**
   * Auto-pick da RODADA atual (timer zerou): sorteia UMA lane ainda vazia e um
   * jogador ALEATÓRIO dela no pool de finalistas (sem olhar overall — é o risco
   * de deixar zerar). Preenche SÓ essa lane e avança a rodada (ou finaliza se foi
   * a última). NÃO decide o time todo de uma vez.
   */
  const autoPickRound = useCallback(() => {
    const st = stateRef.current;
    if (st.phase !== "draft") return;
    clearTimeout(rollTimer.current); // corta uma roleta em andamento, se houver
    const rng = rngRef.current;
    const emptyRoles = ROLES.filter((r) => !st.myPicks[r]);
    if (!emptyRoles.length) return;
    // 1 lane vazia sorteada.
    const role = rng.pick(emptyRoles);
    // jogador aleatório dessa lane no pool (sem olhar overall).
    const candidates = FINALIST_POOL.flatMap((t) => {
      const e = t.players.find((p) => p[0] === role);
      return e ? [{ t, e }] : [];
    });
    const { t, e } = rng.pick(candidates);
    const pick: TournamentPick = { role, name: e[1], rating: e[2], country: e[3], team: t.team, short: t.short, year: t.year, league: t.league };
    soundsRef.current.sndPick();
    dispatch({ type: "pickPlayer", role, pick });
    const filled = Object.keys({ ...st.myPicks, [role]: pick }).length;
    if (filled >= 5) {
      clearInterval(tickTimer.current);
      stepTimer.current = setTimeout(() => finalizeDraft({ ...st.myPicks, [role]: pick }), 700);
    } else {
      const deadline = st.config.pickSeconds > 0 ? Date.now() + st.config.pickSeconds * 1000 : null;
      dispatch({ type: "draftDeadline", deadline, round: filled + 1 });
    }
  }, [finalizeDraft]);

  const pickPlayer = useCallback((role: Role) => {
    const st = stateRef.current;
    if (st.rolling || !st.currentRollId) return; // não escolhe no meio da roleta
    if (st.myPicks[role]) return; // lane já preenchida
    const team = DRAFT_TEAMS.find((t) => t.id === st.currentRollId);
    if (!team) return;
    const entry = team.players.find((p) => p[0] === role);
    if (!entry) return;
    soundsRef.current.sndPick();
    const pick: TournamentPick = {
      role,
      name: entry[1],
      rating: entry[2],
      country: entry[3],
      team: team.team,
      short: team.short,
      year: team.year,
      league: team.league,
    };
    dispatch({ type: "pickPlayer", role, pick });
    // avança a rodada (ou finaliza se completou as 5). No offline o draft é ágil:
    // escolher já passa de rodada com o relógio reiniciado.
    const nextPicks = { ...st.myPicks, [role]: pick };
    const filled = Object.keys(nextPicks).length;
    if (filled >= 5) {
      clearInterval(tickTimer.current);
      // pequeno respiro pra ver a 5ª escolha antes de montar o bracket.
      stepTimer.current = setTimeout(() => finalizeDraft(nextPicks), 700);
    } else {
      // sem tempo (pickSeconds 0) → não rearma deadline; só o pick avança a rodada.
      const deadline = st.config.pickSeconds > 0 ? Date.now() + st.config.pickSeconds * 1000 : null;
      dispatch({ type: "draftDeadline", deadline, round: filled + 1 });
    }
  }, [finalizeDraft]);

  // tick do timer de DRAFT: ao zerar, auto-pick SÓ DESTA RODADA (1 lane) e avança.
  useEffect(() => {
    if (state.phase !== "draft" || state.draftDeadline == null) return;
    clearInterval(tickTimer.current);
    tickTimer.current = setInterval(() => {
      const st = stateRef.current;
      if (st.draftDeadline == null) return;
      if (Date.now() >= st.draftDeadline) {
        clearInterval(tickTimer.current);
        autoPickRound();
      }
    }, 250);
    return () => clearInterval(tickTimer.current);
  }, [state.phase, state.draftDeadline, autoPickRound]);

  // AUTO-ROLL: a rodada começa e o time já rola sozinho pro jogador (não precisa
  // clicar "Rolar"). Dispara quando não há time travado nem roleta em andamento e
  // a line ainda tem lanes vazias. (`roll()` muta rolling→true, quebrando a
  // condição, então não há loop.)
  useEffect(() => {
    if (state.phase !== "draft") return;
    if (state.rolling || state.currentRollId) return;
    const filled = ROLES.filter((r) => state.myPicks[r]).length;
    if (filled >= 5) return;
    const id = setTimeout(() => {
      const st = stateRef.current;
      if (st.phase === "draft" && !st.rolling && !st.currentRollId && ROLES.filter((r) => st.myPicks[r]).length < 5) {
        roll();
      }
    }, 220); // pequeno respiro entre rodadas (deixa a escolha anterior "assentar")
    return () => clearTimeout(id);
  }, [state.phase, state.rolling, state.currentRollId, state.draftRound, state.myPicks, roll]);

  // AUTO-AVANÇO da tela "ir pros playoffs": se ninguém clicar em 30s, entra sozinho.
  useEffect(() => {
    if (state.phase !== "drafted" || state.draftedDeadline == null) return;
    clearInterval(tickTimer.current);
    tickTimer.current = setInterval(() => {
      const st = stateRef.current;
      if (st.phase !== "drafted" || st.draftedDeadline == null) return;
      if (Date.now() >= st.draftedDeadline) {
        clearInterval(tickTimer.current);
        enterBracket();
      }
    }, 250);
    return () => clearInterval(tickTimer.current);
  }, [state.phase, state.draftedDeadline, enterBracket]);

  // ── BRACKET ──
  /** Inicia (abre) a série atual da fila: simula a Bo5 inteira e monta a timeline. */
  const openCurrentSeries = useCallback(() => {
    const st = stateRef.current;
    if (!st.bracket) return;
    const matchId = st.queue[st.queueIndex];
    if (!matchId) return;
    const match = allMatches(st.bracket).find((m) => m.id === matchId);
    if (!match || !match.a || !match.b) return;
    const idMap = new Map(st.competitors.map((c) => [c.id, c]));
    const a = idMap.get(match.a)!;
    const b = idMap.get(match.b)!;
    const rng = makeRng(seedRef.current + 1000 + hashId(matchId));
    const sim = simulateBo5(rng, a, b);
    const imersivo = st.config.pace === "imersivo";
    const timelines: GameTimeline[] = imersivo
      ? sim.games.map((aWon, gi) =>
          buildGameTimeline({
            rng,
            gameNumber: gi + 1,
            aWon,
            lineA: a.line,
            lineB: b.line,
            nameA: { label: shortName(a) },
            nameB: { label: shortName(b) },
            pentas: sim.pentasByGame[gi] ?? [],
          }),
        )
      : [];
    const live: LiveSeries = {
      matchId,
      aId: a.id,
      bId: b.id,
      scoreA: 0,
      scoreB: 0,
      finalA: sim.finalA,
      finalB: sim.finalB,
      games: sim.games,
      pentasByGame: sim.pentasByGame,
      timelines,
      gameIndex: 0,
      eventIndex: 0,
      finished: !imersivo, // modo rápido: já mostra o placar final
    };
    if (!imersivo) {
      // rápido: placar já é o final.
      live.scoreA = sim.finalA;
      live.scoreB = sim.finalB;
    }

    // ── bot×bot da MESMA fase rodando em paralelo (placar parcial no bracket) ──
    // cada jogo delas revela CASADO com a minha série (game k ~ quando meu game k
    // termina), com defasagem aleatória de ±4s pra não ficar robótico.
    const stage = match.stage;
    const stageMatches = stage === "qf" ? st.bracket.qf : stage === "sf" ? st.bracket.sf : [st.bracket.gf];
    // tempo ESTIMADO de cada jogo da minha série (pra basear o cronograma das bot×bot).
    const perGameMs = imersivo
      ? (timelines.reduce((a, t) => a + t.events.length, 0) / Math.max(1, timelines.length)) * 950 + 1400
      : 600; // rápido: revela rapidinho
    const now = Date.now();
    const sideMatches = stageMatches
      .filter((m) => !m.done && m.a && m.b && idMap.get(m.a)?.isBot && idMap.get(m.b)?.isBot && m.id !== matchId)
      .map((m) => {
        const ca = idMap.get(m.a!)!;
        const cb = idMap.get(m.b!)!;
        const srng = makeRng(seedFromHash(m.id));
        const ssim = simulateBo5(srng, ca, cb);
        // cronograma: game k revela ~ (k+1)*perGameMs ± 3s (jitter por jogo).
        const schedule = ssim.games.map((_, k) => {
          const jitter = (srng.next() * 6000) - 3000; // [-3s, +3s]
          return now + (k + 1) * perGameMs + jitter;
        });
        // garante ordem crescente (um jogo nunca antes do anterior).
        for (let k = 1; k < schedule.length; k++) if (schedule[k] <= schedule[k - 1]) schedule[k] = schedule[k - 1] + 500;
        return {
          matchId: m.id,
          games: ssim.games,
          scoreA: 0,
          scoreB: 0,
          revealed: 0,
          schedule,
          finalA: ssim.finalA,
          finalB: ssim.finalB,
        };
      });

    dispatch({ type: "openSeries", live, sideMatches });
  }, []);

  // tick do countdown de INÍCIO de série (10s).
  useEffect(() => {
    if (state.phase !== "bracket" || state.startDeadline == null || state.live) return;
    clearInterval(tickTimer.current);
    tickTimer.current = setInterval(() => {
      const st = stateRef.current;
      if (st.startDeadline == null || st.live) return;
      if (Date.now() >= st.startDeadline) {
        clearInterval(tickTimer.current);
        openCurrentSeries();
      }
    }, 200);
    return () => clearInterval(tickTimer.current);
  }, [state.phase, state.startDeadline, state.live, openCurrentSeries]);

  /** Começar a série agora (humano clicou "jogar"). */
  const startSeriesNow = useCallback(() => {
    clearInterval(tickTimer.current);
    openCurrentSeries();
  }, [openCurrentSeries]);

  // motor da TIMELINE imersiva: avança evento a evento / jogo a jogo.
  useEffect(() => {
    if (state.phase !== "bracket" || !state.live || state.live.finished) return;
    if (state.config.pace !== "imersivo") return;
    clearTimeout(stepTimer.current);
    const EVENT_MS = 950; // ritmo dos eventos
    const GAME_GAP_MS = 1400; // pausa entre jogos
    stepTimer.current = setTimeout(() => {
      const st = stateRef.current;
      const live = st.live;
      if (!live || live.finished) return;
      const tl = live.timelines[live.gameIndex];
      if (!tl) return;
      const snd = soundsRef.current;
      const iAmA = live.aId === st.myId;
      // ainda há eventos neste jogo?
      if (live.eventIndex < tl.events.length - 1) {
        const nextEv = tl.events[live.eventIndex + 1];
        // som só nos DESTAQUES (pra não poluir): penta forte, objetivos grandes um toque suave.
        if (nextEv?.icon === "⚔") snd.sndPenta();
        else if (nextEv?.big) snd.sndMvp();
        dispatch({ type: "advanceTimeline", live: { ...live, eventIndex: live.eventIndex + 1 } });
        return;
      }
      // jogo terminou: atualiza placar e passa pro próximo (ou finaliza).
      const aWon = tl.aWon;
      const scoreA = live.scoreA + (aWon ? 1 : 0);
      const scoreB = live.scoreB + (aWon ? 0 : 1);
      const lastGame = live.gameIndex >= live.timelines.length - 1;
      // som do fim de jogo: vitória/derrota do MEU lado.
      const youWonGame = aWon === iAmA;
      if (lastGame) (youWonGame ? snd.sndWin : snd.sndLose)();
      else snd.sndReveal();
      dispatch({
        type: "advanceTimeline",
        live: {
          ...live,
          scoreA,
          scoreB,
          gameIndex: lastGame ? live.gameIndex : live.gameIndex + 1,
          eventIndex: 0,
          finished: lastGame,
        },
      });
    }, currentStepMs(state.live, EVENT_MS, GAME_GAP_MS));
    return () => clearTimeout(stepTimer.current);
  }, [state.phase, state.live, state.config.pace]);

  // SÉRIE TERMINOU → registra no histórico NA HORA (já aparece no card "avança!").
  useEffect(() => {
    const live = state.live;
    if (!live || !live.finished) return;
    if (state.recordedMatchIds.includes(live.matchId)) return;
    const idMap = new Map(state.competitors.map((c) => [c.id, c]));
    const stage = allMatches(state.bracket!).find((m) => m.id === live.matchId)?.stage ?? "qf";
    const played = buildPlayed(live, idMap, state.myId, stage);
    dispatch({ type: "recordSeries", matchId: live.matchId, played });
  }, [state.live, state.recordedMatchIds, state.competitors, state.bracket, state.myId]);

  // TICK das bot×bot paralelas: revela os jogos no horário do cronograma (casado
  // com a minha série ± jitter). Atualiza o placar parcial no bracket.
  useEffect(() => {
    if (state.phase !== "bracket" || !state.sideMatches.length) return;
    const pending = state.sideMatches.some((s) => s.revealed < s.games.length);
    if (!pending) return;
    clearInterval(sideTimer.current);
    sideTimer.current = setInterval(() => {
      const st = stateRef.current;
      if (!st.sideMatches.length || !st.bracket) { clearInterval(sideTimer.current); return; }
      const now = Date.now();
      let changed = false;
      const justDone: { matchId: string }[] = [];
      const next = st.sideMatches.map((s) => {
        const wasDone = s.revealed >= s.games.length;
        let revealed = s.revealed, scoreA = s.scoreA, scoreB = s.scoreB;
        while (revealed < s.games.length && s.schedule[revealed] <= now) {
          if (s.games[revealed]) scoreA++; else scoreB++;
          revealed++;
          changed = true;
        }
        const nowDone = revealed >= s.games.length;
        if (!wasDone && nowDone) justDone.push({ matchId: s.matchId });
        return revealed !== s.revealed ? { ...s, revealed, scoreA, scoreB } : s;
      });
      if (!changed) return;

      // bot×bot que ACABARAM agora → aplica no bracket REAL (propaga o vencedor
      // pra próxima fase) + persiste a forma do dia dos bots.
      if (justDone.length) {
        let bracket = st.bracket;
        const idMap = new Map(st.competitors.map((c) => [c.id, c]));
        for (const d of justDone) {
          const s = next.find((x) => x.matchId === d.matchId)!;
          bracket = applyResult(bracket, idMap, d.matchId, s.finalA, s.finalB);
          const m = allMatches(bracket).find((x) => x.id === d.matchId)!;
          const ca = idMap.get(m.a!), cb = idMap.get(m.b!);
          if (ca && cb) {
            const ssim = simulateBo5(makeRng(seedFromHash(d.matchId)), ca, cb);
            const aWon = s.finalA > s.finalB;
            idMap.set(ca.id, { ...ca, form: updateForma(ca, aWon, ssim.games, "a", ssim.pentasByGame) });
            idMap.set(cb.id, { ...cb, form: updateForma(cb, !aWon, ssim.games, "b", ssim.pentasByGame) });
          }
        }
        const comps = Array.from(idMap.values());
        // se uma bot×bot resolveu a FINAL → encerra o torneio com o bracket certo.
        if (isOver(bracket)) {
          clearInterval(sideTimer.current);
          dispatch({ type: "finish", championId: bracket.gf.winner!, bracket, competitors: comps });
          return;
        }
        dispatch({ type: "tickSideMatches", sideMatches: next, bracket, competitors: comps });
      } else {
        dispatch({ type: "tickSideMatches", sideMatches: next });
      }
      if (next.every((s) => s.revealed >= s.games.length)) clearInterval(sideTimer.current);
    }, 250);
    return () => clearInterval(sideTimer.current);
  }, [state.phase, state.sideMatches]);

  /** Avança o bracket após a série atual terminar (resolve, monta próxima fase). */
  const advanceAfterSeries = useCallback(() => {
    const st = stateRef.current;
    if (!st.bracket || !st.live) return;
    const rng = rngRef.current;
    const live = st.live;
    const idMap = new Map(st.competitors.map((c) => [c.id, c]));

    // 1) aplica o resultado da série assistida no bracket.
    let bracket = applyResult(st.bracket, idMap, live.matchId, live.finalA, live.finalB);

    // 2) aplica a forma do dia 🔥/🧊 aos dois competidores (persiste entre fases).
    const a = idMap.get(live.aId)!;
    const b = idMap.get(live.bId)!;
    const aWon = live.finalA > live.finalB;
    let competitors = st.competitors.map((c) => {
      if (c.id === a.id) return { ...c, form: updateForma(a, aWon, live.games, "a", live.pentasByGame) };
      if (c.id === b.id) return { ...c, form: updateForma(b, !aWon, live.games, "b", live.pentasByGame) };
      return c;
    });
    let workMap = new Map(competitors.map((c) => [c.id, c]));

    // qual fase a série que acabou pertence (qf/sf/gf).
    const curStage = allMatches(bracket).find((m) => m.id === live.matchId)?.stage ?? "qf";

    let queue = st.queue;
    let queueIndex = st.queueIndex + 1;

    // 3) ainda há séries ASSISTÍVEIS nesta fase? espera elas (não resolve nada).
    //    Só quando TODAS as séries com humano da fase terminam é que a fase fecha:
    //    aí resolvemos as bot×bot DESTA fase e passamos pra próxima.
    if (queueIndex >= queue.length) {
      // (a) fecha a fase atual: resolve as bot×bot que faltaram dela.
      const resCur = resolveBotMatches(bracket, workMap, curStage);
      bracket = resCur.bracket;
      competitors = Array.from(workMap.values());
      workMap = new Map(competitors.map((c) => [c.id, c]));

      // (b) sobe pras próximas fases: enfileira as assistíveis; se a fase não tem
      //     nenhuma (humano já eliminado), resolve as bot×bot dela e segue.
      queue = [];
      queueIndex = 0;
      while (!isOver(bracket)) {
        const stage = nextStageOf(bracket);
        if (!stage) break;
        const stageMatches = (stage === "sf" ? bracket.sf : [bracket.gf]).map(
          (m) => allMatches(bracket).find((x) => x.id === m.id)!,
        );
        const q = orderQueue(rng, stageMatches, workMap);
        if (q.length) { queue = q; break; } // achou fase com série assistível
        // fase só de bots → resolve e continua subindo.
        const res = resolveBotMatches(bracket, workMap, stage);
        bracket = res.bracket;
        competitors = Array.from(workMap.values());
        workMap = new Map(competitors.map((c) => [c.id, c]));
      }
    }

    // 4) torneio acabou? (salva o bracket FINAL — pra o pódio/classificação baterem)
    if (isOver(bracket)) {
      dispatch({ type: "finish", championId: bracket.gf.winner!, bracket, competitors });
      return;
    }

    const more = queueIndex < queue.length;
    dispatch({
      type: "resolveMatch",
      bracket,
      competitors,
      queue,
      queueIndex,
      startDeadline: more ? Date.now() + 10_000 : Date.now(),
    });
  }, []);

  // ── RESET ──
  const reset = useCallback(() => {
    clearInterval(tickTimer.current);
    clearTimeout(stepTimer.current);
    clearTimeout(rollTimer.current);
    seedRef.current = (seedRef.current + 0x9e3779b9) >>> 0; // nova seed
    codeRef.current = makeRoomCode(makeRng(seedRef.current));
    dispatch({ type: "reset", seed: seedRef.current });
  }, []);

  void active;

  return {
    state,
    code: codeRef.current,
    competitorLabel,
    byId,
    // lobby
    setConfig,
    startTournament,
    // draft
    roll,
    rerollOther,
    rerollSame,
    pickPlayer,
    finalizeDraft,
    // draft pronto → playoffs
    confirmReady,
    // bracket
    startSeriesNow,
    advanceAfterSeries,
    // meta
    reset,
  };
}

// ── helpers internos ──

const STAGE_LABEL: Record<"qf" | "sf" | "gf", string> = { qf: "Quartas", sf: "Semifinal", gf: "Grande Final" };

/**
 * Constrói o registro de HISTÓRICO de uma série assistida, do ponto de vista do
 * humano (myId). Mapeia o lado "a"/"b" da simulação pra "you"/"opp" e deriva um
 * MVP por jogo (penta do vencedor, senão o carry de maior overall) e da série.
 */
function buildPlayed(live: LiveSeries, idMap: Map<string, Competitor>, myId: string, stage: "qf" | "sf" | "gf"): TourSeries {
  const a = idMap.get(live.aId)!;
  const b = idMap.get(live.bId)!;
  const iAmA = a.id === myId;
  const youComp = iAmA ? a : b;
  const oppComp = iAmA ? b : a;
  const sideToPersp = (s: "a" | "b"): "you" | "opp" => (s === "a" ? (iAmA ? "you" : "opp") : (iAmA ? "opp" : "you"));
  const lineOfSide = (s: "a" | "b") => (s === "a" ? a.line : b.line);
  const find = (s: "a" | "b", name: string): TournamentPick | undefined => lineOfSide(s).find((p) => p.name === name);

  const games = live.games.map((aWon, gi) => {
    const winSide: "a" | "b" = aWon ? "a" : "b";
    const pentasRaw = live.pentasByGame[gi] ?? [];
    const pentas: TourHl[] = pentasRaw.map((pk) => {
      const p = find(pk.side, pk.name);
      return { side: sideToPersp(pk.side), role: p?.role ?? "MID", name: pk.name, country: p?.country };
    });
    // mvp do jogo: mesmo critério da forma (penta do vencedor, senão carry).
    const mvpName = gameMvpName(lineOfSide(winSide), pentasRaw, winSide);
    const mp = find(winSide, mvpName);
    const cp: TourHl = { side: sideToPersp(winSide), role: mp?.role ?? "MID", name: mvpName, country: mp?.country };
    return { youWon: sideToPersp(winSide) === "you", pentas, mvp: cp };
  });

  const yourGames = iAmA ? live.finalA : live.finalB;
  const oppGames = iAmA ? live.finalB : live.finalA;
  const won = yourGames > oppGames;
  // mvp da série: jogador (do lado vencedor) com mais MVPs de jogo.
  const winnerPersp: "you" | "opp" = won ? "you" : "opp";
  const counts = new Map<string, { hl: TourHl; n: number }>();
  for (const g of games) if (g.mvp && g.mvp.side === winnerPersp) {
    const cur = counts.get(g.mvp.name) ?? { hl: g.mvp, n: 0 };
    cur.n++; counts.set(g.mvp.name, cur);
  }
  let mvp: TourHl | null = null; let best = 0;
  for (const v of counts.values()) if (v.n > best) { best = v.n; mvp = v.hl; }

  void youComp;
  return {
    stageLabel: STAGE_LABEL[stage],
    oppLabel: oppComp.isBot ? `🤖 ${oppComp.name}` : oppComp.name,
    oppSub: competitorSubtitle(oppComp),
    yourGames, oppGames, won, games, mvp,
  };
}

/**
 * Resolve TODAS as séries bot×bot de uma fase (placar direto, sem assistir).
 * Muta o `idMap` pra persistir a forma do dia dos bots na próxima fase.
 * (Determinístico: cada confronto deriva sua seed do próprio id.)
 */
function resolveBotMatches(
  bracket: Bracket,
  idMap: Map<string, Competitor>,
  stage: "qf" | "sf" | "gf",
): { bracket: Bracket } {
  let b = bracket;
  const matches = stage === "qf" ? b.qf : stage === "sf" ? b.sf : [b.gf];
  for (const m of matches) {
    if (m.done || !m.a || !m.b) continue;
    const a = idMap.get(m.a);
    const bb = idMap.get(m.b);
    if (!a || !bb) continue;
    if (a.isBot && bb.isBot) {
      const sim = simulateBo5(makeRng(seedFromHash(m.id)), a, bb);
      b = applyResult(b, idMap, m.id, sim.finalA, sim.finalB);
      const aWon = sim.finalA > sim.finalB;
      idMap.set(a.id, { ...a, form: updateForma(a, aWon, sim.games, "a", sim.pentasByGame) });
      idMap.set(bb.id, { ...bb, form: updateForma(bb, !aWon, sim.games, "b", sim.pentasByGame) });
    }
  }
  return { bracket: b };
}

/** Torneio acabou (final resolvida com vencedor)? */
function isOver(b: Bracket): boolean {
  return b.gf.done && b.gf.winner != null;
}

/** Próxima fase a jogar (a primeira com confrontos não-resolvidos). */
function nextStageOf(b: Bracket): "sf" | "gf" | null {
  if (b.qf.every((m) => m.done)) {
    if (!b.sf.every((m) => m.done)) return "sf";
    if (!b.gf.done) return "gf";
  }
  return null;
}

/** Nome curto do competidor pra narração (nick do humano / nome do bot). */
function shortName(c: Competitor): string {
  // no FEED da timeline, eventos de TIME usam a org da line (ex.: "T1"), não o
  // nick do bot/humano. (Os eventos individuais já citam os jogadores reais.)
  return teamShortOf(c) || c.name;
}

/** Hash simples e estável de um id → inteiro (pra derivar seed por confronto). */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0;
  return h >>> 0;
}
function seedFromHash(id: string): number {
  return (hashId(id) ^ 0x5bd1e995) >>> 0;
}

/** Tempo (ms) até o próximo passo: eventos grandes pausam mais; fim de jogo dá um gap. */
function currentStepMs(live: LiveSeries | null, eventMs: number, gameGapMs: number): number {
  if (!live) return eventMs;
  const tl = live.timelines[live.gameIndex];
  if (!tl) return eventMs;
  if (live.eventIndex >= tl.events.length - 1) return gameGapMs; // último evento → gap pro próximo jogo
  const ev = tl.events[live.eventIndex];
  return ev?.big ? eventMs + 500 : eventMs;
}

export type Tournament = ReturnType<typeof useTournament>;
export { FINALIST_POOL, rollBotLine };
