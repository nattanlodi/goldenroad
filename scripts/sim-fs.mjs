// Calibra a rampa do FIRST STAND: mede a média do adversário por nó.
// Grupo (USF/UBF/LBF) = pool normal ponderado. KSF = semifinal (60/40),
// KGF = finalists. Espelha drawOpponent.
import { TEAMS } from "../src/data/teams.ts";

const avg = (t) => Math.round(t.players.reduce((a, p) => a + p[2], 0) / t.players.length);
const PLAYOFF_COUNT = { 2011: 4 };
const YEARS = [...new Set(TEAMS.map((t) => t.year))].sort((a, b) => a - b);
const playoffsOf = (y) => TEAMS.filter((t) => t.year === y).slice(0, PLAYOFF_COUNT[y] ?? 8);
const DRAFT_TEAMS = YEARS.flatMap(playoffsOf);
const SEMI = new Set(YEARS.flatMap((y) => playoffsOf(y).slice(2, 4).map((t) => t.id)));
const POOL_AVG = DRAFT_TEAMS.reduce((a, t) => a + avg(t), 0) / DRAFT_TEAMS.length;

const K = { fs_usf: -0.065, fs_ubf: 0.029, fs_lbf: 0.044, fs_ksf: 0.0, fs_kgf: -0.16 };
const RESTRICT = { fs_ksf: "semifinal", fs_kgf: "finalists" };

function poolFor(restrict) {
  if (restrict === "finalists") return DRAFT_TEAMS.filter((t) => t.champion || t.finalist);
  if (restrict === "semifinal") {
    const vices = DRAFT_TEAMS.filter((t) => t.finalist);
    const semis = DRAFT_TEAMS.filter((t) => SEMI.has(t.id));
    const wantVice = Math.random() < 0.6;
    const primary = wantVice ? vices : semis;
    return primary.length ? primary : (wantVice ? semis : vices);
  }
  return DRAFT_TEAMS;
}

function draw(k, restrict) {
  const pool = poolFor(restrict);
  const w = pool.map((t) => Math.exp(k * (avg(t) - POOL_AVG)));
  const tot = w.reduce((a, x) => a + x, 0);
  let r = Math.random() * tot;
  for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r < 0) return avg(pool[i]); }
  return avg(pool[pool.length - 1]);
}

const N = 300000;
console.log(`Pool média ${POOL_AVG.toFixed(1)} · ${N} sorteios por nó\n`);
console.log("nó      | alvo | méd  | 90+ | <80");
console.log("--------|------|------|-----|----");
const TARGET = { fs_usf: 77, fs_ubf: 83, fs_lbf: 84, fs_ksf: 85, fs_kgf: 87 };
for (const node of ["fs_usf", "fs_ubf", "fs_lbf", "fs_ksf", "fs_kgf"]) {
  let soma = 0, t90 = 0, fr = 0;
  for (let i = 0; i < N; i++) { const a = draw(K[node], RESTRICT[node]); soma += a; if (a >= 90) t90++; if (a < 80) fr++; }
  console.log(`${node.padEnd(7)} |  ${TARGET[node]}  | ${(soma / N).toFixed(1)} | ${((100 * t90) / N).toFixed(0).padStart(2)}% | ${((100 * fr) / N).toFixed(0).padStart(2)}%`);
}
