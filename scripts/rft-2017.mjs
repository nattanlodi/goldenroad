import { merge } from "./rft-merge.mjs";
// 2017 — geral (/players) + PLAYOFF por série (prints).
// F(SKT-SSG) SF1(SKT-RNG) SF2(SSG-WE) QF1(LZ-SSG) QF2(SKT-MSF) QF3(RNG-FNC) QF4(WE-C9)
merge("2017", {
  // Samsung Galaxy campeão (base 88). Sem transcendente; Ruler/CoreJJ destaques. Sem cura.
  CuVee:   { base:88, geral:66.0, playoff:[70,63,81] },
  Ambition:{ base:88, geral:62.0, playoff:[69,52,70] },
  Crown:   { base:88, geral:63.0, playoff:[63,63,73] },
  Ruler:   { base:88, geral:66.0, playoff:[70,59,71] },
  CoreJJ:  { base:88, geral:66.0, playoff:[70,65,74] },
  // SKT vice (base 84). Faker ainda elite na derrota.
  Huni:    { base:84, geral:60.0, playoff:[65,64,65] },
  Peanut:  { base:84, geral:50.0, playoff:[46,50,55] },
  Faker:   { base:84, geral:64.0, playoff:[64,60,71] },
  Bang:    { base:84, geral:55.0, playoff:[46,57,58] },
  Wolf:    { base:84, geral:55.0, playoff:[46,56,58] },
  // RNG semi (base 81): SF1+QF3. Uzi.
  Letme:   { base:81, geral:58.0, playoff:[57,65] },
  Mlxg:    { base:81, geral:58.0, playoff:[61,59] },
  Xiaohu:  { base:81, geral:68.0, playoff:[67,74] },
  Uzi:     { base:81, geral:66.0, playoff:[56,77] },
  Ming:    { base:81, geral:60.0, playoff:[60,65] },
  // Team WE semi (base 81): SF2+QF4
  "957":   { base:81, geral:58.0, playoff:[60,57] },
  Condi:   { base:81, geral:55.0, playoff:[59,46] },
  xiye:    { base:81, geral:62.0, playoff:[65,64] },
  Mystic:  { base:81, geral:58.0, playoff:[55,58] },
  Ben:     { base:81, geral:54.0, playoff:[54,53] }, // BEN
  // Longzhu quartas (base 78): QF1 (varridos 0-3). Khan/Bdd.
  Khan:    { base:78, geral:55.0, playoff:[49] },
  Cuzz:    { base:78, geral:50.0, playoff:[37] },
  Bdd:     { base:78, geral:60.0, playoff:[62] },
  PraY:    { base:78, geral:52.0, playoff:[44] },
  GorillA: { base:78, geral:52.0, playoff:[47] },
  // Misfits quartas (base 78): QF2 (levaram SKT ao game 5!). Caps... não, Caps é Fnatic 2017.
  Alphari: { base:78, geral:58.0, playoff:[59] },
  Maxlore: { base:78, geral:55.0, playoff:[55] },
  PowerOfEvil:{ base:78, geral:55.0, playoff:[54] },
  "Hans Sama":{ base:78, geral:60.0, playoff:[60] },
  Ignar:   { base:78, geral:58.0, playoff:[62] },
  // Fnatic quartas (base 78): QF3 (perderam 1-3). Caps.
  sOAZ:    { base:78, geral:50.0, playoff:[50] },
  Broxah:  { base:78, geral:55.0, playoff:[55] },
  Caps:    { base:78, geral:58.0, playoff:[57] },
  Rekkles: { base:78, geral:62.0, playoff:[66] },
  Jesiz:   { base:78, geral:52.0, playoff:[53] },
  // Cloud9 quartas (base 78): QF4 (perderam 2-3, jogaram bem). Jensen/Smoothie.
  Impact:  { base:78, geral:62.0, playoff:[67] },
  Contractz:{ base:78, geral:60.0, playoff:[66] },
  Jensen:  { base:78, geral:65.0, playoff:[71] },
  Sneaky:  { base:78, geral:62.0, playoff:[69] },
  Smoothie:{ base:78, geral:62.0, playoff:[71] },
});
