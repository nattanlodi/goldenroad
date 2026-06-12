import type {
  CampaignEnd,
  CareerStage,
  Difficulty,
  GameMode,
  GameMvp,
  HighlightRef,
  LiveGame,
  Lineup,
  LineupPlayer,
  MsiNode,
  Pentakill,
  PlayedSeries,
  Phase,
  Role,
  SeriesHighlight,
  SeriesSetup,
  StagePhase,
  Team,
} from "../types";

export interface GameState {
  phase: Phase;
  mode: GameMode; // "worlds" (atual) ou "goldenroad" (carreira MSI→Worlds)
  careerStage: CareerStage; // etapa do GOLDENROAD: "msi" ou "worlds"
  msiNode: MsiNode | null; // nó atual do bracket do MSI (só no modo goldenroad/etapa msi)
  difficulty: Difficulty;
  lineup: Lineup;

  // draft
  current: Team | null;
  rolling: boolean;
  rollDisplay: Team | null;
  rerolls: number;

  // campanha (playoffs)
  stagePhase: StagePhase;
  swissWins: number;
  swissLosses: number;
  koIndex: number; // 0 QF · 1 SF · 2 Final
  usedOppIds: string[];
  history: PlayedSeries[];
  series: SeriesSetup | null; // série atual
  seriesPlaying: boolean;
  revealed: boolean;
  yourGames: number;
  oppGames: number;
  seriesResult: "win" | "loss" | null;
  highlight: SeriesHighlight | null; // pentakills + MVPs (preenchido no reveal)
  pentaFlash: Pentakill | null; // pentakill a exibir agora (durante a animação)
  gameMvpFlash: GameMvp | null; // MVP da partida atual (durante a animação)
  liveGames: LiveGame[]; // partidas da série ATUAL (pra detectar fim de série)
  campaignGames: LiveGame[]; // todas as partidas da campanha (histórico persistente)
  finalsMvp: HighlightRef | null; // MVP da Grande Final (campeão) — preservado pro ResultScreen
  finished: CampaignEnd | null;

  // share / meta
  copied: boolean;
  record: number;
  isNewRecord: boolean;
}

const emptyLineup = (): Lineup => ({ TOP: null, JNG: null, MID: null, BOT: null, SUP: null });

const freshCampaign = {
  stagePhase: "swiss" as StagePhase,
  swissWins: 0,
  swissLosses: 0,
  koIndex: 0,
  usedOppIds: [] as string[],
  history: [] as PlayedSeries[],
  series: null as SeriesSetup | null,
  seriesPlaying: false,
  revealed: false,
  yourGames: 0,
  oppGames: 0,
  seriesResult: null as "win" | "loss" | null,
  highlight: null as SeriesHighlight | null,
  pentaFlash: null as Pentakill | null,
  gameMvpFlash: null as GameMvp | null,
  liveGames: [] as LiveGame[],
  campaignGames: [] as LiveGame[],
  finalsMvp: null as HighlightRef | null,
  finished: null as CampaignEnd | null,
};

export const initialState: GameState = {
  phase: "start",
  mode: "worlds",
  careerStage: "msi",
  msiNode: null,
  difficulty: "classico",
  lineup: emptyLineup(),
  current: null,
  rolling: false,
  rollDisplay: null,
  rerolls: 3,
  ...freshCampaign,
  copied: false,
  record: 0,
  isNewRecord: false,
};

