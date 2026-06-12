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

// ============================================================
// Baralho de AZAR — "evento de azar": as 3 cartas são TODAS ruins e o jogador
// é OBRIGADO a escolher qual prejuízo aceitar (o mal menor). Pode incluir dano
// permanente. Mesma estrutura das boas, mas com `hostile: true`.
// ============================================================
export const HOSTILE_DECK: EventCard[] = [
  {
    id: "lesao",
    name: "Lesão",
    icon: "🩹",
    rarity: "comum",
    kind: "injureChoose",
    value: 4,
    permanent: false,
    needsTarget: true,
    hostile: true,
    desc: "-4 num jogador SEU à sua escolha — só nesta série. (você decide quem aguenta)",
  },
  {
    id: "surto-gripe",
    name: "Surto de Gripe",
    icon: "🤧",
    rarity: "comum",
    kind: "teamNerfTemp",
    value: 2,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "-2 de overall em TODA a sua line, só nesta série.",
  },
  {
    id: "maratona-soloq",
    name: "Maratona de SoloQ",
    icon: "😴",
    rarity: "comum",
    kind: "slumpRandom",
    value: 5,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "-5 num jogador SEU aleatório (sem escolha), só nesta série.",
  },
  {
    id: "slump",
    name: "Slump da Estrela",
    icon: "📉",
    rarity: "rara",
    kind: "slumpBest",
    value: 3,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "-3 no seu MELHOR jogador — a estrela apaga nesta série.",
  },
  {
    id: "friozao",
    name: "Friozão",
    icon: "🧊",
    rarity: "comum",
    kind: "freezeRandom",
    value: 3,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "Congela 🧊 um jogador SEU aleatório (-3) nesta série.",
  },
  {
    id: "scrim-inferno",
    name: "Scrim do Inferno",
    icon: "💪",
    rarity: "rara",
    kind: "oppBuffAll",
    value: 3,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "O RIVAL chega afiado: +3 em todo o time dele, só nesta série.",
  },
  {
    id: "foco-no-carry",
    name: "Foco no Carry",
    icon: "🎯",
    rarity: "rara",
    kind: "oppBuffBest",
    value: 5,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "+5 no MELHOR jogador do rival nesta série.",
  },
  {
    id: "jet-lag",
    name: "Jet Lag",
    icon: "⏳",
    rarity: "comum",
    kind: "oldestNerf",
    value: 6,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "-6 no seu jogador de edição mais ANTIGA (o veterano sofre), só nesta série.",
  },
  {
    id: "multa-da-liga",
    name: "Multa da Liga",
    icon: "💸",
    rarity: "rara",
    kind: "permNerfChoose",
    value: 1,
    permanent: true,
    needsTarget: true,
    hostile: true,
    desc: "-1 PERMANENTE numa lane SUA à escolha. Dói pra sempre — mas você escolhe onde.",
  },
  {
    id: "queda-de-rendimento",
    name: "Queda de Rendimento",
    icon: "🪫",
    rarity: "lendaria",
    kind: "permNerfBest",
    value: 2,
    permanent: true,
    needsTarget: false,
    hostile: true,
    desc: "-2 PERMANENTE no seu MELHOR jogador. A estrela perde brilho pela run inteira.",
  },
  {
    id: "vazou-estrategia",
    name: "Vazou a Estratégia",
    icon: "📵",
    rarity: "rara",
    kind: "doubleEdge",
    value: 2,
    value2: 1,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "Rival lê seu jogo: +2 em todo o rival E -1 na sua line, só nesta série.",
  },
  {
    id: "azar-do-coringa",
    name: "Azar do Coringa",
    icon: "🃏",
    rarity: "comum",
    kind: "badRoulette",
    value: 5,
    permanent: false,
    needsTarget: false,
    hostile: true,
    desc: "Roleta ruim: 50% -2 em toda a line, 50% -5 num jogador aleatório. Só nesta série.",
  },
];

const RARITY_WEIGHT: Record<CardRarity, number> = { comum: 70, rara: 26, lendaria: 8 };

const BASE_CHANCE = 0.4; // 40%
const PITY = 2; // força um evento após 2 séries secas
const HOSTILE_CHANCE = 0.22; // 22% dos eventos são de AZAR (maior em decisivas)

export interface EventRoll {
  cards: EventCard[] | null;
  dry: number;
  /** true quando o trio é todo de cartas ruins (evento de azar). */
  hostile: boolean;
}

/** Sorteia 3 cartas distintas de um baralho, ponderadas por raridade. */
function pickThree(deck: EventCard[]): EventCard[] {
  const pool = deck.slice();
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
  return picked;
}

// limiar de "rival fraco": abaixo disso, o jogo passa a punir com cartas de azar
// (compensação de dificuldade — rival fraco = mais chance de prejuízo pra você).
const WEAK_OPP = 85;

/**
 * Sorteia (ou não) um evento de pré-série.
 * @param dry quantas séries seguidas sem evento (pity).
 * @param hasFrozen há algum jogador 🧊 gelado? (filtra "Descongelar" se não)
 * @param decisive série decisiva/eliminação? (chance um pouco maior, mais drama)
 * @param oppAvg over médio do rival — abaixo de 85 dispara azar com chance alta.
 */
export function rollEventCards(dry: number, hasFrozen: boolean, decisive: boolean, oppAvg = 99): EventRoll {
  const chance = decisive ? BASE_CHANCE + 0.12 : BASE_CHANCE;
  const force = dry >= PITY;
  if (!force && Math.random() >= chance) return { cards: null, dry: dry + 1, hostile: false };

  // dado que ROLOU evento: chance de ser de AZAR (mais provável em decisivas).
  let hostileChance = decisive ? HOSTILE_CHANCE + 0.08 : HOSTILE_CHANCE;

  // RIVAL FRACO (over < 85): chance de azar sobe MUITO, escalando com a fraqueza.
  // 84 → ~0.50, 80 → ~0.70, ≤78 → 0.80 (teto). Compensa partidas fáceis demais.
  if (oppAvg < WEAK_OPP) {
    const scaled = 0.5 + (WEAK_OPP - 1 - oppAvg) * 0.05; // 84→0.50 … 78→0.80
    hostileChance = Math.min(0.8, Math.max(hostileChance, scaled));
  }

  const isHostile = Math.random() < hostileChance;

  const deck = isHostile ? HOSTILE_DECK : EVENT_DECK.filter((c) => (c.kind === "thaw" ? hasFrozen : true));
  const picked = pickThree(deck);
  return { cards: picked.length ? picked : null, dry: 0, hostile: isHostile && picked.length > 0 };
}
