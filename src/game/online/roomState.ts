// ============================================================
// ESTADO DE SALA ONLINE 1v1 (Degrau 1) — sincronizado pelo host
// ============================================================
// Este é o estado `S` que vive no RoomClient (host-autoritativo). O host detém a
// fonte da verdade; clientes mandam INTENÇÕES (`RoomIntent`) e recebem o snapshot.
//
// Por enquanto cobre só a fase LOBBY (1º bloco do 1v1): host cria a sala, o 2º
// jogador entra, os dois ficam "prontos", o host inicia. As fases draft/série
// entram em blocos seguintes, estendendo este mesmo estado/reduce.
//
// IMPORTANTE: nada de Date.now()/random no reduce — o reducer roda no host e deve
// ser puro a partir de (estado, intenção, ctx). Timestamps/seed entram pelo ctx
// ou por intenções específicas (ex.: o host inicia com um deadline já calculado).

import type { ReduceCtx } from "../../net/roomClient";
import type { RoomConfig } from "../tournamentReducer";
import type { Role } from "../../types";
import type { TournamentPick } from "../tournament";
import type { GameTimeline } from "../timeline";

export type OnlinePhase = "lobby" | "draft" | "series" | "result";

export const DRAFT_ROUNDS = 5; // 5 picks = 5 lanes

/** Um jogador conectado à sala (espelha o Presence, mas é o registro OFICIAL do host). */
export interface RoomPlayer {
  playerId: string;
  nick: string;
  isHost: boolean;
  /** marcou "pronto" no lobby. */
  ready: boolean;
  /** ── draft ── line escolhida (por role); preenchida rodada a rodada. */
  picks: Partial<Record<Role, TournamentPick>>;
  /** já escolheu nesta rodada? (zera a cada nova rodada). */
  pickedThisRound: boolean;
}

/** Estado completo da sala 1v1 que o host transmite. */
export interface RoomState {
  phase: OnlinePhase;
  /** código da sala (= origem da seed determinística via seedFromCode). */
  code: string;
  /** config da sala (só o host edita no lobby). */
  config: RoomConfig;
  /** os jogadores na sala, na ordem de chegada (máx. 2 no Degrau 1). */
  players: RoomPlayer[];

  // ── draft (fase "draft") ──
  /** rodada atual do draft (1..DRAFT_ROUNDS). */
  draftRound: number;
  /** timestamp (ms) em que a rodada acaba; null = sem limite (espera todos). */
  roundDeadline: number | null;

  // ── série (fase "series") ──
  series: SeriesState | null;

  // ── resultado (fase "result") ──
  /** playerId do vencedor do duelo. */
  winnerId: string | null;
}

/** Estado da Bo5 ao vivo, narrada pelo host e espelhada nos dois. */
export interface SeriesState {
  /** lados do confronto (A = primeiro player; B = segundo). */
  aId: string;
  bId: string;
  /** countdown de início (timestamp ms) — null quando já começou. */
  startDeadline: number | null;
  /** placar atual (sobe jogo a jogo). */
  scoreA: number;
  scoreB: number;
  /** placar FINAL pré-simulado (a série inteira já foi decidida pela seed). */
  finalA: number;
  finalB: number;
  /** resultado de cada jogo (true = A venceu), na ordem. */
  games: boolean[];
  /** pentakills reais por jogo (lado + nome). */
  pentasByGame: { side: "a" | "b"; name: string }[][];
  /** timelines por jogo (modo imersivo; vazio no rápido). */
  timelines: GameTimeline[];
  /** índice do jogo sendo narrado. */
  gameIndex: number;
  /** índice do evento atual dentro da timeline do jogo. */
  eventIndex: number;
  /** terminou de narrar tudo? (mostra resultado + avançar). */
  finished: boolean;
}

/** Config inicial do lobby online (default do design: imersivo). */
const DEFAULT_CONFIG: RoomConfig = {
  humanCount: 2,
  pickSeconds: 30,
  hideRatings: false,
  cardsOn: false, // cartas adiadas pro Degrau 2 (sem cartas no 1v1)
  pace: "imersivo",
};

