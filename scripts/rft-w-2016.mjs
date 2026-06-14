import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2016 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das 49 partidas de
// grupo (event/worlds-2016, ids 22352-22401, slug `...day-N-M`); playoff = avgRftRating por série (22402-22408).
// Bracket: F(SKT-SSG) SF1(SKT-ROX) SF2(SSG-H2K) QF1(SSG-C9) QF2(SKT-RNG) QF3(ROX-EDG) QF4(H2K-ANX)
// Colocações: SKT=1, SSG=2, ROX/H2K=semi(3-4), EDG/RNG/C9/ANX=quartas(5-8).
// Ligas: SKT/SSG/ROX=LCK, EDG/RNG=LPL, H2K=LEC, C9=LCS, ANX(Albus NoX)=wildcard. Faker = Finals MVP.
// ⚠ rft.gg: Mann=ClearLove(jng EDG), aMiracle=Onesh0tiq. Koro1(top EDG) jogou SÓ playoff
// (Mouse jogou os grupos) → geral do Koro1 = geral de grupos do Mouse (49.5). SKT rodiziou jng (Bengi n=2/Blank n=4 nos grupos).
mergeWorlds("2016", {
  // SKT (LCK, campeão). F vs SSG(LCK-2), SF1 vs ROX(LCK-3), QF2 vs RNG(LPL-7). Faker fMVP (tri-campeão).
  Duke:{ base:86, geral:69.5, playoff:[[66,"LCK-2"],[64,"LCK-3"],[60,"LPL-7"]] },
  Bengi:{ base:86, geral:65.2, playoff:[[66,"LCK-2"],[62,"LCK-3"],[48,"LPL-7"]] },
  Faker:{ base:86, geral:72.5, playoff:[[73,"LCK-2"],[73,"LCK-3"],[73,"LPL-7"]], mvp:true },
  Bang:{ base:86, geral:68.1, playoff:[[63,"LCK-2"],[51,"LCK-3"],[64,"LPL-7"]] },
  Wolf:{ base:86, geral:66.4, playoff:[[65,"LCK-2"],[56,"LCK-3"],[63,"LPL-7"]] },
  // SSG (LCK, vice). F vs SKT(LCK-1), SF2 vs H2K(LEC-3), QF1 vs C9(LCS-7).
  CuVee:{ base:84, geral:69, playoff:[[56,"LCK-1"],[65,"LEC-3"],[69,"LCS-7"]], vice:true },
  Ambition:{ base:84, geral:65.7, playoff:[[49,"LCK-1"],[65,"LEC-3"],[62,"LCS-7"]], vice:true },
  Crown:{ base:84, geral:71.5, playoff:[[55,"LCK-1"],[84,"LEC-3"],[68,"LCS-7"]], vice:true },
  Ruler:{ base:84, geral:55.1, playoff:[[55,"LCK-1"],[49,"LEC-3"],[66,"LCS-7"]], vice:true },
  CoreJJ:{ base:84, geral:68.2, playoff:[[52,"LCK-1"],[49,"LEC-3"],[71,"LCS-7"]], vice:true },
  // ROX (LCK, semi). SF1 vs SKT(LCK-1), QF3 vs EDG(LPL-7). O lendário ROX.
  Smeb:{ base:81, geral:65.1, playoff:[[64,"LCK-1"],[69,"LPL-7"]] },
  Peanut:{ base:81, geral:63.4, playoff:[[52,"LCK-1"],[70,"LPL-7"]] },
  Kuro:{ base:81, geral:65.1, playoff:[[54,"LCK-1"],[71,"LPL-7"]] },
  PraY:{ base:81, geral:64.4, playoff:[[52,"LCK-1"],[57,"LPL-7"]] },
  GorillA:{ base:81, geral:66.7, playoff:[[54,"LCK-1"],[67,"LPL-7"]] },
  // H2K (LEC, semi). SF2 vs SSG(LCK-2), QF4 vs ANX(wild-7). Odoamne 90 na QF.
  Odoamne:{ base:81, geral:70, playoff:[[61,"LCK-2"],[90,"wild-7"]] },
  Jankos:{ base:81, geral:57.4, playoff:[[51,"LCK-2"],[74,"wild-7"]] },
  Ryu:{ base:81, geral:69.4, playoff:[[36,"LCK-2"],[80,"wild-7"]] },
  FORG1VEN:{ base:81, geral:59.6, playoff:[[55,"LCK-2"],[62,"wild-7"]] },
  Vander:{ base:81, geral:64.9, playoff:[[56,"LCK-2"],[69,"wild-7"]] },
  // EDG (LPL, quartas). QF3 vs ROX(LCK-3). Koro1 jogou só playoff (Mouse jogou grupos).
  Koro1:{ base:78, geral:49.5, playoff:[[49,"LCK-3"]] },
  Clearlove:{ base:78, geral:61.3, playoff:[[37,"LCK-3"]] },
  Scout:{ base:78, geral:72, playoff:[[51,"LCK-3"]] },
  Deft:{ base:78, geral:59.7, playoff:[[50,"LCK-3"]] },
  Meiko:{ base:78, geral:60.9, playoff:[[48,"LCK-3"]] },
  // RNG (LPL, quartas). QF2 vs SKT(LCK-1). Uzi/Mata.
  Looper:{ base:78, geral:54.6, playoff:[[63,"LCK-1"]] },
  Mlxg:{ base:78, geral:54.5, playoff:[[43,"LCK-1"]] },
  Xiaohu:{ base:78, geral:51.7, playoff:[[55,"LCK-1"]] },
  Uzi:{ base:78, geral:61.3, playoff:[[48,"LCK-1"]] },
  Mata:{ base:78, geral:62.6, playoff:[[49,"LCK-1"]] },
  // C9 (LCS, quartas). QF1 vs SSG(LCK-2).
  Impact:{ base:78, geral:64.6, playoff:[[54,"LCK-2"]] },
  Meteos:{ base:78, geral:54.8, playoff:[[48,"LCK-2"]] },
  Jensen:{ base:78, geral:62.9, playoff:[[65,"LCK-2"]] },
  Sneaky:{ base:78, geral:54, playoff:[[38,"LCK-2"]] },
  Smoothie:{ base:78, geral:50.3, playoff:[[43,"LCK-2"]] },
  // ANX (wild, quartas). QF4 vs H2K(LEC-3). Heróis dos grupos (CIS), varridos na QF.
  Smurf:{ base:78, geral:58.4, playoff:[[33,"LEC-3"]] },
  PvPStejos:{ base:78, geral:55.9, playoff:[[28,"LEC-3"]] },
  Kira:{ base:78, geral:62.4, playoff:[[42,"LEC-3"]] },
  aMiracle:{ base:78, geral:42.1, playoff:[[41,"LEC-3"]] },
  Likkrit:{ base:78, geral:51.6, playoff:[[45,"LEC-3"]] },
});
