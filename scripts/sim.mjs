// Monte Carlo do motor de competição (espelha src/game/helpers.ts).
// Compara valores de STRENGTH_SENSITIVITY (S) pra calibrar a dificuldade.
// S menor => diferença de nota pesa mais => time forte vence mais.
//
// Os adversários são sorteados do POOL DE JOGO real (DRAFT_TEAMS, só playoffs),
// usando a média de cada time — exatamente como drawOpponent faz no jogo.

import { DRAFT_TEAMS } from "../src/data/teams.ts";

// média (arredondada) de cada time do pool — igual a teamAvg() do jogo
const POOL = DRAFT_TEAMS.map((t) => Math.round(t.players.reduce((a, p) => a + p[2], 0) / t.players.length));

const sum = POOL.reduce((a, v) => a + v, 0);
const mean = sum / POOL.length;
const sorted = [...POOL].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const min = sorted[0];
const max = sorted[sorted.length - 1];

const rnd = (a) => a[Math.floor(Math.random() * a.length)];

function makeEngine(S) {
  const gameWinProb = (you, opp) => 1 / (1 + Math.pow(10, -(you - opp) / S));
  function simulateSeries(target, you, opp) {
    const p = gameWinProb(you, opp);
    let yw = 0, ow = 0;
    while (yw < target && ow < target) (Math.random() < p ? yw++ : ow++);
    return yw >= target;
  }
  function drawOpp(used) {
    let pool = POOL.map((v, i) => [v, i]).filter(([, i]) => !used.has(i));
    if (!pool.length) pool = POOL.map((v, i) => [v, i]);
    const [v, i] = rnd(pool);
    used.add(i);
    return v;
  }
  // espelha a campanha real: Suíça (Bo1, decisiva→Bo3) até 3 vitórias / 3 derrotas,
  // depois mata-mata de 3 rodadas em Bo5.
  function campaign(you) {
    const used = new Set();
    let w = 0, l = 0;
    while (w < 3 && l < 3) {
      const decisive = w === 2 || l === 2;
      if (simulateSeries(decisive ? 2 : 1, you, drawOpp(used))) w++; else l++;
    }
    if (l >= 3) return { champion: false, perfect: false };
    for (let k = 0; k < 3; k++) if (!simulateSeries(3, you, drawOpp(used))) return { champion: false, perfect: false };
    return { champion: true, perfect: l === 0 };
  }
  return campaign;
}

const N = 40000;
const RATINGS = [80, 83, 86, 88, 90, 92, 95];
const S_VALUES = [10, 8, 7, 6, 5];

console.log(`Pool de jogo: ${POOL.length} times · média ${mean.toFixed(1)} · mediana ${median} · min ${min} · max ${max}`);
console.log(`${N} campanhas por (S, nota). título = vira campeão · 6-0 = sem perder nenhuma série\n`);
for (const S of S_VALUES) {
  const campaign = makeEngine(S);
  const row = [];
  for (const you of RATINGS) {
    let champ = 0, perf = 0;
    for (let i = 0; i < N; i++) {
      const r = campaign(you);
      if (r.champion) champ++;
      if (r.perfect) perf++;
    }
    row.push(`${you}: ${((100 * champ) / N).toFixed(0)}%/${((100 * perf) / N).toFixed(0)}%`);
  }
  console.log(`S=${String(S).padStart(2)}  →  ${row.join("  ·  ")}`);
}
console.log(`\n(cada célula = % título / % 6-0 perfeito · S atual no jogo = 8)`);
