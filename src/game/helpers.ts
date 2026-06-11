import type { Lineup, LineupPlayer, Opponent, RosterEntry, SeriesSetup, StagePhase, Team } from "../types";
import { DRAFT_TEAMS, QUARTERFINAL_IDS, SEMIFINAL_IDS, ROLES } from "../data/teams";

/** Sorteia um item aleatório de um array. */
export function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Peso de sorteio de cada time no DRAFT. Quanto mais longe foi no Worlds, mais
// provável de cair: campeão/vice = 1, semi = 0.75, quartas = 0.4.
const QUARTERFINAL_DRAW_WEIGHT = 0.4;
const SEMIFINAL_DRAW_WEIGHT = 0.75;
function drawWeight(t: Team): number {
  if (QUARTERFINAL_IDS.has(t.id)) return QUARTERFINAL_DRAW_WEIGHT;
  if (SEMIFINAL_IDS.has(t.id)) return SEMIFINAL_DRAW_WEIGHT;
  return 1;
}

/** Sorteio ponderado: cada time com sua chance proporcional ao peso. */
export function weightedTeam(pool: Team[]): Team {
  const total = pool.reduce((a, t) => a + drawWeight(t), 0);
  let r = Math.random() * total;
  for (const t of pool) {
    r -= drawWeight(t);
    if (r < 0) return t;
  }
  return pool[pool.length - 1];
}

/** Sorteia um time pro DRAFT (ponderado), evitando repetir o último (excludeId). */
export function drawAny(excludeId?: string): Team {
  const pool = DRAFT_TEAMS.filter((t) => t.id !== excludeId);
  return weightedTeam(pool.length ? pool : DRAFT_TEAMS);
}

/** Média (arredondada) dos overalls de um time. */
export function teamAvg(players: RosterEntry[]): number {
  return Math.round(players.reduce((a, p) => a + p[2], 0) / players.length);
}

// ============================================================
// Motor de competição (força agregada)
// ============================================================

/**
 * Sensibilidade da curva de probabilidade. Quanto MENOR, mais a diferença de
 * overall importa (time forte vence mais). S=6 ("Dominante"):
 *   diff +5 → ~87% · +10 → ~98% · 0 → 50% por jogo.
 * Calibração no pool REAL de playoffs pós-mescla RFT (116 times, média 81,
 * min 67 / max 96, teto de line ~97), via scripts/sim.mjs:
 *   nota 80 → ~5% título · 86 → ~37% · 88 → ~50% · 90 → ~61% ·
 *   92 → ~71% / 50% 6-0 · 95 (quase-teto) → ~88% título / 73% 6-0.
 * Aumente pra deixar mais aleatório/difícil; diminua pra premiar mais a nota.
 */
export const STRENGTH_SENSITIVITY = 6;

/** Probabilidade de você vencer UM jogo, dada a diferença de força média. */
export function gameWinProb(yourAvg: number, oppAvg: number): number {
  return 1 / (1 + Math.pow(10, -(yourAvg - oppAvg) / STRENGTH_SENSITIVITY));
}

export interface SimulatedSeries {
  games: boolean[]; // ordem dos jogos: true = você venceu
  yourGames: number;
  oppGames: number;
  won: boolean;
}

/** Simula uma série (primeiro a `target` vitórias) jogo a jogo. */
export function simulateSeries(target: number, yourAvg: number, oppAvg: number): SimulatedSeries {
  const p = gameWinProb(yourAvg, oppAvg);
  const games: boolean[] = [];
  let yw = 0;
  let ow = 0;
  while (yw < target && ow < target) {
    const youWin = Math.random() < p;
    games.push(youWin);
    if (youWin) yw++;
    else ow++;
  }
  return { games, yourGames: yw, oppGames: ow, won: yw >= target };
}

// Média do pool de adversários — referência pra ponderar o sorteio por força.
const POOL_AVG = DRAFT_TEAMS.reduce((a, t) => a + teamAvg(t.players), 0) / DRAFT_TEAMS.length;

// "Intensidade" da escalada por fase: peso(time) = exp(intensidade * (médiaTime
// - médiaPool)). Os valores foram calibrados (scripts/calib-k.mjs) pra a média do
// adversário sorteado bater no ALVO de cada fase: suíça 79 · quartas 83 · semi
// 86 · final 90. (suíça negativa → favorece levemente os fracos, média < pool.)
const STAGE_INTENSITY: Record<string, number> = {
  swiss: -0.035,
  quarter: 0.039,
  semi: 0.097,
  final: 0.203,
};

/**
 * Sorteia um adversário (evitando os já enfrentados), ponderado pela força do
 * time conforme a fase — fases mais avançadas tendem a adversários mais fortes.
 */
export function drawOpponent(usedIds: string[], stageKey: string = "swiss"): Opponent {
  let pool = DRAFT_TEAMS.filter((t) => !usedIds.includes(t.id));
  if (!pool.length) pool = DRAFT_TEAMS;
  const k = STAGE_INTENSITY[stageKey] ?? 0;
  const weights = pool.map((t) => Math.exp(k * (teamAvg(t.players) - POOL_AVG)));
  const total = weights.reduce((a, w) => a + w, 0);
  let r = Math.random() * total;
  let t = pool[pool.length - 1];
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r < 0) {
      t = pool[i];
      break;
    }
  }
  return {
    id: t.id,
    team: t.team,
    short: t.short,
    year: t.year,
    league: t.league,
    players: t.players,
    avg: teamAvg(t.players),
  };
}

const KO_STAGES = [
  { stageKey: "quarter", stageLabel: "Quartas de final" },
  { stageKey: "semi", stageLabel: "Semifinal" },
  { stageKey: "final", stageLabel: "Grande Final" },
] as const;

