// ============================================================
// TIMELINE IMERSIVA (cosmética) — dramatiza uma série já decidida
// ============================================================
// O resultado de cada jogo JÁ foi decidido pelo motor (simulateSeries). A
// timeline só NARRA esse resultado com eventos cronometrados de um "jogo de LoL"
// fictício, citando os jogadores reais das duas lines. 100% cosmético: não muda
// nada do placar. Time mais forte tende a mais eventos a favor, mas há tensão
// (o mais fraco "rouba o Baron" e dá esperança antes de cair).
//
// Determinístico por Rng (recebe a fonte semeada) — todos veem a mesma narração.

import type { TournamentPick } from "./tournament";
import type { Rng } from "./prng";

/** Um evento da timeline de UM jogo. */
export interface TimelineEvent {
  /** "minuto de jogo" fictício (pra exibir tipo 14:32). */
  minute: number;
  icon: string;
  /** lado que se beneficiou do evento ("a" | "b" | "neutral"). */
  side: "a" | "b" | "neutral";
  /** texto narrado (já com nomes reais). */
  text: string;
  /** evento-clímax (Baron, Nexus) — pra destacar visualmente. */
  big?: boolean;
}

/** A timeline completa de UM jogo: quem venceu + a sequência de eventos. */
export interface GameTimeline {
  gameNumber: number;
  /** "a" venceu este jogo? (lado A do confronto). */
  aWon: boolean;
  events: TimelineEvent[];
}

// nomes "amigáveis" dos lados pra narração (org curta ou nick).
export interface SideName {
  label: string; // ex.: "T1" ou "Marlon"
}

/** Sorteia um jogador de uma lane "agressiva" (carries fecham mais jogadas). */
const CARRY_WEIGHT: Record<string, number> = { BOT: 1, MID: 0.85, TOP: 0.5, JNG: 0.45, SUP: 0.15 };
function pickCarry(rng: Rng, line: TournamentPick[]): TournamentPick {
  const tot = line.reduce((a, p) => a + (CARRY_WEIGHT[p.role] ?? 0.3), 0);
  let r = rng.next() * tot;
  for (const p of line) {
    r -= CARRY_WEIGHT[p.role] ?? 0.3;
    if (r < 0) return p;
  }
  return line[line.length - 1];
}

// catálogos de frases por tipo de evento. {killer}/{victim} são substituídos.
const FIRST_BLOOD = ["{killer} abre o placar em cima de {victim}!", "First Blood! {killer} pega {victim} desprevenido.", "{killer} invade e tira a primeira de {victim}."];
const DRAGON = ["{team} garante mais um dragão.", "{team} controla o dragão com folga.", "{team} fecha o objetivo: dragão pra eles."];
const HERALD = ["{team} pega o Arauto e abre o mapa.", "Arauto controlado por {team}."];
const TOWER = ["{killer} derruba a torre e estende a vantagem.", "{team} abre a lane com a torre.", "Mais uma torre cai pra {team}."];
const TEAMFIGHT = ["Teamfight! {team} vence 3x1.", "{killer} brilha na luta — ace parcial pra {team}.", "{team} acerta o pick e converte a luta."];
const BARON = ["🦅 {team} ROUBA o Baron! A virada pode vir aí.", "🦅 BARON pra {team} — momento decisivo!", "🦅 {team} fecha o Baron com a equipe inteira."];
const ACE = ["💥 ACE! {team} limpa o mapa inteiro.", "💥 {killer} fecha o ACE pra {team}!"];
const SOUL = ["🌩️ {team} conquista a Alma do Dragão.", "🌩️ Alma do Dragão garantida por {team}."];
const PENTA = ["⚔ PENTAKILL de {killer}!! A torcida vai à loucura.", "⚔ {killer} FECHA O PENTA pra {team}!"];

function fill(tpl: string, killer?: string, victim?: string, team?: string): string {
  return tpl.replace("{killer}", killer ?? "").replace("{victim}", victim ?? "").replace("{team}", team ?? "");
}

/**
 * Gera a timeline de UM jogo. O vencedor (aWon) recebe a maioria dos eventos
 * grandes; o perdedor ganha 1-2 lances de esperança (drama). Pentakills reais do
 * motor entram como eventos ⚔ no minuto certo.
 */
