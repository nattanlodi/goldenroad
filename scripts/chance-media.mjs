// Chance da MÉDIA da line ser >= alvo (90 por padrão). Diferente de "5x90+":
// aqui só importa a soma/média dos 5. Simula o draft real (sorteio ponderado,
// 1 pick por rodada) com jogo guloso: pega o melhor jogador do time numa lane
// vazia; rerola enquanto o melhor pick disponível for fraco e ainda houver reroll.
import { DRAFT_TEAMS, QUARTERFINAL_IDS, SEMIFINAL_IDS } from "../src/data/teams.ts";

const ROLES = ["TOP", "JNG", "MID", "BOT", "SUP"];
const ALVO = 92;
const RR_FLOOR = 91; // rerola se o melhor pick disponível for < isto (e tiver reroll)

const weight = (t) => (QUARTERFINAL_IDS.has(t.id) ? 0.4 : SEMIFINAL_IDS.has(t.id) ? 0.75 : 1);
function drawTeam(usedId) {
  const cand = DRAFT_TEAMS.filter((t) => t.id !== usedId);
  const tot = cand.reduce((a, t) => a + weight(t), 0);
  let r = Math.random() * tot;
  for (const t of cand) { r -= weight(t); if (r < 0) return t; }
  return cand[cand.length - 1];
}
// melhor jogador do time numa lane ainda vazia: retorna {role, rating}
function melhorPick(t, filled) {
  let best = null;
  for (const p of t.players) {
    if (filled[p[0]]) continue;
    if (!best || p[2] > best.rating) best = { role: p[0], rating: p[2] };
  }
  return best;
}

function simula(rerolls) {
  const filled = {};
  let soma = 0, used = null, rr = rerolls;
  for (let round = 0; round < 5; round++) {
    let t = drawTeam(used); used = t.id;
    let pick = melhorPick(t, filled);
    while (pick && pick.rating < RR_FLOOR && rr > 0) {
      rr--; t = drawTeam(used); used = t.id; pick = melhorPick(t, filled);
    }
    filled[pick.role] = true;
    soma += pick.rating;
  }
  return soma / 5;
}

const N = 200000;
console.log(`Pool ${DRAFT_TEAMS.length} times · alvo média >= ${ALVO} · jogo guloso (rerola pick < ${RR_FLOOR})\n`);
for (const rr of [0, 3, 8, 20]) {
  let ok = 0, somaMedias = 0;
  for (let i = 0; i < N; i++) { const m = simula(rr); somaMedias += m; if (m >= ALVO) ok++; }
  console.log(`${String(rr).padStart(2)} rerolls: média típica ${(somaMedias / N).toFixed(1)} · chance média>=${ALVO}: ${((100 * ok) / N).toFixed(1)}%`);
}
