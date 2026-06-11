// Chance de montar uma line 5x90+. Conta os 90+ por lane no pool (DRAFT_TEAMS)
// e simula o draft real (sorteio ponderado, 1 pick por rodada, sem reroll e com).
import { DRAFT_TEAMS, QUARTERFINAL_IDS, SEMIFINAL_IDS } from "../src/data/teams.ts";

const ROLES = ["TOP", "JNG", "MID", "BOT", "SUP"];
const THRESH = 90;

// peso de sorteio do draft (espelha helpers)
const weight = (t) => (QUARTERFINAL_IDS.has(t.id) ? 0.4 : SEMIFINAL_IDS.has(t.id) ? 0.75 : 1);
function drawTeam(pool, usedId) {
  const cand = pool.filter((t) => t.id !== usedId);
  const tot = cand.reduce((a, t) => a + weight(t), 0);
  let r = Math.random() * tot;
  for (const t of cand) { r -= weight(t); if (r < 0) return t; }
  return cand[cand.length - 1];
}

// quantos 90+ por lane existem no pool
console.log(`Pool: ${DRAFT_TEAMS.length} times · limiar ${THRESH}+\n`);
console.log("90+ por lane no pool:");
for (const role of ROLES) {
  const n = DRAFT_TEAMS.filter((t) => {
    const p = t.players.find((x) => x[0] === role);
    return p && p[2] >= THRESH;
  }).length;
  console.log(`  ${role}: ${n} times têm um ${role} ${THRESH}+`);
}

// simula: 5 rodadas (1 pick/rodada). A cada rodada o jogador rerola enquanto
// tiver reroll, até o time sorteado ter um 90+ numa lane vazia. Estratégia
// gulosa: pega o 90+ da lane mais "rara" disponível. Se acabar reroll sem 90+
// útil, falha o objetivo. (banco compartilhado de rerolls pra toda a campanha)
function simula(rerolls) {
  const filled = {};
  let used = null;
  let rr = rerolls;
  for (let round = 0; round < 5; round++) {
    let t = drawTeam(DRAFT_TEAMS, used);
    used = t.id;
    let opc = lanes90Vazias(t, filled);
    while (!opc.length && rr > 0) {
      rr--;
      t = drawTeam(DRAFT_TEAMS, used);
      used = t.id;
      opc = lanes90Vazias(t, filled);
    }
    if (!opc.length) return false; // forçado a pegar <90
    filled[opc[0]] = true;
  }
  return true;
}
function lanes90Vazias(t, filled) {
  return ROLES.filter((r) => !filled[r]).filter((r) => {
    const p = t.players.find((x) => x[0] === r);
    return p && p[2] >= THRESH;
  });
}

const N = 200000;
for (const rr of [0, 3, 8, 20]) {
  let ok = 0;
  for (let i = 0; i < N; i++) if (simula(rr)) ok++;
  console.log(`\nCom ${rr} rerolls extras: ${((100 * ok) / N).toFixed(2)}% das vezes monta 5x${THRESH}+`);
}
