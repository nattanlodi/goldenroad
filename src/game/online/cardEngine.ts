// ============================================================
// MOTOR DE CARTAS do torneio ONLINE (Degrau 2) — PURO e DETERMINÍSTICO
// ============================================================
// As cartas de evento do PvP seguem a regra de SIMETRIA DE NÍVEL (§design):
//   • quando ROLA evento numa série, os DOIS lados recebem evento do MESMO nível
//     (mesma raridade + mesmo "humor": buff ou azar). Mas NÃO as mesmas cartas —
//     cada lado vê seu próprio trio e escolhe a sua. A simetria é de NÍVEL.
//   • Contra BOT: o bot recebe um trio do mesmo nível e PICKA A MELHOR.
//   • Cartas de TROCA/ROUBO (Curinga/Olheiro/Troca Forçada) só em humano×humano.
//
// Tudo aqui é determinístico por seed (host e clientes regeneram igual) e opera
// sobre `TournamentPick[]` (a line do online), sem tocar em React/estado do solo.
// Aplicar uma carta pode mexer na line do RIVAL (roubo/troca), por isso as
// funções recebem/retornam OS DOIS lados.

import type { CardRarity, EventCard, Role } from "../../types";
import { ROLES } from "../../data/teams";
import { EVENT_DECK, HOSTILE_DECK } from "../../data/eventCards";
import { makeRng, seedFromCode, type Rng } from "../prng";
import { FINALIST_TEAMS, teamToLine, type TournamentPick } from "../tournament";

const RARITY_WEIGHT: Record<CardRarity, number> = { comum: 70, rara: 26, lendaria: 8 };
const BASE_CHANCE = 0.4; // mesma régua do solo (rollEventCards)
const HOSTILE_CHANCE = 0.22;

/** Pool de finalistas achatado por role (pro Curinga trocar por qualquer um). */
const POOL_BY_ROLE: Record<Role, TournamentPick[]> = (() => {
  const out = { TOP: [], JNG: [], MID: [], BOT: [], SUP: [] } as Record<Role, TournamentPick[]>;
  for (const t of FINALIST_TEAMS) for (const p of teamToLine(t)) out[p.role].push(p);
  return out;
})();

/** Cartas de TROCA/ROUBO — só entram em humano×humano (§design). */
const SWAP_KINDS = new Set(["stealBest", "swapOwnRole", "swapWithOpp"]);

/** O evento simétrico decidido pelo host pra uma série (mesmo nível dos 2 lados). */
export interface SymmetricEvent {
  /** nível/raridade sorteado — IGUAL pros dois lados. */
  rarity: CardRarity;
  /** evento de azar? (os dois recebem trio ruim) ou bom (os dois recebem trio bom). */
  hostile: boolean;
  /** trio do lado A (3 cartas distintas do nível). */
  trioA: EventCard[];
  /** trio do lado B (3 cartas distintas — diferentes do A, mesmo nível). */
  trioB: EventCard[];
}

/** Sorteia 1 carta de um pool ponderado por raridade, evitando repetir ids. */
function pickWeighted(pool: EventCard[], rng: Rng, used: Set<string>): EventCard | null {
  const avail = pool.filter((c) => !used.has(c.id));
  if (!avail.length) return null;
  const total = avail.reduce((a, c) => a + RARITY_WEIGHT[c.rarity], 0);
  let r = rng.next() * total;
  for (const c of avail) {
    r -= RARITY_WEIGHT[c.rarity];
    if (r < 0) return c;
  }
  return avail[avail.length - 1];
}

/** Monta um trio de 3 cartas distintas a partir de um baralho (ponderado). */
function trioFrom(deck: EventCard[], rng: Rng): EventCard[] {
  const used = new Set<string>();
  const out: EventCard[] = [];
  while (out.length < 3) {
    const c = pickWeighted(deck, rng, used);
    if (!c) break;
    used.add(c.id);
    out.push(c);
  }
  return out;
}

/**
 * Decide (deterministicamente, pela seed da série) se ROLA um evento simétrico e,
 * se sim, monta os dois trios do MESMO nível. `vsBot` filtra as cartas de
 * troca/roubo (só aparecem em humano×humano). `decisive` aumenta a chance.
 *
 * Retorna null se não rolou evento nesta série.
 */
