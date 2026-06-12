// Tipos centrais do 6×0 Worlds.

export type Role = "TOP" | "JNG" | "MID" | "BOT" | "SUP";

/** Jogador dentro do dataset: [role, nome, overall, país?].
 *  O 4º item é o código ISO 3166-1 alpha-2 minúsculo (ex.: "kr", "br") — opcional. */
export type RosterEntry = [Role, string, number, string?];

/** Uma campanha (time + ano) do Worlds. */
export interface Team {
  id: string;
  team: string;
  short: string;
  year: number;
  league: string;
  champion: boolean;
  /** Vice-campeão: perdeu a final daquele Worlds. */
  finalist?: boolean;
  players: RosterEntry[];
}

/** Jogador já escolhido e alocado numa lane da sua line. */
export interface LineupPlayer {
  role: Role;
  name: string;
  rating: number;
  team: string;
  short: string;
  year: number;
  league: string;
  champion: boolean;
  finalist?: boolean;
  country?: string;
}

export type Lineup = Record<Role, LineupPlayer | null>;

export type Difficulty = "classico" | "especialista";

export type Phase = "start" | "play" | "series" | "result" | "codex";

// ---- campanha / playoffs ----

export type StageKey = "swiss" | "quarter" | "semi" | "final";

/** Fase atual da campanha. */
export type StagePhase = "swiss" | "ko";

// ---- modo GOLDENROAD: MSI (double elimination) ----

/** Nó do bracket do MSI no caminho do JOGADOR (double elim). */
export type MsiNode =
  | "UR1" // Upper Round 1
  | "UR2" // Upper Round 2
  | "UF" // Upper Final
  | "LR1" // Lower Round 1
  | "LR2" // Lower Round 2
  | "LR3" // Lower Round 3
  | "LF" // Lower Final
  | "GF"; // Grand Final

/** Lado do bracket onde o jogador chega à Grand Final (ou em que se encontra). */
export type MsiSide = "upper" | "lower";

/** Modo de jogo. "worlds" = só o Worlds (atual). "goldenroad" = carreira (MSI → Worlds). */
export type GameMode = "worlds" | "goldenroad";

/** Etapa atual do modo carreira GOLDENROAD. */
export type CareerStage = "msi" | "worlds";

/** Time adversário de uma série, já com a média de overall pré-calculada. */
export interface Opponent {
  id: string;
  team: string;
  short: string;
  year: number;
  league: string;
  players: RosterEntry[];
  avg: number;
}

/** Configuração de uma série a ser jogada. */
export interface SeriesSetup {
  stageKey: StageKey;
  stageLabel: string; // "Fase Suíça" / "Quartas de final" / ...
  format: string; // "Bo1" / "Bo3" / "Bo5"
  target: number; // vitórias necessárias (1 / 2 / 3)
  decisive: boolean; // série suíça que avança ou elimina
  opp: Opponent;
}

/** Lado de um destaque: seu time ou o adversário. */
export type Side = "you" | "opp";

/** Referência leve a um jogador (de qualquer lado) num destaque. */
export interface HighlightRef {
  side: Side;
  role: Role;
  name: string;
  rating: number;
  country?: string;
}

/** Um pentakill ocorrido durante uma série: quem fez, de qual lado e em qual jogo (1-based). */
export interface Pentakill {
  side: Side;
  role: Role;
  name: string;
  country?: string;
  gameNumber: number;
}

/** MVP de uma única partida da série (do time que venceu aquele jogo). */
export interface GameMvp extends HighlightRef {
  gameNumber: number;
}

/** Resumo ao vivo de uma partida já disputada (histórico em tempo real). */
export interface LiveGame {
  gameNumber: number;
  youWon: boolean;
  mvp: GameMvp | null;
  pentakills: Pentakill[];
  /** rótulo da série/fase a que esta partida pertence (ex.: "Quartas de final"). */
  stageLabel?: string;
  /** índice da série na campanha (pra agrupar/numerar no histórico). */
  seriesIndex?: number;
  /** formato da série (Bo1 / Bo3 / Bo5). */
  format?: string;
  /** nome curto do adversário daquela série. */
  oppShort?: string;
  /** ano do adversário (sufixo do card). */
  oppYear?: number;
  /** rodada da Fase Suíça (1..n) — só preenchido em séries suíças. */
  swissRound?: number;
}

/** Destaques de uma série: pentakills, MVP de cada partida e o MVP eleito ao fim. */
export interface SeriesHighlight {
  pentakills: Pentakill[];
  gameMvps: GameMvp[];
  mvp: HighlightRef | null;
}

/** Resultado de uma série já disputada (entra no histórico da jornada). */
export interface PlayedSeries {
  stageKey: StageKey;
  stageLabel: string;
  format: string;
  opp: Opponent;
  yourGames: number;
  oppGames: number;
  won: boolean;
}

export type CampaignEnd = "champion" | "eliminated";