export function buildGameTimeline(args: {
  rng: Rng;
  gameNumber: number;
  aWon: boolean;
  lineA: TournamentPick[];
  lineB: TournamentPick[];
  nameA: SideName;
  nameB: SideName;
  /** pentakills reais deste jogo: lado + nome (do rollSeriesHighlights). */
  pentas: { side: "a" | "b"; name: string }[];
}): GameTimeline {
  const { rng, gameNumber, aWon, lineA, lineB, nameA, nameB, pentas } = args;
  const winSide: "a" | "b" = aWon ? "a" : "b";
  const loseSide: "a" | "b" = aWon ? "b" : "a";
  const lineOf = (s: "a" | "b") => (s === "a" ? lineA : lineB);
  const nameOf = (s: "a" | "b") => (s === "a" ? nameA.label : nameB.label);

  const ev: TimelineEvent[] = [];
  const add = (minute: number, icon: string, side: "a" | "b" | "neutral", text: string, big = false) =>
    ev.push({ minute, icon, side, text, big });

  // ── early game (3-10 min): first blood + objetivos iniciais ──
  {
    const fbSide = rng.chance(0.62) ? winSide : loseSide; // vencedor leva mais
    const killer = pickCarry(rng, lineOf(fbSide));
    const victim = pickCarry(rng, lineOf(fbSide === "a" ? "b" : "a"));
    add(3 + rng.int(4), "🩸", fbSide, fill(rng.pick(FIRST_BLOOD), killer.name, victim.name));
  }
  add(6 + rng.int(3), "🐉", rng.chance(0.6) ? winSide : loseSide, fill(rng.pick(DRAGON), undefined, undefined, nameOf(rng.chance(0.6) ? winSide : loseSide)));
  if (rng.chance(0.7)) add(8 + rng.int(3), "🦎", winSide, fill(rng.pick(HERALD), undefined, undefined, nameOf(winSide)));

  // ── mid game (12-22 min): torres, teamfights, um lance de esperança do perdedor ──
  {
    const killer = pickCarry(rng, lineOf(winSide));
    add(12 + rng.int(4), "🏰", winSide, fill(rng.pick(TOWER), killer.name, undefined, nameOf(winSide)));
  }
  {
    // momento de esperança do perdedor: rouba o Baron OU vence uma luta.
    if (rng.chance(0.55)) add(16 + rng.int(3), "🦅", loseSide, fill(rng.pick(BARON), undefined, undefined, nameOf(loseSide)), true);
    else {
      const killer = pickCarry(rng, lineOf(loseSide));
      add(16 + rng.int(3), "⚡", loseSide, fill(rng.pick(TEAMFIGHT), killer.name, undefined, nameOf(loseSide)));
    }
  }
  {
    const killer = pickCarry(rng, lineOf(winSide));
    add(20 + rng.int(3), "⚡", winSide, fill(rng.pick(TEAMFIGHT), killer.name, undefined, nameOf(winSide)));
  }

  // ── late game (24-34 min): baron/alma decisivos do vencedor + pentas reais ──
  if (rng.chance(0.6)) add(24 + rng.int(3), "🌩️", winSide, fill(rng.pick(SOUL), undefined, undefined, nameOf(winSide)));
  add(26 + rng.int(3), "🦅", winSide, fill(rng.pick(BARON), undefined, undefined, nameOf(winSide)), true);
  // pentakills REAIS do motor (entram perto do clímax).
  pentas.forEach((pk, i) => {
    add(28 + i + rng.int(2), "⚔", pk.side, fill(rng.pick(PENTA), pk.name, undefined, nameOf(pk.side)), true);
  });
  if (rng.chance(0.4)) {
    const killer = pickCarry(rng, lineOf(winSide));
    add(30 + rng.int(2), "💥", winSide, fill(rng.pick(ACE), killer.name, undefined, nameOf(winSide)));
  }

  // ── nexus (fim): o vencedor fecha o jogo ──
  add(32 + rng.int(4), "🏆", winSide, `${nameOf(winSide)} destrói o Nexus e fecha o jogo ${gameNumber}!`, true);

  // ordena por minuto e remove minutos duplicados subindo +1.
  ev.sort((a, b) => a.minute - b.minute);
  let last = 0;
  for (const e of ev) {
    if (e.minute <= last) e.minute = last + 1;
    last = e.minute;
  }

  return { gameNumber, aWon, events: ev };
}
