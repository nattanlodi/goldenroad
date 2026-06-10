// Que NOTAS DE LINE o jogador consegue montar? A line é a média de 5 jogadores,
// um por rota, cada um sorteado de um time aleatório do pool de playoffs.
// Mede: (a) melhor line teórica por rota, (b) distribuição jogando "greedy"
// (pega sempre o melhor da rota oferecida), (c) distribuição de uma line aleatória.
import { DRAFT_TEAMS } from "../src/data/teams.ts";

const ROLES = ["TOP", "JNG", "MID", "BOT", "SUP"];
const byRole = Object.fromEntries(ROLES.map((r) => [r, []]));
for (const t of DRAFT_TEAMS)
  for (const p of t.players) byRole[p[0]].push(p[2]);

// (a) teto absoluto: melhor jogador de cada rota
const ceiling = ROLES.map((r) => Math.max(...byRole[r]));
console.log("Teto por rota:", Object.fromEntries(ROLES.map((r, i) => [r, ceiling[i]])));
console.log("Line máxima teórica:", Math.round(ceiling.reduce((a, v) => a + v, 0) / 5));

// média global de jogador por rota
for (const r of ROLES) {
  const a = byRole[r];
  const m = a.reduce((x, y) => x + y, 0) / a.length;
  console.log(`  ${r}: média ${m.toFixed(1)} · max ${Math.max(...a)} · n ${a.length}`);
}

// (c) line 100% aleatória: 5 jogadores aleatórios (um por rota)
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const N = 200000;
const buckets = {};
let s = 0;
for (let i = 0; i < N; i++) {
  const avg = Math.round(ROLES.reduce((a, r) => a + rnd(byRole[r]), 0) / 5);
  s += avg;
  buckets[avg] = (buckets[avg] || 0) + 1;
}
console.log(`\nLine aleatória (${N}): média ${(s / N).toFixed(1)}`);
const keys = Object.keys(buckets).map(Number).sort((a, b) => a - b);
for (const k of keys) console.log(`  nota ${k}: ${((100 * buckets[k]) / N).toFixed(1)}%`);
