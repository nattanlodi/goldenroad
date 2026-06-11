import { merge } from "./rft-merge.mjs";
// 2019 — geral (/players) + PLAYOFF por série (prints).
// F(G2-FPX) SF1(IG-FPX) SF2(G2-T1) QF1(GRF-IG) QF2(FPX-FNC) QF3(T1-SPY) QF4(DWG-G2)
merge("2019", {
  // FunPlus Phoenix campeão (base 88). Tian MVP da final; Doinb o cérebro. Sem transcendente.
  GimGoon: { base:86, geral:62.0, playoff:[68,64,59] },
  Tian:    { base:86, geral:70.0, playoff:[66,69,75] , mvp:true },
  Doinb:   { base:86, geral:72.0, playoff:[79,65,77] },
  Lwx:     { base:86, geral:66.0, playoff:[73,62,62] },
  Crisp:   { base:86, geral:72.0, playoff:[74,80,74] },
  // G2 vice (base 84). A super-G2.
  Wunder:  { base:84, geral:60.0, playoff:[53,56,74] },
  Jankos:  { base:84, geral:58.0, playoff:[48,58,66] },
  Caps:    { base:84, geral:62.0, playoff:[37,64,60] },
  Perkz:   { base:84, geral:60.0, playoff:[40,60,59] },
  Mikyx:   { base:84, geral:60.0, playoff:[41,72,54] },
  // Invictus Gaming semi (base 81): SF1+QF1
  TheShy:  { base:81, geral:66.0, playoff:[51,77] },
  Ning:    { base:81, geral:52.0, playoff:[43,61] },
  Rookie:  { base:81, geral:64.0, playoff:[64,63] },
  JackeyLove:{ base:81, geral:58.0, playoff:[54,56] },
  Baolan:  { base:81, geral:52.0, playoff:[50,54] },
  // T1 semi (base 81): SF2+QF3. Faker ainda elite.
  Khan:    { base:81, geral:66.0, playoff:[66,73] },
  Clid:    { base:81, geral:62.0, playoff:[61,67] },
  Faker:   { base:81, geral:60.0, playoff:[58,58] },
  Teddy:   { base:81, geral:55.0, playoff:[53,55] },
  Effort:  { base:81, geral:58.0, playoff:[56,62] },
  // Griffin quartas (base 78): QF1. Chovy/Viper jovens.
  Sword:   { base:78, geral:48.0, playoff:[40] },
  Tarzan:  { base:78, geral:62.0, playoff:[64] },
  Chovy:   { base:78, geral:58.0, playoff:[57] },
  Viper:   { base:78, geral:60.0, playoff:[63] },
  Lehends: { base:78, geral:60.0, playoff:[68] },
  // Fnatic quartas (base 78): QF2 (perderam 1-3)
  Bwipo:   { base:78, geral:55.0, playoff:[55] },
  Broxah:  { base:78, geral:50.0, playoff:[47] },
  Nemesis: { base:78, geral:55.0, playoff:[59] },
  Rekkles: { base:78, geral:52.0, playoff:[46] },
  Hylissang:{ base:78, geral:55.0, playoff:[55] },
  // Splyce quartas (base 78): QF3 (perderam 1-3)
  Vizicsacsi:{ base:78, geral:50.0, playoff:[46] },
  Xerxe:   { base:78, geral:55.0, playoff:[56] },
  Humanoid:{ base:78, geral:55.0, playoff:[54] },
  Kobbe:   { base:78, geral:55.0, playoff:[58] },
  Tore:    { base:78, geral:58.0, playoff:[60] },
  // DAMWON quartas (base 78): QF4 (perderam 1-3). Estreia da futura campeã.
  Nuguri:  { base:78, geral:55.0, playoff:[52] },
  Canyon:  { base:78, geral:55.0, playoff:[52] },
  ShowMaker:{ base:78, geral:62.0, playoff:[62] },
  Nuclear: { base:78, geral:52.0, playoff:[50] },
  BeryL:   { base:78, geral:58.0, playoff:[61] },
});