export type Action =
  | { type: "begin"; mode: GameMode }
  | { type: "setDifficulty"; difficulty: Difficulty }
  | { type: "roll"; display: Team }
  | { type: "rollEnd"; team: Team }
  | { type: "pick"; role: Role; player: LineupPlayer; complete: boolean }
  | { type: "rerollDec" }
  | { type: "startCampaign"; series: SeriesSetup; usedOppIds: string[] }
  | { type: "startMsi"; series: SeriesSetup; usedOppIds: string[]; node: MsiNode }
  | {
      type: "msiAdvance";
      played: PlayedSeries;
      series: SeriesSetup;
      node: MsiNode;
      usedOppIds: string[];
    }
  | { type: "msiToWorlds"; series: SeriesSetup; usedOppIds: string[] }
  | { type: "playBegin" }
  | { type: "gameStep"; yourGames: number; oppGames: number; penta: Pentakill | null; gameMvp: GameMvp | null; liveGame: LiveGame }
  | { type: "clearFlashes" }
  | { type: "seriesReveal"; result: "win" | "loss"; highlight: SeriesHighlight }
  | {
      type: "nextSeriesAdvance";
      played: PlayedSeries;
      series: SeriesSetup;
      stagePhase: StagePhase;
      swissWins: number;
      swissLosses: number;
      koIndex: number;
      usedOppIds: string[];
    }
  | { type: "finishCampaign"; played: PlayedSeries; finished: CampaignEnd; record: number; isNewRecord: boolean; finalsMvp: HighlightRef | null }
  | { type: "restart" }
  | { type: "openCodex" }
  | { type: "setCopied"; copied: boolean };

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "begin":
      return {
        ...state,
        phase: "play",
        mode: action.mode,
        careerStage: "msi",
        msiNode: null,
        lineup: emptyLineup(),
        rerolls: 3,
        current: null,
        rolling: false,
        rollDisplay: null,
        ...freshCampaign,
      };

    case "setDifficulty":
      return { ...state, difficulty: action.difficulty };

    case "roll":
      return { ...state, rolling: true, rollDisplay: action.display };

    case "rollEnd":
      return { ...state, rolling: false, rollDisplay: null, current: action.team };

    case "pick": {
      const lineup = { ...state.lineup, [action.role]: action.player };
      return action.complete ? { ...state, lineup } : { ...state, lineup, current: null };
    }

    case "rerollDec":
      return { ...state, rerolls: state.rerolls - 1 };

    case "startCampaign":
      return {
        ...state,
        phase: "series",
        ...freshCampaign,
        series: action.series,
        usedOppIds: action.usedOppIds,
      };

    case "startMsi":
      return {
        ...state,
        phase: "series",
        careerStage: "msi",
        ...freshCampaign,
        msiNode: action.node,
        series: action.series,
        usedOppIds: action.usedOppIds,
      };

    case "msiAdvance":
      return {
        ...state,
        history: [...state.history, action.played],
        msiNode: action.node,
        series: action.series,
        usedOppIds: action.usedOppIds,
        seriesPlaying: false,
        revealed: false,
        yourGames: 0,
        oppGames: 0,
        seriesResult: null,
        highlight: null,
        pentaFlash: null,
        gameMvpFlash: null,
        liveGames: [],
      };

    case "msiToWorlds":
      // campeão do MSI: mantém a line, parte pro Worlds (etapa worlds da carreira).
      return {
        ...state,
        careerStage: "worlds",
        msiNode: null,
        ...freshCampaign,
        series: action.series,
        usedOppIds: action.usedOppIds,
      };

    case "playBegin":
      return {
        ...state,
        seriesPlaying: true,
        revealed: false,
        yourGames: 0,
        oppGames: 0,
        seriesResult: null,
        highlight: null,
        pentaFlash: null,
        gameMvpFlash: null,
        liveGames: [],
      };

    case "gameStep":
      return {
        ...state,
        yourGames: action.yourGames,
        oppGames: action.oppGames,
        pentaFlash: action.penta ?? state.pentaFlash,
        gameMvpFlash: action.gameMvp ?? state.gameMvpFlash,
        liveGames: [...state.liveGames, action.liveGame],
        campaignGames: [...state.campaignGames, action.liveGame],
      };

    case "clearFlashes":
      return { ...state, pentaFlash: null, gameMvpFlash: null };

    case "seriesReveal":
      return { ...state, seriesPlaying: false, revealed: true, seriesResult: action.result, highlight: action.highlight, pentaFlash: null, gameMvpFlash: null };

    case "nextSeriesAdvance":
      return {
        ...state,
        history: [...state.history, action.played],
        series: action.series,
        stagePhase: action.stagePhase,
        swissWins: action.swissWins,
        swissLosses: action.swissLosses,
        koIndex: action.koIndex,
        usedOppIds: action.usedOppIds,
        seriesPlaying: false,
        revealed: false,
        yourGames: 0,
        oppGames: 0,
        seriesResult: null,
        highlight: null,
        pentaFlash: null,
        gameMvpFlash: null,
        liveGames: [],
      };

    case "finishCampaign":
      return {
        ...state,
        phase: "result",
        history: [...state.history, action.played],
        finished: action.finished,
        record: action.record,
        isNewRecord: action.isNewRecord,
        finalsMvp: action.finalsMvp,
      };

    case "restart":
      return { ...state, phase: "start" };

    case "openCodex":
      return { ...state, phase: "codex" };

    case "setCopied":
      return { ...state, copied: action.copied };

    default:
      return state;
  }
}
