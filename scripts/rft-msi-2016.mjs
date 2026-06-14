import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2016 (Xangai) — knockout de 4 times (2 semis + final). Campeão: SK Telecom T1 sobre a Counter
// Logic Gaming na final (3-0). RFT geral (/event/msi-2016/players) + por SÉRIE de mata-mata
// (/match/<id>-<slug>), mescla 80/20 COM força do oponente. Série = [rating,"LIGA-COLOC"]. MVP do
// torneio = Faker (oficial; também o maior RFT entre finalistas, 72.2) → +2. Não houve Finals MVP
// formal separado em 2016. Colocações: SKT 1(LCK) · CLG 2(LCS) · RNG 3-4(LPL) · FW 3-4(LMS).
// base: campeão 86 · vice 84 · semi 81.
merge("MSI 2016", {
  // SK Telecom T1 — campeão (base 86). Trilha: Final(vs CLG), Semi(vs RNG). Faker MVP do torneio (+2).
  Duke: { base: 86, geral: 71.8, playoff: [[61.8, "LCS-2"], [46.7, "LPL-3"]] },
  Blank: { base: 86, geral: 63.0, playoff: [[51.4, "LCS-2"], [55.4, "LPL-3"]] },
  Faker: { base: 86, geral: 72.2, playoff: [[76.9, "LCS-2"], [62.3, "LPL-3"]], mvpTour: true },
  Bang: { base: 86, geral: 64.3, playoff: [[69.9, "LCS-2"], [60.9, "LPL-3"]] },
  Wolf: { base: 86, geral: 65.5, playoff: [[65.7, "LCS-2"], [61.4, "LPL-3"]] },
  // Counter Logic Gaming — vice (base 84). Trilha: Final(vs SKT), Semi(vs FW). vice (final amaciada).
  Darshan: { base: 84, geral: 59.2, playoff: [[64.2, "LCK-1"], [73.6, "LMS-3"]], vice: true },
  Xmithie: { base: 84, geral: 55.9, playoff: [[61.2, "LCK-1"], [63.5, "LMS-3"]], vice: true },
  Huhi: { base: 84, geral: 62.6, playoff: [[53.8, "LCK-1"], [69.7, "LMS-3"]], vice: true },
  Stixxay: { base: 84, geral: 58.4, playoff: [[47.9, "LCK-1"], [68.9, "LMS-3"]], vice: true },
  aphromoo: { base: 84, geral: 60.7, playoff: [[49.7, "LCK-1"], [68.8, "LMS-3"]], vice: true },
  // Royal Never Give Up — semi/3-4 (base 81). Trilha: Semi(vs SKT). Looper o destaque, caiu pra SKT.
  Looper: { base: 81, geral: 62.6, playoff: [[77.4, "LCK-1"]] },
  Mlxg: { base: 81, geral: 66.2, playoff: [[60.8, "LCK-1"]] },
  Xiaohu: { base: 81, geral: 67.5, playoff: [[60.2, "LCK-1"]] },
  Wuxx: { base: 81, geral: 56.1, playoff: [[60.7, "LCK-1"]] },
  Mata: { base: 81, geral: 60.1, playoff: [[51.1, "LCK-1"]] },
  // Flash Wolves — semi/3-4 (base 81). Trilha: Semi(vs CLG). varrida; Maple o melhor.
  MMD: { base: 81, geral: 58.8, playoff: [[38.7, "LCS-2"]] },
  Karsa: { base: 81, geral: 54.0, playoff: [[45.8, "LCS-2"]] },
  Maple: { base: 81, geral: 67.0, playoff: [[59.7, "LCS-2"]] },
  NL: { base: 81, geral: 51.7, playoff: [[43.3, "LCS-2"]] },
  SwordArt: { base: 81, geral: 57.6, playoff: [[45.6, "LCS-2"]] },
});
