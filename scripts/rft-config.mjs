// ============================================================================
// CONFIG ÚNICA DA RÉGUA DE OVERALLS — todos os "knobs" num lugar só.
// Worlds (rft-worlds-calc.mjs) E MSI (rft-msi-calc.mjs) importam DESTE arquivo.
// Mudar um valor aqui + rodar `node scripts/reprocess-all.mjs` recalcula o jogo INTEIRO.
// ============================================================================

// --- MISTURA playoff/geral (z-score) ---
export const W_PLAYOFF = 0.8; // peso do desempenho no PLAYOFF (mata-mata)
export const W_GERAL = 0.2;   // peso do desempenho na fase de pontos (grupos/suíça)
//   Ex.: pra 70/30, troque pra 0.7 / 0.3.

// --- AMPLITUDE ---
export const SPREAD = 7; // multiplica o z-score final: overall = base + round(zFinal*SPREAD).
//   MAIOR = notas mais espalhadas (topo sobe, fundo desce). MENOR = mais comprimido.

// --- BASES POR COLOCAÇÃO (rebaixadas -2 em 14/jun p/ o 100 ser raro) ---
// Mapeia a base-de-entrada dos rft-w/rft-msi-<ano>.mjs (campeão 86 etc.) -> base efetiva.
export const REBASE = { 86: 84, 84: 82, 81: 79, 78: 76 };
//   campeão 84 · vice 82 · semi 79 · quartas 76. Pra subir tudo +1, some 1 em cada.

// --- SHRINKAGE por nº de séries (corrige sample pequeno, ex.: jogou 1 só jogo) ---
export const K_SHRINK = 0.5; // zP *= sqrt(n/(n+K)). MAIOR pune mais quem jogou pouco.

// --- BÔNUS DE MVP ---
// MSI usa os 3 (mvpFinal/mvpTour/duplo). Worlds: o motor só aplica o fMVP (=MVP_FINAL);
// MVP-do-torneio e duplo do Worlds são overrides de curadoria nos .ts (fora do motor).
export const MVP_FINAL = 1; // Finals MVP
export const MVP_TOUR = 1;  // MVP do torneio
export const MVP_BOTH = 2;  // mesmo jogador é os dois

// --- TETO GLOBAL ---
export const CAP_GLOBAL = 100; // nenhum overall passa disto (raridade "centurião" = 100).
//   NÃO há mais caps[base] (faixa por colocação) — decisão 14/jun.

// ============================================================================
// FORÇA DO OPONENTE (região × colocação). Reexportado de opp-strength.mjs pra ficar
// tudo "configurável a partir de um lugar". Edite os valores LÁ (PLACE_FORCE/REGION_FORCE).
// ============================================================================
export { PLACE_FORCE, REGION_FORCE, rawForce, oppWeight, tournamentMean } from "./opp-strength.mjs";
