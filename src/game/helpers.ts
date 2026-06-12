import type { GameMvp, HighlightRef, Lineup, LineupPlayer, Opponent, Pentakill, Role, RosterEntry, SeriesHighlight, SeriesSetup, StagePhase, Team } from "../types";
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

// ============================================================
// Destaques da série: pentakills + MVP
// ============================================================

/**
 * Chance de um pentakill rolar PARA UM TIME numa partida. Independente por time
 * e por partida: pode haver penta seu, do rival, dos dois ou de nenhum no mesmo
 * jogo. ~12% por time/partida — bem no meio da faixa 10-15%. Não depende do
 * resultado da partida (até num jogo perdido alguém seu pode fechar um penta).
 */
const PENTA_CHANCE = 0.12;

type HighlightPlayer = HighlightRef;

// Propensão de pentakill por lane (realista): carries fecham penta, suporte quase
// nunca. Aplicado ANTES do overall — multiplica a chance de cada lane levar o penta.
//   ADC 1.0 · MID 0.6 · TOP 0.3 · JNG 0.12 · SUP 0.02
const PENTA_ROLE_WEIGHT: Record<Role, number> = { BOT: 1.0, MID: 0.6, TOP: 0.3, JNG: 0.12, SUP: 0.02 };

// peso de pentakill por jogador: propensão da lane (dominante) × força (jogador
// melhor carrega mais dentro da mesma lane).
const pentaWeight = (p: HighlightPlayer) => PENTA_ROLE_WEIGHT[p.role] * Math.pow(Math.max(1, p.rating - 60), 1.6);

function pickByWeight(list: HighlightPlayer[], weight: (p: HighlightPlayer) => number): HighlightPlayer {
  const tot = list.reduce((a, p) => a + weight(p), 0);
  let r = Math.random() * tot;
  for (const p of list) {
    r -= weight(p);
    if (r < 0) return p;
  }
  return list[list.length - 1];
}

/**
 * Gera os destaques de uma série, jogo a jogo:
 *  - pentakills: cada partida, cada time tenta independentemente (~12%) um penta
 *    de um jogador (ponderado por overall).
 *  - MVP de partida: em cada jogo, o time que VENCEU aquela partida elege um MVP
 *    (ponderado por overall + bônus por penta naquele jogo).
 *  - MVP da série: no time vencedor da série, ponderado por quantas vezes o
 *    jogador foi MVP de partida (peso forte) + overall + pentakills.
 */
export function rollSeriesHighlights(
  games: boolean[],
  yourList: LineupPlayer[],
  oppPlayers: RosterEntry[],
  seriesWon: boolean,
): SeriesHighlight {
  if (!yourList.length) return { pentakills: [], gameMvps: [], mvp: null };

  const youSide: HighlightPlayer[] = yourList.map((p) => ({
    side: "you",
    role: p.role,
    name: p.name,
    rating: p.rating,
    country: p.country,
  }));
  const oppSide: HighlightPlayer[] = oppPlayers.map((p) => ({
    side: "opp",
    role: p[0],
    name: p[1],
    rating: p[2],
    country: p[3],
  }));

  const pentakills: Pentakill[] = [];
  const gameMvps: GameMvp[] = [];

  games.forEach((youWon, idx) => {
    const gameNumber = idx + 1;
    // cada time tenta seu pentakill de forma independente nesta partida.
    for (const side of [youSide, oppSide]) {
      if (Math.random() < PENTA_CHANCE) {
        const hero = pickByWeight(side, pentaWeight);
        pentakills.push({ side: hero.side, role: hero.role, name: hero.name, country: hero.country, gameNumber });
      }
    }
    // MVP da partida: time que venceu ESTE jogo. Sorteio ponderado por overall,
    // com pentakill dando um bônus FORTE (~3x por penta) — quem fez penta vira
    // favorito, mas não garantido (senão ADC, que faz mais penta, monopolizaria).
    const winner = youWon ? youSide : oppSide;
    const pentaHere = (p: HighlightPlayer) =>
      pentakills.filter((k) => k.gameNumber === gameNumber && k.side === p.side && k.role === p.role).length;
    const gameMvpWeight = (p: HighlightPlayer) =>
      Math.pow(Math.max(1, p.rating - 55), 1.5) * Math.pow(3, pentaHere(p));
    const gm = pickByWeight(winner, gameMvpWeight);
    gameMvps.push({ side: gm.side, role: gm.role, name: gm.name, rating: gm.rating, country: gm.country, gameNumber });
  });

  // MVP da série: do time VENCEDOR da série. Critério PRINCIPAL = quem foi MVP de
  // mais partidas; desempate por (overall + bônus de pentakills na série). É
  // determinístico — quem mais carregou os jogos leva, sem sorteio.
  const winnerSide = seriesWon ? youSide : oppSide;
  const gameMvpCount = (p: HighlightPlayer) =>
    gameMvps.filter((m) => m.side === p.side && m.role === p.role).length;
  const pentaCount = (p: HighlightPlayer) =>
    pentakills.filter((k) => k.side === p.side && k.role === p.role).length;
  // pontuação de desempate: overall + cada pentakill vale ~3 pontos de overall.
  const tieScore = (p: HighlightPlayer) => p.rating + 3 * pentaCount(p);
  const mvpP = winnerSide.reduce((best, p) => {
    const c = gameMvpCount(p);
    const cb = gameMvpCount(best);
    if (c !== cb) return c > cb ? p : best;
    return tieScore(p) > tieScore(best) ? p : best;
  }, winnerSide[0]);
  const mvp: HighlightRef = { side: mvpP.side, role: mvpP.role, name: mvpP.name, rating: mvpP.rating, country: mvpP.country };
  return { pentakills, gameMvps, mvp };
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
  // MSI — rampa suave própria (calib-k.mjs). A UR1 "esquenta" no nível da
  // suíça (~79) e a dificuldade cresce gradual até a GF (~90), em vez de já
  // começar em nível de quartas. Alvos: UR1 79 · UR2 82 · UF 86 · LR1 81 ·
  // LR2 84 · LR3 86 · LF 88 · GF 90.
  msi_ur1: -0.039,
  msi_ur2: 0.018,
  msi_uf: 0.097,
  msi_lr1: 0.0,
  msi_lr2: 0.056,
  msi_lr3: 0.097,
  msi_lf: 0.145,
  msi_gf: 0.21,
  // FIRST STAND — 1º torneio do ano, um pouco mais fácil que o MSI. Nós de grupo
  // (USF/UBF/LBF) usam pool normal ponderado; KSF/KGF usam pool restrito
  // (semifinal/finalists), então o k ali só ajusta dentro do grupo de elite.
  // Alvos: USF ~77 · UBF ~83 · LBF ~84 · KSF ~85 · KGF ~87. (calib-k.mjs)
  fs_usf: -0.065,
  fs_ubf: 0.029,
  fs_lbf: 0.044,
  fs_ksf: 0.0,
  fs_kgf: -0.16,
};

