import { mergeWorlds } from "./rft-worlds-calc.mjs";
// 2014 — MOTOR NOVO (força do oponente + geral REAL da fase de grupos).
// Dados 100% frescos do rft.gg (jun/2026): geral = média avgRftRating das partidas de grupo
// (event/worlds-2014 = id 399; match ids 18567-18616, slug `2014-season-world-championship-day-N-M`);
// playoff = avgRftRating por série (18617-18623). Fonte: sitemap/matches-0.xml + SSR RSC.
// Bracket: F(SSW-RC) SF1(SSW-SSB) SF2(RC-OMG) QF1(SSW-TSM) QF2(SSB-C9) QF3(RC-EDG) QF4(NJWS-OMG).
// Colocações: SSW=1, RC=2, SSB/OMG=semi(3-4), TSM/C9/EDG/NJWS=quartas(5-8).
// Ligas: SSW/SSB/NJWS=LCK, RC/EDG/OMG=LPL, TSM/C9=LCS. Mata (SSW sup) = Finals MVP.
// ⚠ rft.gg: Mann=ClearLove, Korol=Koro1 (ambos EDG). OMG rodiziou o SUPORTE: Cloud jogou os
// playoffs, DaDa777 jogou os grupos → geral do Cloud = geral de grupos do DaDa777 (51.6).
mergeWorlds("2014", {
  // SSW (LCK, campeão). F vs RC(LPL-2), SF1 vs SSB(LCK-3), QF1 vs TSM(LCS-7). Mata fMVP.
  Looper:{ base:86, geral:82.2, playoff:[[84.2,"LPL-2"],[89.9,"LCK-3"],[87.3,"LCS-7"]] },
  DanDy:{ base:86, geral:80.9, playoff:[[74.9,"LPL-2"],[82.9,"LCK-3"],[79.6,"LCS-7"]] },
  PawN:{ base:86, geral:78.8, playoff:[[97.1,"LPL-2"],[100,"LCK-3"],[100,"LCS-7"]] },
  imp:{ base:86, geral:75.1, playoff:[[57.1,"LPL-2"],[57,"LCK-3"],[61.9,"LCS-7"]] },
  Mata:{ base:86, geral:82.6, playoff:[[80.9,"LPL-2"],[88.9,"LCK-3"],[100,"LCS-7"]], mvp:true },
  // RC (LPL, vice). F vs SSW(LCK-1), SF2 vs OMG(LPL-3), QF3 vs EDG(LPL-7).
  zero:{ base:84, geral:73.2, playoff:[[31,"LCK-1"],[38.8,"LPL-3"],[72.6,"LPL-7"]], vice:true },
  inSec:{ base:84, geral:61.5, playoff:[[31.7,"LCK-1"],[18,"LPL-3"],[61.9,"LPL-7"]], vice:true },
  Corn:{ base:84, geral:65.4, playoff:[[24.5,"LCK-1"],[41.9,"LPL-3"],[71.7,"LPL-7"]], vice:true },
  Uzi:{ base:84, geral:70.6, playoff:[[29,"LCK-1"],[23.6,"LPL-3"],[58.8,"LPL-7"]], vice:true },
  Cola:{ base:84, geral:63.8, playoff:[[28.6,"LCK-1"],[21.7,"LPL-3"],[67.1,"LPL-7"]], vice:true },
  // SSB (LCK, semi). SF1 vs SSW(LCK-1), QF2 vs C9(LCS-7).
  Acorn:{ base:81, geral:64.2, playoff:[[18.2,"LCK-1"],[41.3,"LCS-7"]] },
  Spirit:{ base:81, geral:64.2, playoff:[[27.2,"LCK-1"],[33.1,"LCS-7"]] },
  Dade:{ base:81, geral:66.2, playoff:[[18.4,"LCK-1"],[48.5,"LCS-7"]] },
  Deft:{ base:81, geral:66.1, playoff:[[37,"LCK-1"],[16.3,"LCS-7"]] },
  Heart:{ base:81, geral:70.3, playoff:[[22.3,"LCK-1"],[34,"LCS-7"]] },
  // OMG (LPL, semi). SF2 vs RC(LPL-2), QF4 vs NJWS(LCK-7). Cloud (jng) só playoff.
  Gogoing:{ base:81, geral:58.7, playoff:[[95.2,"LPL-2"],[75.5,"LCK-7"]] },
  Cloud:{ base:81, geral:51.6, playoff:[[84.9,"LPL-2"],[71.6,"LCK-7"]] },
  Cool:{ base:81, geral:57.3, playoff:[[79.4,"LPL-2"],[61.2,"LCK-7"]] },
  san:{ base:81, geral:50.8, playoff:[[75.6,"LPL-2"],[67.5,"LCK-7"]] },
  LoveLing:{ base:81, geral:54.7, playoff:[[77.3,"LPL-2"],[57.5,"LCK-7"]] },
  // TSM (LCS, quartas). QF1 vs SSW(LCK-1). Varridos 0-3.
  Dyrus:{ base:78, geral:61.9, playoff:[[44.4,"LCK-1"]] },
  Amazing:{ base:78, geral:50.5, playoff:[[21.2,"LCK-1"]] },
  Bjergsen:{ base:78, geral:75.7, playoff:[[15.2,"LCK-1"]] },
  WildTurtle:{ base:78, geral:55.9, playoff:[[29,"LCK-1"]] },
  Lustboy:{ base:78, geral:61.5, playoff:[[36.6,"LCK-1"]] },
  // C9 (LCS, quartas). QF2 vs SSB(LCK-3). Levaram a SSB ao limite (2-3).
  BalIs:{ base:78, geral:56.4, playoff:[[66.1,"LCK-3"]] },
  Meteos:{ base:78, geral:57.4, playoff:[[68.4,"LCK-3"]] },
  Hai:{ base:78, geral:56.8, playoff:[[72.7,"LCK-3"]] },
  Sneaky:{ base:78, geral:51.3, playoff:[[83.9,"LCK-3"]] },
  LemonNation:{ base:78, geral:58.3, playoff:[[91,"LCK-3"]] },
  // EDG (LPL, quartas). QF3 vs RC(LPL-2). Mann=ClearLove, Korol=Koro1.
  Koro1:{ base:78, geral:63.4, playoff:[[44.4,"LPL-2"]] },
  ClearLove:{ base:78, geral:60.5, playoff:[[25.1,"LPL-2"]] },
  U:{ base:78, geral:70.2, playoff:[[45.8,"LPL-2"]] },
  NaMei:{ base:78, geral:55.7, playoff:[[33.7,"LPL-2"]] },
  fzzf:{ base:78, geral:63, playoff:[[40.2,"LPL-2"]] },
  // NJWS (LCK, quartas). QF4 vs OMG(LPL-3). Ggoong destaque nos grupos.
  GorillA:{ base:78, geral:63.5, playoff:[[40.6,"LPL-3"]] },
  Watch:{ base:78, geral:53.6, playoff:[[46.2,"LPL-3"]] },
  Ggoong:{ base:78, geral:76.3, playoff:[[47.7,"LPL-3"]] },
  Zefa:{ base:78, geral:53.6, playoff:[[45.4,"LPL-3"]] },
  Save:{ base:78, geral:61.9, playoff:[[38.1,"LPL-3"]] },
});
