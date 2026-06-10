import { merge } from "./rft-merge.mjs";
// 2018 — geral (/players) + PLAYOFF por série (prints).
// F(FNC-IG) SF1(G2-IG) SF2(C9-FNC) QF1(KT-IG) QF2(RNG-G2) QF3(AF-C9) QF4(FNC-EDG)
merge("2018", {
  // Invictus Gaming campeão (base 88). Superequipe equilibrada; Rookie/TheShy destaques.
  TheShy:    { base:88, geral:70.0, playoff:[80,76,64] },
  Ning:      { base:88, geral:66.0, playoff:[76,66,65] },
  Rookie:    { base:88, geral:78.0, playoff:[85,76,75] },
  JackeyLove:{ base:88, geral:68.0, playoff:[76,60,61] },
  Baolan:    { base:88, geral:70.0, playoff:[85,68,66] },
  // Fnatic vice (base 84). Massacrados 0-3 na final, mas demolidores na semi (Bwipo 86).
  Bwipo:     { base:84, geral:62.0, playoff:[43,86,63] },
  Broxah:    { base:84, geral:60.0, playoff:[51,77,63] },
  Caps:      { base:84, geral:60.0, playoff:[40,77,53] },
  Rekkles:   { base:84, geral:58.0, playoff:[47,69,58] },
  Hylissang: { base:84, geral:58.0, playoff:[41,75,57] },
  // Cloud9 semi (base 81): SF2+QF3. 1º semifinalista NA.
  Licorice:  { base:81, geral:48.0, playoff:[36,49] },
  Svenskeren:{ base:81, geral:60.0, playoff:[42,79] },
  Jensen:    { base:81, geral:62.0, playoff:[48,76] },
  Sneaky:    { base:81, geral:55.0, playoff:[44,67] },
  Zeyzal:    { base:81, geral:55.0, playoff:[51,65] },
  // G2 semi (base 81): SF1+QF2. Perkz.
  Wunder:    { base:81, geral:58.0, playoff:[49,66] },
  Jankos:    { base:81, geral:55.0, playoff:[47,65] },
  Perkz:     { base:81, geral:65.0, playoff:[51,79] },
  Hjarnan:   { base:81, geral:55.0, playoff:[49,58] },
  Wadid:     { base:81, geral:58.0, playoff:[57,67] },
  // Afreeca Freecs quartas (base 78): QF3 (varridos 0-3). Kiin.
  Kiin:      { base:78, geral:60.0, playoff:[72] },
  Spirit:    { base:78, geral:50.0, playoff:[42] },
  Kuro:      { base:78, geral:52.0, playoff:[46] },
  Kramer:    { base:78, geral:52.0, playoff:[44] },
  TusiN:     { base:78, geral:55.0, playoff:[57] },
  // EDward Gaming quartas (base 78): QF4. Scout.
  Ray:       { base:78, geral:50.0, playoff:[50] },
  Haro:      { base:78, geral:55.0, playoff:[55] },
  Scout:     { base:78, geral:60.0, playoff:[66] },
  iBoy:      { base:78, geral:55.0, playoff:[58] },
  Meiko:     { base:78, geral:58.0, playoff:[61] },
  // RNG quartas (base 78): QF2 (perderam 2-3 — a maior zebra). Uzi favorito do ano.
  Letme:     { base:78, geral:52.0, playoff:[53] },
  Mlxg:      { base:78, geral:52.0, playoff:[53] },
  Xiaohu:    { base:78, geral:50.0, playoff:[48] },
  Uzi:       { base:78, geral:58.0, playoff:[57] },
  Ming:      { base:78, geral:52.0, playoff:[50] },
  // KT Rolster quartas (base 78): QF1 (perderam 2-3 épica). Smeb/Deft.
  Smeb:      { base:78, geral:58.0, playoff:[61] },
  Score:     { base:78, geral:55.0, playoff:[58] },
  Ucal:      { base:78, geral:55.0, playoff:[45] },
  Deft:      { base:78, geral:58.0, playoff:[55] },
  Mata:      { base:78, geral:52.0, playoff:[52] },
});