/** Estado inicial criado pelo HOST ao abrir a sala. Começa SEM players: cada um
 * (host inclusive) se registra via o `join` automático, com seu playerId real. */
export function initialRoomState(code: string): RoomState {
  return {
    phase: "lobby",
    code,
    config: DEFAULT_CONFIG,
    players: [],
    draftRound: 1,
    roundDeadline: null,
    series: null,
    winnerId: null,
  };
}

// ── intenções (cliente → host) ──
// Obs.: ROLAR time é 100% local/privado (não vira intenção). Só o PICK final e os
// avanços de rodada (controlados pelo host) trafegam.
export type RoomIntent =
  | { kind: "join"; nick: string } // entrei na sala (registra/atualiza meu nick)
  | { kind: "setConfig"; patch: Partial<RoomConfig> } // host ajusta config
  | { kind: "setReady"; ready: boolean } // marcar/desmarcar pronto
  | { kind: "start"; deadline: number | null } // host inicia o draft (rodada 1 + deadline)
  | { kind: "draftPick"; role: Role; pick: TournamentPick } // escolhi um jogador nesta rodada
  | { kind: "advanceRound"; round: number; deadline: number | null; autopicks: AutoPick[] } // host avança rodada (+ auto-picks)
  | { kind: "finishDraft"; autopicks: AutoPick[]; series: SeriesState } // host conclui o draft → fase série (line completa + série pré-simulada)
  | { kind: "seriesTick"; series: SeriesState } // host avança a narração da série (placar/timeline)
  | { kind: "finishSeries"; winnerId: string } // série terminou → fase resultado
  | { kind: "leave" }; // sair da sala

/** Auto-pick que o host aplica a quem não escolheu ao zerar o timer. */
export interface AutoPick {
  playerId: string;
  role: Role;
  pick: TournamentPick;
}

const MAX_PLAYERS = 2; // Degrau 1 = duelo 1v1

