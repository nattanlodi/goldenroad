// Monte Carlo do motor de competição (espelha src/game/helpers.ts).
// Compara valores de STRENGTH_SENSITIVITY (S) pra calibrar a dificuldade.
// S menor => diferença de nota pesa mais => time forte vence mais.

// médias reais do pool (arredondadas, iguais a teamAvg do dataset)
const POOL = [91, 92, 90, 93, 94, 94, 90, 89, 91, 90, 89, 90, 88, 89, 90, 89, 88, 89, 85, 87, 83];

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
const RATINGS = [89, 92, 95, 99];
const S_VALUES = [15, 12, 10, 8, 6];

console.log(`${N} campanhas · pool médio ~89\n`);
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
    row.push(`nota ${you}: ${((100 * champ) / N).toFixed(0)}% título / ${((100 * perf) / N).toFixed(0)}% 6-0`);
  }
  console.log(`S=${String(S).padStart(2)}  →  ${row.join("   ·   ")}`);
}
