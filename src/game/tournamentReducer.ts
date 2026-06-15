// ============================================================
// ESTADO + REDUCER do modo "Worlds ao Vivo" (Degrau 0 — offline)
// ============================================================
// Estado ISOLADO do jogo solo (não toca GameState/reducer.ts). Vive num
// useReducer próprio dentro de useTournament. As fases são:
//   lobby → draft → bracket → result
//
// Tudo derivado de uma SEED (PRNG) — o draft dos bots, o sorteio do bracket e as
// simulações são reproduzíveis. Base pronta pro online (Degrau 1+).

import type { Role } from "../types";
import type { Bracket, Competitor, TournamentPick } from "./tournament";
import type { GameTimeline } from "./timeline";

export type TournamentPhase = "lobby" | "draft" | "drafted" | "bracket" | "result";

/** Ritmo das séries: imersivo (timeline) ou rápido (placar direto). */
export type Pace = "imersivo" | "rapido";

/** Config da sala (no offline, ajustada antes de começar). */
export interface RoomConfig {
  humanCount: number; // quantos humanos (1 no offline; 2..8 no online)
  pickSeconds: number; // 10 | 20 | 30 — ou 0 = SEM tempo (avança quando todos pickam)
  hideRatings: boolean; // modo especialista (esconde overalls no draft)
  cardsOn: boolean; // cartas de evento ligadas
  pace: Pace; // imersivo | rapido
}

/** Estado de uma série EM ANDAMENTO sendo assistida (timeline imersiva). */
export interface LiveSeries {
  matchId: string;
  /** os dois competidores. */
  aId: string;
  bId: string;
  /** placar atual. */
  scoreA: number;
  scoreB: number;
  /** placar FINAL pré-decidido (a série inteira já foi simulada). */
  finalA: number;
  finalB: number;
  /** resultados de cada jogo (true = A venceu) na ordem. */
  games: boolean[];
  /** pentakills reais por jogo (lado + nome) — pra forma do dia e destaques. */
  pentasByGame: { side: "a" | "b"; name: string }[][];
  /** timelines por jogo (modo imersivo). */
  timelines: GameTimeline[];
  /** índice do jogo atual sendo narrado. */
  gameIndex: number;
  /** índice do evento atual dentro da timeline do jogo. */
  eventIndex: number;
  /** já terminou de narrar tudo? (mostra resultado + botão avançar). */
  finished: boolean;
}

/** Uma série bot×bot rodando "ao vivo" em paralelo (placar parcial no bracket). */
export interface SideMatch {
  matchId: string;
  /** resultados pré-simulados de cada jogo (true = lado A do confronto venceu). */
  games: boolean[];
  /** placar parcial atual (sobe jogo a jogo). */
  scoreA: number;
  scoreB: number;
  /** quantos jogos já foram revelados. */
  revealed: number;
  /** timestamp (ms) em que cada jogo deve ser revelado (defasado da série do humano). */
  schedule: number[];
  /** placar final (pra resolver no bracket quando termina). */
  finalA: number;
  finalB: number;
}

/** Destaque (penta/mvp) numa série do histórico do torneio. */
export interface TourHl {
  side: "you" | "opp";
  role: Role;
  name: string;
  country?: string;
}

/** Uma série já disputada no torneio (do ponto de vista do humano), pro histórico. */
export interface TourSeries {
  stageLabel: string; // "Quartas" / "Semifinal" / "Grande Final"
  oppLabel: string; // nome do adversário (nick / 🤖 bot)
  oppSub: string; // time-base do adversário ("RNG '22")
  yourGames: number;
  oppGames: number;
  won: boolean;
  /** por jogo: você venceu? + pentas do jogo + mvp do jogo. */
  games: { youWon: boolean; pentas: TourHl[]; mvp: TourHl | null }[];
  /** MVP da série (lado vencedor). */
  mvp: TourHl | null;
}

export interface TournamentState {
  phase: TournamentPhase;
  seed: number;
  config: RoomConfig;

