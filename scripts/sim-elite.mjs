// Compara o nível médio do ADVERSÁRIO nas semis/finais ANTES e DEPOIS da regra
// de restrição de pool (finais = só finalista; semis = 60% vice / 40% semi).
// Espelha drawOpponent: restringe o pool e DEPOIS pondera por STAGE_INTENSITY.
import { TEAMS } from "../src/data/teams.ts";

const avg = (t) => Math.round(t.players.reduce((a, p) => a + p[2], 0) / t.players.length);

// reconstrói o pool de playoffs igual ao teams.ts (8 por ano; 2011 = 4).
const PLAYOFF_COUNT = { 2011: 4 };
const DEFAULT = 8;
const YEARS = [...new Set(TEAMS.map((t) => t.year))].sort((a, b) => a - b);
const playoffsOf = (y) => TEAMS.filter((t) => t.year === y).slice(0, PLAYOFF_COUNT[y] ?? DEFAULT);
const DRAFT_TEAMS = YEARS.flatMap(playoffsOf);
// semifinalistas = 3º-4º (slice 2..4) de cada edição.
const SEMI = new Set(YEARS.flatMap((y) => playoffsOf(y).slice(2, 4).map((t) => t.id)));

const POOL_AVG = DRAFT_TEAMS.reduce((a, t) => a + avg(t), 0) / DRAFT_TEAMS.length;

const K = {
  swiss: -0.035, quarter: 0.039, semi: 0.097, final: 0.203,
  msi_ur1: -0.039, msi_ur2: 0.018, msi_uf: 0.097,
  msi_lr1: 0.0, msi_lr2: 0.056, msi_lr3: 0.097, msi_lf: 0.145, msi_gf: 0.21,
};

// sorteia um adversário do `pool`, ponderado por força (STAGE_INTENSITY k).
function drawFrom(pool, k) {
  const w = pool.map((t) => Math.exp(k * (avg(t) - POOL_AVG)));
  const tot = w.reduce((a, x) => a + x, 0);
  let r = Math.random() * tot;
  for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r < 0) return avg(pool[i]); }
  return avg(pool[pool.length - 1]);
}

// pool restrito conforme a regra nova.
function restrictedPool(restrict) {
  if (restrict === "finalists") return DRAFT_TEAMS.filter((t) => t.champion || t.finalist);
  if (restrict === "semifinal") {
    const vices = DRAFT_TEAMS.filter((t) => t.finalist);
    const semis = DRAFT_TEAMS.filter((t) => SEMI.has(t.id));
    const wantVice = Math.random() < 0.6;
    const primary = wantVice ? vices : semis;
    const fallback = wantVice ? semis : vices;
    return primary.length ? primary : fallback;
  }
  return DRAFT_TEAMS;
}

const N = 300000;
const stats = (k, restrict) => {
  let soma = 0, t90 = 0, t88 = 0, fr = 0;
  for (let i = 0; i < N; i++) {
    const pool = restrict ? restrictedPool(restrict) : DRAFT_TEAMS;
    const a = drawFrom(pool, k);
    soma += a; if (a >= 90) t90++; if (a >= 88) t88++; if (a < 80) fr++;
  }
  return { med: soma / N, p90: (100 * t90) / N, p88: (100 * t88) / N, fr: (100 * fr) / N };
};

const finalists = DRAFT_TEAMS.filter((t) => t.champion || t.finalist);
const vices = DRAFT_TEAMS.filter((t) => t.finalist);
const semis = DRAFT_TEAMS.filter((t) => SEMI.has(t.id));
console.log(`Pool: ${DRAFT_TEAMS.length} times · média ${POOL_AVG.toFixed(1)}`);
console.log(`Finalistas (camp/vice): ${finalists.length} (méd ${(finalists.reduce((a, t) => a + avg(t), 0) / finalists.length).toFixed(1)})`);
console.log(`Vices: ${vices.length} (méd ${(vices.reduce((a, t) => a + avg(t), 0) / vices.length).toFixed(1)}) · Semis: ${semis.length} (méd ${(semis.reduce((a, t) => a + avg(t), 0) / semis.length).toFixed(1)})`);
console.log(`\n${N} sorteios por linha\n`);

const fmt = (s) => `${s.med.toFixed(1)} | ${s.p90.toFixed(0).padStart(3)}% | ${s.p88.toFixed(0).padStart(3)}% | ${s.fr.toFixed(0).padStart(3)}%`;

// fases SEM regra de restrição (pool normal ponderado) — quartas do Worlds e as
// rodadas que antecedem as finais de bracket do MSI.
const plain = [
  ["Worlds Quartas", "quarter"],
  ["MSI UR1", "msi_ur1"],
  ["MSI UR2 (pré-UF)", "msi_ur2"],
  ["MSI LR1", "msi_lr1"],
  ["MSI LR2", "msi_lr2"],
  ["MSI LR3 (pré-LF)", "msi_lr3"],
];
console.log("FASES SEM RESTRIÇÃO (pool normal ponderado)");
console.log("fase             | méd  | 90+  | 88+  | <80");
console.log("-----------------|------|------|------|-----");
for (const [label, k] of plain) {
  console.log(`${label.padEnd(16)} | ${fmt(stats(K[k], null))}`);
}

// fases COM regra (semis e finais) — antes x depois.
const rows = [
  ["Worlds Semi", "semi", "semifinal"],
  ["Worlds Final", "final", "finalists"],
  ["MSI UF (semi)", "msi_uf", "semifinal"],
  ["MSI LF (semi)", "msi_lf", "semifinal"],
  ["MSI GF (final)", "msi_gf", "finalists"],
];
console.log("\nFASES COM REGRA — ANTES x DEPOIS");
console.log("fase            |          ANTES (pool todo)        |          DEPOIS (regra)");
console.log("                | méd  | 90+  | 88+  | <80          | méd  | 90+  | 88+  | <80");
console.log("----------------|------|------|------|------|-------|------|------|------|-----");
for (const [label, k, restrict] of rows) {
  console.log(`${label.padEnd(15)} | ${fmt(stats(K[k], null))}  | ${fmt(stats(K[k], restrict))}`);
}
