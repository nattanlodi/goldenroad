import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2022 (Busan) — knockout de só 4 times (single-elim: 2 semis + final). Campeão: Royal
// Never Give Up sobre a T1 na final (3-2; o bi seguido da RNG). RFT geral (/players) + por SÉRIE
// de mata-mata, mescla 80/20 COM força do oponente. Série = [rating,"LIGA-COLOC"].
// Finals MVP: Ming (RNG, +2). MVP do torneio: Zeus (T1) — maior RFT geral entre finalistas (80.4, +2).
// Colocações: RNG 1(LPL) · T1 2(LCK) · EG 3-4(LCS) · G2 3-4(LEC). base: campeão 86 · vice 84 · semi 81.
merge("MSI 2022", {
  // Royal Never Give Up — campeão (base 86). Trilha: Final(vs T1), Semi(vs EG). Ming Finals MVP (+2).
  Bin: { base: 86, geral: 74.3, playoff: [[59.7, "LCK-2"], [82.2, "LCS-3"]] },
  Wei: { base: 86, geral: 73.0, playoff: [[67.7, "LCK-2"], [62.8, "LCS-3"]] },
  Xiaohu: { base: 86, geral: 76.0, playoff: [[64.4, "LCK-2"], [69.1, "LCS-3"]] },
  GALA: { base: 86, geral: 68.4, playoff: [[58.1, "LCK-2"], [62.5, "LCS-3"]] },
  Ming: { base: 86, geral: 74.1, playoff: [[60.7, "LCK-2"], [69.3, "LCS-3"]], mvpFinal: true },
  // T1 — vice (base 84). Trilha: Final(vs RNG), Semi(vs G2). Zeus MVP do torneio (+2). vice.
  Zeus: { base: 84, geral: 80.4, playoff: [[71.0, "LPL-1"], [86.4, "LEC-4"]], vice: true, mvpTour: true },
  Oner: { base: 84, geral: 72.3, playoff: [[48.3, "LPL-1"], [75.8, "LEC-4"]], vice: true },
  Faker: { base: 84, geral: 70.3, playoff: [[53.0, "LPL-1"], [75.4, "LEC-4"]], vice: true },
  Gumayusi: { base: 84, geral: 61.4, playoff: [[54.8, "LPL-1"], [63.6, "LEC-4"]], vice: true },
  Keria: { base: 84, geral: 69.7, playoff: [[52.6, "LPL-1"], [75.5, "LEC-4"]], vice: true },
  // Evil Geniuses — semi/3-4 (base 81). Trilha: Semi(vs RNG).
  Impact: { base: 81, geral: 62.4, playoff: [[39.9, "LPL-1"]] },
  Inspired: { base: 81, geral: 63.9, playoff: [[53.2, "LPL-1"]] },
  Jojopyun: { base: 81, geral: 63.1, playoff: [[54.7, "LPL-1"]] },
  Danny: { base: 81, geral: 58.7, playoff: [[55.8, "LPL-1"]] },
  Vulcan: { base: 81, geral: 64.2, playoff: [[52.8, "LPL-1"]] },
  // G2 Esports — semi/3-4 (base 81). Trilha: Semi(vs T1).
  BrokenBlade: { base: 81, geral: 63.4, playoff: [[41.1, "LCK-2"]] },
  Jankos: { base: 81, geral: 59.5, playoff: [[29.4, "LCK-2"]] },
  Caps: { base: 81, geral: 66.2, playoff: [[36.1, "LCK-2"]] },
  Flakked: { base: 81, geral: 55.9, playoff: [[40.8, "LCK-2"]] },
  Targamas: { base: 81, geral: 60.2, playoff: [[40.6, "LCK-2"]] },
});
