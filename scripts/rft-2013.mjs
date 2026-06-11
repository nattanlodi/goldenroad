import { merge } from "./rft-merge.mjs";
// 2013 — RFT geral (/players) + RFT de PLAYOFF agregado por série (prints rft.gg).
// Séries: F (final SKT-Royal), S1 (SKT-NaJin), S2 (Royal-Fnatic),
//         QF1 (C9-Fnatic), QF2 (NaJin-Gambit), QF3 (Gamania-SKT), QF4 (Royal-OMG).
merge("2013", {
  // SKT campeão (base 88): F + S1 + QF3
  Impact:    { base:86, geral:66.6, playoff:[61,51,81] },
  Bengi:     { base:86, geral:56.2, playoff:[59,74,60] },
  Faker:     { base:86, geral:60.8, playoff:[73,58,63] , mvp:true },
  Piglet:    { base:86, geral:59.3, playoff:[35,68,63] },
  PoohManDu: { base:86, geral:57.0, playoff:[55,55,70] },
  // Royal Club vice (base 84): F + S2 + QF4
  GoDlike:   { base:84, geral:53.5, playoff:[49,41,61] }, // Ackerman
  Lucky:     { base:84, geral:50.0, playoff:[37,37,58] },
  "Wh1t3zZ": { base:84, geral:58.1, playoff:[56,56,62] },
  Uzi:       { base:84, geral:51.2, playoff:[53,53,64] },
  Tabe:      { base:84, geral:51.7, playoff:[55,55,59] },
  // NaJin Black Sword semi (base 81): S1 + QF2
  Expession: { base:81, geral:62.4, playoff:[42,72] },
  Watch:     { base:81, geral:49.4, playoff:[74,56] },
  Nagne:     { base:81, geral:55.0, playoff:[58,59] },
  PraY:      { base:81, geral:48.1, playoff:[51,56] },
  Cain:      { base:81, geral:49.9, playoff:[66,55] },
  // Fnatic semi (base 81): S2 + QF1
  "sOAZ":    { base:81, geral:66.5, playoff:[74,71] },
  Cyanide:   { base:81, geral:54.1, playoff:[60,53] },
  "xPeke":   { base:81, geral:63.2, playoff:[65,60] },
  Puszu:     { base:81, geral:57.8, playoff:[65,59] },
  YellOwStaR:{ base:81, geral:60.4, playoff:[60,59] },
  // Gamania Bears quartas (base 78): QF3 (agora tem playoff!)
  Steak:     { base:78, geral:50.0, playoff:[42] },
  Winds:     { base:78, geral:48.0, playoff:[38] },
  Maple:     { base:78, geral:52.0, playoff:[37] },
  NL:        { base:78, geral:50.0, playoff:[35] },
  SwordArT:  { base:78, geral:50.0, playoff:[42] },
  // Gambit quartas (base 78): QF2
  Darien:    { base:78, geral:62.4, playoff:[58] },
  Diamondprox:{ base:78, geral:50.7, playoff:[48] },
  "Alex Ich":{ base:78, geral:59.1, playoff:[50] },
  Genja:     { base:78, geral:49.2, playoff:[49] },
  Voidle:    { base:78, geral:52.0, playoff:[50] },
  // OMG quartas (base 78): QF4
  Gogoing:   { base:78, geral:65.6, playoff:[56] },
  LoveLin:   { base:78, geral:54.0, playoff:[45] },
  Cool:      { base:78, geral:63.9, playoff:[54] },
  San:       { base:78, geral:55.6, playoff:[38] },
  Bigpomelo: { base:78, geral:63.0, playoff:[43] },
  // Cloud9 quartas (base 78): QF1
  Balls:     { base:78, geral:61.7, playoff:[62] },
  Meteos:    { base:78, geral:52.1, playoff:[52] },
  Hai:       { base:78, geral:54.2, playoff:[43] },
  Sneaky:    { base:78, geral:47.6, playoff:[48] },
  LemonNation:{ base:78, geral:50.6, playoff:[51] },
});