  // ── competidores (humanos + bots) ──
  competitors: Competitor[];
  /** id do humano que sou eu (offline: o único). */
  myId: string;

  // ── draft ──
  draftRound: number; // 1..5
  /** time atualmente rolado pelo humano (pra escolher um jogador). */
  rolledTeamIds: string[]; // histórico de times rolados nesta rodada (pra "outro")
  currentRollId: string | null; // id do time rolado agora (travado)
  /** roleta em andamento? (animação de sorteio). */
  rolling: boolean;
  /** id do time exibido DURANTE a roleta (embaralhando). */
  rollDisplayId: string | null;
  /** picks do humano por role (na rodada atual já escolhida?). */
  myPicks: Partial<Record<Role, TournamentPick>>;
  /** resorteios restantes (mesma mecânica do solo). */
  rerolls: number;
  /** deadline (timestamp ms) do timer da rodada — null = sem timer rodando. */
  draftDeadline: number | null;

  // ── draft pronto (aguardando "ir pros playoffs") ──
  /** ids dos humanos que já confirmaram avançar pros playoffs. */
  readyIds: string[];
  /** deadline (timestamp ms) do auto-avanço pros playoffs (30s). */
  draftedDeadline: number | null;

  // ── bracket ──
  bracket: Bracket | null;
  /** fila de matchIds a jogar na ordem (HxH → HxBot; bot×bot já resolvido). */
  queue: string[];
  /** índice da série atual na fila. */
  queueIndex: number;
  /** série ao vivo sendo assistida (null = entre séries / aguardando). */
  live: LiveSeries | null;
  /** séries bot×bot da fase atual rodando em paralelo (placar parcial no bracket). */
  sideMatches: SideMatch[];
  /** countdown de início de série (timestamp ms) — null = não armado. */
  startDeadline: number | null;
  /** histórico das séries do humano no torneio (pra barra/penta/mvp como no solo). */
  history: TourSeries[];
  /** matchIds já registrados no histórico (evita duplicar). */
  recordedMatchIds: string[];

  // ── resultado ──
  championId: string | null;
}

const DEFAULT_CONFIG: RoomConfig = {
  humanCount: 1,
  pickSeconds: 30,
  hideRatings: false,
  cardsOn: false,
  pace: "imersivo",
};

export function initialTournamentState(seed: number): TournamentState {
  return {
    phase: "lobby",
    seed,
    config: DEFAULT_CONFIG,
    competitors: [],
    myId: "me",
    draftRound: 1,
    rolledTeamIds: [],
    currentRollId: null,
    rolling: false,
    rollDisplayId: null,
    myPicks: {},
    rerolls: 3,
    draftDeadline: null,
    readyIds: [],
    draftedDeadline: null,
    bracket: null,
    queue: [],
    queueIndex: 0,
    live: null,
    sideMatches: [],
    startDeadline: null,
    history: [],
    recordedMatchIds: [],
    championId: null,
  };
}

export type TournamentAction =
  | { type: "setConfig"; patch: Partial<RoomConfig> }
  | { type: "startDraft"; competitors: Competitor[]; myId: string; deadline: number | null }
  | { type: "rollStep"; displayId: string } // passo da roleta (embaralhando)
  | { type: "rollEnd"; teamId: string } // trava o time final
  | { type: "rerollDec" }
  | { type: "pickPlayer"; role: Role; pick: TournamentPick }
  | { type: "draftDeadline"; deadline: number | null; round: number }
  | { type: "draftReady"; competitors: Competitor[]; bracket: Bracket; queue: string[]; draftedDeadline: number } // lines prontas → aguarda "ir pros playoffs"
  | { type: "confirmReady"; id: string } // um humano confirmou avançar
  | { type: "enterBracket"; startDeadline: number } // todos confirmaram (ou timeout) → começa
  | { type: "armStart"; deadline: number }
  | { type: "openSeries"; live: LiveSeries; sideMatches: SideMatch[] }
  | { type: "advanceTimeline"; live: LiveSeries }
  | { type: "tickSideMatches"; sideMatches: SideMatch[]; bracket?: Bracket; competitors?: Competitor[] } // avança o placar parcial das bot×bot (e propaga vencedores ao terminar)
  | { type: "recordSeries"; matchId: string; played: TourSeries } // série terminou → histórico
  | { type: "resolveMatch"; bracket: Bracket; competitors: Competitor[]; queue: string[]; queueIndex: number; startDeadline: number | null }
  | { type: "finish"; championId: string; bracket: Bracket; competitors: Competitor[] }
  | { type: "reset"; seed: number };

