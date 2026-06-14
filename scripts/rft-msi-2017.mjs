import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2017 (Brasil — Rio/São Paulo/Brasília) — knockout de 4 times (2 semis + final). Campeão:
// SK Telecom T1 sobre a G2 Esports na final (3-1; o bi da SKT). RFT geral (/event/msi-2017/players)
// + por SÉRIE de mata-mata (/match/<id>-<slug>), mescla 80/20 COM força do oponente. Série =
// [rating,"LIGA-COLOC"]. MVP: NÃO houve Finals MVP formal separado em 2017. MVP oficial do torneio
// = Wolf (+2). Pela régua RFT, o maior geral entre finalistas é Huni (71.0) → também +2 (decisão do
// usuário: os dois ganham +2). Colocações: SKT 1(LCK) · G2 2(LEC) · WE 3-4(LPL) · FW 3-4(LMS).
// base: campeão 86 · vice 84 · semi 81.
merge("MSI 2017", {
  // SK Telecom T1 — campeão (base 86). Trilha: Final(vs G2), Semi(vs FW). Huni +2 (maior RFT finalistas),
  // Wolf +2 (MVP oficial do torneio).
  Huni: { base: 86, geral: 71.0, playoff: [[68.4, "LEC-2"], [81.8, "LMS-3"]], mvpTour: true },
  Peanut: { base: 86, geral: 66.5, playoff: [[78.7, "LEC-2"], [46.0, "LMS-3"]] },
  Faker: { base: 86, geral: 68.9, playoff: [[43.3, "LEC-2"], [70.7, "LMS-3"]] },
  Bang: { base: 86, geral: 57.6, playoff: [[70.2, "LEC-2"], [72.4, "LMS-3"]] },
  Wolf: { base: 86, geral: 64.0, playoff: [[66.7, "LEC-2"], [65.9, "LMS-3"]], mvpTour: true },
  // G2 Esports — vice (base 84). Trilha: Final(vs SKT), Semi(vs WE). vice (final amaciada). Perkz carregou.
  Expect: { base: 84, geral: 61.0, playoff: [[54.8, "LCK-1"], [79.6, "LPL-3"]], vice: true },
  Trick: { base: 84, geral: 50.9, playoff: [[42.7, "LCK-1"], [68.1, "LPL-3"]], vice: true },
  Perkz: { base: 84, geral: 63.1, playoff: [[87.3, "LCK-1"], [93.4, "LPL-3"]], vice: true },
  Zven: { base: 84, geral: 52.2, playoff: [[34.0, "LCK-1"], [54.2, "LPL-3"]], vice: true },
  Mithy: { base: 84, geral: 55.8, playoff: [[45.7, "LCK-1"], [76.1, "LPL-3"]], vice: true },
  // Team WE — semi/3-4 (base 81). Trilha: Semi(vs G2). caiu pra G2; xiye o melhor no geral.
  "957": { base: 81, geral: 62.5, playoff: [[46.4, "LEC-2"]] },
  Condi: { base: 81, geral: 53.9, playoff: [[48.9, "LEC-2"]] },
  xiye: { base: 81, geral: 68.9, playoff: [[53.5, "LEC-2"]] },
  Mystic: { base: 81, geral: 57.8, playoff: [[59.7, "LEC-2"]] },
  zero: { base: 81, geral: 58.3, playoff: [[31.7, "LEC-2"]] },
  // Flash Wolves — semi/3-4 (base 81). Trilha: Semi(vs SKT). varrida; Karsa/Maple os melhores.
  MMD: { base: 81, geral: 58.9, playoff: [[40.6, "LCK-1"]] },
  Karsa: { base: 81, geral: 60.6, playoff: [[62.5, "LCK-1"]] },
  Maple: { base: 81, geral: 64.4, playoff: [[59.6, "LCK-1"]] },
  Betty: { base: 81, geral: 50.6, playoff: [[44.2, "LCK-1"]] },
  SwordArt: { base: 81, geral: 63.5, playoff: [[48.3, "LCK-1"]] },
});
