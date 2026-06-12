// Mescla RFT (playoff 80% + geral 20%), normalizada por z-score por evento.
// overall = clamp( base_colocação + round(zFinal * SPREAD), caps[base] ) + (mvp ? 1 : 0)
// SPREAD 7 => o RFT pesa ~57% e a base ~43% na variação. Bases: campeão 86 · vice 84
// · semi 81 · quartas 78. Sem curadoria; o único ajuste manual é +1 pro MVP da final
// (flag mvp:true). Times de quartas sem página de série usam só o RFT geral.

const SPREAD = 7;
const W_PLAYOFF = 0.8;
const W_GERAL = 0.2;
const caps = { 86: [78, 97], 84: [72, 95], 81: [70, 94], 78: [66, 91] };

function z(val, mean, sd) { return sd ? (val - mean) / sd : 0; }
function stats(arr) {
  const m = arr.reduce((a, v) => a + v, 0) / arr.length;
  const sd = Math.sqrt(arr.reduce((a, v) => a + (v - m) ** 2, 0) / arr.length);
  return { m, sd };
}

// players: { name: { base, geral, playoff:[...series ratings] (vazio = sem playoff), mvp?, vice? } }
// Array playoff em ordem [Final, Semi, Quartas...] (1ª posição = fase mais avançada).
// VICE (vice:true): AMACIA a queda da FINAL (1ª posição). A final mantém PESO NORMAL na
// média (não infla semi/quartas), mas seu VALOR é suavizado em direção à média das outras
// séries: finalAmaciada = (finalReal + média(semi, quartas)) / 2. Ideia: perder a final 0-3
// não derruba quem foi gigante o torneio todo, sem fazer a nota se basear mais na semi/quartas.
export function merge(label, players) {
  const geralVals = Object.values(players).map((p) => p.geral);
  const playoffPlayers = Object.values(players).filter((p) => p.playoff && p.playoff.length);
  // média de RFT de playoff; pro vice, a final (1ª pos) tem o valor amaciado (peso normal).
  const playoffAvg = (p) => {
    if (p.vice && p.playoff.length > 1) {
      const others = p.playoff.slice(1);
      const othersAvg = others.reduce((a, v) => a + v, 0) / others.length;
      const finalSoft = (p.playoff[0] + othersAvg) / 2;
      return [finalSoft, ...others].reduce((a, v) => a + v, 0) / p.playoff.length;
    }
    return p.playoff.reduce((a, v) => a + v, 0) / p.playoff.length;
  };
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
    if (p.mvp) ov = Math.min(99, ov + 1); // +1 pro MVP da final
    out[name] = ov;
    const tag = p.mvp ? ` (MVP +1)` : "";
    console.log(`  ${name.padEnd(12)} base ${p.base} zP ${zP.toFixed(2)} zG ${zG.toFixed(2)} => ${ov}${tag}`);
  }
  return out;
}
