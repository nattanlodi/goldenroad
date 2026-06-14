import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2021 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média dos avgRftRating das 53 partidas
// de grupo (event/worlds-2021); playoff = avgRftRating por série (7 séries main event).
// Bracket: F(EDG-DK) SF1(DK-T1) SF2(EDG-GEN) QF1(T1-HLE) QF2(EDG-RNG) QF3(DK-MAD) QF4(GEN-C9)
// Colocações: EDG=1, DK=2, GEN/T1=semi(3-4), RNG/C9/HLE/MAD=quartas(5-8).
// Ligas: EDG/RNG=LPL, DK/GEN/T1/HLE=LCK, C9=LCS, MAD=LEC. Scout = Finals MVP.
mergeWorlds("2021", {
  // EDG (LPL, campeão). F vs DK(LCK-2), SF2 vs GEN(LCK-3), QF2 vs RNG(LPL-7). Scout fMVP.
  Flandre:{ base:86, geral:73.8, playoff:[[70,"LCK-2"],[63,"LCK-3"],[66,"LPL-7"]] },
  Jiejie:{ base:86, geral:66.7, playoff:[[63,"LCK-2"],[57,"LCK-3"],[61,"LPL-7"]] },
  Scout:{ base:86, geral:68.8, playoff:[[58,"LCK-2"],[65,"LCK-3"],[64,"LPL-7"]], mvp:true },
  Viper:{ base:86, geral:53.9, playoff:[[51,"LCK-2"],[62,"LCK-3"],[54,"LPL-7"]] },
  Meiko:{ base:86, geral:64.8, playoff:[[63,"LCK-2"],[65,"LCK-3"],[71,"LPL-7"]] },
  // DK (LCK, vice). F vs EDG(LPL-1), SF1 vs T1(LCK-3), QF3 vs MAD(LEC-7).
  Khan:{ base:84, geral:85.3, playoff:[[57,"LPL-1"],[63,"LCK-3"],[73,"LEC-7"]], vice:true },
  Canyon:{ base:84, geral:65, playoff:[[53,"LPL-1"],[66,"LCK-3"],[75,"LEC-7"]], vice:true },
  ShowMaker:{ base:84, geral:69.5, playoff:[[65,"LPL-1"],[72,"LCK-3"],[67,"LEC-7"]], vice:true },
  Ghost:{ base:84, geral:54.1, playoff:[[51,"LPL-1"],[55,"LCK-3"],[64,"LEC-7"]], vice:true },
  BeryL:{ base:84, geral:66.2, playoff:[[60,"LPL-1"],[70,"LCK-3"],[76,"LEC-7"]], vice:true },
  // GEN (LCK, semi). SF2 vs EDG(LPL-1), QF4 vs C9(LCS-7).
  Rascal:{ base:81, geral:64.8, playoff:[[58,"LPL-1"],[74,"LCS-7"]] },
  Clid:{ base:81, geral:56.4, playoff:[[54,"LPL-1"],[73,"LCS-7"]] },
  Bdd:{ base:81, geral:68.8, playoff:[[64,"LPL-1"],[75,"LCS-7"]] },
  Ruler:{ base:81, geral:59, playoff:[[49,"LPL-1"],[67,"LCS-7"]] },
  Life:{ base:81, geral:61.3, playoff:[[62,"LPL-1"],[80,"LCS-7"]] },
  // T1 (LCK, semi). SF1 vs DK(LCK-2), QF1 vs HLE(LCK-7).
  Canna:{ base:81, geral:78.9, playoff:[[57,"LCK-2"],[76,"LCK-7"]] },
  Oner:{ base:81, geral:71.3, playoff:[[51,"LCK-2"],[76,"LCK-7"]] },
  Faker:{ base:81, geral:64.5, playoff:[[51,"LCK-2"],[67,"LCK-7"]] },
  Gumayusi:{ base:81, geral:59.4, playoff:[[49,"LCK-2"],[76,"LCK-7"]] },
  Keria:{ base:81, geral:70.3, playoff:[[52,"LCK-2"],[75,"LCK-7"]] },
  // RNG (LPL, quartas). QF2 vs EDG(LPL-1).
  Xiaohu:{ base:78, geral:74.8, playoff:[[68,"LPL-1"]] },
  Wei:{ base:78, geral:61.4, playoff:[[55,"LPL-1"]] },
  Cryin:{ base:78, geral:61.8, playoff:[[56,"LPL-1"]] },
  GALA:{ base:78, geral:58.6, playoff:[[47,"LPL-1"]] },
  Ming:{ base:78, geral:63.4, playoff:[[59,"LPL-1"]] },
  // C9 (LCS, quartas). QF4 vs GEN(LCK-3).
  Fudge:{ base:78, geral:62.1, playoff:[[49,"LCK-3"]] },
  Blaber:{ base:78, geral:67.6, playoff:[[53,"LCK-3"]] },
  Perkz:{ base:78, geral:70.8, playoff:[[47,"LCK-3"]] },
  Zven:{ base:78, geral:53.6, playoff:[[37,"LCK-3"]] },
  Vulcan:{ base:78, geral:67.9, playoff:[[43,"LCK-3"]] },
  // HLE (LCK, quartas). QF1 vs T1(LCK-3).
  Morgan:{ base:78, geral:61.2, playoff:[[51,"LCK-3"]] },
  Willer:{ base:78, geral:66.4, playoff:[[36,"LCK-3"]] },
  Chovy:{ base:78, geral:82.3, playoff:[[56,"LCK-3"]] },
  Deft:{ base:78, geral:63.5, playoff:[[44,"LCK-3"]] },
  Vsta:{ base:78, geral:69.6, playoff:[[41,"LCK-3"]] },
  // MAD (LEC, quartas). QF3 vs DK(LCK-2).
  Armut:{ base:78, geral:60.7, playoff:[[52,"LCK-2"]] },
  Elyoya:{ base:78, geral:59, playoff:[[49,"LCK-2"]] },
  Humanoid:{ base:78, geral:64.5, playoff:[[56,"LCK-2"]] },
  Carzzy:{ base:78, geral:52.2, playoff:[[41,"LCK-2"]] },
  Kaiser:{ base:78, geral:63.2, playoff:[[61,"LCK-2"]] },
});
