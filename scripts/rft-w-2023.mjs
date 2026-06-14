import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2023 — MOTOR NOVO.
// Bracket: F(WBG-T1) SF1(BLG-WBG) SF2(JDG-T1) QF1(NRG-WBG) QF2(GEN-BLG) QF3(JDG-KT) QF4(LNG-T1)
// Colocações: T1=1, WBG=2, BLG/JDG=semi(3-4), NRG/GEN/KT/LNG=quartas(5-8).
mergeWorlds("2023", {
  // T1 campeão. F vs WBG(LPL-2), SF2 vs JDG(LPL-3), QF4 vs LNG(LPL-7). Zeus fMVP.
  Zeus:    { base:86, geral:77.4, playoff:[[95,"LPL-2"],[70,"LPL-3"],[86,"LPL-7"]] , mvp:true },
  Oner:    { base:86, geral:70.8, playoff:[[81,"LPL-2"],[59,"LPL-3"],[73,"LPL-7"]] },
  Faker:   { base:86, geral:69.4, playoff:[[68,"LPL-2"],[69,"LPL-3"],[69,"LPL-7"]] },
  Gumayusi:{ base:86, geral:65.3, playoff:[[66,"LPL-2"],[64,"LPL-3"],[62,"LPL-7"]] },
  Keria:   { base:86, geral:71.2, playoff:[[78,"LPL-2"],[77,"LPL-3"],[66,"LPL-7"]] },
  // WBG vice. F vs T1(LCK-1), SF1 vs BLG(LPL-3), QF1 vs NRG(LCS-7).
  TheShy:  { base:84, geral:73.3, playoff:[[39,"LCK-1"],[77,"LPL-3"],[82,"LCS-7"]], vice:true },
  Weiwei:  { base:84, geral:60.6, playoff:[[50,"LCK-1"],[53,"LPL-3"],[67,"LCS-7"]], vice:true },
  Xiaohu:  { base:84, geral:69.1, playoff:[[50,"LCK-1"],[65,"LPL-3"],[80,"LCS-7"]], vice:true },
  Light:   { base:84, geral:73.9, playoff:[[39,"LCK-1"],[54,"LPL-3"],[84,"LCS-7"]], vice:true },
  Crisp:   { base:84, geral:70.9, playoff:[[41,"LCK-1"],[60,"LPL-3"],[92,"LCS-7"]], vice:true },
  // BLG semi. SF1 vs WBG(LPL-2), QF2 vs GEN(LCK-7).
  Bin:     { base:81, geral:66.6, playoff:[[47,"LPL-2"],[69,"LCK-7"]] },
  Xun:     { base:81, geral:59.4, playoff:[[62,"LPL-2"],[75,"LCK-7"]] },
  YaGao:   { base:81, geral:60.7, playoff:[[68,"LPL-2"],[65,"LCK-7"]] },
  Elk:     { base:81, geral:64.6, playoff:[[64,"LPL-2"],[69,"LCK-7"]] },
  ON:      { base:81, geral:60.5, playoff:[[70,"LPL-2"],[74,"LCK-7"]] },
  // JDG semi. SF2 vs T1(LCK-1), QF3 vs KT(LCK-7).
  369:   { base:81, geral:71.8, playoff:[[55,"LCK-1"],[65,"LCK-7"]] },
  Kanavi:  { base:81, geral:72.5, playoff:[[55,"LCK-1"],[67,"LCK-7"]] },
  Knight:  { base:81, geral:74.4, playoff:[[59,"LCK-1"],[61,"LCK-7"]] },
  Ruler:   { base:81, geral:74.5, playoff:[[59,"LCK-1"],[70,"LCK-7"]] },
  MISSING: { base:81, geral:73.3, playoff:[[60,"LCK-1"],[67,"LCK-7"]] },
  // NRG quartas. QF1 vs WBG(LPL-2).
  Dhokla:  { base:78, geral:65.3, playoff:[[52,"LPL-2"]] },
  Contractz:{ base:78, geral:63.9, playoff:[[47,"LPL-2"]] },
  Palafox: { base:78, geral:68.8, playoff:[[48,"LPL-2"]] },
  FBI:     { base:78, geral:53.8, playoff:[[40,"LPL-2"]] },
  IgNar:   { base:78, geral:66.6, playoff:[[40,"LPL-2"]] },
  // Gen.G quartas. QF2 vs BLG(LPL-3).
  Doran:   { base:78, geral:82.1, playoff:[[57,"LPL-3"]] },
  Peanut:  { base:78, geral:80.8, playoff:[[53,"LPL-3"]] },
  Chovy:   { base:78, geral:81, playoff:[[59,"LPL-3"]] },
  Peyz:    { base:78, geral:71.8, playoff:[[56,"LPL-3"]] },
  Delight: { base:78, geral:80, playoff:[[56,"LPL-3"]] },
  // KT Rolster quartas. QF3 vs JDG(LPL-3).
  Kiin:    { base:78, geral:67.8, playoff:[[61,"LPL-3"]] },
  Cuzz:    { base:78, geral:67.5, playoff:[[52,"LPL-3"]] },
  Bdd:     { base:78, geral:65.8, playoff:[[64,"LPL-3"]] },
  Aiming:  { base:78, geral:77.5, playoff:[[57,"LPL-3"]] },
  Lehends: { base:78, geral:69.6, playoff:[[52,"LPL-3"]] },
  // LNG quartas. QF4 vs T1(LCK-1).
  Zika:    { base:78, geral:63.5, playoff:[[49,"LCK-1"]] },
  Tarzan:  { base:78, geral:71.6, playoff:[[40,"LCK-1"]] },
  Scout:   { base:78, geral:77.9, playoff:[[52,"LCK-1"]] },
  GALA:    { base:78, geral:64.5, playoff:[[42,"LCK-1"]] },
  Hang:    { base:78, geral:67.5, playoff:[[49,"LCK-1"]] },
});
