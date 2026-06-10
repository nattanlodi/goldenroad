import { DRAFT_TEAMS, TEAMS } from "../src/data/teams.ts";

const byYear = {};
for (const t of DRAFT_TEAMS) (byYear[t.year] ??= []).push(t.short);
console.log("Arquivo completo (TEAMS):", TEAMS.length);
console.log("Pool de jogo (DRAFT_TEAMS):", DRAFT_TEAMS.length);
for (const y of Object.keys(byYear).sort())
  console.log(y, "(" + byYear[y].length + "):", byYear[y].join(" "));
