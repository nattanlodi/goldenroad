import { mergeMsi as merge } from "./rft-msi-calc.mjs";
// MSI 2018 (Berlim/Paris/Vancouver) — knockout de 4 times (2 semis + final). Campeão: Royal Never
// Give Up sobre a Kingzone DragonX na final (3-1). RFT geral (/event/msi-2018/players) + por SÉRIE
// de mata-mata (páginas /match/<id>-<slug>), mescla 80/20 COM força do oponente. Série =
// [rating,"LIGA-COLOC"]. Uzi = Finals MVP E MVP do torneio (maior RFT geral entre finalistas, 73.7)
// → DUPLO MVP (+3). Colocações: RNG 1(LPL) · KZ 2(LCK) · FNC 3-4(LEC) · FW 3-4(LMS).
// base: campeão 86 · vice 84 · semi 81. Rosters do mata-mata: RNG usou Karsa no jungle (titular do
// bracket; Mlxg só na semi), Fnatic usou Bwipo no top. Kingzone aparece como "DRX" no rft.gg (rebrand).
merge("MSI 2018", {
  // Royal Never Give Up — campeão (base 86). Trilha: Final(vs KZ), Semi(vs FNC). Uzi DUPLO MVP (+3).
  Letme: { base: 86, geral: 66.1, playoff: [[75.2, "LCK-2"], [77.8, "LEC-3"]] },
  Karsa: { base: 86, geral: 70.8, playoff: [[78.5, "LCK-2"], [71.3, "LEC-3"]] },
  Xiaohu: { base: 86, geral: 69.7, playoff: [[64.1, "LCK-2"], [61.0, "LEC-3"]] },
  Uzi: { base: 86, geral: 73.7, playoff: [[87.1, "LCK-2"], [76.9, "LEC-3"]], mvpFinal: true, mvpTour: true },
  Ming: { base: 86, geral: 67.1, playoff: [[77.2, "LCK-2"], [64.9, "LEC-3"]] },
  // Kingzone DragonX — vice (base 84). Trilha: Final(vs RNG), Semi(vs FW). vice (final amaciada).
  Khan: { base: 84, geral: 66.6, playoff: [[51.6, "LPL-1"], [72.3, "LMS-3"]], vice: true },
  Peanut: { base: 84, geral: 58.4, playoff: [[39.4, "LPL-1"], [69.2, "LMS-3"]], vice: true },
  Bdd: { base: 84, geral: 61.6, playoff: [[49.8, "LPL-1"], [81.2, "LMS-3"]], vice: true },
  PraY: { base: 84, geral: 58.5, playoff: [[35.1, "LPL-1"], [83.8, "LMS-3"]], vice: true },
  GorillA: { base: 84, geral: 58.8, playoff: [[45.9, "LPL-1"], [69.0, "LMS-3"]], vice: true },
  // Fnatic — semi/3-4 (base 81). Trilha: Semi(vs RNG). Caps o destaque. Bwipo titular do top na semi.
  Bwipo: { base: 81, geral: 61.4, playoff: [[49.5, "LPL-1"]] },
  Broxah: { base: 81, geral: 59.1, playoff: [[51.2, "LPL-1"]] },
  Caps: { base: 81, geral: 69.6, playoff: [[68.9, "LPL-1"]] },
  Rekkles: { base: 81, geral: 60.7, playoff: [[56.2, "LPL-1"]] },
  Hylissang: { base: 81, geral: 58.8, playoff: [[53.0, "LPL-1"]] },
  // Flash Wolves — semi/3-4 (base 81). Trilha: Semi(vs KZ). varrida; Maple/SwordArt os melhores.
  Hanabi: { base: 81, geral: 58.5, playoff: [[48.2, "LCK-2"]] },
  Moojin: { base: 81, geral: 62.9, playoff: [[36.1, "LCK-2"]] },
  Maple: { base: 81, geral: 64.2, playoff: [[48.7, "LCK-2"]] },
  Betty: { base: 81, geral: 61.3, playoff: [[44.2, "LCK-2"]] },
  SwordArt: { base: 81, geral: 65.8, playoff: [[53.9, "LCK-2"]] },
});