export function rollSymmetricEvent(
  code: string,
  matchId: string,
  vsBot: boolean,
  decisive: boolean,
  always = false
): SymmetricEvent | null {
  const rng = makeRng(seedFromCode(`${code}:cards:${matchId}`));
  const chance = decisive ? BASE_CHANCE + 0.12 : BASE_CHANCE;
  // `always`: no torneio com cartas ligadas, TODA série vem com carta. Ainda
  // consome o rng (mantém o resto da sequência determinística inalterado).
  const roll = rng.next();
  if (!always && roll >= chance) return null;

  const hostileChance = decisive ? HOSTILE_CHANCE + 0.08 : HOSTILE_CHANCE;
  const hostile = rng.next() < hostileChance;

  // baralho-base do humor sorteado; sem "thaw" (não há 🧊 prévio no torneio) e,
  // contra bot, sem as cartas de troca/roubo.
  let deck = (hostile ? HOSTILE_DECK : EVENT_DECK).filter((c) => c.kind !== "thaw");
  if (vsBot) deck = deck.filter((c) => !SWAP_KINDS.has(c.kind));

  // o NÍVEL (raridade) é sorteado UMA vez e vale pros dois lados (simetria).
  const rarity = pickRarity(rng, deck);
  const pool = deck.filter((c) => c.rarity === rarity);
  // se o nível tiver menos de 3 cartas, completa com o baralho todo (raro).
  const sourceA = pool.length >= 3 ? pool : deck;
  const trioA = trioFrom(sourceA, rng);
  const trioB = trioFrom(sourceA, rng);
  if (trioA.length < 3 || trioB.length < 3) return null;
  return { rarity, hostile, trioA, trioB };
}

/** Sorteia uma raridade presente no baralho (ponderada pelos pesos do solo). */
function pickRarity(rng: Rng, deck: EventCard[]): CardRarity {
  const present = new Set(deck.map((c) => c.rarity));
  const opts = (["comum", "rara", "lendaria"] as CardRarity[]).filter((r) => present.has(r));
  const total = opts.reduce((a, r) => a + RARITY_WEIGHT[r], 0);
  let x = rng.next() * total;
  for (const r of opts) {
    x -= RARITY_WEIGHT[r];
    if (x < 0) return r;
  }
  return opts[opts.length - 1] ?? "comum";
}

// ── escolha do BOT: a MELHOR carta do trio ──

/** Valor heurístico de uma carta pro DONO (positivo = bom pra mim). O bot pega
 * a de maior valor (§design: "bot não erra a escolha"). */
function cardValueForOwner(c: EventCard): number {
  switch (c.kind) {
    // buffs próprios (quanto maior o value e mais permanente, melhor).
    case "teamBuff": case "teamBuffTemp": return c.value * 5 + (c.permanent ? 6 : 0);
    case "weakestBuff": case "weakestBuffPerm": case "oldestBuff":
    case "bestBuffPerm": case "roleBuffRandom": case "roleBuffChoose":
    case "captainChoose": case "igniteChoose": case "frontlineBuff": case "thaw":
      return c.value + (c.permanent ? 4 : 0);
    case "roulette": return c.value * 0.6 - 2 * 0.4; // valor esperado
    // contra o rival (bom): nerf no rival.
    case "nerfOpp": return c.value;
    case "nerfOppAll": return c.value * 4;
    case "stealBest": return 12; // roubar o craque do rival
    case "swapOwnRole": return 8;
    case "swapWithOpp": return 7;
    // cartas RUINS (o bot escolhe a MENOS pior → maior valor = menos dano).
    case "teamNerfTemp": return -c.value * 5;
    case "injureChoose": case "slumpBest": case "freezeRandom":
    case "slumpRandom": case "oldestNerf": return -c.value;
    case "permNerfChoose": return -c.value * 4 - 4;
    case "permNerfBest": return -c.value - 4;
    case "oppBuffAll": return -c.value * 4;
    case "oppBuffBest": return -c.value;
    case "doubleEdge": return -(c.value * 4 + (c.value2 ?? 0));
    case "badRoulette": return -(c.value * 0.5 + 2 * 0.5) * 3;
    default: return 0;
  }
}

