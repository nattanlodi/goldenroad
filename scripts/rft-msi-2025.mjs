import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2025 — RFT geral (/players) + RFT por SÉRIE de mata-mata (páginas de match) do rft.gg.
// Mescla 80/20 COM força do oponente (opp-strength). Série = [rating,"LIGA-COLOC"].
// Finals MVP: Chovy (+2). MVP do torneio: Kiin (maior RFT geral entre finalistas, +2).
// playoff[] em ordem [mais avançada → menos].
// Colocações: GenG 1(LCK) · T1 2(LCK) · AL 3(LPL) · BLG 4(LPL) · FLY 5-6(LTA) · CFO 5-6(LCP) · G2/MKOI 7-8(LEC).
merge("MSI 2025", {
  // Gen.G — campeão (base 86). Trilha: Final(vs T1), UF(vs T1), UR2(vs AL). Chovy fMVP, Kiin MVP torneio.
  Kiin: { base: 86, geral: 72.3, playoff: [[72.8, "LCK-2"], [67.9, "LCK-2"], [69.2, "LPL-3"]], mvpTour: true },
  Canyon: { base: 86, geral: 67.1, playoff: [[64.5, "LCK-2"], [70.0, "LCK-2"], [63.6, "LPL-3"]] },
  Chovy: { base: 86, geral: 71.0, playoff: [[74.0, "LCK-2"], [66.8, "LCK-2"], [68.1, "LPL-3"]], mvpFinal: true },
  Ruler: { base: 86, geral: 69.0, playoff: [[65.9, "LCK-2"], [67.4, "LCK-2"], [68.9, "LPL-3"]] },
  Duro: { base: 86, geral: 65.7, playoff: [[62.9, "LCK-2"], [72.3, "LCK-2"], [62.6, "LPL-3"]] },
  // T1 — vice (base 84). Trilha: Final(vs GenG), LF(vs AL), UF(vs GenG), UR2(vs BLG). vice.
  Doran: { base: 84, geral: 62.1, playoff: [[51.0, "LCK-1"], [63.7, "LPL-3"], [59.9, "LCK-1"], [57.2, "LPL-4"]], vice: true },
  Oner: { base: 84, geral: 67.1, playoff: [[61.9, "LCK-1"], [71.5, "LPL-3"], [62.9, "LCK-1"], [70.6, "LPL-4"]], vice: true },
  Faker: { base: 84, geral: 63.3, playoff: [[56.1, "LCK-1"], [68.1, "LPL-3"], [62.5, "LCK-1"], [69.3, "LPL-4"]], vice: true },
  Gumayusi: { base: 84, geral: 68.6, playoff: [[62.9, "LCK-1"], [71.5, "LPL-3"], [68.7, "LCK-1"], [79.9, "LPL-4"]], vice: true },
  Keria: { base: 84, geral: 67.1, playoff: [[63.6, "LCK-1"], [70.3, "LPL-3"], [64.6, "LCK-1"], [73.5, "LPL-4"]], vice: true },
  // Anyone's Legend — semi/3º (base 81). Trilha: LF(vs T1), LR3(vs BLG), LR2(vs CFO), UR2(vs GenG).
  Flandre: { base: 81, geral: 68.3, playoff: [[64.5, "LCK-2"], [70.7, "LPL-4"], [67.5, "LCP-6"], [60.1, "LCK-1"]] },
  Tarzan: { base: 81, geral: 70.8, playoff: [[56.6, "LCK-2"], [81.8, "LPL-4"], [68.8, "LCP-6"], [70.2, "LCK-1"]] },
  Shanks: { base: 81, geral: 68.3, playoff: [[59.0, "LCK-2"], [75.9, "LPL-4"], [71.0, "LCP-6"], [60.1, "LCK-1"]] },
  Hope: { base: 81, geral: 67.0, playoff: [[62.4, "LCK-2"], [86.9, "LPL-4"], [67.8, "LCP-6"], [59.0, "LCK-1"]] },
  Kael: { base: 81, geral: 72.7, playoff: [[64.0, "LCK-2"], [87.8, "LPL-4"], [67.5, "LCP-6"], [68.4, "LCK-1"]] },
  // Bilibili Gaming — 4º (base 81). Trilha: LR3(vs AL), LR2(vs FLY), UR2(vs T1).
  Bin: { base: 81, geral: 69.7, playoff: [[64.3, "LPL-3"], [66.5, "LTA-6"], [69.9, "LCK-2"]] },
  Beichuan: { base: 81, geral: 63.8, playoff: [[52.9, "LPL-3"], [61.9, "LTA-6"], [54.6, "LCK-2"]] },
  Knight: { base: 81, geral: 72.6, playoff: [[59.2, "LPL-3"], [77.9, "LTA-6"], [64.1, "LCK-2"]] },
  Elk: { base: 81, geral: 68.5, playoff: [[55.3, "LPL-3"], [71.0, "LTA-6"], [59.3, "LCK-2"]] },
  ON: { base: 81, geral: 69.2, playoff: [[55.5, "LPL-3"], [69.9, "LTA-6"], [58.5, "LCK-2"]] },
  // FlyQuest — quartas (base 78). Trilha: LR2(vs BLG), R1(vs G2).
  Bwipo: { base: 78, geral: 68.0, playoff: [[67.5, "LPL-4"], [75.5, "LEC-8"]] },
  Inspired: { base: 78, geral: 68.7, playoff: [[66.3, "LPL-4"], [87.3, "LEC-8"]] },
  Quad: { base: 78, geral: 59.4, playoff: [[57.5, "LPL-4"], [61.9, "LEC-8"]] },
  Massu: { base: 78, geral: 62.9, playoff: [[56.5, "LPL-4"], [74.9, "LEC-8"]] },
  Busio: { base: 78, geral: 69.1, playoff: [[68.0, "LPL-4"], [80.6, "LEC-8"]] },
  // CTBC Flying Oyster — quartas (base 78). Trilha: LR2(vs AL), R1(vs MKOI).
  Driver: { base: 78, geral: 67.3, playoff: [[62.6, "LPL-3"], [66.5, "LEC-8"]] },
  JunJia: { base: 78, geral: 65.5, playoff: [[58.1, "LPL-3"], [67.8, "LEC-8"]] },
  HongQ: { base: 78, geral: 66.7, playoff: [[61.3, "LPL-3"], [70.4, "LEC-8"]] },
  Doggo: { base: 78, geral: 70.5, playoff: [[69.1, "LPL-3"], [70.9, "LEC-8"]] },
  Kaiwing: { base: 78, geral: 65.7, playoff: [[59.1, "LPL-3"], [69.0, "LEC-8"]] },
  // G2 — quartas (base 78). Trilha: R1(vs FLY).
  BrokenBlade: { base: 78, geral: 57.5, playoff: [[58.2, "LTA-6"]] },
  SkewMond: { base: 78, geral: 63.9, playoff: [[53.6, "LTA-6"]] },
  Caps: { base: 78, geral: 68.4, playoff: [[66.4, "LTA-6"]] },
  "Hans Sama": { base: 78, geral: 54.0, playoff: [[55.5, "LTA-6"]] },
  Labrov: { base: 78, geral: 57.9, playoff: [[56.1, "LTA-6"]] },
  // Movistar KOI — quartas (base 78). Trilha: R1(vs CFO).
  Myrwn: { base: 78, geral: 58.4, playoff: [[58.1, "LCP-6"]] },
  Elyoya: { base: 78, geral: 55.6, playoff: [[57.0, "LCP-6"]] },
  Jojopyun: { base: 78, geral: 60.1, playoff: [[60.3, "LCP-6"]] },
  Supa: { base: 78, geral: 61.6, playoff: [[57.7, "LCP-6"]] },
  Alvaro: { base: 78, geral: 63.1, playoff: [[61.9, "LCP-6"]] },
});
