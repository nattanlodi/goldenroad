// Simula o sorteio de oponentes em cada nó do MSI e mostra a distribuição
// das médias (faixas de força) — Monte Carlo fiel ao drawOpponent real.
import { DRAFT_TEAMS } from "../src/data/teams.ts";

const avg = (t) => t.players.reduce((a, p) => a + p[2], 0) / t.players.length;
const TEAMS = DRAFT_TEAMS.map((t) => ({ id: t.id, team: t.team, year: t.year, avg: avg(t) }));
const AVGS = TEAMS.map((t) => t.avg);
const POOL_AVG = AVGS.reduce((a, x) => a + x, 0) / AVGS.length;

// mesmas intensidades de helpers.ts (rampa MSI)
const K = {
  msi_ur1: -0.039, msi_ur2: 0.018, msi_uf: 0.097,
  msi_lr1: 0.0, msi_lr2: 0.056, msi_lr3: 0.097, msi_lf: 0.145, msi_gf: 0.21,
};

const NODES = [
  ["UR1", "msi_ur1", "Upper R1"],
  ["UR2", "msi_ur2", "Upper R2"],
  ["UF", "msi_uf", "Upper Final"],
  ["LR1", "msi_lr1", "Lower R1"],
  ["LR2", "msi_lr2", "Lower R2"],
  ["LR3", "msi_lr3", "Lower R3"],
  ["LF", "msi_lf", "Lower Final"],
  ["GF", "msi_gf", "Grand Final"],
];

// probabilidade determinística de sortear cada time (sem 'usedIds', pool cheio)
function probs(k) {
  const w = AVGS.map((a) => Math.exp(k * (a - POOL_AVG)));
  const tot = w.reduce((a, x) => a + x, 0);
  return w.map((x) => x / tot);
}

// faixas de força (raridade aproximada por média de time)
const BANDS = [
  ["≥90 (elite)", (a) => a >= 90],
  ["86–89 (forte)", (a) => a >= 86 && a < 90],
  ["82–85 (médio+)", (a) => a >= 82 && a < 86],
  ["78–81 (médio)", (a) => a >= 78 && a < 82],
  ["<78 (fraco)", (a) => a < 78],
];

const pct = (x) => (x * 100).toFixed(1).padStart(5) + "%";

console.log(`Pool: ${TEAMS.length} times · média ${POOL_AVG.toFixed(1)} · min ${Math.min(...AVGS).toFixed(0)} · max ${Math.max(...AVGS).toFixed(0)}\n`);

for (const [node, key, label] of NODES) {
  const p = probs(K[key]);
  const mediaEsp = p.reduce((s, pi, i) => s + pi * AVGS[i], 0);
  // chance por faixa
  const bandP = BANDS.map(([, test]) => p.reduce((s, pi, i) => s + (test(AVGS[i]) ? pi : 0), 0));
  // top-3 times mais prováveis
  const ranked = p.map((pi, i) => ({ ...TEAMS[i], p: pi })).sort((a, b) => b.p - a.p).slice(0, 3);

  console.log(`■ ${label.padEnd(12)} (${node})  média esperada do oponente: ${mediaEsp.toFixed(1)}`);
  BANDS.forEach(([name], i) => console.log(`    ${name.padEnd(16)} ${pct(bandP[i])}`));
  console.log(`    + provável: ${ranked.map((r) => `${r.team} ${r.year} (${r.avg.toFixed(0)}, ${pct(r.p).trim()})`).join(" · ")}\n`);
}
