// Monte Carlo do motor de competição (espelha src/game/helpers.ts).
// Valida: a força da line muda o desfecho e dá pra perder.

const S = 15; // STRENGTH_SENSITIVITY

// médias reais do pool (arredondadas, iguais a teamAvg do dataset)
const POOL = [91, 92, 90, 93, 94, 94, 90, 89, 91, 90, 89, 90, 88, 89, 90, 89, 88, 89, 85, 87, 83];

const gameWinProb = (you, opp) => 1 / (1 + Math.pow(10, -(you - opp) / S));

function simulateSeries(target, you, opp) {
  const p = gameWinProb(you, opp);
  let yw = 0, ow = 0;
  while (yw < target && ow < target) (Math.random() < p ? yw++ : ow++);
  return yw >= target;
}

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
function drawOpp(used) {
  let pool = POOL.map((v, i) => [v, i]).filter(([, i]) => !used.has(i));
  if (!pool.length) pool = POOL.map((v, i) => [v, i]);
  const [v, i] = rnd(pool);
  used.add(i);
  return v;
}

// roda uma campanha completa, devolve {champion, perfect, exit}
function campaign(you) {
  const used = new Set();
  let w = 0, l = 0;
  // Suíça
  while (w < 3 && l < 3) {
    const decisive = w === 2 || l === 2;
    const target = decisive ? 2 : 1;
    const opp = drawOpp(used);
    if (simulateSeries(target, you, opp)) w++; else l++;
  }
  if (l >= 3) return { champion: false, perfect: false, exit: "suica" };
  // mata-mata (QF, SF, Final) Bo5
  const koNames = ["quartas", "semi", "final"];
  for (let k = 0; k < 3; k++) {
    const opp = drawOpp(used);
    if (!simulateSeries(3, you, opp)) return { champion: false, perfect: false, exit: koNames[k] };
  }
  return { champion: true, perfect: l === 0, exit: "campeao" };
}

const N = 30000;
console.log(`sensibilidade S=${S} · ${N} campanhas por nota\n`);
console.log("nota | campeão | 6-0 perf | cai suíça | cai QF | cai SF | cai final");
console.log("-----|---------|----------|-----------|--------|--------|----------");
for (const you of [83, 86, 89, 92, 95, 99]) {
  const c = { campeao: 0, perfect: 0, suica: 0, quartas: 0, semi: 0, final: 0 };
  for (let i = 0; i < N; i++) {
    const r = campaign(you);
    if (r.champion) c.campeao++;
    if (r.perfect) c.perfect++;
    if (r.exit !== "campeao") c[r.exit]++;
  }
  const pct = (n) => ((100 * n) / N).toFixed(1).padStart(5) + "%";
  console.log(
    `  ${you} | ${pct(c.campeao)} |  ${pct(c.perfect)} |  ${pct(c.suica)}   | ${pct(c.quartas)} | ${pct(c.semi)} | ${pct(c.final)}`,
  );
}
