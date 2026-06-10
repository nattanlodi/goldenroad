// Tipos centrais do 6×0 Worlds.

export type Role = "TOP" | "JNG" | "MID" | "BOT" | "SUP";

/** Jogador dentro do dataset: [role, nome, overall]. */
export type RosterEntry = [Role, string, number];

/** Uma campanha (time + ano) do Worlds. */
export interface Team {
  id: string;
  team: string;
  short: string;
  year: number;
  league: string;
  champion: boolean;
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
}

export type Lineup = Record<Role, LineupPlayer | null>;

export type Difficulty = "classico" | "especialista";

export type Phase = "start" | "play" | "series" | "result";

// ---- campanha / playoffs ----

export type StageKey = "swiss" | "quarter" | "semi" | "final";

/** Fase atual da campanha. */
export type StagePhase = "swiss" | "ko";

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
