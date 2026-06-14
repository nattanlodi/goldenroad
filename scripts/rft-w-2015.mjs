import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2015 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das 48 partidas de
// grupo (event/worlds-2015, ids 20285-20333, slug `...day-N-M`); playoff = avgRftRating por série (20334-20340).
// Bracket: F(SKT-KOO) SF1(OG-SKT) SF2(FNC-KOO) QF1(FW-OG) QF2(SKT-ahq) QF3(FNC-EDG) QF4(KT-KOO)
// Colocações: SKT=1, KOO=2, FNC/OG=semi(3-4), EDG/ahq/KT/FW=quartas(5-8).
// Ligas: SKT/KOO/KT=LCK, EDG=LPL, FNC/OG=LEC, ahq/FW=wildcard(LMS). MaRin = Finals MVP.
// ⚠ rft.gg: KOO Tigers = "ROX Tigers"; Niels=Zven; ClearLove=Mann; Koro1(EDG top) jogou só
// playoff → geral = AmazingJ (top grupos, 52.8). SKT rodiziou mid (Faker n=4/Easyhoon n=2 grupos, Easyhoon jogou a SF1).
mergeWorlds("2015", {
  // SKT (LCK, campeão). F vs KOO(LCK-2), SF1 vs OG(LEC-3), QF2 vs ahq(wild-7). MaRin fMVP.
  MaRin:{ base:86, geral:82.8, playoff:[[66,"LCK-2"],[72,"LEC-3"],[67,"wild-7"]], mvp:true },
  Bengi:{ base:86, geral:63.3, playoff:[[51,"LCK-2"],[58,"LEC-3"],[54,"wild-7"]] },
  Faker:{ base:86, geral:75.7, playoff:[[75,"LCK-2"],[82,"LEC-3"],[75,"wild-7"]] },
  Bang:{ base:86, geral:66.1, playoff:[[60,"LCK-2"],[55,"LEC-3"],[66,"wild-7"]] },
  Wolf:{ base:86, geral:75, playoff:[[62,"LCK-2"],[62,"LEC-3"],[66,"wild-7"]] },
  // KOO (LCK, vice). F vs SKT(LCK-1), SF2 vs FNC(LEC-3), QF4 vs KT(LCK-7).
  Smeb:{ base:84, geral:74.4, playoff:[[55,"LCK-1"],[78,"LEC-3"],[66,"LCK-7"]], vice:true },
  Hojin:{ base:84, geral:59.7, playoff:[[55,"LCK-1"],[50,"LEC-3"],[54,"LCK-7"]], vice:true },
  Kuro:{ base:84, geral:80.5, playoff:[[54,"LCK-1"],[68,"LEC-3"],[64,"LCK-7"]], vice:true },
  PraY:{ base:84, geral:62.3, playoff:[[47,"LCK-1"],[60,"LEC-3"],[54,"LCK-7"]], vice:true },
  GorillA:{ base:84, geral:69.2, playoff:[[49,"LCK-1"],[76,"LEC-3"],[63,"LCK-7"]], vice:true },
  // FNC (LEC, semi). SF2 vs KOO(LCK-2), QF3 vs EDG(LPL-7).
  Huni:{ base:81, geral:72.3, playoff:[[50,"LCK-2"],[73,"LPL-7"]] },
  Reignover:{ base:81, geral:61.7, playoff:[[51,"LCK-2"],[53,"LPL-7"]] },
  Febiven:{ base:81, geral:74.9, playoff:[[67,"LCK-2"],[80,"LPL-7"]] },
  Rekkles:{ base:81, geral:55.7, playoff:[[48,"LCK-2"],[60,"LPL-7"]] },
  YellOwStaR:{ base:81, geral:64.6, playoff:[[44,"LCK-2"],[65,"LPL-7"]] },
  // OG (LEC, semi). SF1 vs SKT(LCK-1), QF1 vs FW(wild-7).
  Soaz:{ base:81, geral:53.7, playoff:[[48,"LCK-1"],[64,"wild-7"]] },
  Amazing:{ base:81, geral:52.4, playoff:[[45,"LCK-1"],[52,"wild-7"]] },
  xPeke:{ base:81, geral:64.5, playoff:[[45,"LCK-1"],[59,"wild-7"]] },
  Niels:{ base:81, geral:53, playoff:[[49,"LCK-1"],[64,"wild-7"]] },
  Mithy:{ base:81, geral:55.1, playoff:[[52,"LCK-1"],[57,"wild-7"]] },
  // EDG (LPL, quartas). QF3 vs FNC(LEC-3). Koro1 jogou só playoff (AmazingJ jogou grupos).
  Koro1:{ base:78, geral:52.8, playoff:[[43,"LEC-3"]] },
  ClearLove:{ base:78, geral:58.5, playoff:[[45,"LEC-3"]] },
  PawN:{ base:78, geral:66.3, playoff:[[50,"LEC-3"]] },
  Deft:{ base:78, geral:60.8, playoff:[[45,"LEC-3"]] },
  Meiko:{ base:78, geral:71.2, playoff:[[44,"LEC-3"]] },
  // ahq (wild, quartas). QF2 vs SKT(LCK-1). Varridos 0-3.
  Ziv:{ base:78, geral:61.4, playoff:[[44,"LCK-1"]] },
  Mountain:{ base:78, geral:56.6, playoff:[[45,"LCK-1"]] },
  Westdoor:{ base:78, geral:59.2, playoff:[[40,"LCK-1"]] },
  AN:{ base:78, geral:57.6, playoff:[[44,"LCK-1"]] },
  Albis:{ base:78, geral:56.3, playoff:[[49,"LCK-1"]] },
  // KT (LCK, quartas). QF4 vs KOO(LCK-2). Ssumday/Piccaboo grupos fortes.
  Ssumday:{ base:78, geral:78.3, playoff:[[53,"LCK-2"]] },
  Score:{ base:78, geral:61.7, playoff:[[52,"LCK-2"]] },
  Nagne:{ base:78, geral:65.1, playoff:[[53,"LCK-2"]] },
  Arrow:{ base:78, geral:62.6, playoff:[[55,"LCK-2"]] },
  Piccaboo:{ base:78, geral:72.1, playoff:[[57,"LCK-2"]] },
  // FW (wild, quartas). QF1 vs OG(LEC-3). Maple destaque.
  Steak:{ base:78, geral:57.7, playoff:[[52,"LEC-3"]] },
  Karsa:{ base:78, geral:62.8, playoff:[[49,"LEC-3"]] },
  Maple:{ base:78, geral:69.2, playoff:[[65,"LEC-3"]] },
  NL:{ base:78, geral:65.3, playoff:[[50,"LEC-3"]] },
  SwordArT:{ base:78, geral:63.8, playoff:[[53,"LEC-3"]] },
});
