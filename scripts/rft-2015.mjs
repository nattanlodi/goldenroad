import { merge } from "./rft-merge.mjs";
// 2015 — geral (/players) + PLAYOFF por série (prints). ROX no RFT = KOO Tigers (mesmo elenco).
// F(SKT-ROX) SF1(OG-SKT) SF2(FNC-ROX) QF1(FW-OG) QF2(SKT-ahq) QF3(FNC-EDG) QF4(KT-ROX)
merge("2015", {
  // SKT campeão (base 88): F+SF1+QF2. Faker 96 curadoria (tri-MVP, line histórica).
  MaRin:   { base:86, geral:64.0, playoff:[66,72,67] , mvp:true },
  Bengi:   { base:86, geral:52.0, playoff:[51,58,54] },
  Faker:   { base:86, geral:72.0, playoff:[75,77,75] },
  Bang:    { base:86, geral:62.0, playoff:[60,55,66] },
  Wolf:    { base:86, geral:60.0, playoff:[62,62,66] },
  // KOO Tigers vice (base 84): F+SF2+QF4 (ROX no RFT)
  Smeb:    { base:84, geral:64.0, playoff:[55,78,66] },
  Hojin:   { base:84, geral:52.0, playoff:[55,50,54] },
  Kuro:    { base:84, geral:60.0, playoff:[54,68,64] },
  PraY:    { base:84, geral:55.0, playoff:[47,60,54] },
  GorillA: { base:84, geral:62.0, playoff:[49,76,63] },
  // Fnatic semi (base 81): SF2+QF3
  Huni:    { base:81, geral:62.0, playoff:[50,73] },
  Reignover:{ base:81, geral:58.0, playoff:[51,53] },
  Febiven: { base:81, geral:68.0, playoff:[67,80] },
  Rekkles: { base:81, geral:56.0, playoff:[48,60] },
  YellOwStaR:{ base:81, geral:52.0, playoff:[44,65] },
  // Origen semi (base 81): SF1+QF1
  Soaz:    { base:81, geral:58.0, playoff:[48,64] },
  Amazing: { base:81, geral:50.0, playoff:[45,52] },
  xPeke:   { base:81, geral:55.0, playoff:[45,59] },
  Niels:   { base:81, geral:58.0, playoff:[49,64] }, // Zven
  Mithy:   { base:81, geral:55.0, playoff:[52,57] },
  // EDG quartas (base 78): QF3 (varridos 0-3 pela FNC)
  Koro1:   { base:78, geral:50.0, playoff:[43] },
  ClearLove:{ base:78, geral:55.0, playoff:[45] },
  PawN:    { base:78, geral:55.0, playoff:[50] },
  Deft:    { base:78, geral:58.0, playoff:[45] },
  Meiko:   { base:78, geral:50.0, playoff:[44] },
  // ahq quartas (base 78): QF2 (varridos 0-3 pela SKT)
  Ziv:     { base:78, geral:48.0, playoff:[44] },
  Mountain:{ base:78, geral:48.0, playoff:[45] },
  Westdoor:{ base:78, geral:50.0, playoff:[40] },
  AN:      { base:78, geral:48.0, playoff:[44] },
  Albis:   { base:78, geral:50.0, playoff:[49] },
  // KT quartas (base 78): QF4
  Ssumday: { base:78, geral:55.0, playoff:[53] },
  Score:   { base:78, geral:55.0, playoff:[52] },
  Nagne:   { base:78, geral:53.0, playoff:[53] },
  Arrow:   { base:78, geral:55.0, playoff:[55] },
  Piccaboo:{ base:78, geral:55.0, playoff:[57] },
  // Flash Wolves quartas (base 78): QF1
  Steak:   { base:78, geral:50.0, playoff:[52] },
  Karsa:   { base:78, geral:55.0, playoff:[49] },
  Maple:   { base:78, geral:60.0, playoff:[65] },
  NL:      { base:78, geral:50.0, playoff:[50] },
  SwordArT:{ base:78, geral:52.0, playoff:[53] },
});
