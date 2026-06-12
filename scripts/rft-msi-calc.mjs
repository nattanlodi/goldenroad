// Motor de cálculo dos overalls do MSI: RFT geral + playoff (80/20, z-score) COM
// FORÇA DO OPONENTE (opp-strength.mjs). Espelha a filosofia do Worlds adaptada ao
// MSI (sem suíça): peso do oponente MEIA intensidade no playoff, CHEIA no geral
// (via média de força dos oponentes enfrentados). MVP: +2 finals / +2 torneio / +3 duplo.
//
// Entrada por jogador: { base, geral, playoff: [[rating, "LIGA-COLOC"], ...], mvpFinal?, mvpTour? }
//   "LIGA-COLOC" = liga + colocação final do oponente daquela série (ex.: "LCK-2").
// playoff em ordem [mais avançada → menos]; vice (base 84) amacia a final (1ª pos).

import { rawForce, oppWeight } from "./opp-strength.mjs";

const SPREAD = 7;
const W_PLAYOFF = 0.8;
const W_GERAL = 0.2;
const caps = { 86: [78, 97], 84: [72, 95], 81: [70, 94], 78: [66, 91] };

// colocação (número) → chave de PLACE_FORCE.
function placeKey(n) {
  if (n === 1) return "champion";
  if (n === 2) return "finalist";
  if (n <= 4) return "semi";
  return "quarter"; // 5-8 no MSI (8 times no bracket)
}
function parseOpp(key) {
  const dash = key.lastIndexOf("-");
  return { league: key.slice(0, dash), place: placeKey(parseInt(key.slice(dash + 1), 10)) };
}

function z(val, mean, sd) { return sd ? (val - mean) / sd : 0; }
function stats(arr) {
  const m = arr.reduce((a, v) => a + v, 0) / arr.length;
  const sd = Math.sqrt(arr.reduce((a, v) => a + (v - m) ** 2, 0) / arr.length);
  return { m, sd };
}

export function mergeMsi(label, players) {
  // 1) média de rawForça do torneio = média da rawForça de TODOS os oponentes citados.
  const allOpps = [];
  for (const p of Object.values(players)) for (const s of p.playoff || []) {
    if (Array.isArray(s)) allOpps.push(parseOpp(s[1]));
  }
  const meanRaw = allOpps.length ? allOpps.reduce((a, o) => a + rawForce(o.place, o.league), 0) / allOpps.length : 0;

  // 2) playoff ponderado: cada série × peso do oponente (MEIA intensidade). Vice amacia a final.
  const playoffAvg = (p) => {
    const rs = (p.playoff || []).map((s) => {
      if (!Array.isArray(s)) return s;
      const { place, league } = parseOpp(s[1]);
      return s[0] * oppWeight(rawForce(place, league), meanRaw, true);
    });
    if (!rs.length) return null;
    if (p.vice && rs.length > 1) {
      const others = rs.slice(1);
      const oAvg = others.reduce((a, v) => a + v, 0) / others.length;
      const soft = (rs[0] + oAvg) / 2;
      return [soft, ...others].reduce((a, v) => a + v, 0) / rs.length;
    }
    return rs.reduce((a, v) => a + v, 0) / rs.length;
  };

  // 3) geral ponderado: × peso CHEIO da MÉDIA de força dos oponentes do próprio time.
  const geralAdj = (p) => {
    const opps = (p.playoff || []).filter(Array.isArray).map((s) => parseOpp(s[1]));
    if (!opps.length) return p.geral;
    const myMean = opps.reduce((a, o) => a + rawForce(o.place, o.league), 0) / opps.length;
    return p.geral * oppWeight(myMean, meanRaw, false);
  };

  const gVals = Object.values(players).map(geralAdj);
  const pPlayers = Object.values(players).filter((p) => p.playoff && p.playoff.length);
  const gStat = stats(gVals);
  const pStat = stats(pPlayers.map(playoffAvg));

  console.log(`\n== ${label} ==  meanRawForça ${meanRaw.toFixed(3)} · geral μ${gStat.m.toFixed(1)} · playoff μ${pStat.m.toFixed(1)}`);
  const out = {};
  for (const [name, p] of Object.entries(players)) {
    const zG = z(geralAdj(p), gStat.m, gStat.sd);
    const zP = p.playoff && p.playoff.length ? z(playoffAvg(p), pStat.m, pStat.sd) : zG;
    const zF = W_PLAYOFF * zP + W_GERAL * zG;
    const [lo, hi] = caps[p.base];
    let ov = Math.max(lo, Math.min(hi, p.base + Math.round(zF * SPREAD)));
    // MVP: +2 finals / +2 torneio / +3 se os dois (desconto de 1 na sobreposição). Teto 100.
    let bonus = 0, tag = "";
    if (p.mvpFinal && p.mvpTour) { bonus = 3; tag = " (DUPLO MVP +3)"; }
    else if (p.mvpFinal) { bonus = 2; tag = " (fMVP +2)"; }
    else if (p.mvpTour) { bonus = 2; tag = " (MVP torneio +2)"; }
    ov = Math.min(100, ov + bonus);
    out[name] = ov;
    console.log(`  ${name.padEnd(12)} base ${p.base} zP ${zP.toFixed(2)} zG ${zG.toFixed(2)} => ${ov}${tag}`);
  }
  return out;
}
