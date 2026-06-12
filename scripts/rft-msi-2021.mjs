import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2021 (Reykjavík) — knockout de 4 times (2 semis + final). Campeão: Royal Never Give Up
// sobre a DAMWON Gaming na final (3-2). RFT geral (/players) + por SÉRIE de mata-mata, mescla
// 80/20 COM força do oponente. Série = [rating,"LIGA-COLOC"]. Finals MVP: GALA (RNG, +2).
// MVP do torneio: ShowMaker (DK) — maior RFT geral entre finalistas (75, +2).
// Colocações: RNG 1(LPL) · DK 2(LCK) · MAD 3-4(LEC) · PSG 3-4(PCS). base: campeão 86 · vice 84 · semi 81.
merge("MSI 2021", {
  // Royal Never Give Up — campeão (base 86). Trilha: Final(vs DK), Semi(vs PSG). GALA Finals MVP (+2).
  Xiaohu: { base: 86, geral: 71.2, playoff: [[63.0, "LCK-2"], [66.0, "PCS-3"]] },
  Wei: { base: 86, geral: 67.6, playoff: [[59.1, "LCK-2"], [63.6, "PCS-3"]] },
  Cryin: { base: 86, geral: 67.0, playoff: [[64.2, "LCK-2"], [68.6, "PCS-3"]] },
  GALA: { base: 86, geral: 66.0, playoff: [[62.2, "LCK-2"], [63.6, "PCS-3"]], mvpFinal: true },
  Ming: { base: 86, geral: 68.9, playoff: [[65.9, "LCK-2"], [70.9, "PCS-3"]] },
  // DAMWON Gaming — vice (base 84). Trilha: Final(vs RNG), Semi(vs MAD). ShowMaker MVP torneio (+2). vice.
  Khan: { base: 84, geral: 68.3, playoff: [[56.5, "LPL-1"], [64.5, "LEC-4"]], vice: true },
  Canyon: { base: 84, geral: 73.3, playoff: [[63.4, "LPL-1"], [73.4, "LEC-4"]], vice: true },
  ShowMaker: { base: 84, geral: 75.0, playoff: [[60.5, "LPL-1"], [79.8, "LEC-4"]], vice: true, mvpTour: true },
  Ghost: { base: 84, geral: 57.3, playoff: [[60.1, "LPL-1"], [56.5, "LEC-4"]], vice: true },
  BeryL: { base: 84, geral: 62.8, playoff: [[58.8, "LPL-1"], [69.9, "LEC-4"]], vice: true },
  // MAD Lions — semi/3-4 (base 81). Trilha: Semi(vs DK).
  Armut: { base: 81, geral: 62.6, playoff: [[56.9, "LCK-2"]] },
  Elyoya: { base: 81, geral: 63.2, playoff: [[54.1, "LCK-2"]] },
  Humanoid: { base: 81, geral: 65.0, playoff: [[45.0, "LCK-2"]] },
  Carzzy: { base: 81, geral: 59.9, playoff: [[51.1, "LCK-2"]] },
  Kaiser: { base: 81, geral: 64.9, playoff: [[53.0, "LCK-2"]] },
  // PSG Talon — semi/3-4 (base 81). Trilha: Semi(vs RNG).
  Hanabi: { base: 81, geral: 65.4, playoff: [[55.3, "LPL-1"]] },
  River: { base: 81, geral: 67.8, playoff: [[57.0, "LPL-1"]] },
  Maple: { base: 81, geral: 63.9, playoff: [[59.1, "LPL-1"]] },
  Doggo: { base: 81, geral: 64.7, playoff: [[60.8, "LPL-1"]] },
  Kaiwing: { base: 81, geral: 68.2, playoff: [[56.8, "LPL-1"]] },
});
