// Média dos adversários sorteados por fase (espelha drawOpponent ponderado).
import { DRAFT_TEAMS } from "../src/data/teams.ts";

const avg = (t) => Math.round(t.players.reduce((a, p) => a + p[2], 0) / t.players.length);
const POOL_AVG = DRAFT_TEAMS.reduce((a, t) => a + avg(t), 0) / DRAFT_TEAMS.length;
// calibrado pra média-alvo: suíça 80 · quartas 84 · semi 87.5 · final 90
const K = { swiss: -0.035, quarter: 0.039, semi: 0.097, final: 0.203 };

function draw(stage) {
  const k = K[stage];
  const w = DRAFT_TEAMS.map((t) => Math.exp(k * (avg(t) - POOL_AVG)));
  const tot = w.reduce((a, x) => a + x, 0);
  let r = Math.random() * tot;
  for (let i = 0; i < DRAFT_TEAMS.length; i++) { r -= w[i]; if (r < 0) return avg(DRAFT_TEAMS[i]); }
  return avg(DRAFT_TEAMS[DRAFT_TEAMS.length - 1]);
}

const N = 200000;
console.log(`Pool média ${POOL_AVG.toFixed(1)} · ${N} sorteios por fase\n`);
console.log("fase     | méd. adv | % 90+ | % 88+ | % <80");
console.log("---------|----------|-------|-------|------");
for (const stage of ["swiss", "quarter", "semi", "final"]) {
  let soma = 0, t90 = 0, t88 = 0, fr = 0;
  for (let i = 0; i < N; i++) { const a = draw(stage); soma += a; if (a >= 90) t90++; if (a >= 88) t88++; if (a < 80) fr++; }
  console.log(`${stage.padEnd(8)} |   ${(soma / N).toFixed(1)}   |  ${((100 * t90) / N).toFixed(0)}%  |  ${((100 * t88) / N).toFixed(0)}%  |  ${((100 * fr) / N).toFixed(0)}%`);
}
