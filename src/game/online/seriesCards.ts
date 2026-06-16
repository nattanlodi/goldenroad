// ============================================================
// Ponte CARTAS → SIMULAÇÃO (online) — PURO e DETERMINÍSTICO
// ============================================================
// Dada uma série COM as escolhas de carta resolvidas (pickA/pickB), produz os
// dois Competitor EFETIVOS: line modificada (permanentes/trocas) + `form` com os
// deltas temporários somados. A simulação e a timeline usam esses competidores,
// então host e clientes chegam ao MESMO resultado a partir das escolhas (que
// trafegam) + a seed da sala — sem transmitir a simulação inteira.

import { makeRng, seedFromCode, type Rng } from "../prng";
import type { Competitor, TournamentPick } from "../tournament";
import { applyCardToLines, type LineMods } from "./cardEngine";
import type { CardChoice, SeriesCards } from "./roomState";

/** Soma os deltas temporários (mods) ao `form` de um competidor. */
function withForm(c: Competitor, line: TournamentPick[], mods: LineMods): Competitor {
  const form: Partial<Record<typeof line[number]["role"], number>> = { ...c.form };
  for (const role of Object.keys(mods) as (keyof typeof mods)[]) {
    form[role] = (form[role] ?? 0) + (mods[role] ?? 0);
  }
  const avg = line.length ? Math.round(line.reduce((s, p) => s + p.rating, 0) / line.length) : 0;
  return { ...c, line, avg, form };
}

/** Acha uma carta (pelo id) no trio do lado. */
function cardOf(cards: SeriesCards, side: "a" | "b", choice: CardChoice | null) {
  if (!choice) return null;
  const trio = side === "a" ? cards.trioA : cards.trioB;
  return trio.find((c) => c.id === choice.cardId) ?? null;
}

/**
 * Aplica as escolhas de carta dos DOIS lados e devolve os competidores efetivos.
 * Cada lado aplica sua carta do seu ponto de vista (my=ele, opp=o outro). Como
 * uma carta pode mexer na line do rival (roubo/troca), aplicamos em sequência
 * (A depois B) sobre as MESMAS lines — ordem fixa = determinismo.
 *
 * `code`+`salt` (=matchId) derivam o RNG das aleatoriedades das cartas (roleta).
 */
export function applyCardsToCompetitors(
  a: Competitor,
  b: Competitor,
  cards: SeriesCards,
  code: string,
  salt: string
): { a: Competitor; b: Competitor } {
  let lineA = a.line.slice();
  let lineB = b.line.slice();
  let modsA: LineMods = {};
  let modsB: LineMods = {};
  const merge = (dst: LineMods, src: LineMods) => { for (const k of Object.keys(src) as (keyof LineMods)[]) dst[k] = (dst[k] ?? 0) + (src[k] ?? 0); };

  const rng: Rng = makeRng(seedFromCode(`${code}:cardfx:${salt}`));

  // lado A aplica sua carta (my=A, opp=B).
  const cardA = cardOf(cards, "a", cards.pickA);
  if (cardA) {
    const res = applyCardToLines(cardA, lineA, lineB, cards.pickA?.target ?? null, rng);
    lineA = res.myLine; lineB = res.oppLine;
    merge(modsA, res.myMods); merge(modsB, res.oppMods);
  }
  // lado B aplica sua carta (my=B, opp=A) — sobre as lines já possivelmente trocadas.
  const cardB = cardOf(cards, "b", cards.pickB);
  if (cardB) {
    const res = applyCardToLines(cardB, lineB, lineA, cards.pickB?.target ?? null, rng);
    lineB = res.myLine; lineA = res.oppLine;
    merge(modsB, res.myMods); merge(modsA, res.oppMods);
  }

  return { a: withForm(a, lineA, modsA), b: withForm(b, lineB, modsB) };
}
