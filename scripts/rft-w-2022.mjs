import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2022 — MOTOR NOVO. ⚠ FASE DE GRUPOS (não suíça) — formato mais volátil.
// Bracket: F(T1-DRX) SF1(JDG-T1) SF2(GEN-DRX) QF1(JDG-RGE) QF2(T1-RNG) QF3(GEN-DWG) QF4(DRX-EDG)
// Colocações: DRX=1, T1=2, JDG/GEN=semi(3-4), RGE/RNG/DWG/EDG=quartas(5-8).
mergeWorlds("2022", {
  // DRX campeão. F vs T1(LCK-2), SF2 vs GEN(LCK-3), QF4 vs EDG(LPL-7).
  Kingen:  { base:86, geral:72.1, playoff:[[73,"LCK-2"],[63,"LCK-3"],[61,"LPL-7"]] , mvp:true },
  Pyosik:  { base:86, geral:78.7, playoff:[[61,"LCK-2"],[68,"LCK-3"],[60,"LPL-7"]] },
  Zeka:    { base:86, geral:71.3, playoff:[[66,"LCK-2"],[67,"LCK-3"],[65,"LPL-7"]] },
  Deft:    { base:86, geral:65.6, playoff:[[56,"LCK-2"],[60,"LCK-3"],[65,"LPL-7"]] },
  BeryL:   { base:86, geral:66.6, playoff:[[63,"LCK-2"],[64,"LCK-3"],[64,"LPL-7"]] },
  // T1 vice. F vs DRX(LCK-1), SF1 vs JDG(LPL-3), QF2 vs RNG(LPL-7).
  Zeus:    { base:84, geral:81.8, playoff:[[58,"LCK-1"],[71,"LPL-3"],[78,"LPL-7"]], vice:true },
  Oner:    { base:84, geral:66.6, playoff:[[60,"LCK-1"],[61,"LPL-3"],[73,"LPL-7"]], vice:true },
  Faker:   { base:84, geral:59.6, playoff:[[58,"LCK-1"],[72,"LPL-3"],[62,"LPL-7"]], vice:true },
  Gumayusi:{ base:84, geral:73.9, playoff:[[55,"LCK-1"],[80,"LPL-3"],[72,"LPL-7"]], vice:true },
  Keria:   { base:84, geral:76.4, playoff:[[63,"LCK-1"],[80,"LPL-3"],[73,"LPL-7"]], vice:true },
  // JDG semi. SF1 vs T1(LCK-2), QF1 vs RGE(LEC-7).
  369:   { base:81, geral:79.3, playoff:[[64,"LCK-2"],[78,"LEC-7"]] },
  Kanavi:  { base:81, geral:71.9, playoff:[[60,"LCK-2"],[82,"LEC-7"]] },
  YaGao:   { base:81, geral:61.6, playoff:[[51,"LCK-2"],[61,"LEC-7"]] },
  Hope:    { base:81, geral:64.8, playoff:[[48,"LCK-2"],[65,"LEC-7"]] },
  MISSING: { base:81, geral:70.9, playoff:[[54,"LCK-2"],[74,"LEC-7"]] },
  // GEN semi. SF2 vs DRX(LCK-1), QF3 vs DWG(LCK-7).
  Doran:   { base:81, geral:69.1, playoff:[[59,"LCK-1"],[59,"LCK-7"]] },
  Peanut:  { base:81, geral:78.5, playoff:[[53,"LCK-1"],[51,"LCK-7"]] },
  Chovy:   { base:81, geral:79.7, playoff:[[55,"LCK-1"],[68,"LCK-7"]] },
  Ruler:   { base:81, geral:72.3, playoff:[[64,"LCK-1"],[61,"LCK-7"]] },
  Lehends: { base:81, geral:74.8, playoff:[[55,"LCK-1"],[61,"LCK-7"]] },
  // Rogue quartas. QF1 vs JDG(LPL-3).
  Odoamne: { base:78, geral:63.8, playoff:[[47,"LPL-3"]] },
  Malrang: { base:78, geral:51.7, playoff:[[39,"LPL-3"]] },
  Larssen: { base:78, geral:69.9, playoff:[[73,"LPL-3"]] },
  Comp:    { base:78, geral:57.4, playoff:[[47,"LPL-3"]] },
  Trymbi:  { base:78, geral:56, playoff:[[48,"LPL-3"]] },
  // RNG quartas. QF2 vs T1(LCK-2).
  Breathe: { base:78, geral:66.3, playoff:[[54,"LCK-2"]] },
  Wei:     { base:78, geral:67, playoff:[[47,"LCK-2"]] },
  Xiaohu:  { base:78, geral:61.1, playoff:[[58,"LCK-2"]] },
  GALA:    { base:78, geral:73, playoff:[[50,"LCK-2"]] },
  Ming:    { base:78, geral:71.2, playoff:[[46,"LCK-2"]] },
  // DWG KIA quartas. QF3 vs GEN(LCK-3).
  Nuguri:  { base:78, geral:67.4, playoff:[[66,"LCK-3"]] },
  Canyon:  { base:78, geral:68.8, playoff:[[69,"LCK-3"]] },
  ShowMaker:{ base:78, geral:78.4, playoff:[[66,"LCK-3"]] },
  deokdam: { base:78, geral:71.5, playoff:[[56,"LCK-3"]] },
  Kellin:  { base:78, geral:73.2, playoff:[[63,"LCK-3"]] },
  // EDward Gaming quartas. QF4 vs DRX(LCK-1).
  Flandre: { base:78, geral:63.1, playoff:[[68,"LCK-1"]] },
  Jiejie:  { base:78, geral:72, playoff:[[59,"LCK-1"]] },
  Scout:   { base:78, geral:66.9, playoff:[[72,"LCK-1"]] },
  Viper:   { base:78, geral:70.3, playoff:[[58,"LCK-1"]] },
  Meiko:   { base:78, geral:76, playoff:[[56,"LCK-1"]] },
});
