import { merge } from "./rft-merge.mjs";
// 2024 — geral (/players) + PLAYOFF por série (prints).
// F(BLG-T1) SF1(WBG-BLG) SF2(T1-GEN) QF1(LNG-WBG) QF2(HLE-BLG) QF3(TES-T1) QF4(GEN-FLY)
merge("2024", {
  // T1 campeão (base 88). 4o titulo; Faker MVP da final. Keria 86 na QF3.
  Zeus:    { base:86, geral:70.0, playoff:[66,65,79] },
  Oner:    { base:86, geral:69.0, playoff:[66,71,71] },
  Faker:   { base:86, geral:67.0, playoff:[60,63,78] , mvp:true },
  Gumayusi:{ base:86, geral:73.0, playoff:[71,67,82] },
  Keria:   { base:86, geral:71.0, playoff:[61,67,86] },
  // Bilibili Gaming vice (base 84). Bin/Elk/Knight monstruosos; final em 5 jogos.
  Bin:     { base:84, geral:68.0, playoff:[63,68,75] },
  Xun:     { base:84, geral:66.0, playoff:[59,69,74] },
  Knight:  { base:84, geral:72.0, playoff:[70,84,66] },
  Elk:     { base:84, geral:66.0, playoff:[57,75,66] },
  ON:      { base:84, geral:68.0, playoff:[64,70,66] },
  // Weibo Gaming semi (base 81): SF1+QF1
  Breathe: { base:81, geral:60.0, playoff:[55,73] },
  Tarzan:  { base:81, geral:55.0, playoff:[58,57] },
  Xiaohu:  { base:81, geral:62.0, playoff:[52,75] },
  Light:   { base:81, geral:60.0, playoff:[54,68] },
  Crisp:   { base:81, geral:62.0, playoff:[56,78] },
  // Gen.G semi (base 81): SF2+QF4. Chovy/Canyon.
  Kiin:    { base:81, geral:64.0, playoff:[61,74] },
  Canyon:  { base:81, geral:62.0, playoff:[57,69] },
  Chovy:   { base:81, geral:66.0, playoff:[66,71] },
  Peyz:    { base:81, geral:62.0, playoff:[64,66] },
  Lehends: { base:81, geral:58.0, playoff:[59,58] },
  // LNG quartas (base 78): QF1 (perderam 1-3)
  Zika:    { base:78, geral:58.0, playoff:[64] },
  Weiwei:  { base:78, geral:55.0, playoff:[57] },
  Scout:   { base:78, geral:58.0, playoff:[61] },
  GALA:    { base:78, geral:58.0, playoff:[64] },
  Hang:    { base:78, geral:55.0, playoff:[60] },
  // Hanwha Life quartas (base 78): QF2 (perderam 1-3). Zeka/Viper.
  Doran:   { base:78, geral:52.0, playoff:[54] },
  Peanut:  { base:78, geral:55.0, playoff:[55] },
  Zeka:    { base:78, geral:60.0, playoff:[63] },
  Viper:   { base:78, geral:62.0, playoff:[70] },
  Delight: { base:78, geral:58.0, playoff:[68] },
  // Top Esports quartas (base 78): QF3 (varridos 0-3). JackeyLove/Meiko.
  "369":   { base:78, geral:52.0, playoff:[50] },
  Tian:    { base:78, geral:48.0, playoff:[47] },
  Creme:   { base:78, geral:45.0, playoff:[40] },
  JackeyLove:{ base:78, geral:55.0, playoff:[47] },
  Meiko:   { base:78, geral:50.0, playoff:[44] },
  // FlyQuest quartas (base 78): QF4 (perderam 2-3). Bwipo/Inspired.
  Bwipo:   { base:78, geral:55.0, playoff:[56] },
  Inspired:{ base:78, geral:60.0, playoff:[65] },
  Quad:    { base:78, geral:58.0, playoff:[65] },
  Massu:   { base:78, geral:55.0, playoff:[61] },
  Busio:   { base:78, geral:55.0, playoff:[58] },
});
