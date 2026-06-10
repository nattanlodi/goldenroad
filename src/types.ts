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

/** Uma das 6 séries dos playoffs. */
export interface Series {
  stage: string;
  format: string;
  score: string; // ex.: "3-0"
  team: string;
  short: string;
  year: number;
  league: string;
  players: RosterEntry[];
}
