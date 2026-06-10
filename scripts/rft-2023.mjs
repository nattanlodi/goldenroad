import { merge } from "./rft-merge.mjs";
// 2023 — geral (/players) + PLAYOFF por série (prints).
// F(WBG-T1) SF1(BLG-WBG) SF2(JDG-T1) QF1(NRG-WBG) QF2(GEN-BLG) QF3(JDG-KT) QF4(LNG-T1)
merge("2023", {
  // T1 campeão (base 88). Tetra do Faker; Zeus monstro (95 na final). Faker 95 curadoria (lenda em casa).
  Zeus:    { base:88, geral:80.0, playoff:[95,70,86] },
  Oner:    { base:88, geral:70.0, playoff:[81,59,73] },
  Faker:   { base:88, geral:68.0, playoff:[68,69,69], cura:95 },
  Gumayusi:{ base:88, geral:64.0, playoff:[66,64,62] },
  Keria:   { base:88, geral:74.0, playoff:[78,77,66] },
  // Weibo Gaming vice (base 84). TheShy de volta a uma final.
  TheShy:  { base:84, geral:70.0, playoff:[39,77,82] },
  Weiwei:  { base:84, geral:55.0, playoff:[50,53,67] },
  Xiaohu:  { base:84, geral:62.0, playoff:[50,65,80] },
  Light:   { base:84, geral:60.0, playoff:[39,54,84] },
  Crisp:   { base:84, geral:62.0, playoff:[41,60,92] },
  // Bilibili Gaming semi (base 81): SF1+QF2. Bin/Elk.
  Bin:     { base:81, geral:60.0, playoff:[47,69] },
  Xun:     { base:81, geral:65.0, playoff:[62,75] },
  YaGao:   { base:81, geral:62.0, playoff:[68,65] },
  Elk:     { base:81, geral:64.0, playoff:[64,69] },
  ON:      { base:81, geral:68.0, playoff:[70,74] },
  // JD Gaming semi (base 81): SF2+QF3. Knight/Ruler.
  "369":   { base:81, geral:58.0, playoff:[55,65] },
  Kanavi:  { base:81, geral:60.0, playoff:[55,67] },
  Knight:  { base:81, geral:62.0, playoff:[59,61] },
  Ruler:   { base:81, geral:66.0, playoff:[59,70] },
  MISSING: { base:81, geral:62.0, playoff:[60,67] },
  // NRG quartas (base 78): QF1 (varridos 0-3)
  Dhokla:  { base:78, geral:50.0, playoff:[52] },
  Contractz:{ base:78, geral:48.0, playoff:[47] },
  Palafox: { base:78, geral:50.0, playoff:[48] },
  FBI:     { base:78, geral:52.0, playoff:[40] },
  IgNar:   { base:78, geral:48.0, playoff:[40] },
  // Gen.G quartas (base 78): QF2 (perderam 2-3). Chovy/Peyz.
  Doran:   { base:78, geral:55.0, playoff:[57] },
  Peanut:  { base:78, geral:52.0, playoff:[53] },
  Chovy:   { base:78, geral:60.0, playoff:[59] },
  Peyz:    { base:78, geral:58.0, playoff:[56] },
  Delight: { base:78, geral:55.0, playoff:[56] },
  // KT Rolster quartas (base 78): QF3 (perderam 1-3). Bdd/Aiming.
  Kiin:    { base:78, geral:55.0, playoff:[61] },
  Cuzz:    { base:78, geral:52.0, playoff:[52] },
  Bdd:     { base:78, geral:58.0, playoff:[64] },
  Aiming:  { base:78, geral:55.0, playoff:[57] },
  Lehends: { base:78, geral:52.0, playoff:[52] },
  // LNG quartas (base 78): QF4 (varridos 0-3). Scout/Tarzan/GALA.
  Zika:    { base:78, geral:48.0, playoff:[49] },
  Tarzan:  { base:78, geral:48.0, playoff:[40] },
  Scout:   { base:78, geral:55.0, playoff:[52] },
  GALA:    { base:78, geral:50.0, playoff:[42] },
  Hang:    { base:78, geral:50.0, playoff:[49] },
});