/** Reduce host-autoritativo: aplica uma intenção ao estado. Puro. */
export function reduceRoom(state: RoomState, intent: RoomIntent, ctx: ReduceCtx): RoomState {
  switch (intent.kind) {
    case "join": {
      const exists = state.players.find((p) => p.playerId === ctx.from);
      if (exists) {
        // reconexão / renome: atualiza o nick, mantém o resto.
        return {
          ...state,
          players: state.players.map((p) =>
            p.playerId === ctx.from ? { ...p, nick: intent.nick || p.nick } : p
          ),
        };
      }
      // sala cheia → ignora (a UI do convidado mostra "sala cheia" por outra via).
      if (state.players.length >= MAX_PLAYERS) return state;
      // só entra no lobby (não no meio do jogo).
      if (state.phase !== "lobby") return state;
      // o host é quem roda o reduce: ctx.from === ctx.hostId identifica o host.
      const isHost = ctx.from === ctx.hostId;
      return {
        ...state,
        players: [
          ...state.players,
          {
            playerId: ctx.from,
            nick: intent.nick || (isHost ? "Host" : "Convidado"),
            isHost,
            ready: false,
            picks: {},
            pickedThisRound: false,
          },
        ],
      };
    }

    case "setConfig": {
      // só o host edita a config.
      if (ctx.from !== ctx.hostId) return state;
      return { ...state, config: { ...state.config, ...intent.patch } };
    }

    case "setReady": {
      return {
        ...state,
        players: state.players.map((p) =>
          p.playerId === ctx.from ? { ...p, ready: intent.ready } : p
        ),
      };
    }

    case "start": {
      // só o host inicia, e só com a sala cheia (2 humanos) e ambos prontos.
      if (ctx.from !== ctx.hostId) return state;
      if (state.phase !== "lobby") return state;
      if (state.players.length < MAX_PLAYERS) return state;
      if (!state.players.every((p) => p.ready)) return state;
      // entra no draft: rodada 1, deadline já calculado pelo host (ou null = sem limite).
      return {
        ...state,
        phase: "draft",
        draftRound: 1,
        roundDeadline: intent.deadline,
        players: state.players.map((p) => ({ ...p, picks: {}, pickedThisRound: false })),
      };
    }

    case "draftPick": {
      // registra o pick do jogador NESTA rodada (uma vez por rodada).
      if (state.phase !== "draft") return state;
      return {
        ...state,
        players: state.players.map((p) =>
          p.playerId === ctx.from && !p.pickedThisRound
            ? { ...p, picks: { ...p.picks, [intent.role]: intent.pick }, pickedThisRound: true }
            : p
        ),
      };
    }

    case "advanceRound": {
      // só o host avança a rodada (aplica auto-picks de quem não escolheu).
      if (ctx.from !== ctx.hostId || state.phase !== "draft") return state;
      const autoByPlayer = new Map<string, AutoPick>();
      for (const a of intent.autopicks) autoByPlayer.set(a.playerId, a);
      return {
        ...state,
        draftRound: intent.round,
        roundDeadline: intent.deadline,
        players: state.players.map((p) => {
          const auto = autoByPlayer.get(p.playerId);
          const picks = auto && !p.pickedThisRound ? { ...p.picks, [auto.role]: auto.pick } : p.picks;
          return { ...p, picks, pickedThisRound: false };
        }),
      };
    }

    case "finishDraft": {
      // host conclui: aplica auto-picks da ÚLTIMA rodada e vai pra série (já pré-simulada).
      if (ctx.from !== ctx.hostId || state.phase !== "draft") return state;
      const autoByPlayer = new Map<string, AutoPick>();
      for (const a of intent.autopicks) autoByPlayer.set(a.playerId, a);
      return {
        ...state,
        phase: "series",
        roundDeadline: null,
        series: intent.series,
        players: state.players.map((p) => {
          const auto = autoByPlayer.get(p.playerId);
          const picks = auto && !p.pickedThisRound ? { ...p.picks, [auto.role]: auto.pick } : p.picks;
          return { ...p, picks, pickedThisRound: true };
        }),
      };
    }

    case "seriesTick": {
      // host avança a narração (placar/timeline/finished). Clientes só renderizam.
      if (ctx.from !== ctx.hostId || state.phase !== "series") return state;
      return { ...state, series: intent.series };
    }

    case "finishSeries": {
      if (ctx.from !== ctx.hostId || state.phase !== "series") return state;
      return { ...state, phase: "result", winnerId: intent.winnerId };
    }

    case "leave": {
      const next = state.players.filter((p) => p.playerId !== ctx.from);
      // se o host saiu, a sala morre por outra via (RoomClient manda "bye").
      return { ...state, players: next };
    }
  }
}

/** Quem é o jogador correspondente a um playerId (ou null). */
export function playerOf(state: RoomState, playerId: string): RoomPlayer | null {
  return state.players.find((p) => p.playerId === playerId) ?? null;
}

/** Todos os jogadores já escolheram nesta rodada? (gatilho de avanço antecipado). */
export function allPickedThisRound(state: RoomState): boolean {
  return state.players.length > 0 && state.players.every((p) => p.pickedThisRound);
}

/** Quem ainda NÃO escolheu nesta rodada (recebe auto-pick ao zerar o timer). */
export function pendingThisRound(state: RoomState): RoomPlayer[] {
  return state.players.filter((p) => !p.pickedThisRound);
}

/** Lanes ainda vazias na line de um jogador (pro auto-pick escolher uma). */
export function emptyRoles(p: RoomPlayer, roles: readonly Role[]): Role[] {
  return roles.filter((r) => !p.picks[r]);
}

/** Sala pronta pra começar? (cheia + todos prontos). */
export function canStart(state: RoomState): boolean {
  return (
    state.phase === "lobby" &&
    state.players.length >= MAX_PLAYERS &&
    state.players.every((p) => p.ready)
  );
}
