import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2015 (Tallahassee, EUA) — a PRIMEIRA edição do MSI. Knockout de 4 times (2 semis + final).
// Campeão: EDward Gaming sobre a SK Telecom T1 na final (3-2; a maior zebra/glória da LPL). RFT geral
// (/event/msi-2015/players) + por SÉRIE de mata-mata (/match/<id>-<slug>), mescla 80/20 COM força do
// oponente. Série = [rating,"LIGA-COLOC"]. MVP do torneio = Clearlove (oficial, jungle EDG — aparece
// como "Mann" no rft.gg, imagem clearlove.webp) +2; maior RFT entre finalistas = Meiko (75.2) +2
// (mesma regra do 2017: os dois ganham +2). SKT rodíziou o mid: Easyhoon jogou a FINAL (91.3) e é o
// titular do card; Faker jogou a semi. Colocações: EDG 1(LPL) · SKT 2(LCK) · FNC 3-4(LEC) · ahq 3-4(LMS).
// base: campeão 86 · vice 84 · semi 81.
merge("MSI 2015", {
  // EDward Gaming — campeão (base 86). Trilha: Final(vs SKT), Semi(vs ahq). Clearlove MVP torneio (+2).
  Korol: { base: 86, geral: 74.0, playoff: [[53.6, "LCK-2"], [64.7, "LMS-3"]] },
  Clearlove: { base: 86, geral: 63.4, playoff: [[32.8, "LCK-2"], [64.8, "LMS-3"]], mvpTour: true },
  PawN: { base: 86, geral: 68.9, playoff: [[35.9, "LCK-2"], [78.1, "LMS-3"]] },
  Deft: { base: 86, geral: 63.1, playoff: [[37.8, "LCK-2"], [62.7, "LMS-3"]] },
  Meiko: { base: 86, geral: 75.2, playoff: [[47.2, "LCK-2"], [83.7, "LMS-3"]], mvpTour: true },
  // SK Telecom T1 — vice (base 84). Trilha: Final(vs EDG), Semi(vs FNC). vice (final amaciada).
  // Easyhoon jogou só a final (mid titular do card). Os outros 4 jogaram final + semi.
  MaRin: { base: 84, geral: 60.6, playoff: [[60.6, "LPL-1"], [68.1, "LEC-3"]], vice: true },
  Bengi: { base: 84, geral: 52.6, playoff: [[73.8, "LPL-1"], [64.8, "LEC-3"]], vice: true },
  Easyhoon: { base: 84, geral: 73.0, playoff: [[91.3, "LPL-1"]], vice: true },
  Bang: { base: 84, geral: 50.4, playoff: [[54.4, "LPL-1"], [62.0, "LEC-3"]], vice: true },
  Wolf: { base: 84, geral: 57.2, playoff: [[71.4, "LPL-1"], [72.7, "LEC-3"]], vice: true },
  // Fnatic — semi/3-4 (base 81). Trilha: Semi(vs SKT). varrida pela SKT; Huni o destaque.
  Huni: { base: 81, geral: 59.9, playoff: [[61.0, "LCK-2"]] },
  Reignover: { base: 81, geral: 57.1, playoff: [[47.0, "LCK-2"]] },
  FEBIVEN: { base: 81, geral: 61.5, playoff: [[28.9, "LCK-2"]] },
  Steeelback: { base: 81, geral: 46.3, playoff: [[46.9, "LCK-2"]] },
  YellOwStaR: { base: 81, geral: 57.7, playoff: [[35.6, "LCK-2"]] },
  // ahq eSports Club — semi/3-4 (base 81). Trilha: Semi(vs EDG). varrida; Westdoor/Albis os melhores.
  Ziv: { base: 81, geral: 53.3, playoff: [[40.2, "LPL-1"]] },
  Mountain: { base: 81, geral: 53.4, playoff: [[40.8, "LPL-1"]] },
  Westdoor: { base: 81, geral: 64.6, playoff: [[59.7, "LPL-1"]] },
  An: { base: 81, geral: 52.1, playoff: [[45.6, "LPL-1"]] },
  Albis: { base: 81, geral: 65.7, playoff: [[55.6, "LPL-1"]] },
});
