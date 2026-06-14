import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2024 — MOTOR NOVO (força do oponente). Ratings de rft-2024.mjs; cada série recebe a
// tag "LIGA-COLOC" do oponente (colocação final dele no torneio).
// Bracket: F(BLG-T1) SF1(WBG-BLG) SF2(T1-GEN) QF1(LNG-WBG) QF2(HLE-BLG) QF3(TES-T1) QF4(GEN-FLY)
// Colocações: T1=1, BLG=2, WBG/GEN=semi(3-4), LNG/HLE/TES/FLY=quartas(5-8).
mergeWorlds("2024", {
  // T1 campeão. F vs BLG(LPL-2), SF2 vs GEN(LCK-3), QF3 vs TES(LPL-7).
  Zeus:    { base:86, geral:81.8, playoff:[[66,"LPL-2"],[65,"LCK-3"],[79,"LPL-7"]] },
  Oner:    { base:86, geral:78.5, playoff:[[66,"LPL-2"],[71,"LCK-3"],[71,"LPL-7"]] },
  Faker:   { base:86, geral:71, playoff:[[60,"LPL-2"],[63,"LCK-3"],[78,"LPL-7"]] , mvp:true },
  Gumayusi:{ base:86, geral:70.7, playoff:[[62,"LPL-2"],[67,"LCK-3"],[82,"LPL-7"]] },
  Keria:   { base:86, geral:79.3, playoff:[[61,"LPL-2"],[67,"LCK-3"],[86,"LPL-7"]] },
  // BLG vice. F vs T1(LCK-1), SF1 vs WBG(LPL-3), QF2 vs HLE(LCK-7).
  Bin:     { base:84, geral:64.8, playoff:[[63,"LCK-1"],[68,"LPL-3"],[75,"LCK-7"]], vice:true },
  Xun:     { base:84, geral:67.7, playoff:[[59,"LCK-1"],[69,"LPL-3"],[74,"LCK-7"]], vice:true },
  Knight:  { base:84, geral:73.5, playoff:[[70,"LCK-1"],[84,"LPL-3"],[66,"LCK-7"]], vice:true },
  Elk:     { base:84, geral:68.5, playoff:[[57,"LCK-1"],[75,"LPL-3"],[66,"LCK-7"]], vice:true },
  ON:      { base:84, geral:62.4, playoff:[[64,"LCK-1"],[70,"LPL-3"],[66,"LCK-7"]], vice:true },
  // WBG semi. SF1 vs BLG(LPL-2), QF1 vs LNG(LPL-7).
  Breathe: { base:81, geral:70.9, playoff:[[55,"LPL-2"],[73,"LPL-7"]] },
  Tarzan:  { base:81, geral:61.1, playoff:[[58,"LPL-2"],[57,"LPL-7"]] },
  Xiaohu:  { base:81, geral:66, playoff:[[52,"LPL-2"],[75,"LPL-7"]] },
  Light:   { base:81, geral:67.8, playoff:[[54,"LPL-2"],[68,"LPL-7"]] },
  Crisp:   { base:81, geral:65.3, playoff:[[56,"LPL-2"],[78,"LPL-7"]] },
  // GEN semi. SF2 vs T1(LCK-1), QF4 vs FLY(LCS-7).
  Kiin:    { base:81, geral:61.9, playoff:[[61,"LCK-1"],[74,"LCS-7"]] },
  Canyon:  { base:81, geral:64.5, playoff:[[57,"LCK-1"],[69,"LCS-7"]] },
  Chovy:   { base:81, geral:76.9, playoff:[[66,"LCK-1"],[71,"LCS-7"]] },
  Peyz:    { base:81, geral:77.5, playoff:[[64,"LCK-1"],[66,"LCS-7"]] },
  Lehends: { base:81, geral:80.8, playoff:[[59,"LCK-1"],[58,"LCS-7"]] },
  // LNG quartas. QF1 vs WBG(LPL-3).
  Zika:    { base:78, geral:80.7, playoff:[[64,"LPL-3"]] },
  Weiwei:  { base:78, geral:75.4, playoff:[[57,"LPL-3"]] },
  Scout:   { base:78, geral:73.2, playoff:[[61,"LPL-3"]] },
  GALA:    { base:78, geral:73.3, playoff:[[64,"LPL-3"]] },
  Hang:    { base:78, geral:82.3, playoff:[[60,"LPL-3"]] },
  // HLE quartas. QF2 vs BLG(LPL-2).
  Doran:   { base:78, geral:67.3, playoff:[[54,"LPL-2"]] },
  Peanut:  { base:78, geral:63.7, playoff:[[55,"LPL-2"]] },
  Zeka:    { base:78, geral:74.1, playoff:[[63,"LPL-2"]] },
  Viper:   { base:78, geral:71.8, playoff:[[70,"LPL-2"]] },
  Delight: { base:78, geral:71, playoff:[[68,"LPL-2"]] },
  // TES quartas. QF3 vs T1(LCK-1).
  369:   { base:78, geral:73.4, playoff:[[50,"LCK-1"]] },
  Tian:    { base:78, geral:68.7, playoff:[[47,"LCK-1"]] },
  Creme:   { base:78, geral:72.9, playoff:[[40,"LCK-1"]] },
  JackeyLove:{ base:78, geral:67.1, playoff:[[47,"LCK-1"]] },
  Meiko:   { base:78, geral:73.4, playoff:[[44,"LCK-1"]] },
  // FLY quartas. QF4 vs GEN(LCK-3).
  Bwipo:   { base:78, geral:65.4, playoff:[[56,"LCK-3"]] },
  Inspired:{ base:78, geral:64.6, playoff:[[65,"LCK-3"]] },
  Quad:    { base:78, geral:68.9, playoff:[[65,"LCK-3"]] },
  Massu:   { base:78, geral:67.2, playoff:[[61,"LCK-3"]] },
  Busio:   { base:78, geral:67.4, playoff:[[58,"LCK-3"]] },
});