/** Índice da MELHOR carta do trio pro dono (escolha do bot/auto pela melhor). */
export function bestCardIndex(trio: EventCard[]): number {
  let best = 0;
  let bestV = -Infinity;
  for (let i = 0; i < trio.length; i++) {
    const v = cardValueForOwner(trio[i]);
    if (v > bestV) { bestV = v; best = i; }
  }
  return best;
}

// ── aplicação do efeito de UMA carta às lines ──

/** Alvo escolhido (lane própria / lane do rival / jogador específico do Curinga). */
export interface OnlineCardTarget {
  role?: Role; // lane envolvida (nerf no rival, injure própria, troca…)
  swapTeamId?: string; // Curinga: time do jogador escolhido
  swapName?: string; // Curinga: nome do jogador escolhido
}

/** Delta temporário por role (vale só esta série) aplicado a uma line. */
export type LineMods = Partial<Record<Role, number>>;

/** Resultado de aplicar uma carta: lines (possivelmente trocadas) + deltas temporários. */
export interface CardApplied {
  myLine: TournamentPick[];
  oppLine: TournamentPick[];
  myMods: LineMods;
  oppMods: LineMods;
}

const lineByRole = (line: TournamentPick[]) => {
  const m = new Map<Role, TournamentPick>();
  for (const p of line) m.set(p.role, p);
  return m;
};
const sortedByRole = (m: Map<Role, TournamentPick>) =>
  ROLES.map((r) => m.get(r)).filter((x): x is TournamentPick => !!x);

// fallback "TOP" quando a line está vazia (não deveria ocorrer no bracket, mas
// blinda contra um snapshot incompleto no cliente → evita TypeError no render).
const weakestRole = (line: TournamentPick[]): Role => (line.length ? line.reduce((w, p) => (p.rating < w.rating ? p : w), line[0]).role : "TOP");
const bestRole = (line: TournamentPick[]): Role => (line.length ? line.reduce((b, p) => (p.rating > b.rating ? p : b), line[0]).role : "TOP");
const oldestRole = (line: TournamentPick[]): Role => (line.length ? line.reduce((o, p) => (p.year < o.year ? p : o), line[0]).role : "TOP");

/**
 * Aplica o efeito de uma carta às duas lines (DO PONTO DE VISTA do dono `my`).
 * PERMANENTE → muda a line (rating/jogador) direto; TEMPORÁRIO → entra nos mods
 * (delta por role, vale só a série). `rng` resolve aleatoriedades (roleta etc.)
 * e DEVE ser o mesmo seed em host/clientes (derivado por matchId+lado).
 */
