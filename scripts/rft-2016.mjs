import { merge } from "./rft-merge.mjs";
// 2016 — geral (/players) + PLAYOFF por série (prints).
// F(SKT-SSG) SF1(SKT-ROX) SF2(SSG-H2K) QF1(SSG-C9) QF2(SKT-RNG) QF3(ROX-EDG) QF4(H2K-ANX)
merge("2016", {
  // SKT campeão (base 88): F+SF1+QF2. Faker 96 curadoria (tri-campeão).
  Duke:   { base:86, geral:62.0, playoff:[66,64,60] },
  Bengi:  { base:86, geral:60.0, playoff:[63,57,65] },
  Faker:  { base:86, geral:71.0, playoff:[73,73,73] , mvp:true },
  Bang:   { base:86, geral:60.0, playoff:[63,51,64] },
  Wolf:   { base:86, geral:60.0, playoff:[65,56,63] },
  // Samsung Galaxy vice (base 84): F+SF2+QF1. Crown e Ruler em ascensão.
  CuVee:  { base:84, geral:62.0, playoff:[56,65,69], vice:true },
  Ambition:{ base:84, geral:60.0, playoff:[49,65,62], vice:true },
  Crown:  { base:84, geral:66.0, playoff:[55,84,68], vice:true },
  Ruler:  { base:84, geral:58.0, playoff:[55,49,66], vice:true },
  CoreJJ: { base:84, geral:58.0, playoff:[52,49,71], vice:true },
  // ROX Tigers semi (base 81): SF1+QF3. O lendário ROX.
  Smeb:   { base:81, geral:68.0, playoff:[64,69] },
  Peanut: { base:81, geral:62.0, playoff:[52,70] },
  Kuro:   { base:81, geral:62.0, playoff:[54,71] },
  PraY:   { base:81, geral:60.0, playoff:[52,57] },
  GorillA:{ base:81, geral:62.0, playoff:[54,67] },
  // H2K semi (base 81): SF2+QF4
  Odoamne:{ base:81, geral:62.0, playoff:[61,90] },
  Jankos: { base:81, geral:58.0, playoff:[51,74] },
  Ryu:    { base:81, geral:55.0, playoff:[36,80] },
  FORG1VEN:{ base:81, geral:58.0, playoff:[55,62] },
  Vander: { base:81, geral:56.0, playoff:[56,69] },
  // EDG quartas (base 78): QF3 (perderam 1-3)
  Koro1:  { base:78, geral:52.0, playoff:[49] },
  Clearlove:{ base:78, geral:55.0, playoff:[37] }, // RFT lista Mann; jungler real ClearLove
  Scout:  { base:78, geral:55.0, playoff:[51] },
  Deft:   { base:78, geral:58.0, playoff:[50] },
  Meiko:  { base:78, geral:52.0, playoff:[48] },
  // RNG quartas (base 78): QF2 (perderam 1-3). Uzi/Mata.
  Looper: { base:78, geral:58.0, playoff:[63] },
  Mlxg:   { base:78, geral:50.0, playoff:[43] },
  Xiaohu: { base:78, geral:55.0, playoff:[55] },
  Uzi:    { base:78, geral:55.0, playoff:[48] },
  Mata:   { base:78, geral:52.0, playoff:[49] },
  // C9 quartas (base 78): QF1 (varridos 0-3)
  Impact: { base:78, geral:55.0, playoff:[54] },
  Meteos: { base:78, geral:50.0, playoff:[48] },
  Jensen: { base:78, geral:60.0, playoff:[65] },
  Sneaky: { base:78, geral:48.0, playoff:[38] },
  Smoothie:{ base:78, geral:50.0, playoff:[43] },
  // Albus NoX Luna quartas (base 78): QF4 (varridos 0-3, mas heróis dos grupos)
  Smurf:  { base:78, geral:50.0, playoff:[33] },
  PvPStejos:{ base:78, geral:48.0, playoff:[28] },
  Kira:   { base:78, geral:52.0, playoff:[42] },
  aMiracle:{ base:78, geral:50.0, playoff:[41] }, // Onesh0tiq no print
  Likkrit:{ base:78, geral:55.0, playoff:[45] },
});
