import { merge } from "./rft-merge.mjs";
// 2025 — geral (/players) + PLAYOFF por série (prints).
// F(T1-KT) SF1(GEN-KT) SF2(T1-TES) QF1(GEN-HLE) QF2(KT-CFO) QF3(G2-TES) QF4(AL-T1)
merge("2025", {
  // T1 campeão (base 88). Tricampeonato seguido (6o titulo); Gumayusi MVP da final. Faker 94 curadoria.
  Doran:   { base:86, geral:68.0, playoff:[65,78,66] },
  Oner:    { base:86, geral:70.0, playoff:[64,89,65] },
  Faker:   { base:86, geral:68.0, playoff:[64,81,66] },
  Gumayusi:{ base:86, geral:74.0, playoff:[70,79,74] , mvp:true },
  Keria:   { base:86, geral:76.0, playoff:[71,84,73] },
  // KT Rolster vice (base 84). Bdd/Cuzz/Peter monstruosos na QF (92/90/91).
  PerfecT: { base:84, geral:72.0, playoff:[63,71,80], vice:true },
  Cuzz:    { base:84, geral:78.0, playoff:[74,76,90], vice:true },
  Bdd:     { base:84, geral:78.0, playoff:[70,78,92], vice:true },
  deokdam: { base:84, geral:72.0, playoff:[58,78,84], vice:true },
  Peter:   { base:84, geral:76.0, playoff:[68,75,91], vice:true },
  // Top Esports semi (base 81): SF2+QF3. 369/Creme/JackeyLove.
  "369":   { base:81, geral:66.0, playoff:[56,75] },
  Kanavi:  { base:81, geral:58.0, playoff:[40,73] },
  Creme:   { base:81, geral:62.0, playoff:[49,76] },
  JackeyLove:{ base:81, geral:60.0, playoff:[43,74] },
  Hang:    { base:81, geral:64.0, playoff:[53,75] },
  // Gen.G semi (base 81): SF1+QF1. Chovy/Canyon/Ruler.
  Kiin:    { base:81, geral:62.0, playoff:[57,66] },
  Canyon:  { base:81, geral:64.0, playoff:[54,73] },
  Chovy:   { base:81, geral:66.0, playoff:[54,77] },
  Ruler:   { base:81, geral:62.0, playoff:[60,62] },
  Duro:    { base:81, geral:62.0, playoff:[54,70] },
  // Anyone's Legend quartas (base 78): QF4 (perderam 2-3). Flandre/Kael/Tarzan.
  Flandre: { base:78, geral:60.0, playoff:[69] },
  Tarzan:  { base:78, geral:58.0, playoff:[66] },
  Shanks:  { base:78, geral:55.0, playoff:[64] },
  Hope:    { base:78, geral:55.0, playoff:[57] },
  Kael:    { base:78, geral:60.0, playoff:[72] },
  // G2 Esports quartas (base 78): QF3 (perderam 1-3). Caps.
  BrokenBlade:{ base:78, geral:52.0, playoff:[54] },
  SkewMond:{ base:78, geral:55.0, playoff:[60] },
  Caps:    { base:78, geral:58.0, playoff:[60] },
  "Hans Sama":{ base:78, geral:52.0, playoff:[53] },
  Labrov:  { base:78, geral:52.0, playoff:[53] },
  // Hanwha Life quartas (base 78): QF1 (perderam 1-3). Viper/Zeus.
  Zeus:    { base:78, geral:60.0, playoff:[66] },
  Peanut:  { base:78, geral:55.0, playoff:[61] },
  Zeka:    { base:78, geral:52.0, playoff:[56] },
  Viper:   { base:78, geral:65.0, playoff:[78] },
  Delight: { base:78, geral:58.0, playoff:[69] },
  // CTBC Flying Oyster quartas (base 78): QF2 (varridos 0-3)
  Driver:  { base:78, geral:48.0, playoff:[47] },
  JunJia:  { base:78, geral:48.0, playoff:[45] },
  HongQ:   { base:78, geral:48.0, playoff:[44] },
  Doggo:   { base:78, geral:52.0, playoff:[48] },
  Kaiwing: { base:78, geral:52.0, playoff:[51] },
});
