import { merge } from "./rft-merge.mjs";
// 2022 — geral (/players) + PLAYOFF por série (prints).
// F(T1-DRX) SF1(JDG-T1) SF2(GEN-DRX) QF1(JDG-RGE) QF2(T1-RNG) QF3(GEN-DWG) QF4(DRX-EDG)
merge("2022", {
  // DRX campeão (base 88). Cinderela (4a seed); Kingen MVP da final, Zeka destaque.
  Kingen:  { base:88, geral:60.0, playoff:[73,63,61] },
  Pyosik:  { base:88, geral:60.0, playoff:[61,68,60] },
  Zeka:    { base:88, geral:64.0, playoff:[66,67,65] },
  Deft:    { base:88, geral:58.0, playoff:[56,60,65] },
  BeryL:   { base:88, geral:62.0, playoff:[63,64,64] },
  // T1 vice (base 84). Trio jovem + Faker; final em 5 jogos.
  Zeus:    { base:84, geral:66.0, playoff:[58,71,78] },
  Oner:    { base:84, geral:62.0, playoff:[60,61,73] },
  Faker:   { base:84, geral:64.0, playoff:[58,72,62] },
  Gumayusi:{ base:84, geral:68.0, playoff:[55,80,72] },
  Keria:   { base:84, geral:68.0, playoff:[63,80,73] },
  // JD Gaming semi (base 81): SF1+QF1. Kanavi gigante na QF (82).
  "369":   { base:81, geral:66.0, playoff:[64,78] },
  Kanavi:  { base:81, geral:68.0, playoff:[60,82] },
  YaGao:   { base:81, geral:58.0, playoff:[51,61] },
  Hope:    { base:81, geral:60.0, playoff:[48,65] },
  MISSING: { base:81, geral:62.0, playoff:[54,74] },
  // Gen.G semi (base 81): SF2+QF3. Chovy/Ruler.
  Doran:   { base:81, geral:58.0, playoff:[59,59] },
  Peanut:  { base:81, geral:55.0, playoff:[53,51] },
  Chovy:   { base:81, geral:64.0, playoff:[55,68] },
  Ruler:   { base:81, geral:62.0, playoff:[64,61] },
  Lehends: { base:81, geral:58.0, playoff:[55,61] },
  // Rogue quartas (base 78): QF1 (varridos 0-3). Larssen.
  Odoamne: { base:78, geral:50.0, playoff:[47] },
  Malrang: { base:78, geral:48.0, playoff:[39] },
  Larssen: { base:78, geral:62.0, playoff:[73] },
  Comp:    { base:78, geral:50.0, playoff:[47] },
  Trymbi:  { base:78, geral:52.0, playoff:[48] },
  // RNG quartas (base 78): QF2 (varridos 0-3). GALA/Xiaohu.
  Breathe: { base:78, geral:55.0, playoff:[54] },
  Wei:     { base:78, geral:50.0, playoff:[47] },
  Xiaohu:  { base:78, geral:58.0, playoff:[58] },
  GALA:    { base:78, geral:55.0, playoff:[50] },
  Ming:    { base:78, geral:50.0, playoff:[46] },
  // DWG KIA quartas (base 78): QF3 (perderam 2-3). Canyon/ShowMaker.
  Nuguri:  { base:78, geral:58.0, playoff:[66] },
  Canyon:  { base:78, geral:62.0, playoff:[69] },
  ShowMaker:{ base:78, geral:60.0, playoff:[66] },
  deokdam: { base:78, geral:55.0, playoff:[56] },
  Kellin:  { base:78, geral:58.0, playoff:[63] },
  // EDward Gaming quartas (base 78): QF4 (perderam 2-3). Scout o destaque.
  Flandre: { base:78, geral:60.0, playoff:[68] },
  Jiejie:  { base:78, geral:55.0, playoff:[59] },
  Scout:   { base:78, geral:64.0, playoff:[72] },
  Viper:   { base:78, geral:55.0, playoff:[58] },
  Meiko:   { base:78, geral:55.0, playoff:[56] },
});
