// Simula o sorteio PONDERADO do draft (espelha helpers.weightedTeam) e mostra
// a distribuição por colocação: campeão / vice / semi / quartas.
import { DRAFT_TEAMS, QUARTERFINAL_IDS, SEMIFINAL_IDS } from "../src/data/teams.ts";

const W_QUARTER = 0.4;
const W_SEMI = 0.75;
const weight = (t) => (QUARTERFINAL_IDS.has(t.id) ? W_QUARTER : SEMIFINAL_IDS.has(t.id) ? W_SEMI : 1);

function weightedTeam(pool) {
  const total = pool.reduce((a, t) => a + weight(t), 0);
  let r = Math.random() * total;
  for (const t of pool) {
    r -= weight(t);
    if (r < 0) return t;
  }
  return pool[pool.length - 1];
}

// classifica cada time por colocação. champion/finalist vêm dos flags; semi são
// os não-campeão/vice que NÃO são quartas; o resto é quartas.
function grupo(t) {
  if (t.champion) return "campeao";
  if (t.finalist) return "vice";
  if (QUARTERFINAL_IDS.has(t.id)) return "quartas";
  return "semi";
}

const counts = { campeao: 0, vice: 0, semi: 0, quartas: 0 };
const totalPorGrupo = { campeao: 0, vice: 0, semi: 0, quartas: 0 };
for (const t of DRAFT_TEAMS) totalPorGrupo[grupo(t)]++;

const N = 300000;
for (let i = 0; i < N; i++) counts[grupo(weightedTeam(DRAFT_TEAMS))]++;

console.log(`Pool: ${DRAFT_TEAMS.length} times · pesos: semi ${W_SEMI} · quartas ${W_QUARTER} · ${N} sorteios\n`);
const labels = { campeao: "Campeão", vice: "Vice", semi: "Semifinal", quartas: "Quartas" };
console.log("grupo        | nº times |  % total  | % por time | uniforme/time");
console.log("-------------|----------|-----------|------------|--------------");
for (const g of ["campeao", "vice", "semi", "quartas"]) {
  const nt = totalPorGrupo[g];
  const pctTotal = (100 * counts[g]) / N;
  const pctPorTime = pctTotal / nt;
  const unif = 100 / DRAFT_TEAMS.length;
  console.log(
    `${labels[g].padEnd(12)} | ${String(nt).padStart(8)} | ${pctTotal.toFixed(1).padStart(7)}% | ${pctPorTime.toFixed(3).padStart(8)}% | ${unif.toFixed(3)}%`,
  );
}
