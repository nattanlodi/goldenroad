import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2013 — Season 3 World Championship (motor novo, força do oponente + geral REAL dos grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das partidas de grupo
// (slug `season-3-world-championship-day-N-M`, ids 18300-18340); playoff = avgRftRating por série (18341-18347).
// ⚠ FORMATO ESPECIAL 2013: 10 times jogaram a fase de grupos (2 grupos de 5); só SKT/OMG/Fnatic/Gambit
// avançaram. Os outros 4 do mata-mata (Royal Club, NaJin Black Sword, Cloud9, Gamania Bears) entraram
// DIRETO nos playoffs (seeds regionais) e NÃO têm fase de grupos no rft.gg → SEM `geral` (motor pondera
// 100% playoff pra eles). Bracket: F(SKT-Royal) SF1(SKT-NaJin) SF2(Royal-Fnatic) QF1(C9-Fnatic)
// QF2(NaJin-Gambit) QF3(Gamania-SKT) QF4(Royal-OMG). Colocações: SKT=1, Royal=2, NaJin/Fnatic=semi(3-4),
// C9/Gamania/Gambit/OMG=quartas(5-8). Impact (SKT top) = Finals MVP. SKT no rft.gg = "T1".
mergeWorlds("2013", {
  // SKT T1 (LCK, campeão). F vs Royal(LPL-2), SF1 vs NaJin(LCK-3), QF3 vs Gamania(wild-7). Impact fMVP.
  Impact:{ base:86, geral:67.4, playoff:[[60.6,"LPL-2"],[51.4,"LCK-3"],[85.7,"wild-7"]], mvp:true },
  Bengi:{ base:86, geral:56.7, playoff:[[57.7,"LPL-2"],[49.9,"LCK-3"],[53.3,"wild-7"]] },
  Faker:{ base:86, geral:60.1, playoff:[[62,"LPL-2"],[50.4,"LCK-3"],[57.6,"wild-7"]] },
  Piglet:{ base:86, geral:60.5, playoff:[[62.3,"LPL-2"],[61.9,"LCK-3"],[54.7,"wild-7"]] },
  PoohManDu:{ base:86, geral:56.4, playoff:[[66.5,"LPL-2"],[50.4,"LCK-3"],[72.3,"wild-7"]] },
  // Royal Club (LPL, vice). SEM grupos (seed direto). F vs SKT(LCK-1), SF2 vs Fnatic(LEC-3), QF4 vs OMG(LPL-7).
  Ackerman:{ base:84, playoff:[[56.5,"LCK-1"],[72.8,"LEC-3"],[61.9,"LPL-7"]], vice:true },
  Lucky:{ base:84, playoff:[[40.2,"LCK-1"],[53.6,"LEC-3"],[51.9,"LPL-7"]], vice:true },
  Wh1t3zZ:{ base:84, playoff:[[51.9,"LCK-1"],[73.5,"LEC-3"],[62.5,"LPL-7"]], vice:true },
  Uzi:{ base:84, playoff:[[40.7,"LCK-1"],[55.5,"LEC-3"],[68.7,"LPL-7"]], vice:true },
  Tabe:{ base:84, playoff:[[50.5,"LCK-1"],[58.4,"LEC-3"],[42.4,"LPL-7"]], vice:true },
  // NaJin Black Sword (LCK, semi). SEM grupos (seed direto). SF1 vs SKT(LCK-1), QF2 vs Gambit(LEC-7).
  Expession:{ base:81, playoff:[[67.3,"LCK-1"],[60.5,"LEC-7"]] },
  Watch:{ base:81, playoff:[[56.3,"LCK-1"],[42.9,"LEC-7"]] },
  Nagne:{ base:81, playoff:[[61.5,"LCK-1"],[50.3,"LEC-7"]] },
  PraY:{ base:81, playoff:[[51.9,"LCK-1"],[47.4,"LEC-7"]] },
  Cain:{ base:81, playoff:[[40.7,"LCK-1"],[47.4,"LEC-7"]] },
  // Fnatic (LEC, semi). Jogou grupos. SF2 vs Royal(LPL-2), QF1 vs Cloud9(LCS-7).
  sOAZ:{ base:81, geral:68, playoff:[[40.9,"LPL-2"],[78.3,"LCS-7"]] },
  Cyanide:{ base:81, geral:57.8, playoff:[[32,"LPL-2"],[51.6,"LCS-7"]] },
  xPeke:{ base:81, geral:67.4, playoff:[[41,"LPL-2"],[61,"LCS-7"]] },
  Puszu:{ base:81, geral:60, playoff:[[47.7,"LPL-2"],[66.4,"LCS-7"]] },
  YellOwStaR:{ base:81, geral:64.4, playoff:[[46.3,"LPL-2"],[58.1,"LCS-7"]] },
  // OMG (LPL, quartas). Jogou grupos. QF4 vs Royal(LPL-2).
  Gogoing:{ base:78, geral:67.9, playoff:[[56,"LPL-2"]] },
  LoveLing:{ base:78, geral:56.3, playoff:[[48.4,"LPL-2"]] },
  Cool:{ base:78, geral:66.3, playoff:[[60.5,"LPL-2"]] },
  san:{ base:78, geral:60.2, playoff:[[41.8,"LPL-2"]] },
  pomelo:{ base:78, geral:57.7, playoff:[[46.1,"LPL-2"]] },
  // Gambit (LEC, quartas). Jogou grupos. QF2 vs NaJin(LCK-3). O lendário Moscow5/Gambit.
  Darien:{ base:78, geral:64, playoff:[[62.6,"LCK-3"]] },
  Diamondprox:{ base:78, geral:51.5, playoff:[[62.6,"LCK-3"]] },
  "Alex Ich":{ base:78, geral:62.1, playoff:[[59.7,"LCK-3"]] },
  Genja:{ base:78, geral:49.4, playoff:[[61,"LCK-3"]] },
  Voidle:{ base:78, geral:52.6, playoff:[[57.7,"LCK-3"]] },
  // Cloud9 (LCS, quartas). SEM grupos (seed direto). QF1 vs Fnatic(LEC-3).
  BalIs:{ base:78, playoff:[[64.1,"LEC-3"]] },
  Meteos:{ base:78, playoff:[[44.6,"LEC-3"]] },
  Hai:{ base:78, playoff:[[44.8,"LEC-3"]] },
  Sneaky:{ base:78, playoff:[[46.4,"LEC-3"]] },
  LemonNation:{ base:78, playoff:[[52.4,"LEC-3"]] },
  // Gamania Bears (wild, quartas). SEM grupos (seed direto). QF3 vs SKT(LCK-1). Varridos.
  Steak:{ base:78, playoff:[[50.2,"LCK-1"]] },
  Winds:{ base:78, playoff:[[43,"LCK-1"]] },
  Maple:{ base:78, playoff:[[42.4,"LCK-1"]] },
  NL:{ base:78, playoff:[[38.4,"LCK-1"]] },
  SwordArt:{ base:78, playoff:[[38,"LCK-1"]] },
});
