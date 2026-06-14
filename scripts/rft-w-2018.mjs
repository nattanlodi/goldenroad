import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2018 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das 50 partidas de
// grupo (event/worlds-2018, ids 27246-27296); playoff = avgRftRating por série (ids 27297-27303).
// Bracket: F(IG-FNC) SF1(G2-IG) SF2(FNC-C9) QF1(IG-KT) QF2(G2-RNG) QF3(AF-C9) QF4(FNC-EDG)
// Colocações: IG=1, FNC=2, C9/G2=semi(3-4), AF/EDG/RNG/KT=quartas(5-8).
// Ligas: IG/RNG/EDG=LPL, FNC/G2=LEC, C9=LCS, AF/KT=LCK. Ning = Finals MVP. (Afreeca = "SOOPers" no rft.gg.)
mergeWorlds("2018", {
  // IG (LPL, campeão). F vs FNC(LEC-2), SF1 vs G2(LEC-3), QF1 vs KT(LCK-7). Ning fMVP.
  TheShy:{ base:86, geral:63.8, playoff:[[80,"LEC-2"],[76,"LEC-3"],[72,"LCK-7"]] },
  Ning:{ base:86, geral:64.3, playoff:[[76,"LEC-2"],[66,"LEC-3"],[65,"LCK-7"]], mvp:true },
  Rookie:{ base:86, geral:75.5, playoff:[[85,"LEC-2"],[76,"LEC-3"],[75,"LCK-7"]] },
  JackeyLove:{ base:86, geral:61.5, playoff:[[76,"LEC-2"],[60,"LEC-3"],[61,"LCK-7"]] },
  Baolan:{ base:86, geral:68, playoff:[[85,"LEC-2"],[68,"LEC-3"],[66,"LCK-7"]] },
  // FNC (LEC, vice). F vs IG(LPL-1), SF2 vs C9(LCS-3), QF4 vs EDG(LPL-7).
  Bwipo:{ base:84, geral:67.7, playoff:[[38,"LPL-1"],[86,"LCS-3"],[63,"LPL-7"]], vice:true },
  Broxah:{ base:84, geral:76.2, playoff:[[51,"LPL-1"],[77,"LCS-3"],[63,"LPL-7"]], vice:true },
  Caps:{ base:84, geral:70.6, playoff:[[40,"LPL-1"],[77,"LCS-3"],[53,"LPL-7"]], vice:true },
  Rekkles:{ base:84, geral:69.6, playoff:[[47,"LPL-1"],[69,"LCS-3"],[58,"LPL-7"]], vice:true },
  Hylissang:{ base:84, geral:74.5, playoff:[[41,"LPL-1"],[75,"LCS-3"],[57,"LPL-7"]], vice:true },
  // C9 (LCS, semi). SF2 vs FNC(LEC-2), QF3 vs AF(LCK-7).
  Licorice:{ base:81, geral:65.8, playoff:[[36,"LEC-2"],[49,"LCK-7"]] },
  Svenskeren:{ base:81, geral:61.9, playoff:[[42,"LEC-2"],[79,"LCK-7"]] },
  Jensen:{ base:81, geral:70, playoff:[[48,"LEC-2"],[76,"LCK-7"]] },
  Sneaky:{ base:81, geral:49.7, playoff:[[44,"LEC-2"],[67,"LCK-7"]] },
  Zeyzal:{ base:81, geral:59.3, playoff:[[51,"LEC-2"],[65,"LCK-7"]] },
  // G2 (LEC, semi). SF1 vs IG(LPL-1), QF2 vs RNG(LPL-7).
  Wunder:{ base:81, geral:65.2, playoff:[[49,"LPL-1"],[66,"LPL-7"]] },
  Jankos:{ base:81, geral:55, playoff:[[47,"LPL-1"],[65,"LPL-7"]] },
  Perkz:{ base:81, geral:69.8, playoff:[[51,"LPL-1"],[79,"LPL-7"]] },
  Hjarnan:{ base:81, geral:58.3, playoff:[[49,"LPL-1"],[58,"LPL-7"]] },
  Wadid:{ base:81, geral:59, playoff:[[57,"LPL-1"],[67,"LPL-7"]] },
  // AF (LCK, quartas). QF3 vs C9(LCS-3).
  Kiin:{ base:78, geral:68.4, playoff:[[72,"LCS-3"]] },
  Spirit:{ base:78, geral:63.5, playoff:[[45,"LCS-3"]] },
  Kuro:{ base:78, geral:64.5, playoff:[[46,"LCS-3"]] },
  Kramer:{ base:78, geral:59.9, playoff:[[44,"LCS-3"]] },
  TusiN:{ base:78, geral:61.8, playoff:[[57,"LCS-3"]] },
  // EDG (LPL, quartas). QF4 vs FNC(LEC-2).
  Ray:{ base:78, geral:63.8, playoff:[[50,"LEC-2"]] },
  Haro:{ base:78, geral:55.5, playoff:[[55,"LEC-2"]] },
  Scout:{ base:78, geral:65.3, playoff:[[66,"LEC-2"]] },
  iBoy:{ base:78, geral:62.6, playoff:[[58,"LEC-2"]] },
  Meiko:{ base:78, geral:61.8, playoff:[[61,"LEC-2"]] },
  // RNG (LPL, quartas). QF2 vs G2(LEC-3). A maior zebra (Uzi favorito caiu).
  Letme:{ base:78, geral:62, playoff:[[53,"LEC-3"]] },
  Mlxg:{ base:78, geral:61.5, playoff:[[39,"LEC-3"]] },
  Xiaohu:{ base:78, geral:63, playoff:[[48,"LEC-3"]] },
  Uzi:{ base:78, geral:65.7, playoff:[[57,"LEC-3"]] },
  Ming:{ base:78, geral:63.9, playoff:[[50,"LEC-3"]] },
  // KT (LCK, quartas). QF1 vs IG(LPL-1).
  Smeb:{ base:78, geral:62.3, playoff:[[61,"LPL-1"]] },
  Score:{ base:78, geral:69.9, playoff:[[58,"LPL-1"]] },
  Ucal:{ base:78, geral:71.8, playoff:[[45,"LPL-1"]] },
  Deft:{ base:78, geral:72.9, playoff:[[55,"LPL-1"]] },
  Mata:{ base:78, geral:78.3, playoff:[[52,"LPL-1"]] },
});
