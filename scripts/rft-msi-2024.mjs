import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2024 (Chengdu) — RFT geral (/players) + por SÉRIE de mata-mata do rft.gg. Mescla 80/20
// COM força do oponente (opp-strength). Série = [rating,"LIGA-COLOC"]. Finals MVP: Lehends (+2).
// MVP do torneio: Chovy (maior RFT geral entre finalistas, +2).
// Colocações: GenG 1(LCK) · BLG 2(LPL) · T1 3(LCK) · G2 4(LEC) · TL 5-6(LCS) · TES 5-6(LPL) · FNC/PSG 7-8.
merge("MSI 2024", {
  // Gen.G — campeão (base 86). Trilha: Final(vs BLG), UF(vs BLG), UR2(vs TES). Lehends fMVP, Chovy MVP torneio.
  Kiin: { base: 86, geral: 64.0, playoff: [[61.3, "LPL-2"], [67.3, "LPL-2"], [59.6, "LPL-6"]] },
  Canyon: { base: 86, geral: 66.8, playoff: [[69.9, "LPL-2"], [70.6, "LPL-2"], [59.3, "LPL-6"]] },
  Chovy: { base: 86, geral: 73.6, playoff: [[67.3, "LPL-2"], [70.3, "LPL-2"], [70.8, "LPL-6"]], mvpTour: true },
  Peyz: { base: 86, geral: 60.7, playoff: [[61.5, "LPL-2"], [59.1, "LPL-2"], [59.1, "LPL-6"]] },
  Lehends: { base: 86, geral: 65.1, playoff: [[63.4, "LPL-2"], [67.3, "LPL-2"], [61.1, "LPL-6"]], mvpFinal: true },
  // Bilibili Gaming — vice (base 84). Trilha: Final(vs GenG), LF(vs T1), UF(vs GenG), UR2(vs T1). vice.
  Bin: { base: 84, geral: 67.9, playoff: [[55.3, "LCK-1"], [75.3, "LCK-3"], [64.6, "LCK-1"], [68.9, "LCK-3"]], vice: true },
  Xun: { base: 84, geral: 63.1, playoff: [[67.1, "LCK-1"], [61.7, "LCK-3"], [50.2, "LCK-1"], [63.3, "LCK-3"]], vice: true },
  Knight: { base: 84, geral: 66.6, playoff: [[64.0, "LCK-1"], [71.9, "LCK-3"], [51.7, "LCK-1"], [71.9, "LCK-3"]], vice: true },
  Elk: { base: 84, geral: 57.8, playoff: [[54.4, "LCK-1"], [54.4, "LCK-3"], [47.6, "LCK-1"], [62.3, "LCK-3"]], vice: true },
  ON: { base: 84, geral: 64.3, playoff: [[53.6, "LCK-1"], [65.5, "LCK-3"], [56.1, "LCK-1"], [68.0, "LCK-3"]], vice: true },
  // T1 — semi/3º (base 81). Trilha: LF(vs BLG), LR3(vs G2), LR2(vs TL), UR2(vs BLG).
  Zeus: { base: 81, geral: 64.1, playoff: [[61.3, "LPL-2"], [70.1, "LEC-4"], [64.2, "LCS-6"], [62.2, "LPL-2"]] },
  Oner: { base: 81, geral: 63.6, playoff: [[62.4, "LPL-2"], [64.4, "LEC-4"], [59.1, "LCS-6"], [58.4, "LPL-2"]] },
  Faker: { base: 81, geral: 62.9, playoff: [[53.6, "LPL-2"], [65.0, "LEC-4"], [67.4, "LCS-6"], [59.4, "LPL-2"]] },
  Gumayusi: { base: 81, geral: 56.3, playoff: [[46.4, "LPL-2"], [63.5, "LEC-4"], [57.5, "LCS-6"], [42.9, "LPL-2"]] },
  Keria: { base: 81, geral: 63.0, playoff: [[56.5, "LPL-2"], [68.6, "LEC-4"], [54.4, "LCS-6"], [55.5, "LPL-2"]] },
  // G2 — semi/4º (base 81). Trilha: LR3(vs T1), LR2(vs TES), R1(vs PSG).
  BrokenBlade: { base: 81, geral: 67.0, playoff: [[52.8, "LCK-3"], [74.2, "LPL-6"], [72.0, "PCS-8"]] },
  Yike: { base: 81, geral: 66.8, playoff: [[56.0, "LCK-3"], [75.8, "LPL-6"], [70.8, "PCS-8"]] },
  Caps: { base: 81, geral: 68.6, playoff: [[64.9, "LCK-3"], [70.1, "LPL-6"], [82.1, "PCS-8"]] },
  "Hans Sama": { base: 81, geral: 59.7, playoff: [[56.7, "LCK-3"], [71.7, "LPL-6"], [64.1, "PCS-8"]] },
  Mikyx: { base: 81, geral: 67.1, playoff: [[60.2, "LCK-3"], [80.9, "LPL-6"], [66.0, "PCS-8"]] },
  // Team Liquid — quartas (base 78). Trilha: LR2(vs T1), R1(vs FNC).
  Impact: { base: 78, geral: 54.1, playoff: [[50.6, "LCK-3"], [56.3, "LEC-8"]] },
  UmTi: { base: 78, geral: 57.3, playoff: [[58.6, "LCK-3"], [62.3, "LEC-8"]] },
  APA: { base: 78, geral: 66.2, playoff: [[65.3, "LCK-3"], [73.5, "LEC-8"]] },
  Yeon: { base: 78, geral: 57.9, playoff: [[57.3, "LCK-3"], [68.4, "LEC-8"]] },
  CoreJJ: { base: 78, geral: 61.9, playoff: [[64.4, "LCK-3"], [70.7, "LEC-8"]] },
  // Top Esports — quartas (base 78). Trilha: LR2(vs G2), UR2(vs GenG).
  "369": { base: 78, geral: 62.1, playoff: [[63.1, "LEC-4"], [56.2, "LCK-1"]] },
  Tian: { base: 78, geral: 61.6, playoff: [[53.0, "LEC-4"], [60.8, "LCK-1"]] },
  Creme: { base: 78, geral: 67.4, playoff: [[58.2, "LEC-4"], [68.4, "LCK-1"]] },
  JackeyLove: { base: 78, geral: 62.7, playoff: [[43.8, "LEC-4"], [61.8, "LCK-1"]] },
  Meiko: { base: 78, geral: 68.9, playoff: [[54.4, "LEC-4"], [68.5, "LCK-1"]] },
  // Fnatic — quartas (base 78). Trilha: R1(vs TL).
  Oscarinin: { base: 78, geral: 60.0, playoff: [[57.4, "LCS-6"]] },
  Razork: { base: 78, geral: 60.8, playoff: [[57.3, "LCS-6"]] },
  Humanoid: { base: 78, geral: 65.4, playoff: [[60.7, "LCS-6"]] },
  Noah: { base: 78, geral: 58.3, playoff: [[51.0, "LCS-6"]] },
  Jun: { base: 78, geral: 68.1, playoff: [[61.2, "LCS-6"]] },
  // PSG Talon — quartas (base 78). Trilha: R1(vs G2).
  Azhi: { base: 78, geral: 57.6, playoff: [[42.5, "LEC-4"]] },
  JunJia: { base: 78, geral: 60.4, playoff: [[44.0, "LEC-4"]] },
  Maple: { base: 78, geral: 61.3, playoff: [[47.8, "LEC-4"]] },
  Betty: { base: 78, geral: 56.3, playoff: [[44.2, "LEC-4"]] },
  Woody: { base: 78, geral: 64.6, playoff: [[50.1, "LEC-4"]] },
});
