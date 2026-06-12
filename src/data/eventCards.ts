import type { CardRarity, EventCard } from "../types";

// ============================================================
// Baralho de cartas de evento (estilo "augment" do ARAM).
// Aparecem PRÉ-SÉRIE (rival já conhecido), 30% de chance + pity (força após
// 3 séries secas). 3 cartas; o jogador escolhe 1.
//
// Persistência: `permanent` = vale a run inteira (altera o lineup base);
// senão, vale só a próxima série (entra no SeriesMods temporário).
// ============================================================

export const EVENT_DECK: EventCard[] = [
  {
    id: "patch-dourado",
    name: "Patch Dourado",
    icon: "🔧",
    rarity: "rara",
    kind: "teamBuff",
    value: 1,
    permanent: true,
    needsTarget: false,
    desc: "+1 de overall em TODA a sua line — permanente pela run inteira.",
  },
  {
    id: "buff-de-patch",
    name: "Buff de Patch",
    icon: "📈",
    rarity: "comum",
    kind: "roleBuffRandom",
    value: 2,
    permanent: false,
    needsTarget: false,
    desc: "+2 numa lane sorteada da sua line, só nesta série.",
  },
  {
    id: "prodigio",
    name: "Prodígio",
    icon: "🌱",
    rarity: "comum",
    kind: "weakestBuff",
    value: 5,
    permanent: false,
    needsTarget: false,
    desc: "+5 no seu jogador de MENOR overall, só nesta série.",
  },
  {
    id: "nerf-cirurgico",
    name: "Nerf Cirúrgico",
    icon: "✂️",
    rarity: "comum",
    kind: "nerfOpp",
    value: 3,
    permanent: false,
    needsTarget: true,
    desc: "-3 num jogador do rival à sua escolha, só nesta série.",
  },
  {
    id: "curinga",
    name: "Curinga",
    icon: "🃏",
    rarity: "lendaria",
    kind: "swapOwnRole",
    value: 0,
    permanent: true,
    needsTarget: true,
    desc: "Troque um jogador seu por QUALQUER outro da mesma lane — permanente.",
  },
  {
    id: "troca-forcada",
    name: "Troca Forçada",
    icon: "🔁",
    rarity: "rara",
    kind: "swapWithOpp",
    value: 0,
    permanent: true,
    needsTarget: true,
    desc: "Roube um jogador do rival: troca pelo seu da mesma lane — permanente.",
  },
  {
    id: "descongelar",
    name: "Descongelar",
    icon: "🌡️",
    rarity: "comum",
    kind: "thaw",
    value: 2,
    permanent: false,
    needsTarget: false,
    desc: "Remove o efeito 🧊 Gelado de um jogador e ainda dá +2 nesta série.",
  },
  {
    id: "aquecimento",
    name: "Aquecimento",
    icon: "🔥",
    rarity: "comum",
    kind: "teamBuffTemp",
    value: 2,
    permanent: false,
    needsTarget: false,
    desc: "+2 em TODA a sua line, só nesta série.",
  },
  {
    id: "treino-focado",
    name: "Treino Focado",
    icon: "🎯",
    rarity: "comum",
    kind: "roleBuffChoose",
    value: 3,
    permanent: false,
    needsTarget: true,
    desc: "+3 numa lane SUA à escolha, só nesta série.",
  },
  {
    id: "veterano",
    name: "Veterano",
    icon: "🧓",
    rarity: "comum",
    kind: "oldestBuff",
    value: 4,
    permanent: false,
    needsTarget: false,
    desc: "+4 no seu jogador de edição mais antiga, só nesta série.",
  },
  {
    id: "sabotagem",
    name: "Sabotagem",
    icon: "🌀",
    rarity: "rara",
    kind: "nerfOppAll",
    value: 1,
    permanent: false,
    needsTarget: false,
    desc: "-1 em TODO o rival, só nesta série.",
  },
  {
    id: "promessa",
    name: "Promessa",
    icon: "⭐",
    rarity: "rara",
    kind: "weakestBuffPerm",
    value: 3,
    permanent: true,
    needsTarget: false,
    desc: "+3 PERMANENTE no seu jogador de menor overall.",
  },
  {
    id: "lenda-viva",
    name: "Lenda Viva",
    icon: "👑",
    rarity: "lendaria",
    kind: "bestBuffPerm",
    value: 5,
    permanent: true,
    needsTarget: false,
    desc: "+5 PERMANENTE no seu MELHOR jogador — a estrela vira monstro.",
  },
  {
    id: "capitao",
    name: "Capitão",
    icon: "🎖️",
    rarity: "rara",
    kind: "captainChoose",
    value: 6,
    permanent: false,
    needsTarget: true,
    desc: "+6 num jogador à escolha, mas -1 nos outros 4 — só nesta série.",
  },
  {
    id: "em-brasa",
    name: "Em Brasa",
    icon: "🔥",
    rarity: "comum",
    kind: "igniteChoose",
    value: 3,
    permanent: false,
    needsTarget: true,
    desc: "Põe um jogador seu EM CHAMAS (🔥 +3) só nesta série.",
  },
  {
    id: "linha-de-frente",
    name: "Linha de Frente",
    icon: "🛡️",
    rarity: "comum",
    kind: "frontlineBuff",
    value: 4,
    permanent: false,
    needsTarget: false,
    desc: "+4 no seu TOP e no seu SUP, só nesta série.",
  },
  {
    id: "roleta",
    name: "Roleta da Sorte",
    icon: "🎰",
    rarity: "rara",
    kind: "roulette",
    value: 5,
    permanent: false,
    needsTarget: false,
    desc: "Aposta: 60% de +5 em toda a line, 40% de -2. Só nesta série.",
  },
  {
    id: "olheiro",
    name: "Olheiro",
    icon: "💰",
    rarity: "lendaria",
    kind: "stealBest",
    value: 0,
    permanent: true,
    needsTarget: false,
    desc: "Rouba o MELHOR jogador do rival pra sua line (mesma lane) — permanente.",
  },
];

const RARITY_WEIGHT: Record<CardRarity, number> = { comum: 70, rara: 26, lendaria: 8 };

const BASE_CHANCE = 0.4; // 40%
const PITY = 2; // força um evento após 2 séries secas

export interface EventRoll {
  cards: EventCard[] | null;
  dry: number;
}

/**
 * Sorteia (ou não) um evento de pré-série.
 * @param dry quantas séries seguidas sem evento (pity).
 * @param hasFrozen há algum jogador 🧊 gelado? (filtra "Descongelar" se não)
 * @param decisive série decisiva/eliminação? (chance um pouco maior, mais drama)
 */
export function rollEventCards(dry: number, hasFrozen: boolean, decisive: boolean): EventRoll {
  const chance = decisive ? BASE_CHANCE + 0.12 : BASE_CHANCE;
  const force = dry >= PITY;
  if (!force && Math.random() >= chance) return { cards: null, dry: dry + 1 };

  // pool aplicável ao contexto
  const pool = EVENT_DECK.filter((c) => (c.kind === "thaw" ? hasFrozen : true));
  const picked: EventCard[] = [];
  while (picked.length < 3 && pool.length) {
    const total = pool.reduce((a, c) => a + RARITY_WEIGHT[c.rarity], 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      r -= RARITY_WEIGHT[pool[i].rarity];
      if (r < 0) {
        idx = i;
        break;
      }
    }
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return { cards: picked.length ? picked : null, dry: 0 };
}
