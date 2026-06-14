import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2025 — MOTOR NOVO.
// Bracket: F(T1-KT) SF1(GEN-KT) SF2(T1-TES) QF1(GEN-HLE) QF2(KT-CFO) QF3(G2-TES) QF4(AL-T1)
// Colocações: T1=1, KT=2, TES/GEN=semi(3-4), AL/G2/HLE/CFO=quartas(5-8).
// Ligas: T1/KT/GEN/HLE=LCK, TES/AL=LPL, G2=LEC, CFO=LCP.
mergeWorlds("2025", {
  // T1 campeão. F vs KT(LCK-2), SF2 vs TES(LPL-3), QF4 vs AL(LPL-7). Gumayusi fMVP.
  Doran:   { base:86, geral:65.1, playoff:[[65,"LCK-2"],[78,"LPL-3"],[66,"LPL-7"]] },
  Oner:    { base:86, geral:63.5, playoff:[[64,"LCK-2"],[89,"LPL-3"],[65,"LPL-7"]] },
  Faker:   { base:86, geral:69, playoff:[[64,"LCK-2"],[81,"LPL-3"],[66,"LPL-7"]] },
  Gumayusi:{ base:86, geral:66.2, playoff:[[70,"LCK-2"],[79,"LPL-3"],[74,"LPL-7"]] , mvp:true },
  Keria:   { base:86, geral:68.7, playoff:[[71,"LCK-2"],[84,"LPL-3"],[73,"LPL-7"]] },
  // KT vice. F vs T1(LCK-1), SF1 vs GEN(LCK-3), QF2 vs CFO(LCP-7).
  PerfecT: { base:84, geral:71.9, playoff:[[63,"LCK-1"],[71,"LCK-3"],[80,"LCP-7"]], vice:true },
  Cuzz:    { base:84, geral:69.1, playoff:[[74,"LCK-1"],[76,"LCK-3"],[90,"LCP-7"]], vice:true },
  Bdd:     { base:84, geral:75.7, playoff:[[70,"LCK-1"],[78,"LCK-3"],[92,"LCP-7"]], vice:true },
  deokdam: { base:84, geral:71.9, playoff:[[58,"LCK-1"],[78,"LCK-3"],[84,"LCP-7"]], vice:true },
  Peter:   { base:84, geral:69.9, playoff:[[68,"LCK-1"],[75,"LCK-3"],[91,"LCP-7"]], vice:true },
  // TES semi. SF2 vs T1(LCK-1), QF3 vs G2(LEC-7).
  369:   { base:81, geral:69.9, playoff:[[56,"LCK-1"],[75,"LEC-7"]] },
  Kanavi:  { base:81, geral:72.7, playoff:[[40,"LCK-1"],[73,"LEC-7"]] },
  Creme:   { base:81, geral:68, playoff:[[49,"LCK-1"],[76,"LEC-7"]] },
  JackeyLove:{ base:81, geral:66.9, playoff:[[43,"LCK-1"],[74,"LEC-7"]] },
  Hang:    { base:81, geral:65.5, playoff:[[53,"LCK-1"],[75,"LEC-7"]] },
  // GEN semi. SF1 vs KT(LCK-2), QF1 vs HLE(LCK-7).
  Kiin:    { base:81, geral:70, playoff:[[57,"LCK-2"],[66,"LCK-7"]] },
  Canyon:  { base:81, geral:76.8, playoff:[[54,"LCK-2"],[73,"LCK-7"]] },
  Chovy:   { base:81, geral:81.5, playoff:[[54,"LCK-2"],[77,"LCK-7"]] },
  Ruler:   { base:81, geral:79.1, playoff:[[60,"LCK-2"],[62,"LCK-7"]] },
  Duro:    { base:81, geral:74.9, playoff:[[54,"LCK-2"],[70,"LCK-7"]] },
  // Anyone's Legend quartas. QF4 vs T1(LCK-1).
  Flandre: { base:78, geral:58, playoff:[[69,"LCK-1"]] },
  Tarzan:  { base:78, geral:78.1, playoff:[[66,"LCK-1"]] },
  Shanks:  { base:78, geral:79.5, playoff:[[64,"LCK-1"]] },
  Hope:    { base:78, geral:64.6, playoff:[[57,"LCK-1"]] },
  Kael:    { base:78, geral:80.8, playoff:[[72,"LCK-1"]] },
  // G2 Esports quartas. QF3 vs TES(LPL-3).
  BrokenBlade:{ base:78, geral:64.1, playoff:[[54,"LPL-3"]] },
  SkewMond:{ base:78, geral:67.8, playoff:[[60,"LPL-3"]] },
  Caps:    { base:78, geral:65.6, playoff:[[60,"LPL-3"]] },
  "Hans Sama":{ base:78, geral:70.1, playoff:[[53,"LPL-3"]] },
  Labrov:  { base:78, geral:73.1, playoff:[[53,"LPL-3"]] },
  // Hanwha Life quartas. QF1 vs GEN(LCK-3).
  Zeus:    { base:78, geral:78.8, playoff:[[66,"LCK-3"]] },
  Peanut:  { base:78, geral:70.3, playoff:[[61,"LCK-3"]] },
  Zeka:    { base:78, geral:68, playoff:[[56,"LCK-3"]] },
  Viper:   { base:78, geral:76.3, playoff:[[78,"LCK-3"]] },
  Delight: { base:78, geral:78.3, playoff:[[69,"LCK-3"]] },
  // CTBC Flying Oyster quartas. QF2 vs KT(LCK-2).
  Driver:  { base:78, geral:63.3, playoff:[[47,"LCK-2"]] },
  JunJia:  { base:78, geral:73.5, playoff:[[45,"LCK-2"]] },
  HongQ:   { base:78, geral:63.9, playoff:[[44,"LCK-2"]] },
  Doggo:   { base:78, geral:77.2, playoff:[[48,"LCK-2"]] },
  Kaiwing: { base:78, geral:74.1, playoff:[[51,"LCK-2"]] },
});
