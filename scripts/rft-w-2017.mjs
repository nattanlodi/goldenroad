import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2017 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das 50 partidas de
// grupo (event/worlds-2017, ids 24695-24745); playoff = avgRftRating por série (ids 24746-24752).
// Bracket: F(SKT-SSG) SF1(SKT-RNG) SF2(SSG-WE) QF1(LZ-SSG) QF2(SKT-MSF) QF3(RNG-FNC) QF4(WE-C9)
// Colocações: SSG=1, SKT=2, RNG/WE=semi(3-4), LZ/MSF/FNC/C9=quartas(5-8).
// Ligas: SSG/SKT/LZ=LCK, RNG/WE=LPL, MSF/FNC=LEC, C9=LCS. Ambition = Finals MVP.
// ⚠ SKT rodiziou jng (Peanut titular do card, n=4 grupos; Blank n=2). Faker grupos fortes (70.1).
mergeWorlds("2017", {
  // SSG (LCK, campeão). F vs SKT(LCK-2), SF2 vs WE(LPL-3), QF1 vs LZ(LCK-7). Ambition fMVP.
  CuVee:{ base:86, geral:69, playoff:[[70,"LCK-2"],[63,"LPL-3"],[81,"LCK-7"]] },
  Ambition:{ base:86, geral:55.5, playoff:[[69,"LCK-2"],[52,"LPL-3"],[70,"LCK-7"]], mvp:true },
  Crown:{ base:86, geral:62, playoff:[[63,"LCK-2"],[63,"LPL-3"],[73,"LCK-7"]] },
  Ruler:{ base:86, geral:58.4, playoff:[[70,"LCK-2"],[59,"LPL-3"],[71,"LCK-7"]] },
  CoreJJ:{ base:86, geral:58.6, playoff:[[70,"LCK-2"],[65,"LPL-3"],[74,"LCK-7"]] },
  // SKT (LCK, vice). F vs SSG(LCK-1), SF1 vs RNG(LPL-3), QF2 vs MSF(LEC-7).
  Huni:{ base:84, geral:71, playoff:[[65,"LCK-1"],[64,"LPL-3"],[65,"LEC-7"]], vice:true },
  Peanut:{ base:84, geral:48.4, playoff:[[42,"LCK-1"],[57,"LPL-3"],[55,"LEC-7"]], vice:true },
  Faker:{ base:84, geral:70.1, playoff:[[64,"LCK-1"],[60,"LPL-3"],[71,"LEC-7"]], vice:true },
  Bang:{ base:84, geral:61.3, playoff:[[46,"LCK-1"],[57,"LPL-3"],[58,"LEC-7"]], vice:true },
  Wolf:{ base:84, geral:62.6, playoff:[[46,"LCK-1"],[56,"LPL-3"],[58,"LEC-7"]], vice:true },
  // RNG (LPL, semi). SF1 vs SKT(LCK-2), QF3 vs FNC(LEC-7).
  Letme:{ base:81, geral:62.5, playoff:[[57,"LCK-2"],[65,"LEC-7"]] },
  Mlxg:{ base:81, geral:60.1, playoff:[[61,"LCK-2"],[59,"LEC-7"]] },
  Xiaohu:{ base:81, geral:64.7, playoff:[[67,"LCK-2"],[74,"LEC-7"]] },
  Uzi:{ base:81, geral:73.2, playoff:[[56,"LCK-2"],[77,"LEC-7"]] },
  Ming:{ base:81, geral:69, playoff:[[60,"LCK-2"],[65,"LEC-7"]] },
  // WE (LPL, semi). SF2 vs SSG(LCK-1), QF4 vs C9(LCS-7).
  "957":{ base:81, geral:66.1, playoff:[[60,"LCK-1"],[57,"LCS-7"]] },
  Condi:{ base:81, geral:60.8, playoff:[[59,"LCK-1"],[46,"LCS-7"]] },
  xiye:{ base:81, geral:71.7, playoff:[[65,"LCK-1"],[64,"LCS-7"]] },
  Mystic:{ base:81, geral:74.5, playoff:[[55,"LCK-1"],[58,"LCS-7"]] },
  Ben:{ base:81, geral:68.9, playoff:[[54,"LCK-1"],[53,"LCS-7"]] },
  // LZ (LCK, quartas). QF1 vs SSG(LCK-1). Khan dominou os grupos (78.5, maior do torneio).
  Khan:{ base:78, geral:78.5, playoff:[[49,"LCK-1"]] },
  Cuzz:{ base:78, geral:64, playoff:[[37,"LCK-1"]] },
  Bdd:{ base:78, geral:76.6, playoff:[[62,"LCK-1"]] },
  PraY:{ base:78, geral:72.3, playoff:[[44,"LCK-1"]] },
  GorillA:{ base:78, geral:74.4, playoff:[[47,"LCK-1"]] },
  // MSF (LEC, quartas). QF2 vs SKT(LCK-2). Levaram a SKT ao game 5.
  Alphari:{ base:78, geral:60, playoff:[[59,"LCK-2"]] },
  Maxlore:{ base:78, geral:60.6, playoff:[[55,"LCK-2"]] },
  PowerOfEvil:{ base:78, geral:68.9, playoff:[[54,"LCK-2"]] },
  "Hans Sama":{ base:78, geral:63.3, playoff:[[60,"LCK-2"]] },
  Ignar:{ base:78, geral:66.1, playoff:[[62,"LCK-2"]] },
  // FNC (LEC, quartas). QF3 vs RNG(LPL-3).
  sOAZ:{ base:78, geral:51.3, playoff:[[50,"LPL-3"]] },
  Broxah:{ base:78, geral:58.2, playoff:[[55,"LPL-3"]] },
  Caps:{ base:78, geral:67.9, playoff:[[57,"LPL-3"]] },
  Rekkles:{ base:78, geral:60.2, playoff:[[66,"LPL-3"]] },
  Jesiz:{ base:78, geral:63.5, playoff:[[53,"LPL-3"]] },
  // C9 (LCS, quartas). QF4 vs WE(LPL-3). Jogaram bem (2-3).
  Impact:{ base:78, geral:62.8, playoff:[[67,"LPL-3"]] },
  Contractz:{ base:78, geral:57, playoff:[[66,"LPL-3"]] },
  Jensen:{ base:78, geral:65.8, playoff:[[71,"LPL-3"]] },
  Sneaky:{ base:78, geral:55.9, playoff:[[69,"LPL-3"]] },
  Smoothie:{ base:78, geral:56.3, playoff:[[71,"LPL-3"]] },
});
