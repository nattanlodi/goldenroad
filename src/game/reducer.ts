import type {
  CampaignEnd,
  Difficulty,
  Lineup,
  LineupPlayer,
  PlayedSeries,
  Phase,
  Role,
  SeriesSetup,
  StagePhase,
  Team,
} from "../types";

export interface GameState {
  phase: Phase;
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
  finished: null as CampaignEnd | null,
};

export const initialState: GameState = {
  phase: "start",
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
  | { type: "begin" }
  | { type: "setDifficulty"; difficulty: Difficulty }
  | { type: "roll"; display: Team }
  | { type: "rollEnd"; team: Team }
  | { type: "pick"; role: Role; player: LineupPlayer; complete: boolean }
  | { type: "rerollDec" }
  | { type: "startCampaign"; series: SeriesSetup; usedOppIds: string[] }
  | { type: "playBegin" }
  | { type: "gameStep"; yourGames: number; oppGames: number }
  | { type: "seriesReveal"; result: "win" | "loss" }
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
  | { type: "finishCampaign"; played: PlayedSeries; finished: CampaignEnd; record: number; isNewRecord: boolean }
  | { type: "restart" }
  | { type: "setCopied"; copied: boolean };

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "begin":
      return {
        ...state,
        phase: "play",
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

    case "playBegin":
      return { ...state, seriesPlaying: true, revealed: false, yourGames: 0, oppGames: 0, seriesResult: null };

    case "gameStep":
      return { ...state, yourGames: action.yourGames, oppGames: action.oppGames };

    case "seriesReveal":
      return { ...state, seriesPlaying: false, revealed: true, seriesResult: action.result };

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
      };

    case "finishCampaign":
      return {
        ...state,
        phase: "result",
        history: [...state.history, action.played],
        finished: action.finished,
        record: action.record,
        isNewRecord: action.isNewRecord,
      };

    case "restart":
      return { ...state, phase: "start" };

    case "setCopied":
      return { ...state, copied: action.copied };

    default:
      return state;
  }
}