export function tournamentReducer(state: TournamentState, action: TournamentAction): TournamentState {
  switch (action.type) {
    case "setConfig":
      return { ...state, config: { ...state.config, ...action.patch } };

    case "startDraft":
      return {
        ...state,
        phase: "draft",
        competitors: action.competitors,
        myId: action.myId,
        draftRound: 1,
        rolledTeamIds: [],
        currentRollId: null,
        rolling: false,
        rollDisplayId: null,
        myPicks: {},
        rerolls: 3,
        draftDeadline: action.deadline,
      };

    case "rollStep":
      return { ...state, rolling: true, rollDisplayId: action.displayId };

    case "rollEnd":
      return {
        ...state,
        rolling: false,
        rollDisplayId: null,
        currentRollId: action.teamId,
        rolledTeamIds: [...state.rolledTeamIds, action.teamId],
      };

    case "rerollDec":
      return { ...state, rerolls: Math.max(0, state.rerolls - 1) };

    case "pickPlayer":
      return {
        ...state,
        myPicks: { ...state.myPicks, [action.role]: action.pick },
        currentRollId: null,
      };

    case "draftDeadline":
      return {
        ...state,
        draftRound: action.round,
        draftDeadline: action.deadline,
        rolledTeamIds: [],
        currentRollId: null,
        rolling: false,
        rollDisplayId: null,
      };

    case "draftReady":
      // todas as lines completas + bracket montado → tela "ir pros playoffs"
      // (só avança quando todos confirmam OU o auto-avanço de 30s).
      return {
        ...state,
        phase: "drafted",
        competitors: action.competitors,
        bracket: action.bracket,
        queue: action.queue,
        queueIndex: 0,
        currentRollId: null,
        draftDeadline: null,
        readyIds: [],
        draftedDeadline: action.draftedDeadline,
      };

    case "confirmReady":
      return state.readyIds.includes(action.id)
        ? state
        : { ...state, readyIds: [...state.readyIds, action.id] };

    case "enterBracket":
      return {
        ...state,
        phase: "bracket",
        draftedDeadline: null,
        startDeadline: action.startDeadline,
      };

    case "armStart":
      return { ...state, startDeadline: action.deadline };

    case "openSeries":
      return { ...state, live: action.live, sideMatches: action.sideMatches, startDeadline: null };

    case "advanceTimeline":
      return { ...state, live: action.live };

    case "tickSideMatches":
      return {
        ...state,
        sideMatches: action.sideMatches,
        bracket: action.bracket ?? state.bracket,
        competitors: action.competitors ?? state.competitors,
      };

    case "recordSeries":
      // série terminou (live.finished) → entra no histórico NA HORA (não no avanço).
      return state.recordedMatchIds.includes(action.matchId)
        ? state
        : {
            ...state,
            history: [...state.history, action.played],
            recordedMatchIds: [...state.recordedMatchIds, action.matchId],
          };

    case "resolveMatch":
      return {
        ...state,
        bracket: action.bracket,
        competitors: action.competitors,
        queue: action.queue,
        queueIndex: action.queueIndex,
        live: null,
        sideMatches: [],
        startDeadline: action.startDeadline,
      };

    case "finish":
      return {
        ...state,
        phase: "result",
        championId: action.championId,
        bracket: action.bracket,
        competitors: action.competitors,
        live: null,
        sideMatches: [],
        startDeadline: null,
      };

    case "reset":
      return initialTournamentState(action.seed);

    default:
      return state;
  }
}
