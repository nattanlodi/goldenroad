import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2019 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das 49 partidas de
// grupo (event/worlds-2019, ids 30564-30613); playoff = avgRftRating por série (ids 30614-30620).
// Bracket: F(G2-FPX) SF1(IG-FPX) SF2(G2-T1) QF1(GRF-IG) QF2(FNC-FPX) QF3(SPY-T1) QF4(G2-DWG)
// Colocações: FPX=1, G2=2, IG/T1=semi(3-4), GRF/FNC/SPY/DWG=quartas(5-8).
// Ligas: FPX/IG=LPL, G2/FNC/SPY=LEC, T1/GRF/DWG=LCK. Tian = Finals MVP.
mergeWorlds("2019", {
  // FPX (LPL, campeão). F vs G2(LEC-2), SF1 vs IG(LPL-3), QF2 vs FNC(LEC-7). Tian fMVP.
  GimGoon:{ base:86, geral:62.5, playoff:[[68,"LEC-2"],[64,"LPL-3"],[59,"LEC-7"]] },
  Tian:{ base:86, geral:73.3, playoff:[[66,"LEC-2"],[69,"LPL-3"],[75,"LEC-7"]], mvp:true },
  Doinb:{ base:86, geral:75.3, playoff:[[79,"LEC-2"],[65,"LPL-3"],[77,"LEC-7"]] },
  Lwx:{ base:86, geral:62.6, playoff:[[73,"LEC-2"],[62,"LPL-3"],[62,"LEC-7"]] },
  Crisp:{ base:86, geral:70.5, playoff:[[74,"LEC-2"],[80,"LPL-3"],[74,"LEC-7"]] },
  // G2 (LEC, vice). F vs FPX(LPL-1), SF2 vs T1(LCK-3), QF4 vs DWG(LCK-7).
  Wunder:{ base:84, geral:60.9, playoff:[[53,"LPL-1"],[56,"LCK-3"],[74,"LCK-7"]], vice:true },
  Jankos:{ base:84, geral:54.3, playoff:[[48,"LPL-1"],[58,"LCK-3"],[66,"LCK-7"]], vice:true },
  Caps:{ base:84, geral:75, playoff:[[37,"LPL-1"],[64,"LCK-3"],[60,"LCK-7"]], vice:true },
  Perkz:{ base:84, geral:56.5, playoff:[[40,"LPL-1"],[60,"LCK-3"],[59,"LCK-7"]], vice:true },
  Mikyx:{ base:84, geral:62, playoff:[[41,"LPL-1"],[72,"LCK-3"],[54,"LCK-7"]], vice:true },
  // IG (LPL, semi). SF1 vs FPX(LPL-1), QF1 vs GRF(LCK-7).
  TheShy:{ base:81, geral:78.2, playoff:[[51,"LPL-1"],[77,"LCK-7"]] },
  Ning:{ base:81, geral:55.8, playoff:[[43,"LPL-1"],[61,"LCK-7"]] },
  Rookie:{ base:81, geral:68.4, playoff:[[64,"LPL-1"],[63,"LCK-7"]] },
  JackeyLove:{ base:81, geral:49.8, playoff:[[54,"LPL-1"],[56,"LCK-7"]] },
  Baolan:{ base:81, geral:58.7, playoff:[[50,"LPL-1"],[54,"LCK-7"]] },
  // T1 (LCK, semi). SF2 vs G2(LEC-2), QF3 vs SPY(LEC-7).
  Khan:{ base:81, geral:69, playoff:[[66,"LEC-2"],[73,"LEC-7"]] },
  Clid:{ base:81, geral:63, playoff:[[61,"LEC-2"],[67,"LEC-7"]] },
  Faker:{ base:81, geral:75.3, playoff:[[58,"LEC-2"],[58,"LEC-7"]] },
  Teddy:{ base:81, geral:59.9, playoff:[[53,"LEC-2"],[55,"LEC-7"]] },
  Effort:{ base:81, geral:62.2, playoff:[[54,"LEC-2"],[63,"LEC-7"]] },
  // GRF (LCK, quartas). QF1 vs IG(LPL-3).
  Sword:{ base:78, geral:72.9, playoff:[[40,"LPL-3"]] },
  Tarzan:{ base:78, geral:71.7, playoff:[[64,"LPL-3"]] },
  Chovy:{ base:78, geral:77.9, playoff:[[57,"LPL-3"]] },
  Viper:{ base:78, geral:60.6, playoff:[[63,"LPL-3"]] },
  Lehends:{ base:78, geral:75.8, playoff:[[68,"LPL-3"]] },
  // FNC (LEC, quartas). QF2 vs FPX(LPL-1).
  Bwipo:{ base:78, geral:63.3, playoff:[[55,"LPL-1"]] },
  Broxah:{ base:78, geral:66.3, playoff:[[47,"LPL-1"]] },
  Nemesis:{ base:78, geral:69.1, playoff:[[59,"LPL-1"]] },
  Rekkles:{ base:78, geral:57.7, playoff:[[46,"LPL-1"]] },
  Hylissang:{ base:78, geral:64.3, playoff:[[55,"LPL-1"]] },
  // SPY (LEC, quartas). QF3 vs T1(LCK-3).
  Vizicsacsi:{ base:78, geral:67.8, playoff:[[46,"LCK-3"]] },
  Xerxe:{ base:78, geral:61.2, playoff:[[56,"LCK-3"]] },
  Humanoid:{ base:78, geral:64.5, playoff:[[54,"LCK-3"]] },
  Kobbe:{ base:78, geral:56.4, playoff:[[58,"LCK-3"]] },
  Tore:{ base:78, geral:64.4, playoff:[[60,"LCK-3"]] },
  // DWG (LCK, quartas). QF4 vs G2(LEC-2).
  Nuguri:{ base:78, geral:71.3, playoff:[[52,"LEC-2"]] },
  Canyon:{ base:78, geral:70.5, playoff:[[52,"LEC-2"]] },
  ShowMaker:{ base:78, geral:74, playoff:[[62,"LEC-2"]] },
  Nuclear:{ base:78, geral:59.5, playoff:[[50,"LEC-2"]] },
  BeryL:{ base:78, geral:71, playoff:[[61,"LEC-2"]] },
});
