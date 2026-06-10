import { merge } from "./rft-merge.mjs";
// 2014 — RFT geral (/players) + RFT de PLAYOFF agregado por série (prints rft.gg).
// Séries: F(SSW-RYL) SF1(SSW-SSB) SF2(RYL-OMG) QF1(SSW-TSM) QF2(SSB-C9) QF3(RYL-EDG) QF4(NJWS-OMG)
merge("2014", {
  // Samsung White campeão (base 88): F + SF1 + QF1. Mata 99 curadoria (MVP transcendente).
  Looper:  { base:88, geral:79.9, playoff:[76,90,87] },
  DanDy:   { base:88, geral:74.3, playoff:[72,79,84] },
  PawN:    { base:88, geral:82.8, playoff:[83,98,84], cura:96 },
  imp:     { base:88, geral:62.6, playoff:[58,55,36] },
  Mata:    { base:88, geral:79.8, playoff:[80,85,84], cura:99 },
  // Star Horn Royal Club vice (base 84): F + SF2 + QF3
  Cola:    { base:84, geral:50.4, playoff:[44,45,45] },
  inSec:   { base:84, geral:48.1, playoff:[32,46,46] },
  corn:    { base:84, geral:55.6, playoff:[32,58,60] },
  Uzi:     { base:84, geral:57.0, playoff:[40,56,56] },
  Zero:    { base:84, geral:61.0, playoff:[41,58,65] },
  // Samsung Blue semi (base 81): SF1 + QF2
  Acorn:   { base:81, geral:52.7, playoff:[18,61] },
  Spirit:  { base:81, geral:54.1, playoff:[25,61] },
  Dade:    { base:81, geral:57.0, playoff:[24,68] },
  Deft:    { base:81, geral:54.2, playoff:[42,46] },
  Heart:   { base:81, geral:59.4, playoff:[36,60] },
  // OMG semi (base 81): SF2 + QF4
  Gogoing: { base:81, geral:65.7, playoff:[66,80] },
  Loveling:{ base:81, geral:56.3, playoff:[54,64] },
  Cool:    { base:81, geral:64.1, playoff:[68,71] },
  San:     { base:81, geral:55.1, playoff:[54,65] },
  Cloud:   { base:81, geral:65.0, playoff:[60,74] },
  // TSM quartas (base 78): QF1
  Dyrus:   { base:78, geral:53.6, playoff:[58] },
  Amazing: { base:78, geral:50.0, playoff:[32] },
  Bjergsen:{ base:78, geral:63.2, playoff:[65] },
  WildTurtle:{ base:78, geral:50.4, playoff:[23] },
  Lustboy: { base:78, geral:56.8, playoff:[36] },
  // Cloud9 quartas (base 78): QF2
  Balls:   { base:78, geral:54.4, playoff:[51] },
  Meteos:  { base:78, geral:53.7, playoff:[47] },
  Hai:     { base:78, geral:54.2, playoff:[50] },
  Sneaky:  { base:78, geral:53.4, playoff:[57] },
  LemonNation:{ base:78, geral:60.1, playoff:[63] },
  // EDward Gaming quartas (base 78): QF3 (jungler real = ClearLove; RFT lista Mann)
  Koro1:   { base:78, geral:63.0, playoff:[63] },
  ClearLove:{ base:78, geral:57.1, playoff:[52] },
  U:       { base:78, geral:66.0, playoff:[60] },
  NaMei:   { base:78, geral:51.6, playoff:[46] },
  Fzzf:    { base:78, geral:58.7, playoff:[53] },
  // NaJin White Shield quartas (base 78): QF4 (varridos 0-3)
  Save:    { base:78, geral:53.1, playoff:[32] },
  Watch:   { base:78, geral:49.1, playoff:[39] },
  Ggoong:  { base:78, geral:67.2, playoff:[46] },
  Zefa:    { base:78, geral:50.7, playoff:[44] },
  GorillA: { base:78, geral:56.6, playoff:[40] },
});
