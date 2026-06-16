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
import type { Competitor, TournamentPick } from "../tournament";
import { makeRng, seedFromCode } from "../prng";
import { simulateBo5 } from "../series";
import { buildGameTimeline, type GameTimeline } from "../timeline";
import {
  DRAFT_ROUNDS,
  allPickedThisRound,
  initialRoomState,
  pendingThisRound,
  reduceRoom,
  type AutoPick,
  type RoomIntent,
  type RoomState,
  type RoomPlayer,
  type SeriesState,
} from "./roomState";
import { playerRng, randomAutoPick } from "./draftPool";
import { seriesNarrationMs } from "./seriesNarration";

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
  useEffect(() => {
    if (!view?.isHost || !view.state) return;
    const st = view.state;
    const present = new Set(view.members.map((m) => m.playerId));
    present.add(view.me.playerId);

    if (st.phase === "lobby") {
      const filtered = st.players.filter((p) => present.has(p.playerId));
      if (filtered.length !== st.players.length) {
        setHostState({ ...st, players: filtered });
        return;
      }
    }
    // alguém no presence ainda não registrado em players → reenvia o snapshot
    // (assina pelo conjunto presente pra não floodar).
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
        // monta as lines finais (com os auto-picks da última rodada) e pré-simula a Bo5.
        const series = buildSeriesState(st, code, autopicks);
        dispatch({ kind: "finishDraft", autopicks, series });
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

  // ── CONTROLE DA SÉRIE (só o host) ──
  // A série inteira já foi PRÉ-SIMULADA e enviada UMA vez (finishDraft). A
  // narração (placar/feed subindo) roda LOCALMENTE nos dois clientes a partir
  // desse estado determinístico — não reenviamos snapshot a cada evento (o
  // payload com as timelines estouraria/seria descartado pelo Realtime, e era
  // por isso que o convidado não via a série progredir).
  //
  // O host só é autoritativo sobre: (1) ZERAR o countdown de início e (2) ao fim
  // da narração local, transmitir finishSeries (vencedor + transição p/ resultado).
  const seriesStepRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isHostNow || !st || st.phase !== "series" || !st.series) return;
    const s = st.series;

    // 1) ainda no countdown de início → zera quando o deadline chega.
    if (s.startDeadline != null) {
      const ms = Math.max(0, s.startDeadline - Date.now());
      seriesStepRef.current = setTimeout(() => {
        dispatch({ kind: "seriesTick", series: { ...s, startDeadline: null } });
      }, ms);
      return () => { if (seriesStepRef.current) clearTimeout(seriesStepRef.current); };
    }

    // 2) já começou → o host aguarda a DURAÇÃO total da narração e então finaliza
    // (vencedor autoritativo). Os clientes narram visualmente por conta própria.
    const winnerId = s.finalA > s.finalB ? s.aId : s.bId;
    const totalMs = seriesNarrationMs(s, st.config.pace === "imersivo");
    seriesStepRef.current = setTimeout(() => {
      dispatch({ kind: "finishSeries", winnerId });
    }, totalMs);
    return () => { if (seriesStepRef.current) clearTimeout(seriesStepRef.current); };
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
      const secs = view?.state?.config.pickSeconds ?? 0;
      const deadline = secs > 0 ? Date.now() + secs * 1000 : null;
      dispatch({ kind: "start", deadline });
    }, [dispatch, view?.state?.config.pickSeconds]),
    draftPick: useCallback((role: Role, pick: TournamentPick) => dispatch({ kind: "draftPick", role, pick }), [dispatch]),
    leave,
  };
}

// ── helpers puros da SÉRIE (rodam no host) ──

/** Monta um Competitor a partir de um RoomPlayer + auto-picks pendentes daquela rodada. */
function competitorFrom(p: RoomPlayer, autopicks: AutoPick[]): Competitor {
  const picks = { ...p.picks };
  for (const a of autopicks) if (a.playerId === p.playerId && !picks[a.role]) picks[a.role] = a.pick;
  const line = ROLES.map((r) => picks[r]).filter((x): x is TournamentPick => !!x);
  const avg = line.length ? Math.round(line.reduce((s, x) => s + x.rating, 0) / line.length) : 0;
  return { id: p.playerId, name: p.nick, isBot: false, line, avg, form: {} };
}

/** Pré-simula a Bo5 (seed da sala) + timelines, e arma o countdown de 10s. */
function buildSeriesState(st: RoomState, code: string, lastAutopicks: AutoPick[]): SeriesState {
  const [pa, pb] = st.players;
  const a = competitorFrom(pa, lastAutopicks);
  const b = competitorFrom(pb, lastAutopicks);
  const rng = makeRng(seedFromCode(`${code}:series`));
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
          nameA: { label: a.name },
          nameB: { label: b.name },
          pentas: sim.pentasByGame[gi] ?? [],
        })
      )
    : [];
  return {
    aId: a.id,
    bId: b.id,
    startDeadline: Date.now() + 10_000, // 10s de countdown de início (§ design)
    scoreA: 0,
    scoreB: 0,
    finalA: sim.finalA,
    finalB: sim.finalB,
    games: sim.games,
    pentasByGame: sim.pentasByGame,
    timelines,
    gameIndex: 0,
    eventIndex: 0,
    finished: false,
  };
}

