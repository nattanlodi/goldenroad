import type {
  ActiveBuff,
  CampaignEnd,
  CareerStage,
  Difficulty,
  EventCard,
  FormNote,
  FsNode,
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
  SeriesMods,
  SeriesSetup,
  StagePhase,
  Team,
} from "../types";
import type { RunScore } from "./score";
import { emptyMods } from "./effects";

/** Pacote de pré-série: forma do dia + evento sorteado, calculado em useGame. */
export interface PreSeries {
  seriesMods: SeriesMods;
  formNotes: FormNote[];
  pendingEvent: EventCard[] | null;
  pendingHostile: boolean; // o trio sorteado é todo de cartas ruins (azar)?
  eventDry: number;
}

export interface GameState {
  phase: Phase;
  mode: GameMode; // "worlds" (atual) ou "goldenroad" (carreira MSI→Worlds)
  careerStage: CareerStage; // etapa do GOLDENROAD: "first_stand" | "msi" | "worlds"
  fsNode: FsNode | null; // nó atual do bracket do First Stand (etapa first_stand)
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

  // eventos de pré-série + forma do dia
  seriesMods: SeriesMods; // deltas TEMPORÁRIOS (zeram a cada série)
  permMods: Partial<Record<Role, number>>; // deltas PERMANENTES por lane (pro selo +N)
  formNotes: FormNote[]; // badges de forma (fogo/gelado) da série atual
  activeBuffs: ActiveBuff[]; // buffs PERMANENTES acumulados na run (HUD)
  pendingEvent: EventCard[] | null; // 3 cartas a escolher (null = nenhum evento)
  pendingHostile: boolean; // o evento atual é de AZAR (3 cartas ruins)?
  eventDry: number; // séries seguidas sem evento (pity)

  // share / meta
  copied: boolean;
  record: number;
  isNewRecord: boolean;
  // pontuação de run (score arcade)
  runScore: RunScore | null; // computado ao finalizar a campanha
  scoreRecord: number; // melhor score de QUALQUER run (localStorage)
  isNewScoreRecord: boolean;
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
  seriesMods: emptyMods(),
  permMods: {} as Partial<Record<Role, number>>,
  formNotes: [] as FormNote[],
  activeBuffs: [] as ActiveBuff[],
  pendingEvent: null as EventCard[] | null,
  pendingHostile: false,
  eventDry: 0,
};

export const initialState: GameState = {
  phase: "start",
  mode: "worlds",
  careerStage: "first_stand",
  fsNode: null,
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
  runScore: null,
  scoreRecord: 0,
  isNewScoreRecord: false,
};

export type Action =
  | { type: "begin"; mode: GameMode }
  | { type: "setDifficulty"; difficulty: Difficulty }
  | { type: "roll"; display: Team }
  | { type: "rollEnd"; team: Team }
  | { type: "pick"; role: Role; player: LineupPlayer; complete: boolean }
  | { type: "rerollDec" }
  | { type: "startCampaign"; series: SeriesSetup; usedOppIds: string[]; pre: PreSeries }
  | { type: "startFirstStand"; series: SeriesSetup; usedOppIds: string[]; node: FsNode; pre: PreSeries }
  | {
      type: "fsAdvance";
      played: PlayedSeries;
      series: SeriesSetup;
      node: FsNode;
      usedOppIds: string[];
      pre: PreSeries;
    }
  | { type: "fsToMsi"; played: PlayedSeries; series: SeriesSetup; usedOppIds: string[]; node: MsiNode; pre: PreSeries }
  | { type: "startMsi"; series: SeriesSetup; usedOppIds: string[]; node: MsiNode; pre: PreSeries }
  | {
      type: "msiAdvance";
      played: PlayedSeries;
      series: SeriesSetup;
      node: MsiNode;
      usedOppIds: string[];
      pre: PreSeries;
    }
  | { type: "msiToWorlds"; played: PlayedSeries; series: SeriesSetup; usedOppIds: string[]; pre: PreSeries }
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
      pre: PreSeries;
    }
  | { type: "finishCampaign"; played: PlayedSeries; finished: CampaignEnd; record: number; isNewRecord: boolean; finalsMvp: HighlightRef | null; runScore: RunScore; scoreRecord: number; isNewScoreRecord: boolean }
  | {
      type: "resolveEvent";
      lineup: Lineup;
      series: SeriesSetup;
      seriesMods: SeriesMods;
      permMods: Partial<Record<Role, number>>;
      formNotes: FormNote[];
      activeBuffs: ActiveBuff[];
    }
  | { type: "restart" }
  | { type: "openCodex" }
  | { type: "setCopied"; copied: boolean };

