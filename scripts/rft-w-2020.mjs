import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2020 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média dos avgRftRating das 47 partidas
// de grupo (event/worlds-2020, ids 34726-34774); playoff = avgRftRating por série (ids 34775-34781).
// Bracket: F(SN-DWG) SF1(G2-DWG) SF2(SN-TES) QF1(DRX-DWG) QF2(JDG-SN) QF3(FNC-TES) QF4(GEN-G2)
// Colocações: DWG=1, SN=2, TES/G2=semi(3-4), JDG/DRX/GEN/FNC=quartas(5-8).
// Ligas: DWG/DRX/GEN=LCK, SN/JDG/TES=LPL, G2/FNC=LEC. Canyon = Finals MVP.
mergeWorlds("2020", {
  // DWG (LCK, campeão). F vs SN(LPL-2), SF1 vs G2(LEC-3), QF1 vs DRX(LCK-7). Canyon fMVP.
  Nuguri:{ base:86, geral:72.5, playoff:[[73,"LPL-2"],[73,"LEC-3"],[68,"LCK-7"]] },
  Canyon:{ base:86, geral:85.1, playoff:[[78,"LPL-2"],[77,"LEC-3"],[81,"LCK-7"]], mvp:true },
  ShowMaker:{ base:86, geral:69.8, playoff:[[65,"LPL-2"],[67,"LEC-3"],[71,"LCK-7"]] },
  Ghost:{ base:86, geral:61.1, playoff:[[63,"LPL-2"],[57,"LEC-3"],[64,"LCK-7"]] },
  BeryL:{ base:86, geral:67.3, playoff:[[63,"LPL-2"],[67,"LEC-3"],[69,"LCK-7"]] },
  // SN (LPL, vice). F vs DWG(LCK-1), SF2 vs TES(LPL-3), QF2 vs JDG(LPL-7).
  Bin:{ base:84, geral:72, playoff:[[52,"LCK-1"],[77,"LPL-3"],[71,"LPL-7"]], vice:true },
  SofM:{ base:84, geral:71.5, playoff:[[54,"LCK-1"],[67,"LPL-3"],[71,"LPL-7"]], vice:true },
  Angel:{ base:84, geral:69.2, playoff:[[56,"LCK-1"],[66,"LPL-3"],[62,"LPL-7"]], vice:true },
  huanfeng:{ base:84, geral:60.5, playoff:[[46,"LCK-1"],[59,"LPL-3"],[73,"LPL-7"]], vice:true },
  SwordArt:{ base:84, geral:67.8, playoff:[[51,"LCK-1"],[63,"LPL-3"],[68,"LPL-7"]], vice:true },
  // TES (LPL, semi). SF2 vs SN(LPL-2), QF3 vs FNC(LEC-7).
  369:{ base:81, geral:65.9, playoff:[[54,"LPL-2"],[67,"LEC-7"]] },
  Karsa:{ base:81, geral:76.2, playoff:[[52,"LPL-2"],[70,"LEC-7"]] },
  knight:{ base:81, geral:62.8, playoff:[[59,"LPL-2"],[79,"LEC-7"]] },
  JackeyLove:{ base:81, geral:70.2, playoff:[[52,"LPL-2"],[53,"LEC-7"]] },
  Yuyanjia:{ base:81, geral:68.8, playoff:[[58,"LPL-2"],[58,"LEC-7"]] },
  // G2 (LEC, semi). SF1 vs DWG(LCK-1), QF4 vs GEN(LCK-7).
  Wunder:{ base:81, geral:65.3, playoff:[[45,"LCK-1"],[69,"LCK-7"]] },
  Jankos:{ base:81, geral:64.4, playoff:[[46,"LCK-1"],[79,"LCK-7"]] },
  Caps:{ base:81, geral:64.8, playoff:[[58,"LCK-1"],[82,"LCK-7"]] },
  Perkz:{ base:81, geral:54.7, playoff:[[48,"LCK-1"],[72,"LCK-7"]] },
  Mikyx:{ base:81, geral:62.6, playoff:[[57,"LCK-1"],[84,"LCK-7"]] },
  // JDG (LPL, quartas). QF2 vs SN(LPL-2).
  Zoom:{ base:78, geral:67.7, playoff:[[54,"LPL-2"]] },
  Kanavi:{ base:78, geral:62.2, playoff:[[62,"LPL-2"]] },
  YaGao:{ base:78, geral:58.7, playoff:[[58,"LPL-2"]] },
  LokeN:{ base:78, geral:54.3, playoff:[[49,"LPL-2"]] },
  LvMao:{ base:78, geral:65, playoff:[[56,"LPL-2"]] },
  // DRX (LCK, quartas). QF1 vs DWG(LCK-1).
  Doran:{ base:78, geral:72.1, playoff:[[57,"LCK-1"]] },
  Pyosik:{ base:78, geral:80.6, playoff:[[44,"LCK-1"]] },
  Chovy:{ base:78, geral:70.4, playoff:[[53,"LCK-1"]] },
  Deft:{ base:78, geral:60.1, playoff:[[39,"LCK-1"]] },
  Keria:{ base:78, geral:67.2, playoff:[[51,"LCK-1"]] },
  // GEN (LCK, quartas). QF4 vs G2(LEC-3).
  Rascal:{ base:78, geral:63.6, playoff:[[46,"LEC-3"]] },
  Clid:{ base:78, geral:62.3, playoff:[[41,"LEC-3"]] },
  Bdd:{ base:78, geral:64.2, playoff:[[52,"LEC-3"]] },
  Ruler:{ base:78, geral:62.7, playoff:[[45,"LEC-3"]] },
  Life:{ base:78, geral:62.9, playoff:[[41,"LEC-3"]] },
  // FNC (LEC, quartas). QF3 vs TES(LPL-3).
  Bwipo:{ base:78, geral:65, playoff:[[54,"LPL-3"]] },
  Selfmade:{ base:78, geral:72.2, playoff:[[61,"LPL-3"]] },
  Nemesis:{ base:78, geral:62.2, playoff:[[49,"LPL-3"]] },
  Rekkles:{ base:78, geral:53.7, playoff:[[55,"LPL-3"]] },
  Hylissang:{ base:78, geral:64.5, playoff:[[61,"LPL-3"]] },
});
