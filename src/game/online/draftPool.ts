// ============================================================
// Pool de draft do 1v1 ONLINE — rolar time + auto-pick aleatório
// ============================================================
// O draft online reusa o pool de FINALISTAS (mesmo do offline) e a mecânica de
// "rolar times": cada jogador rola seu próprio time localmente (privado, não vai
// pra rede) e escolhe 1 jogador por rodada. Picks PODEM repetir entre os dois
// (sem disputa de pool) — então cada cliente rola com seu RNG sem sincronizar.
//
// Determinismo: o RNG deriva da seed da sala (código) + playerId + rodada, então
// o "rolar" é reproduzível por jogador, mas o host não precisa transmitir nada.

import { ROLES } from "../../data/teams";
import type { Role, Team, Tournament } from "../../types";
import { makeRng, seedFromCode, type Rng } from "../prng";
import { FINALIST_TEAMS, teamToLine, type TournamentPick } from "../tournament";

/** Times finalistas filtrados pelos campeonatos escolhidos (config da sala).
 * `campaigns` ausente/vazio = todos (retrocompat). "worlds" é o default de um time
 * sem o campo `tournament`. Se o filtro zerar o pool (não deve ocorrer), cai pra todos. */
function teamsFor(campaigns?: Tournament[]): Team[] {
  if (!campaigns || campaigns.length === 0) return FINALIST_TEAMS;
  const set = new Set(campaigns);
  const filtered = FINALIST_TEAMS.filter((t) => set.has(t.tournament ?? "worlds"));
  return filtered.length ? filtered : FINALIST_TEAMS;
}

/** Pool por role a partir de um conjunto de times. */
function poolByRole(teams: Team[]): Record<Role, TournamentPick[]> {
  const out = { TOP: [], JNG: [], MID: [], BOT: [], SUP: [] } as Record<Role, TournamentPick[]>;
  for (const t of teams) for (const p of teamToLine(t)) out[p.role].push(p);
  return out;
}

/** RNG por jogador, derivado da sala+jogador (rolar privado e reproduzível). */
export function playerRng(code: string, playerId: string, salt = 0): Rng {
  return makeRng((seedFromCode(`${code}:${playerId}`) ^ (salt * 0x9e3779b1)) >>> 0);
}

/** Resultado de um sorteio: o Team completo (pro card mostrar ano/selo) + line + média. */
export interface RolledTeam {
  team: Team;
  line: TournamentPick[];
  avg: number;
}

function rolledFrom(t: Team): RolledTeam {
  const line = teamToLine(t);
  const avg = Math.round(line.reduce((a, p) => a + p.rating, 0) / line.length);
  return { team: t, line, avg };
}

/** Sorteia um time do pool (filtrado pelos campeonatos) pro jogador rolar. */
export function rollTeam(rng: Rng, excludeId?: string, campaigns?: Tournament[]): RolledTeam {
  const base = teamsFor(campaigns);
  const pool = excludeId ? base.filter((t) => t.id !== excludeId) : base;
  const t = rng.pick(pool.length ? pool : base);
  return rolledFrom(t);
}

/** Há OUTRA campanha (mesmo time, outro ano/torneio) no pool filtrado? */
export function hasSameTeamOtherYear(teamName: string, excludeId: string, campaigns?: Tournament[]): boolean {
  return teamsFor(campaigns).some((t) => t.team === teamName && t.id !== excludeId);
}

/** Sorteia o MESMO time noutro ano/campanha do pool filtrado (ou null se não há outro). */
export function rollSameTeam(rng: Rng, teamName: string, excludeId: string, campaigns?: Tournament[]): RolledTeam | null {
  const others = teamsFor(campaigns).filter((t) => t.team === teamName && t.id !== excludeId);
  if (!others.length) return null;
  return rolledFrom(rng.pick(others));
}

/**
 * Auto-pick ALEATÓRIO (§ draft): pra um jogador que não escolheu, sorteia um
 * jogador do pool (filtrado pelos campeonatos) e uma LANE ainda vazia.
 */
export function randomAutoPick(
  rng: Rng,
  occupied: Partial<Record<Role, TournamentPick>>,
  campaigns?: Tournament[]
): { role: Role; pick: TournamentPick } | null {
  const free = ROLES.filter((r) => !occupied[r]);
  if (!free.length) return null;
  const role = rng.pick(free);
  const candidates = poolByRole(teamsFor(campaigns))[role];
  if (!candidates.length) return null;
  const pick = rng.pick(candidates);
  return { role, pick };
}
