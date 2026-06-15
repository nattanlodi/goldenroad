// ============================================================
// MOTOR DO TORNEIO "WORLDS AO VIVO" (Degrau 0 — offline)
// ============================================================
// Um chaveamento REAL e PERSISTENTE de 8 competidores (humanos + bots). Cada um
// carrega a MESMA line do início ao fim; quem vence sobe, quem perde é eliminado.
// É a estrutura nova do modo (o motor de batalha em si reusa helpers.ts).
//
// Tudo aqui é PURO e DETERMINÍSTICO por seed (via Rng) — nada de Math.random()
// nem estado de React. Isso é o que permite reproduzir o mesmo torneio em
// qualquer navegador (base pro online no Degrau 1+).

import type { Lineup, LineupPlayer, Role, Team } from "../types";
import { DRAFT_TEAMS, ROLES } from "../data/teams";
import { teamAvg } from "./helpers";
import type { Rng } from "./prng";

// ── Pool restrito a FINALISTAS (campeões + vices de Worlds/MSI) — "torneio de elite". ──
export const FINALIST_TEAMS: Team[] = DRAFT_TEAMS.filter((t) => t.champion || t.finalist);

// ── Nomes engraçados pros bots (sorteados sem repetir, com 🤖 antes). ──
export const BOT_NAMES = [
  "Marlon", "Valter", "Pedrinho", "Cleiton", "Jair", "Genival", "Wanderléia", "Beto",
  "Nildo", "Robevaldo", "Tião", "Dimas", "Joelma", "Robinho", "Gilmar", "Edivaldo",
  "Sebastião", "Romário", "Cleberson", "Anderson", "Wesley", "Joãozinho", "Naldo", "Zé",
];

/** Um jogador "draftado" pra uma line de torneio (sem buffs — line crua). */
export interface TournamentPick {
  role: Role;
  name: string;
  rating: number;
  team: string;
  short: string;
  year: number;
  league: string;
  country?: string;
}

/** Um competidor do bracket: humano (line draftada) ou bot (line sorteada). */
export interface Competitor {
  id: string;
  /** nome exibido (nick do humano OU nome do bot). */
  name: string;
  isBot: boolean;
  /** line de 5 jogadores (uma por role), na ordem de ROLES. */
  line: TournamentPick[];
  /** média de overall da line (cravada no início — é a "força" dele). */
  avg: number;
  /** forma do dia acumulada por role (🔥 +/ 🧊 −) que PERSISTE entre fases. */
  form: Partial<Record<Role, number>>;
}

/** Um confronto (nó) do bracket. */
export interface BracketMatch {
  id: string;
  /** fase: quartas (qf) → semis (sf) → final (gf). */
  stage: "qf" | "sf" | "gf";
  /** posição visual: "left" | "right" (borboleta) — a final não tem lado. */
  side: "left" | "right" | "center";
  /** ids dos dois competidores (null = aguardando vencedor de fase anterior). */
  a: string | null;
  b: string | null;
  /** placar da Bo5 (vitórias de cada lado). */
  scoreA: number;
  scoreB: number;
  /** id do vencedor (null = ainda não jogou). */
  winner: string | null;
  /** já foi disputado/resolvido? */
  done: boolean;
  /** série assistível (tem humano) ou resolvida rápido (bot×bot)? */
  watchable: boolean;
}

/** Estado completo do bracket (a árvore 8→4→2→1). */
export interface Bracket {
  qf: BracketMatch[]; // 4 quartas (2 left, 2 right)
  sf: BracketMatch[]; // 2 semis (1 left, 1 right)
  gf: BracketMatch; // 1 final
}

export const ROLE_LABEL_SHORT: Record<Role, string> = { TOP: "TOP", JNG: "JNG", MID: "MID", BOT: "BOT", SUP: "SUP" };

/** Sufixo de ano curto. */
const yy = (year: number) => String(year).slice(2);

/** Converte um Team do dataset numa line de TournamentPicks (uma por role, na ordem). */
export function teamToLine(t: Team): TournamentPick[] {
  // o dataset traz os 5 na ordem das roles; mapeia garantindo a ordem canônica.
  const byRole = new Map<Role, TournamentPick>();
  for (const p of t.players) {
    byRole.set(p[0], {
      role: p[0],
      name: p[1],
      rating: p[2],
      country: p[3],
      team: t.team,
      short: t.short,
      year: t.year,
      league: t.league,
    });
  }
  return ROLES.map((r) => byRole.get(r)).filter((p): p is TournamentPick => !!p);
}

/** Média de overall de uma line. */
export function lineAvg(line: TournamentPick[]): number {
  if (!line.length) return 0;
  return Math.round(line.reduce((a, p) => a + p.rating, 0) / line.length);
}

