// ============================================================
// Simulação de SÉRIE (Bo5) — núcleo puro, reusado offline e online
// ============================================================
// Extraído de useTournament pra o 1v1 online reusar EXATAMENTE a mesma lógica
// de simulação/forma/MVP — determinística por seed (host transmite só a seed e
// os dois clientes recriam a mesma série). Sem estado de React aqui.

import type { Role } from "../types";
import { gameWinProb } from "./helpers";
import type { Rng } from "./prng";
import type { Competitor, TournamentPick } from "./tournament";

export interface Bo5Result {
  finalA: number;
  finalB: number;
  /** true = lado A venceu, por jogo, na ordem. */
  games: boolean[];
  /** pentakills reais por jogo (lado + nome). */
  pentasByGame: { side: "a" | "b"; name: string }[][];
}

/** Força efetiva de um competidor (overall + forma do dia 🔥/🧊). */
function formAvg(c: Competitor): number {
  return c.line.reduce((acc, p) => acc + p.rating + (c.form[p.role] ?? 0), 0) / c.line.length;
}

// peso de penta por lane (carries fecham mais) — usado p/ penta e MVP.
const PENTA_W: Record<Role, number> = { BOT: 1.0, MID: 0.6, TOP: 0.3, JNG: 0.12, SUP: 0.02 };

/** Simula uma Bo5 inteira (determinística pelo rng). Igual ao motor do solo. */
export function simulateBo5(rng: Rng, a: Competitor, b: Competitor): Bo5Result {
  const pA = gameWinProb(formAvg(a), formAvg(b));
  const games: boolean[] = [];
  let wa = 0;
  let wb = 0;
  const pentasByGame: { side: "a" | "b"; name: string }[][] = [];

  const pickPenta = (line: TournamentPick[]): TournamentPick => {
    const w = (p: TournamentPick) => PENTA_W[p.role] * Math.pow(Math.max(1, p.rating - 60), 1.6);
    const tot = line.reduce((acc, p) => acc + w(p), 0);
    let r = rng.next() * tot;
    for (const p of line) {
      r -= w(p);
      if (r < 0) return p;
    }
    return line[line.length - 1];
  };

  while (wa < 3 && wb < 3) {
    const aWon = rng.next() < pA;
    games.push(aWon);
    if (aWon) wa++;
    else wb++;
    const pk: { side: "a" | "b"; name: string }[] = [];
    if (rng.chance(0.12)) pk.push({ side: "a", name: pickPenta(a.line).name });
    if (rng.chance(0.12)) pk.push({ side: "b", name: pickPenta(b.line).name });
    pentasByGame.push(pk);
  }
  return { finalA: wa, finalB: wb, games, pentasByGame };
}

/** Carry de maior peso de uma line (proxy de quem "carrega"). */
export function carryOf(line: TournamentPick[]): TournamentPick {
  return line.reduce((best, p) => (PENTA_W[p.role] * p.rating > PENTA_W[best.role] * best.rating ? p : best), line[0]);
}

/** MVP de UM jogo de um lado: o autor do penta (se houve), senão o carry. */
export function gameMvpName(line: TournamentPick[], pentasOfGame: { side: "a" | "b"; name: string }[], side: "a" | "b"): string {
  const myPenta = pentasOfGame.find((p) => p.side === side);
  return myPenta ? myPenta.name : carryOf(line).name;
}

/**
 * Atualiza a forma do dia 🔥/🧊 após uma série (persiste). Igual ao solo:
 *  🔥 fogo: um jogador do VENCEDOR foi MVP de 2+ jogos da Bo5 (+3).
 *  🧊 gelado: após derrota, o jogador de menor overall esfria (−3).
 */
export function updateForma(
  c: Competitor,
  won: boolean,
  games: boolean[],
  side: "a" | "b",
  pentasByGame: { side: "a" | "b"; name: string }[][]
): Partial<Record<Role, number>> {
  const form: Partial<Record<Role, number>> = {};
  if (won) {
    const mvpCount = new Map<string, number>();
    games.forEach((aWon, gi) => {
      const winSide: "a" | "b" = aWon ? "a" : "b";
      if (winSide !== side) return;
      const name = gameMvpName(c.line, pentasByGame[gi] ?? [], side);
      mvpCount.set(name, (mvpCount.get(name) ?? 0) + 1);
    });
    for (const p of c.line) {
      if ((mvpCount.get(p.name) ?? 0) >= 2) form[p.role] = 3;
    }
  } else {
    const weakest = c.line.reduce((w, p) => (p.rating < w.rating ? p : w), c.line[0]);
    form[weakest.role] = -3;
  }
  return form;
}
