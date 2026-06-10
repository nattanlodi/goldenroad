import type { Difficulty, Lineup, LineupPlayer, Phase, Role, Series, Team } from "../types";

export interface GameState {
  phase: Phase;
  difficulty: Difficulty;
  lineup: Lineup;
  current: Team | null;
  rolling: boolean;
  rollDisplay: Team | null;
  rerolls: number;
  journey: Series[] | null;
  seriesIndex: number;
  revealed: boolean;
  seriesPlaying: boolean;
  gamesWon: number;
  copied: boolean;
  // calculados ao entrar em "result"
  record: number;
  isNewRecord: boolean;
}

const emptyLineup = (): Lineup => ({ TOP: null, JNG: null, MID: null, BOT: null, SUP: null });

export const initialState: GameState = {
  phase: "start",
  difficulty: "classico",
  lineup: emptyLineup(),
  current: null,
  rolling: false,
  rollDisplay: null,
  rerolls: 3,
  journey: null,
  seriesIndex: 0,
  revealed: false,
  seriesPlaying: false,
  gamesWon: 0,
  copied: false,
  record: 0,
  isNewRecord: false,
};

export type Action =
  | { type: "begin" }
  | { type: "setDifficulty"; difficulty: Difficulty }
  | { type: "roll"; display: Team } // tick da roleta (também o início)
  | { type: "rollEnd"; team: Team }
  | { type: "pick"; role: Role; player: LineupPlayer; complete: boolean }
  | { type: "rerollDec" }
  | { type: "startSeries"; journey: Series[] }
  | { type: "seriesPlayBegin" }
  | { type: "seriesGameWon"; gamesWon: number }
  | { type: "seriesReveal" }
  | { type: "nextSeries" }
  | { type: "toResult"; record: number; isNewRecord: boolean }
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
        journey: null,
        seriesIndex: 0,
        revealed: false,
        seriesPlaying: false,
        gamesWon: 0,
      };

    case "setDifficulty":
      return { ...state, difficulty: action.difficulty };

    case "roll":
      return { ...state, rolling: true, rollDisplay: action.display };

    case "rollEnd":
      return { ...state, rolling: false, rollDisplay: null, current: action.team };

    case "pick": {
      const lineup = { ...state.lineup, [action.role]: action.player };
      // No protótipo, ao completar a 5ª lane o time atual permanece (não é limpo),
      // mas a UI já mostra o card "Line completa". Entre escolhas, o time é limpo.
      return action.complete ? { ...state, lineup } : { ...state, lineup, current: null };
    }

    case "rerollDec":
      return { ...state, rerolls: state.rerolls - 1 };

    case "startSeries":
      return { ...state, phase: "series", journey: action.journey, seriesIndex: 0, revealed: false };

    case "seriesPlayBegin":
      return { ...state, seriesPlaying: true, gamesWon: 0 };

    case "seriesGameWon":
      return { ...state, gamesWon: action.gamesWon };

    case "seriesReveal":
      return { ...state, seriesPlaying: false, revealed: true };

    case "nextSeries":
      return { ...state, seriesIndex: state.seriesIndex + 1, revealed: false, seriesPlaying: false, gamesWon: 0 };

    case "toResult":
      return { ...state, phase: "result", record: action.record, isNewRecord: action.isNewRecord };

    case "restart":
      return { ...state, phase: "start" };

    case "setCopied":
      return { ...state, copied: action.copied };

    default:
      return state;
  }
}
