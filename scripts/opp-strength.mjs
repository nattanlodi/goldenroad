// ============================================================================
// MOTOR DE FORÇA DO OPONENTE — módulo permanente (especificação da memória
// overall-calibracao.md, seção "💪 SISTEMA DE FORÇA DO OPONENTE — VERSÃO FINAL").
//
// Cada nota de partida é multiplicada pelo PESO do oponente daquela partida:
// bater/jogar contra time forte (região maior + colocação alta) vale mais; contra
// time fraco, vale menos. Curva ASSIMÉTRICA pune mais os oponentes fracos.
//
//   rawForça = forçaColocação × região
//   peso     = clamp(1 + (rawForça − médiaTorneio) × ganho, [0.55, 1.20])
//              ganho 0.9 se rawForça ≥ média (topo intacto) · 1.7 se < média (pune fraco)
//   intensidade: CHEIA no geral (peso aplicado direto) · MEIA no playoff (1+(W−1)×0.5)
// ============================================================================

// ⚙️ Estes dois mapas (PLACE_FORCE/REGION_FORCE) são os knobs da FORÇA DO OPONENTE.
// Editá-los aqui muda Worlds E MSI (ambos importam via rft-config.mjs). Depois rode
// `node scripts/reprocess-all.mjs` p/ propagar aos .ts.

// força por COLOCAÇÃO final do oponente no torneio.
export const PLACE_FORCE = {
  champion: 1.0, finalist: 0.96, semi: 0.9, quarter: 0.84, swiss: 0.74, playin: 0.66,
};

// força por REGIÃO (manual — pune wildcard fraco; decisão do usuário).
export const REGION_FORCE = {
  LCK: 1.1, LPL: 1.07, LEC: 1.0, LTA: 0.97, LCS: 0.95, PCS: 0.9, LCP: 0.9,
  VCS: 0.88, LJL: 0.84, CBLOL: 0.84, LLA: 0.82, wild: 0.8,
};

export function rawForce(place, league) {
  const pf = PLACE_FORCE[place] ?? PLACE_FORCE.quarter;
  const rf = REGION_FORCE[league] ?? REGION_FORCE.wild;
  return pf * rf;
}

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

/**
 * Peso de um oponente, dada a média de rawForça do torneio.
 * @param raw rawForça do oponente
 * @param mean média de rawForça do torneio (referência)
 * @param half true = metade da intensidade (playoff); false = cheia (geral)
 */
export function oppWeight(raw, mean, half = false) {
  const ganho = raw >= mean ? 0.9 : 1.7;
  let w = 1 + (raw - mean) * ganho;
  w = clamp(w, 0.55, 1.2);
  return half ? 1 + (w - 1) * 0.5 : w;
}

/** Média de rawForça de uma lista de oponentes (cada um {place, league}). */
export function tournamentMean(opps) {
  if (!opps.length) return 0;
  return opps.reduce((a, o) => a + rawForce(o.place, o.league), 0) / opps.length;
}