/** Campos de pré-série a aplicar ao entrar numa nova série (forma + evento). */
const applyPre = (pre: PreSeries) => ({
  seriesMods: pre.seriesMods,
  formNotes: pre.formNotes,
  pendingEvent: pre.pendingEvent,
  pendingHostile: pre.pendingHostile,
  eventDry: pre.eventDry,
});

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "begin":
      return {
        ...state,
        phase: "play",
        mode: action.mode,
        careerStage: "first_stand",
        fsNode: null,
        msiNode: null,
        lineup: emptyLineup(),
        rerolls: 3,
        current: null,
        rolling: false,
        rollDisplay: null,
        ...freshCampaign,
        runScore: null,
        isNewScoreRecord: false,
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
        ...applyPre(action.pre),
      };

    case "startFirstStand":
      return {
        ...state,
        phase: "series",
        careerStage: "first_stand",
        ...freshCampaign,
        fsNode: action.node,
        series: action.series,
        usedOppIds: action.usedOppIds,
        ...applyPre(action.pre),
      };

    case "fsAdvance":
      return {
        ...state,
        history: [...state.history, action.played],
        fsNode: action.node,
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
        ...applyPre(action.pre),
      };

    case "fsToMsi":
      // campeão do First Stand: mantém a line (e buffs), parte pro MSI.
      // PRESERVA o histórico (séries do First Stand) e zera só o progresso interno.
      return {
        ...state,
        careerStage: "msi",
        fsNode: null,
        ...freshCampaign,
        history: [...state.history, action.played], // First Stand inteiro + a final
        campaignGames: state.campaignGames, // continuidade dos jogos da run
        activeBuffs: state.activeBuffs, // preserva buffs permanentes
        permMods: state.permMods, // preserva deltas permanentes por lane
        msiNode: action.node,
        series: action.series,
        usedOppIds: action.usedOppIds,
        ...applyPre(action.pre),
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
        ...applyPre(action.pre),
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
        ...applyPre(action.pre),
      };

    case "msiToWorlds":
      // campeão do MSI: mantém a line (e buffs permanentes), parte pro Worlds.
      // PRESERVA o histórico da campanha (séries do MSI) e registra a final do MSI;
      // só reseta o progresso do torneio (suíça/mata-mata) via freshCampaign.
      return {
        ...state,
        careerStage: "worlds",
        msiNode: null,
        ...freshCampaign,
        history: [...state.history, action.played], // MSI inteiro + a final do MSI
        campaignGames: state.campaignGames, // mantém os jogos da run (continuidade)
        activeBuffs: state.activeBuffs, // preserva buffs permanentes da run
        permMods: state.permMods, // preserva os deltas permanentes por lane
        series: action.series,
        usedOppIds: action.usedOppIds,
        ...applyPre(action.pre),
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
        ...applyPre(action.pre),
      };

    case "resolveEvent":
      return {
        ...state,
        lineup: action.lineup,
        series: action.series,
        seriesMods: action.seriesMods,
        permMods: action.permMods,
        formNotes: action.formNotes,
        activeBuffs: action.activeBuffs,
        pendingEvent: null,
        pendingHostile: false,
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
        runScore: action.runScore,
        scoreRecord: action.scoreRecord,
        isNewScoreRecord: action.isNewScoreRecord,
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
