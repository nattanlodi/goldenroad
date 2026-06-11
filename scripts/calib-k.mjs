// Encontra o k (intensidade) que faz a média do adversário sorteado bater no alvo.
import { DRAFT_TEAMS } from "../src/data/teams.ts";
const avg = (t) => Math.round(t.players.reduce((a, p) => a + p[2], 0) / t.players.length);
const AVGS = DRAFT_TEAMS.map(avg);
const POOL_AVG = AVGS.reduce((a, x) => a + x, 0) / AVGS.length;
// média esperada (determinística) do sorteio ponderado por exp(k*(a-poolAvg))
function mediaEsperada(k) {
  const w = AVGS.map((a) => Math.exp(k * (a - POOL_AVG)));
  const tot = w.reduce((a, x) => a + x, 0);
  return AVGS.reduce((s, a, i) => s + a * w[i], 0) / tot;
}
function acharK(alvo) {
  let lo = -1, hi = 1; // busca binária (k negativo p/ alvo abaixo da média do pool)
  for (let it = 0; it < 60; it++) { const m = (lo + hi) / 2; if (mediaEsperada(m) < alvo) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
console.log(`Pool média ${POOL_AVG.toFixed(2)}\n`);
const alvos = { swiss: 79, quarter: 83, semi: 86, final: 90 };
for (const [fase, alvo] of Object.entries(alvos)) {
  const k = acharK(alvo);
  console.log(`${fase.padEnd(8)} alvo ${alvo}  =>  k=${k.toFixed(4)}  (média real ${mediaEsperada(k).toFixed(2)})`);
}
