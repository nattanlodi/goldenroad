import { merge } from "./rft-merge.mjs";
// 2021 — geral (/players) + PLAYOFF por série (prints).
// F(EDG-DK) SF1(T1-DK) SF2(EDG-GEN) QF1(T1-HLE) QF2(RNG-EDG) QF3(DK-MAD) QF4(GEN-C9)
merge("2021", {
  // EDward Gaming campeão (base 88). Scout/Viper carregaram; sem transcendente único.
  Flandre: { base:86, geral:62.0, playoff:[70,63,66] },
  Jiejie:  { base:86, geral:58.0, playoff:[63,57,61] },
  Scout:   { base:86, geral:62.0, playoff:[58,65,64] , mvp:true },
  Viper:   { base:86, geral:58.0, playoff:[51,62,54] },
  Meiko:   { base:86, geral:65.0, playoff:[63,65,71] },
  // DAMWON KIA vice (base 84). ShowMaker/Canyon/BeryL fortes.
  Khan:    { base:84, geral:60.0, playoff:[57,63,73], vice:true },
  Canyon:  { base:84, geral:64.0, playoff:[53,66,75], vice:true },
  ShowMaker:{ base:84, geral:62.0, playoff:[45,72,67], vice:true },
  Ghost:   { base:84, geral:55.0, playoff:[51,55,64], vice:true },
  BeryL:   { base:84, geral:62.0, playoff:[60,70,76], vice:true },
  // T1 semi (base 81): SF1+QF1. Faker com o trio jovem emergindo.
  Canna:   { base:81, geral:62.0, playoff:[57,76] },
  Oner:    { base:81, geral:62.0, playoff:[51,76] },
  Faker:   { base:81, geral:60.0, playoff:[51,67] },
  Gumayusi:{ base:81, geral:62.0, playoff:[49,76] },
  Keria:   { base:81, geral:62.0, playoff:[52,75] },
  // Gen.G semi (base 81): SF2+QF4
  Rascal:  { base:81, geral:60.0, playoff:[58,74] },
  Clid:    { base:81, geral:60.0, playoff:[54,73] },
  Bdd:     { base:81, geral:64.0, playoff:[64,75] },
  Ruler:   { base:81, geral:60.0, playoff:[49,67] },
  Life:    { base:81, geral:65.0, playoff:[62,80] },
  // RNG quartas (base 78): QF2 (perderam 2-3 epica). Xiaohu de top.
  Xiaohu:  { base:78, geral:62.0, playoff:[68] },
  Wei:     { base:78, geral:55.0, playoff:[55] },
  Cryin:   { base:78, geral:55.0, playoff:[56] },
  GALA:    { base:78, geral:55.0, playoff:[47] },
  Ming:    { base:78, geral:58.0, playoff:[59] },
  // Cloud9 quartas (base 78): QF4 (varridos 0-3)
  Fudge:   { base:78, geral:50.0, playoff:[49] },
  Blaber:  { base:78, geral:55.0, playoff:[53] },
  Perkz:   { base:78, geral:55.0, playoff:[47] },
  Zven:    { base:78, geral:48.0, playoff:[37] },
  Vulcan:  { base:78, geral:50.0, playoff:[43] },
  // Hanwha Life quartas (base 78): QF1 (varridos 0-3). Chovy/Deft.
  Morgan:  { base:78, geral:50.0, playoff:[51] },
  Willer:  { base:78, geral:45.0, playoff:[36] },
  Chovy:   { base:78, geral:58.0, playoff:[56] },
  Deft:    { base:78, geral:52.0, playoff:[44] },
  Vsta:    { base:78, geral:48.0, playoff:[41] },
  // MAD Lions quartas (base 78): QF3 (varridos 0-3). Elyoya.
  Armut:   { base:78, geral:52.0, playoff:[52] },
  Elyoya:  { base:78, geral:55.0, playoff:[49] },
  Humanoid:{ base:78, geral:55.0, playoff:[56] },
  Carzzy:  { base:78, geral:52.0, playoff:[41] },
  Kaiser:  { base:78, geral:55.0, playoff:[61] },
});