export interface NextSeries {
  series: SeriesSetup;
  usedOppIds: string[];
}

/**
 * Monta a próxima série de acordo com a fase e o placar de séries.
 * Suíça: Bo1, salvo séries decisivas (com 2 vitórias ou 2 derrotas) → Bo3.
 * Mata-mata: sempre Bo5.
 */
export function buildNextSeries(
  stagePhase: StagePhase,
  swissWins: number,
  swissLosses: number,
  koIndex: number,
  usedIds: string[],
): NextSeries {
  if (stagePhase === "swiss") {
    const opp = drawOpponent(usedIds, "swiss");
    const decisive = swissWins === 2 || swissLosses === 2;
    return {
      series: {
        stageKey: "swiss",
        stageLabel: "Fase Suíça",
        format: decisive ? "Bo3" : "Bo1",
        target: decisive ? 2 : 1,
        decisive,
        opp,
      },
      usedOppIds: [...usedIds, opp.id],
    };
  }

  const ko = KO_STAGES[koIndex];
  const opp = drawOpponent(usedIds, ko.stageKey);
  return {
    series: { stageKey: ko.stageKey, stageLabel: ko.stageLabel, format: "Bo5", target: 3, decisive: true, opp },
    usedOppIds: [...usedIds, opp.id],
  };
}

// ============================================================
// Line, nota e tiers
// ============================================================

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

/**
 * Tier por nota média da line. Calibrado ao pool real de playoffs: o teto de
 * line é ~95 (limite das notas individuais) e a line "comum" sai em ~80-85,
 * então as faixas foram rebaixadas pra premiar bem quem monta uma line forte.
 */
export function tierFor(avg: number): Tier {
  if (avg >= 93) return { tier: "DREAM TEAM", desc: "Esquadrão dos sonhos — pentacampeão em potencial." };
  if (avg >= 90) return { tier: "SUPERTIME", desc: "Favoritíssimo absoluto ao título mundial." };
  if (avg >= 87) return { tier: "ELITE MUNDIAL", desc: "Time de elite, pronto pra erguer a taça." };
  if (avg >= 84) return { tier: "CONTENDER", desc: "Forte candidato, com brilho de sobra." };
  return { tier: "UNDERDOG", desc: "Zebra perigosa — ninguém quis te enfrentar." };
}

/** Sufixo de ano curto: 2023 -> "23". */
export function yy(year: number): string {
  return String(year).slice(2);
}

// ============================================================
// Raridade do jogador (visual dos cards) — por overall
// ============================================================

export type Rarity = "mitico" | "lendario" | "epico" | "raro" | "comum";

export interface RaritySkin {
  rarity: Rarity;
  /** classe CSS (em index.css) com a moldura/gradiente/glow do tier. */
  cls: string;
  /** cor da nota (overall) pra combinar com o tier. */
  ratingColor: string;
}

const RARITY_SKINS: Record<Rarity, RaritySkin> = {
  mitico: { rarity: "mitico", cls: "card-mitico", ratingColor: "#ff8d7a" },
  lendario: { rarity: "lendario", cls: "card-lendario", ratingColor: "#f5d77a" },
  epico: { rarity: "epico", cls: "card-epico", ratingColor: "#d2a0e8" },
  raro: { rarity: "raro", cls: "card-raro", ratingColor: "#8fb8ec" },
  comum: { rarity: "comum", cls: "card-comum", ratingColor: "#cfd3cb" },
};

/**
 * Raridade pela nota do jogador. Calibrada ao pool (média ~81, teto 98):
 *   mítico 97+ · lendário 92-96 · épico 86-91 · raro 80-85 · comum <80.
 */
export function rarityFor(overall: number): RaritySkin {
  if (overall >= 97) return RARITY_SKINS.mitico;
  if (overall >= 92) return RARITY_SKINS.lendario;
  if (overall >= 86) return RARITY_SKINS.epico;
  if (overall >= 80) return RARITY_SKINS.raro;
  return RARITY_SKINS.comum;
}

// ============================================================
// Narração
// ============================================================

export const WIN_FLAVORS = [
  "Sweep impecável — sua botlane dominou cada partida.",
  "Macro perfeito: vitória sem dar brechas.",
  "O mid carregou e o time fechou sem sustos.",
  "Pressão constante, nexus atrás de nexus.",
  "Draft superior e teamfights impecáveis.",
  "Domínio de início ao fim. Sem chances pro rival.",
];

export const CLOSE_WIN_FLAVORS = [
  "Série suada — mas você segurou nos jogos decisivos.",
  "Levou um susto, deu a volta e fechou.",
  "Disputa equilibrada, decidida nos detalhes a seu favor.",
];

export const LOSS_FLAVORS = [
  "A botlane adversária abriu o mapa e não teve volta.",
  "Draft perdido e teamfights desfavoráveis — eles mereceram.",
  "Seu time vacilou nos objetivos e pagou caro.",
  "O mid inimigo dominou e ditou o ritmo da série.",
  "Faltou pouco, mas o nexus deles caiu por último.",
  "Eles jogaram melhor as partidas que decidiam.",
];

/** Escolhe uma frase de narração pro resultado da série. */
export function seriesFlavor(won: boolean, _yourGames: number, oppGames: number, seed: number): string {
  if (!won) return LOSS_FLAVORS[seed % LOSS_FLAVORS.length];
  const close = oppGames > 0; // perdeu pelo menos um jogo
  const pool = close ? CLOSE_WIN_FLAVORS : WIN_FLAVORS;
  return pool[seed % pool.length];
}
