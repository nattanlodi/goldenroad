import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2023 (Londres) — 1º MSI de bracket duplo. Campeão: JD Gaming sobre a Bilibili Gaming na
// final (3-2). 8 times no bracket. RFT geral (/players) + por SÉRIE de mata-mata, mescla 80/20
// COM força do oponente. Série = [rating,"LIGA-COLOC"]. Knight = Finals MVP E MVP do torneio
// (maior RFT geral entre finalistas, 77.3) → DUPLO MVP (+3). playoff em ordem [mais avançada → menos].
// Colocações: JDG 1(LPL) · BLG 2(LPL) · T1 3(LCK) · GEN 4(LCK) · G2 5-6(LEC) · C9 5-6(LCS) · MAD/GG 7-8.
merge("MSI 2023", {
  // JD Gaming — campeão (base 86). Trilha: Final(vs BLG), UF(vs T1), UR2(vs BLG). Knight duplo MVP (+3).
  "369": { base: 86, geral: 65.9, playoff: [[61.8, "LPL-2"], [62.4, "LCK-3"], [70.4, "LPL-2"]] },
  Kanavi: { base: 86, geral: 74.1, playoff: [[79.0, "LPL-2"], [70.1, "LCK-3"], [65.2, "LPL-2"]] },
  Knight: { base: 86, geral: 77.3, playoff: [[77.3, "LPL-2"], [70.4, "LCK-3"], [75.5, "LPL-2"]], mvpFinal: true, mvpTour: true },
  Ruler: { base: 86, geral: 74.9, playoff: [[68.7, "LPL-2"], [65.0, "LCK-3"], [90.3, "LPL-2"]] },
  MISSING: { base: 86, geral: 73.7, playoff: [[71.8, "LPL-2"], [69.2, "LCK-3"], [84.2, "LPL-2"]] },
  // Bilibili Gaming — vice (base 84). Trilha: Final(vs JDG), LF(vs T1), LR3(vs GEN), LR2(vs G2), UR2(vs JDG). vice.
  Bin: { base: 84, geral: 68.3, playoff: [[59.8, "LPL-1"], [55.6, "LCK-3"], [72.8, "LCK-4"], [68.4, "LEC-6"], [65.7, "LPL-1"]], vice: true },
  Xun: { base: 84, geral: 65.5, playoff: [[43.3, "LPL-1"], [70.3, "LCK-3"], [67.3, "LCK-4"], [63.5, "LEC-6"], [61.9, "LPL-1"]], vice: true },
  YaGao: { base: 84, geral: 61.2, playoff: [[44.5, "LPL-1"], [59.2, "LCK-3"], [65.6, "LCK-4"], [66.2, "LEC-6"], [53.9, "LPL-1"]], vice: true },
  Elk: { base: 84, geral: 72.9, playoff: [[43.8, "LPL-1"], [75.3, "LCK-3"], [80.1, "LCK-4"], [73.5, "LEC-6"], [62.3, "LPL-1"]], vice: true },
  ON: { base: 84, geral: 74.2, playoff: [[53.4, "LPL-1"], [71.2, "LCK-3"], [78.3, "LCK-4"], [78.1, "LEC-6"], [60.8, "LPL-1"]], vice: true },
  // T1 — semi/3º (base 81). Trilha: LF(vs BLG), UF(vs JDG), UR2(vs GEN).
  Zeus: { base: 81, geral: 66.8, playoff: [[66.1, "LPL-2"], [61.7, "LPL-1"], [69.3, "LCK-4"]] },
  Oner: { base: 81, geral: 65.3, playoff: [[61.6, "LPL-2"], [57.4, "LPL-1"], [69.0, "LCK-4"]] },
  Faker: { base: 81, geral: 57.2, playoff: [[57.4, "LPL-2"], [50.1, "LPL-1"], [58.2, "LCK-4"]] },
  Gumayusi: { base: 81, geral: 66.8, playoff: [[57.1, "LPL-2"], [62.5, "LPL-1"], [72.7, "LCK-4"]] },
  Keria: { base: 81, geral: 63.7, playoff: [[63.0, "LPL-2"], [56.9, "LPL-1"], [64.1, "LCK-4"]] },
  // Gen.G — semi/4º (base 81). Trilha: LR3(vs BLG), LR2(vs C9), UR2(vs T1).
  Doran: { base: 81, geral: 59.2, playoff: [[43.7, "LPL-2"], [69.7, "LCS-6"], [51.4, "LCK-3"]] },
  Peanut: { base: 81, geral: 65.3, playoff: [[54.6, "LPL-2"], [81.8, "LCS-6"], [56.3, "LCK-3"]] },
  Chovy: { base: 81, geral: 69.6, playoff: [[55.5, "LPL-2"], [77.3, "LCS-6"], [61.0, "LCK-3"]] },
  Peyz: { base: 81, geral: 61.5, playoff: [[58.4, "LPL-2"], [66.6, "LCS-6"], [59.4, "LCK-3"]] },
  Delight: { base: 81, geral: 64.3, playoff: [[58.0, "LPL-2"], [74.0, "LCS-6"], [59.0, "LCK-3"]] },
  // G2 — quartas (base 78). Trilha: LR2(vs BLG), R1(vs MAD).
  BrokenBlade: { base: 78, geral: 69.1, playoff: [[55.7, "LPL-2"], [75.7, "LEC-8"]] },
  Yike: { base: 78, geral: 68.0, playoff: [[64.4, "LPL-2"], [69.3, "LEC-8"]] },
  Caps: { base: 78, geral: 55.2, playoff: [[48.1, "LPL-2"], [53.4, "LEC-8"]] },
  "Hans Sama": { base: 78, geral: 61.1, playoff: [[56.5, "LPL-2"], [66.1, "LEC-8"]] },
  Mikyx: { base: 78, geral: 67.3, playoff: [[61.0, "LPL-2"], [65.7, "LEC-8"]] },
  // Cloud9 — quartas (base 78). Trilha: LR2(vs GEN), R1(vs GG).
  Fudge: { base: 78, geral: 55.4, playoff: [[54.4, "LCK-4"], [63.6, "LCS-8"]] },
  Blaber: { base: 78, geral: 55.2, playoff: [[30.2, "LCK-4"], [67.3, "LCS-8"]] },
  EMENES: { base: 78, geral: 57.6, playoff: [[47.8, "LCK-4"], [69.3, "LCS-8"]] },
  Berserker: { base: 78, geral: 57.5, playoff: [[44.1, "LCK-4"], [65.0, "LCS-8"]] },
  Zven: { base: 78, geral: 57.1, playoff: [[37.7, "LCK-4"], [63.1, "LCS-8"]] },
  // MAD Lions — quartas (base 78). Trilha: R1(vs G2).
  Chasy: { base: 78, geral: 45.7, playoff: [[41.5, "LEC-6"]] },
  Elyoya: { base: 78, geral: 49.2, playoff: [[53.7, "LEC-6"]] },
  Nisqy: { base: 78, geral: 56.1, playoff: [[68.6, "LEC-6"]] },
  Carzzy: { base: 78, geral: 51.3, playoff: [[60.3, "LEC-6"]] },
  Hylissang: { base: 78, geral: 48.8, playoff: [[58.8, "LEC-6"]] },
  // Golden Guardians — quartas (base 78). Trilha: R1(vs C9).
  Licorice: { base: 78, geral: 67.3, playoff: [[63.6, "LCS-6"]] },
  River: { base: 78, geral: 62.9, playoff: [[58.6, "LCS-6"]] },
  Gori: { base: 78, geral: 64.4, playoff: [[51.5, "LCS-6"]] },
  Stixxay: { base: 78, geral: 61.7, playoff: [[53.3, "LCS-6"]] },
  Huhi: { base: 78, geral: 68.8, playoff: [[59.8, "LCS-6"]] },
});
