import type { Lineup, LineupPlayer, Series, Team } from "../types";
import { ROLES, TEAMS } from "../data/teams";

/** Sorteia um item aleatório de um array. */
export function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Sorteia qualquer time, evitando repetir o último (excludeId). */
export function drawAny(excludeId?: string): Team {
  const pool = TEAMS.filter((t) => t.id !== excludeId);
  return rnd(pool.length ? pool : TEAMS);
}

/** Estágios fixos dos 6 playoffs: [estágio, formato, placar]. */
export const STAGES: [string, string, string][] = [
  ["Fase Suíça", "Bo1", "1-0"],
  ["Fase Suíça", "Bo3", "2-0"],
  ["Fase Suíça", "Bo3 · decisiva", "2-0"],
  ["Quartas de final", "Bo5", "3-0"],
  ["Semifinal", "Bo5", "3-0"],
  ["Grande Final", "Bo5", "3-0"],
];

/** Monta a jornada de 6 séries com adversários aleatórios sem repetição. */
export function buildJourney(): Series[] {
  const used: string[] = [];
  return STAGES.map((s) => {
    let pool = TEAMS.filter((t) => !used.includes(t.id));
    if (!pool.length) pool = TEAMS;
    const opp = rnd(pool);
    used.push(opp.id);
    return {
      stage: s[0],
      format: s[1],
      score: s[2],
      team: opp.team,
      short: opp.short,
      year: opp.year,
      league: opp.league,
      players: opp.players,
    };
  });
}

export const SERIES_FLAVORS = [
  "Sweep impecável — sua botlane dominou cada partida.",
  "Macro perfeito: vitória sem dar brechas.",
  "O mid carregou e o time fechou sem sustos.",
  "Pressão constante, nexus atrás de nexus.",
  "Draft superior e teamfights impecáveis.",
  "Domínio de início ao fim. Sem chances pro rival.",
];

/** Quantas vitórias até fechar a série (1, 2 ou 3). */
export function seriesTarget(score: string): number {
  return Math.max(1, parseInt(score.split("-")[0], 10) || 1);
}

/** Lista de jogadores da line na ordem das roles (apenas os preenchidos). */
export function lineupPicks(lineup: Lineup): LineupPlayer[] {
  return ROLES.map((r) => lineup[r]).filter((p): p is LineupPlayer => p !== null);
}

/** Nota da line = média arredondada dos overalls. */
export function lineScore(lineup: Lineup): number {
  const picks = lineupPicks(lineup);
  if (!picks.length) return 0;
  return Math.round(picks.reduce((a, p) => a + p.rating, 0) / picks.length);
}

export interface Tier {
  tier: string;
  desc: string;
}

/** Tier por nota média (idêntico ao protótipo). */
export function tierFor(avg: number): Tier {
  if (avg >= 95) return { tier: "DREAM TEAM", desc: "Esquadrão dos sonhos — pentacampeão em potencial." };
  if (avg >= 92) return { tier: "SUPERTIME", desc: "Favoritíssimo absoluto ao título mundial." };
  if (avg >= 89) return { tier: "ELITE MUNDIAL", desc: "Time de elite, pronto pra erguer a taça." };
  if (avg >= 86) return { tier: "CONTENDER", desc: "Forte candidato, com brilho de sobra." };
  return { tier: "UNDERDOG", desc: "Zebra perigosa — ninguém quis te enfrentar." };
}

/** Sufixo de ano curto: 2023 -> "23". */
export function yy(year: number): string {
  return String(year).slice(2);
}