/** Converte um TournamentPick num LineupPlayer (pra reusar componentes do solo, ex.: RiftMap). */
export function pickToLineupPlayer(p: TournamentPick): LineupPlayer {
  return {
    role: p.role,
    rating: p.rating,
    baseRating: p.rating,
    name: p.name,
    team: p.team,
    short: p.short,
    year: p.year,
    league: p.league,
    champion: false,
    country: p.country,
  };
}

/** Converte os picks por role num Lineup completo (com null nas lanes vazias). */
export function picksToLineup(picks: Partial<Record<Role, TournamentPick>>): Lineup {
  const out: Lineup = { TOP: null, JNG: null, MID: null, BOT: null, SUP: null };
  for (const r of ROLES) {
    const p = picks[r];
    if (p) out[r] = pickToLineupPlayer(p);
  }
  return out;
}

/**
 * Sorteia uma line de BOT do pool de finalistas — força VARIADA (sem nivelar):
 * pega um time finalista qualquer (uniforme), pra cobrir toda a faixa ~84..97.
 * Picks podem repetir entre bots por agora (pool não-exclusivo, V1).
 */
export function rollBotLine(rng: Rng): TournamentPick[] {
  const t = rng.pick(FINALIST_TEAMS);
  return teamToLine(t);
}

/**
 * Gera os N bots que preenchem o bracket (8 − humanos). Nomes únicos com 🤖,
 * lines de força variada. `usedNames` evita repetir nomes já em uso (ex.: nicks).
 */
export function makeBots(rng: Rng, count: number): Competitor[] {
  const names = rng.shuffle(BOT_NAMES).slice(0, count);
  return names.map((name, i) => {
    const line = rollBotLine(rng);
    return {
      id: `bot-${i}`,
      name,
      isBot: true,
      line,
      avg: lineAvg(line),
      form: {},
    };
  });
}

/** Label de exibição de um competidor (com 🤖 nos bots). */
export function competitorLabel(c: Competitor): string {
  return c.isBot ? `🤖 ${c.name}` : c.name;
}

/** Time-base predominante da line (só o short, ex.: "T1"). Vazio se line vazia. */
export function teamShortOf(c: Competitor): string {
  const counts = new Map<string, { n: number; short: string }>();
  for (const p of c.line) {
    const cur = counts.get(p.short) ?? { n: 0, short: p.short };
    cur.n++;
    counts.set(p.short, cur);
  }
  let best = { n: 0, short: "" };
  for (const v of counts.values()) if (v.n > best.n) best = v;
  return best.short;
}

/** Sub-rótulo: time-base predominante da line (ex.: "T1 '24" se a maioria é dali). */
export function competitorSubtitle(c: Competitor): string {
  const counts = new Map<string, { n: number; short: string; year: number }>();
  for (const p of c.line) {
    const key = `${p.short}-${p.year}`;
    const cur = counts.get(key) ?? { n: 0, short: p.short, year: p.year };
    cur.n++;
    counts.set(key, cur);
  }
  let best = { n: 0, short: "", year: 0 };
  for (const v of counts.values()) if (v.n > best.n) best = v;
  return best.short ? `${best.short} '${yy(best.year)}` : "";
}

/**
 * Monta o bracket inicial de 8 → 4 quartas → 2 semis → 1 final (borboleta).
 *
 * SEEDING (regra travada):
 *  - 2–4 humanos: espalha 1 humano por confronto de quartas → todos começam vs
 *    bot; amigos só se cruzam na semi/final.
 *  - 5–8 humanos: impossível evitar (casa dos pombos) → ordem totalmente sorteada.
 */
