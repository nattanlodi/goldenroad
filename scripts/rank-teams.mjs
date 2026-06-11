// Ranking das médias dos times do pool (DRAFT_TEAMS). Só diagnóstico.
import { DRAFT_TEAMS } from "../src/data/teams.ts";

const rows = DRAFT_TEAMS.map((t) => {
  const avg = t.players.reduce((a, p) => a + p[2], 0) / t.players.length;
  return { name: `${t.short} '${String(t.year).slice(2)}`, team: t.team, avg: Math.round(avg * 10) / 10 };
}).sort((a, b) => b.avg - a.avg);

const n = rows.length;
const fmt = (r, i) => `${String(i).padStart(3)}. ${r.name.padEnd(10)} ${String(r.avg).padStart(4)}  (${r.team})`;

console.log(`Pool: ${n} times\n`);
console.log("== TOP 10 MAIS FORTES ==");
rows.slice(0, 10).forEach((r, i) => console.log(fmt(r, i + 1)));

const mid = Math.floor(n / 2);
console.log("\n== 10 MEDIANOS (centro do pool) ==");
rows.slice(mid - 5, mid + 5).forEach((r, i) => console.log(fmt(r, mid - 5 + i + 1)));

console.log("\n== 10 MAIS FRACOS ==");
rows.slice(-10).forEach((r, i) => console.log(fmt(r, n - 10 + i + 1)));
