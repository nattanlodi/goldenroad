import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2019 (Vietnã/Taiwan) — knockout de 4 times (2 semis + final). Campeão: G2 Esports sobre a
// Team Liquid na final (3-0; a line lendária da G2). RFT geral (/players) + por SÉRIE de mata-mata,
// mescla 80/20 COM força do oponente. Série = [rating,"LIGA-COLOC"]. Caps = Finals MVP E MVP do
// torneio (maior RFT geral entre finalistas, 67.1) → DUPLO MVP (+3).
// Colocações: G2 1(LEC) · TL 2(LCS) · IG 3-4(LPL) · SKT 3-4(LCK). base: campeão 86 · vice 84 · semi 81.
merge("MSI 2019", {
  // G2 Esports — campeão (base 86). Trilha: Final(vs TL), Semi(vs SKT). Caps DUPLO MVP (+3).
  Wunder: { base: 86, geral: 63.0, playoff: [[75.7, "LCS-2"], [60.3, "LCK-3"]] },
  Jankos: { base: 86, geral: 59.6, playoff: [[78.4, "LCS-2"], [55.6, "LCK-3"]] },
  Caps: { base: 86, geral: 67.1, playoff: [[87.5, "LCS-2"], [61.9, "LCK-3"]], mvpFinal: true, mvpTour: true },
  Perkz: { base: 86, geral: 56.6, playoff: [[70.8, "LCS-2"], [53.4, "LCK-3"]] },
  Mikyx: { base: 86, geral: 64.5, playoff: [[82.1, "LCS-2"], [62.6, "LCK-3"]] },
  // Team Liquid — vice (base 84). Trilha: Final(vs G2), Semi(vs IG). vice (final amaciada).
  Impact: { base: 84, geral: 56.8, playoff: [[45.2, "LEC-1"], [55.4, "LPL-4"]], vice: true },
  Xmithie: { base: 84, geral: 54.3, playoff: [[45.9, "LEC-1"], [59.7, "LPL-4"]], vice: true },
  Jensen: { base: 84, geral: 61.5, playoff: [[50.0, "LEC-1"], [72.0, "LPL-4"]], vice: true },
  Doublelift: { base: 84, geral: 50.9, playoff: [[31.7, "LEC-1"], [64.2, "LPL-4"]], vice: true },
  CoreJJ: { base: 84, geral: 60.1, playoff: [[41.1, "LEC-1"], [78.0, "LPL-4"]], vice: true },
  // Invictus Gaming — semi/3-4 (base 81). Trilha: Semi(vs TL). TheShy o destaque.
  TheShy: { base: 81, geral: 64.0, playoff: [[68.5, "LCS-2"]] },
  Ning: { base: 81, geral: 62.6, playoff: [[51.3, "LCS-2"]] },
  Rookie: { base: 81, geral: 64.3, playoff: [[60.4, "LCS-2"]] },
  JackeyLove: { base: 81, geral: 62.9, playoff: [[53.6, "LCS-2"]] },
  Baolan: { base: 81, geral: 62.8, playoff: [[54.9, "LCS-2"]] },
  // SK Telecom T1 — semi/3-4 (base 81). Trilha: Semi(vs G2). line equilibrada, varrida pela G2.
  Khan: { base: 81, geral: 67.0, playoff: [[60.0, "LEC-1"]] },
  Clid: { base: 81, geral: 69.3, playoff: [[58.6, "LEC-1"]] },
  Faker: { base: 81, geral: 68.8, playoff: [[57.3, "LEC-1"]] },
  Teddy: { base: 81, geral: 58.5, playoff: [[60.2, "LEC-1"]] },
  Mata: { base: 81, geral: 62.9, playoff: [[60.4, "LEC-1"]] },
});