/**
 * Sorteia um adversário (evitando os já enfrentados), ponderado pela força do
 * time conforme a fase — fases mais avançadas tendem a adversários mais fortes.
 */
/** Restrição de pool por colocação histórica do adversário. */
export type OppRestrict =
  | "finalists" // só CAMPEÃO ou VICE (grandes finais — MSI/Worlds)
  | "semifinal"; // 60% VICE · 40% SEMIFINALISTA (semis — UF/LF do MSI e semi do Worlds)

/**
 * Sorteia um adversário do pool (ponderado por força via STAGE_INTENSITY).
 * @param restrict limita o pool por colocação (finais/semis enfrentam times de elite).
 */
export function drawOpponent(usedIds: string[], stageKey: string = "swiss", restrict?: OppRestrict): Opponent {
  let pool = DRAFT_TEAMS.filter((t) => !usedIds.includes(t.id));

  if (restrict === "finalists") {
    const finalists = pool.filter((t) => t.champion || t.finalist);
    if (finalists.length) pool = finalists;
  } else if (restrict === "semifinal") {
    // 60% vice (finalist) · 40% semifinalista (3º-4º). Cai pro outro grupo se o
    // sorteado estiver vazio, e pro pool geral se ambos faltarem.
    const vices = pool.filter((t) => t.finalist);
    const semis = pool.filter((t) => SEMIFINAL_IDS.has(t.id));
    const wantVice = Math.random() < 0.6;
    const primary = wantVice ? vices : semis;
    const fallback = wantVice ? semis : vices;
    if (primary.length) pool = primary;
    else if (fallback.length) pool = fallback;
  }

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
    tournament: t.tournament ?? "worlds",
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
  // Grande Final → sempre finalista. Semifinal → 60% vice / 40% semifinalista.
  const restrict: OppRestrict | undefined =
    ko.stageKey === "final" ? "finalists" : ko.stageKey === "semi" ? "semifinal" : undefined;
  const opp = drawOpponent(usedIds, ko.stageKey, restrict);
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

export type Rarity = "centuriao" | "mitico" | "lendario" | "epico" | "raro" | "comum";

export interface RaritySkin {
  rarity: Rarity;
  /** classe CSS (em index.css) com a moldura/gradiente/glow do tier. */
  cls: string;
  /** cor da nota (overall) pra combinar com o tier. */
  ratingColor: string;
}

const RARITY_SKINS: Record<Rarity, RaritySkin> = {
  // 100 = duplo MVP (Finals + Torneio). Card único: fundo branco/marfim com shimmer dourado.
  centuriao: { rarity: "centuriao", cls: "card-centuriao", ratingColor: "#e8b53a" }, // dourado rico
  mitico: { rarity: "mitico", cls: "card-mitico", ratingColor: "#ff5a4d" }, // vermelho rubi (não coral)
  lendario: { rarity: "lendario", cls: "card-lendario", ratingColor: "#f2c14e" }, // dourado/âmbar (não amarelão)
  epico: { rarity: "epico", cls: "card-epico", ratingColor: "#c061e8" }, // roxo (não rosa/lavanda)
  raro: { rarity: "raro", cls: "card-raro", ratingColor: "#5a9eff" }, // azul saturado
  comum: { rarity: "comum", cls: "card-comum", ratingColor: "#cfd3cb" }, // cinza neutro
};

/**
 * Raridade pela nota do jogador. Calibrada ao pool (média ~81, teto 100):
 *   centurião 100 (duplo MVP) · mítico 97-99 · lendário 92-96 · épico 86-91 ·
 *   raro 80-85 · comum <80.
 */
export function rarityFor(overall: number): RaritySkin {
  if (overall >= 100) return RARITY_SKINS.centuriao;
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
