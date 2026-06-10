// Mescla RFT (playoff 70% + geral 30%), normalizada por z-score por evento.
// overall = clamp( base_colocação + round(zFinal * SPREAD), caps[base] )
// Times de quartas que não têm página de série usam só o RFT geral (zPlayoff = zGeral).

const SPREAD = 6;
const W_PLAYOFF = 0.7;
const W_GERAL = 0.3;
const caps = { 88: [80, 96], 84: [73, 95], 81: [70, 94], 78: [66, 90] };

function z(val, mean, sd) { return sd ? (val - mean) / sd : 0; }
function stats(arr) {
  const m = arr.reduce((a, v) => a + v, 0) / arr.length;
  const sd = Math.sqrt(arr.reduce((a, v) => a + (v - m) ** 2, 0) / arr.length);
  return { m, sd };
}

// players: { name: { base, geral, playoff:[...series ratings] (vazio = sem playoff), cura? } }
export function merge(label, players) {
  const geralVals = Object.values(players).map((p) => p.geral);
  const playoffPlayers = Object.values(players).filter((p) => p.playoff && p.playoff.length);
  const playoffAvg = (p) => p.playoff.reduce((a, v) => a + v, 0) / p.playoff.length;
  const gStat = stats(geralVals);
  const pStat = stats(playoffPlayers.map(playoffAvg));

  console.log(`\n== ${label} ==  geral μ${gStat.m.toFixed(1)}/σ${gStat.sd.toFixed(1)} · playoff μ${pStat.m.toFixed(1)}/σ${pStat.sd.toFixed(1)}`);
  const out = {};
  for (const [name, p] of Object.entries(players)) {
    const zG = z(p.geral, gStat.m, gStat.sd);
    const zP = p.playoff && p.playoff.length ? z(playoffAvg(p), pStat.m, pStat.sd) : zG; // sem playoff → usa geral
    const zF = W_PLAYOFF * zP + W_GERAL * zG;
    const [lo, hi] = caps[p.base];
    let ov = Math.max(lo, Math.min(hi, p.base + Math.round(zF * SPREAD)));
    if (p.cura) ov = p.cura; // override de curadoria (teto transcendente)
    out[name] = ov;
    const tag = p.cura ? ` (curadoria ${p.cura})` : "";
    console.log(`  ${name.padEnd(12)} base ${p.base} zP ${zP.toFixed(2)} zG ${zG.toFixed(2)} => ${ov}${tag}`);
  }
  return out;
}
