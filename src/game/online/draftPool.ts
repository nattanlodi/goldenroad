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
import type { Role, Team } from "../../types";
import { makeRng, seedFromCode, type Rng } from "../prng";
import { FINALIST_TEAMS, teamToLine, type TournamentPick } from "../tournament";

/** Todos os jogadores finalistas achatados por role (pool do auto-pick). */
const POOL_BY_ROLE: Record<Role, TournamentPick[]> = (() => {
  const out = { TOP: [], JNG: [], MID: [], BOT: [], SUP: [] } as Record<Role, TournamentPick[]>;
  for (const t of FINALIST_TEAMS) {
    for (const p of teamToLine(t)) out[p.role].push(p);
  }
  return out;
})();

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

/** Sorteia um time do pool de finalistas pro jogador rolar (evita repetir o último). */
export function rollTeam(rng: Rng, excludeId?: string): RolledTeam {
  const pool = excludeId ? FINALIST_TEAMS.filter((t) => t.id !== excludeId) : FINALIST_TEAMS;
  const t = rng.pick(pool.length ? pool : FINALIST_TEAMS);
  return rolledFrom(t);
}

/** Há OUTRA campanha (mesmo time, outro ano/torneio) no pool? */
export function hasSameTeamOtherYear(teamName: string, excludeId: string): boolean {
  return FINALIST_TEAMS.some((t) => t.team === teamName && t.id !== excludeId);
}

/** Sorteia o MESMO time noutro ano/campanha (ou null se não existir outro). */
export function rollSameTeam(rng: Rng, teamName: string, excludeId: string): RolledTeam | null {
  const others = FINALIST_TEAMS.filter((t) => t.team === teamName && t.id !== excludeId);
  if (!others.length) return null;
  return rolledFrom(rng.pick(others));
}

/**
 * Auto-pick ALEATÓRIO (§ draft): pra um jogador que não escolheu, sorteia um
 * jogador do pool e uma LANE ainda vazia. Aleatório no jogador (sem olhar
 * overall), mas nunca num slot já ocupado.
 */
export function randomAutoPick(
  rng: Rng,
  occupied: Partial<Record<Role, TournamentPick>>
): { role: Role; pick: TournamentPick } | null {
  const free = ROLES.filter((r) => !occupied[r]);
  if (!free.length) return null;
  const role = rng.pick(free);
  const candidates = POOL_BY_ROLE[role];
  const pick = rng.pick(candidates);
  return { role, pick };
}