export function applyCardToLines(
  card: EventCard,
  myLine: TournamentPick[],
  oppLine: TournamentPick[],
  target: OnlineCardTarget | null,
  rng: Rng
): CardApplied {
  let my = myLine.slice();
  let opp = oppLine.slice();
  const myMods: LineMods = {};
  const oppMods: LineMods = {};
  // blindagem: line incompleta (snapshot defasado no cliente) → não aplica efeito
  // (evita TypeError em rng.pick/bestRole durante o render). O host sempre tem 5.
  if (!my.length || !opp.length) return { myLine: my, oppLine: opp, myMods, oppMods };
  const bump = (mods: LineMods, role: Role, d: number) => { mods[role] = (mods[role] ?? 0) + d; };
  const permBump = (line: TournamentPick[], role: Role, d: number) =>
    line.map((p) => (p.role === role ? { ...p, rating: Math.max(1, Math.min(100, p.rating + d)) } : p));

  switch (card.kind) {
    // ── buffs próprios temporários ──
    case "teamBuffTemp": for (const p of my) bump(myMods, p.role, card.value); break;
    case "roleBuffRandom": bump(myMods, rng.pick(my).role, card.value); break;
    case "roleBuffChoose": if (target?.role) bump(myMods, target.role, card.value); break;
    case "weakestBuff": bump(myMods, weakestRole(my), card.value); break;
    case "oldestBuff": bump(myMods, oldestRole(my), card.value); break;
    case "igniteChoose": bump(myMods, target?.role ?? bestRole(my), card.value); break;
    case "frontlineBuff": bump(myMods, "TOP", card.value); bump(myMods, "SUP", card.value); break;
    case "captainChoose": {
      const star = target?.role ?? bestRole(my);
      for (const p of my) bump(myMods, p.role, p.role === star ? card.value : -1);
      break;
    }
    case "roulette": {
      const good = rng.next() < 0.6;
      for (const p of my) bump(myMods, p.role, good ? card.value : -2);
      break;
    }
    case "thaw": bump(myMods, rng.pick(my).role, card.value); break; // sem 🧊 prévio no torneio; só o +2

    // ── buffs próprios permanentes ──
    case "teamBuff": my = my.map((p) => ({ ...p, rating: Math.min(100, p.rating + card.value) })); break;
    case "weakestBuffPerm": my = permBump(my, weakestRole(my), card.value); break;
    case "bestBuffPerm": my = permBump(my, bestRole(my), card.value); break;

    // ── nerfs no rival ──
    case "nerfOpp": if (target?.role) bump(oppMods, target.role, -card.value); break;
    case "nerfOppAll": for (const p of opp) bump(oppMods, p.role, -card.value); break;

    // ── troca/roubo (só HxH) ──
    case "stealBest": {
      const role = bestRole(opp); // melhor do rival
      const stolen = lineByRole(opp).get(role);
      const mine = lineByRole(my).get(role);
      if (stolen && mine) {
        const mMap = lineByRole(my); mMap.set(role, stolen); my = sortedByRole(mMap);
        const oMap = lineByRole(opp); oMap.set(role, mine); opp = sortedByRole(oMap);
      }
      break;
    }
    case "swapWithOpp": {
      const role = target?.role;
      if (role) {
        const mine = lineByRole(my).get(role);
        const theirs = lineByRole(opp).get(role);
        if (mine && theirs) {
          const mMap = lineByRole(my); mMap.set(role, theirs); my = sortedByRole(mMap);
          const oMap = lineByRole(opp); oMap.set(role, mine); opp = sortedByRole(oMap);
        }
      }
      break;
    }
    case "swapOwnRole": {
      const role = target?.role;
      if (role && target?.swapName) {
        const repl = POOL_BY_ROLE[role].find((p) => p.team === target.swapTeamId && p.name === target.swapName)
          ?? POOL_BY_ROLE[role].find((p) => p.name === target.swapName);
        if (repl) { const mMap = lineByRole(my); mMap.set(role, repl); my = sortedByRole(mMap); }
      }
      break;
    }

    // ── cartas RUINS (azar) ──
    case "teamNerfTemp": for (const p of my) bump(myMods, p.role, -card.value); break;
    case "injureChoose": if (target?.role) bump(myMods, target.role, -card.value); break;
    case "slumpRandom": case "freezeRandom": bump(myMods, rng.pick(my).role, -card.value); break;
    case "slumpBest": bump(myMods, bestRole(my), -card.value); break;
    case "oldestNerf": bump(myMods, oldestRole(my), -card.value); break;
    case "oppBuffAll": for (const p of opp) bump(oppMods, p.role, card.value); break;
    case "oppBuffBest": bump(oppMods, bestRole(opp), card.value); break;
    case "doubleEdge": for (const p of opp) bump(oppMods, p.role, card.value); for (const p of my) bump(myMods, p.role, -(card.value2 ?? 1)); break;
    case "badRoulette": {
      if (rng.next() < 0.5) for (const p of my) bump(myMods, p.role, -2);
      else bump(myMods, rng.pick(my).role, -5);
      break;
    }
    case "permNerfChoose": if (target?.role) my = permBump(my, target.role, -card.value); break;
    case "permNerfBest": my = permBump(my, bestRole(my), -card.value); break;
  }

  return { myLine: my, oppLine: opp, myMods, oppMods };
}

/** Decide o alvo do BOT pra uma carta que precisa de alvo (a melhor jogada). */
export function botTarget(card: EventCard, myLine: TournamentPick[], oppLine: TournamentPick[]): OnlineCardTarget | null {
  switch (card.kind) {
    case "roleBuffChoose": case "igniteChoose": return { role: bestRole(myLine) }; // reforça o craque
    case "captainChoose": return { role: bestRole(myLine) };
    case "nerfOpp": return { role: bestRole(oppLine) }; // atrapalha o craque rival
    // cartas ruins com escolha: protege o craque, sacrifica o mais fraco.
    case "injureChoose": case "permNerfChoose": return { role: weakestRole(myLine) };
    // swaps: o bot não recebe troca/roubo (filtradas em vsBot) — mas por garantia:
    case "swapWithOpp": return { role: bestRole(oppLine) };
    default: return null;
  }
}