export function buildBracket(rng: Rng, competitors: Competitor[]): Bracket {
  const humans = competitors.filter((c) => !c.isBot);
  const bots = competitors.filter((c) => c.isBot);

  // ordem dos 8 slots das quartas (q0a,q0b, q1a,q1b, q2a,q2b, q3a,q3b).
  let order: Competitor[];
  if (humans.length <= 4) {
    // espalha humanos em confrontos distintos (slot "a" de cada quarta),
    // completa os "b" com bots; bots restantes vão pros confrontos sobrando.
    const hShuffled = rng.shuffle(humans);
    const bShuffled = rng.shuffle(bots);
    const slots: (Competitor | null)[] = new Array(8).fill(null);
    // 1 humano por confronto, no slot "a" (índices pares).
    hShuffled.forEach((h, i) => { slots[i * 2] = h; });
    // preenche o resto com bots, na ordem.
    let bi = 0;
    for (let s = 0; s < 8; s++) if (!slots[s]) slots[s] = bShuffled[bi++];
    order = slots as Competitor[];
  } else {
    // 5+ humanos: sorteio puro.
    order = rng.shuffle(competitors);
  }

  const watchable2 = (a: Competitor, b: Competitor) => !a.isBot || !b.isBot;

  const qf: BracketMatch[] = [];
  for (let i = 0; i < 4; i++) {
    const a = order[i * 2];
    const b = order[i * 2 + 1];
    qf.push({
      id: `qf-${i}`,
      stage: "qf",
      side: i < 2 ? "left" : "right",
      a: a.id,
      b: b.id,
      scoreA: 0,
      scoreB: 0,
      winner: null,
      done: false,
      watchable: watchable2(a, b),
    });
  }
  const sf: BracketMatch[] = [
    { id: "sf-0", stage: "sf", side: "left", a: null, b: null, scoreA: 0, scoreB: 0, winner: null, done: false, watchable: true },
    { id: "sf-1", stage: "sf", side: "right", a: null, b: null, scoreA: 0, scoreB: 0, winner: null, done: false, watchable: true },
  ];
  const gf: BracketMatch = { id: "gf", stage: "gf", side: "center", a: null, b: null, scoreA: 0, scoreB: 0, winner: null, done: false, watchable: true };

  return { qf, sf, gf };
}

/** Todos os confrontos do bracket numa lista plana (ordem de jogo: qf → sf → gf). */
export function allMatches(b: Bracket): BracketMatch[] {
  return [...b.qf, ...b.sf, ...b.gf ? [b.gf] : []];
}

/**
 * Propaga vencedores já decididos pras fases seguintes (preenche os slots null
 * de semis/final). Atualiza `watchable` quando ambos os lados já são conhecidos.
 * Retorna um NOVO bracket (imutável).
 */
export function propagate(b: Bracket, byId: Map<string, Competitor>): Bracket {
  const qf = b.qf.map((m) => ({ ...m }));
  const sf = b.sf.map((m) => ({ ...m }));
  const gf = { ...b.gf };

  // quartas → semis: qf0,qf1 → sf0 (left); qf2,qf3 → sf1 (right).
  sf[0].a = qf[0].winner;
  sf[0].b = qf[1].winner;
  sf[1].a = qf[2].winner;
  sf[1].b = qf[3].winner;
  // semis → final.
  gf.a = sf[0].winner;
  gf.b = sf[1].winner;

  const watchableOf = (m: BracketMatch) => {
    if (!m.a || !m.b) return true; // ainda desconhecido → assume assistível
    const a = byId.get(m.a);
    const bb = byId.get(m.b);
    return !!a && !!bb && (!a.isBot || !bb.isBot);
  };
  for (const m of sf) m.watchable = watchableOf(m);
  gf.watchable = watchableOf(gf);

  return { qf, sf, gf };
}

/** Aplica o resultado de um confronto (placar + vencedor) e devolve novo bracket. */
export function applyResult(
  b: Bracket,
  byId: Map<string, Competitor>,
  matchId: string,
  scoreA: number,
  scoreB: number,
): Bracket {
  const update = (m: BracketMatch): BracketMatch =>
    m.id === matchId
      ? { ...m, scoreA, scoreB, winner: scoreA > scoreB ? m.a : m.b, done: true }
      : m;
  const next: Bracket = {
    qf: b.qf.map(update),
    sf: b.sf.map(update),
    gf: update(b.gf),
  };
  return propagate(next, byId);
}

/**
 * Colocação final de cada competidor pela posição no bracket:
 *  1 (campeão) · 2 (vice) · 3 (semifinalistas, empatados) · 5 (quartas, empatados).
 * Retorna um Map<id, placement>.
 */
export function placements(b: Bracket): Map<string, number> {
  const place = new Map<string, number>();
  // quartas: quem perdeu cada qf → 5º.
  for (const m of b.qf) {
    if (m.done && m.winner) {
      const loser = m.winner === m.a ? m.b : m.a;
      if (loser) place.set(loser, 5);
    }
  }
  // semis: quem perdeu → 3º.
  for (const m of b.sf) {
    if (m.done && m.winner) {
      const loser = m.winner === m.a ? m.b : m.a;
      if (loser) place.set(loser, 3);
    }
  }
  // final: vice (2º) e campeão (1º).
  if (b.gf.done && b.gf.winner) {
    const loser = b.gf.winner === b.gf.a ? b.gf.b : b.gf.a;
    if (loser) place.set(loser, 2);
    place.set(b.gf.winner, 1);
  }
  return place;
}

/** True quando o torneio inteiro acabou (final resolvida). */
export function isTournamentOver(b: Bracket): boolean {
  return b.gf.done && b.gf.winner != null;
}

// Re-export pra quem importa daqui.
export { teamAvg };
