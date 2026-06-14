// Motor de cálculo dos overalls do WORLDS: RFT geral + playoff (80/20, z-score) COM
// FORÇA DO OPONENTE (opp-strength.mjs). Irmão do rft-msi-calc.mjs, adaptado ao Worlds:
//   - placeKey cobre suíça (9-12) e play-in (13+) além de quartas, semis e finalistas;
//   - o `geral` é mantido CRU (não recebe força do oponente) — decisão da memória
//     overall-calibracao.md: o RFT da aba Players já ignora força do oponente e o usuário
//     escolheu não corrigi-lo; só o PLAYOFF é ponderado pela força do oponente.
//   - peso do oponente MEIA intensidade no playoff (a base de fase já protege campeões).
// MVP da FINAL: +1 aqui (flag mvp), igual ao motor antigo; as curadorias e o MVP do
// TORNEIO (+2) são overrides aplicados POR CIMA, fora do motor (decisão do usuário).
//
// Entrada por jogador: { base, geral, playoff: [[rating, "LIGA-COLOC"], ...], mvp?, vice? }
//   "LIGA-COLOC" = liga + colocação final do oponente daquela série (ex.: "LPL-2").
// playoff em ordem [mais avançada → menos]; vice (base 84) amacia a final (1ª pos).

// TODOS os parâmetros da régua (80/20, SPREAD, REBASE, K_SHRINK, MVP, teto) vêm da
// CONFIG ÚNICA rft-config.mjs — mude lá e rode reprocess-all.mjs p/ propagar a tudo.
import { rawForce, oppWeight } from "./opp-strength.mjs";
import { W_PLAYOFF, W_GERAL, SPREAD, REBASE, K_SHRINK, MVP_FINAL, CAP_GLOBAL } from "./rft-config.mjs";

// colocação (número) do oponente → chave de PLACE_FORCE (força por fase alcançada).
function placeKey(n) {
  if (n === 1) return "champion";
  if (n === 2) return "finalist";
  if (n <= 4) return "semi";
  if (n <= 8) return "quarter";
  if (n <= 12) return "swiss";
  return "playin";
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

export function mergeWorlds(label, players) {
  // 1) média de rawForça do torneio = média da rawForça de TODOS os oponentes de playoff citados.
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

  // 3) geral CRU (sem força do oponente — decisão da memória).
  //    Jogadores SEM geral (ex.: Worlds 2013, times que entraram direto no mata-mata sem
  //    fase de grupos no rft.gg) são excluídos da estatística do geral e ponderados 100% playoff.
  const hasGeral = (p) => p.geral != null;
  const gVals = Object.values(players).filter(hasGeral).map((p) => p.geral);
  const pPlayers = Object.values(players).filter((p) => p.playoff && p.playoff.length);
  const gStat = stats(gVals);
  const pStat = stats(pPlayers.map(playoffAvg));

  console.log(`\n== ${label} ==  meanRawForça ${meanRaw.toFixed(3)} · geral μ${gStat.m.toFixed(1)}/σ${gStat.sd.toFixed(1)} · playoff μ${pStat.m.toFixed(1)}/σ${pStat.sd.toFixed(1)}`);
  const out = {};
  for (const [name, p] of Object.entries(players)) {
    const np = (p.playoff || []).length;
    const shrink = np ? Math.sqrt(np / (np + K_SHRINK)) : 0;
    const hasG = p.geral != null;
    const zG = hasG ? z(p.geral, gStat.m, gStat.sd) : 0;
    const zP = np ? z(playoffAvg(p), pStat.m, pStat.sd) * shrink : zG; // shrink por sample
    // sem geral → 100% playoff (não dilui com um zG=0 falso); sem playoff → 100% geral (zP=zG).
    const zF = hasG ? (W_PLAYOFF * zP + W_GERAL * zG) : zP;
    const base = REBASE[p.base] ?? p.base; // base rebaixada -2
    let ov = base + Math.round(zF * SPREAD); // SEM caps[base] — overall cru
    // fMVP sozinho não passa de CAP_GLOBAL-1 (só duplo-MVP via override externo chega a 100).
    if (p.mvp) ov = Math.min(CAP_GLOBAL - 1, ov + MVP_FINAL);
    out[name] = ov;
    const tag = p.mvp ? ` (fMVP +${MVP_FINAL})` : "";
    console.log(`  ${name.padEnd(12)} base ${base} zP ${zP.toFixed(2)} zG ${zG.toFixed(2)} => ${ov}${tag}`);
  }
  return out;
}
