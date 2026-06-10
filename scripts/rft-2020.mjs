import { merge } from "./rft-merge.mjs";
// 2020 — geral (/players) + PLAYOFF por série (prints).
// F(SN-DWG) SF1(G2-DWG) SF2(TES-SN) QF1(DWG-DRX) QF2(SN-JDG) QF3(TES-FNC) QF4(GEN-G2)
merge("2020", {
  // DAMWON campeão (base 88). Canyon perto do teto (81 na QF, MVP-tier); ShowMaker forte.
  Nuguri:  { base:88, geral:70.0, playoff:[73,73,68] },
  Canyon:  { base:88, geral:78.0, playoff:[78,77,81] },
  ShowMaker:{ base:88, geral:70.0, playoff:[65,67,71] },
  Ghost:   { base:88, geral:62.0, playoff:[63,57,64] },
  BeryL:   { base:88, geral:65.0, playoff:[63,67,69] },
  // Suning vice (base 84). SofM o jungler vietnamita; Bin o destaque.
  Bin:     { base:84, geral:66.0, playoff:[52,77,71] },
  SofM:    { base:84, geral:64.0, playoff:[54,67,71] },
  Angel:   { base:84, geral:60.0, playoff:[56,66,62] },
  huanfeng:{ base:84, geral:62.0, playoff:[46,59,73] },
  SwordArt:{ base:84, geral:62.0, playoff:[51,63,68] },
  // Top Esports semi (base 81): SF2+QF3. knight/JackeyLove.
  "369":   { base:81, geral:58.0, playoff:[54,67] },
  Karsa:   { base:81, geral:60.0, playoff:[52,70] },
  knight:  { base:81, geral:66.0, playoff:[59,79] },
  JackeyLove:{ base:81, geral:58.0, playoff:[52,53] },
  yuyanjia:{ base:81, geral:55.0, playoff:[58,58] },
  // G2 semi (base 81): SF1+QF4. Caps.
  Wunder:  { base:81, geral:58.0, playoff:[45,69] },
  Jankos:  { base:81, geral:60.0, playoff:[46,79] },
  Caps:    { base:81, geral:65.0, playoff:[58,82] },
  Perkz:   { base:81, geral:60.0, playoff:[48,72] },
  Mikyx:   { base:81, geral:60.0, playoff:[57,84] },
  // JD Gaming quartas (base 78): QF2 (perderam 1-3). Kanavi.
  Zoom:    { base:78, geral:55.0, playoff:[54] },
  Kanavi:  { base:78, geral:62.0, playoff:[62] },
  Yagao:   { base:78, geral:55.0, playoff:[58] },
  LokeN:   { base:78, geral:52.0, playoff:[49] },
  LvMao:   { base:78, geral:55.0, playoff:[56] },
  // DRX quartas (base 78): QF1 (varridos 0-3). Estreia do Keria; Chovy/Deft.
  Doran:   { base:78, geral:52.0, playoff:[57] },
  Pyosik:  { base:78, geral:48.0, playoff:[44] },
  Chovy:   { base:78, geral:55.0, playoff:[53] },
  Deft:    { base:78, geral:52.0, playoff:[39] },
  Keria:   { base:78, geral:55.0, playoff:[51] },
  // Gen.G quartas (base 78): QF4 (varridos 0-3). Ruler/Bdd.
  Rascal:  { base:78, geral:50.0, playoff:[46] },
  Clid:    { base:78, geral:50.0, playoff:[41] },
  Bdd:     { base:78, geral:55.0, playoff:[52] },
  Ruler:   { base:78, geral:55.0, playoff:[45] },
  Life:    { base:78, geral:50.0, playoff:[41] },
  // Fnatic quartas (base 78): QF3 (perderam 2-3). Selfmade/Hylissang.
  Bwipo:   { base:78, geral:52.0, playoff:[54] },
  Selfmade:{ base:78, geral:58.0, playoff:[61] },
  Nemesis: { base:78, geral:50.0, playoff:[49] },
  Rekkles: { base:78, geral:55.0, playoff:[55] },
  Hylissang:{ base:78, geral:58.0, playoff:[61] },
});
