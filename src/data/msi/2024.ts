import type { Team } from "../../types";

// MSI 2024 (Chengdu) — campeão: Gen.G sobre a Bilibili Gaming (3-2; o bi do Chovy no MSI,
// monstruoso o torneio todo — MVP do torneio; Lehends Finals MVP). 8 times no bracket duplo.
// Notas: RFT geral (/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do oponente
// (região×colocação, curva assimétrica). Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs
// + rft-msi-2024.mjs. MVP: +2 finals / +2 torneio / +3 duplo. Tuplas: [role, nome, overall, país].
export const MSI_2024: Team[] = [
  // 1º — Campeão (base 86). Gen.G; Chovy líder do RFT (99, MVP torneio +2), Lehends fMVP (+2).
  { id: "geng-msi-2024", team: "Gen.G Esports", short: "GEN", year: 2024, league: "LCK", tournament: "msi", champion: true,
    players: [["TOP", "Kiin", 91, "kr"], ["JNG", "Canyon", 94, "kr"], ["MID", "Chovy", 99, "kr"], ["BOT", "Peyz", 88, "kr"], ["SUP", "Lehends", 94, "kr"]] },
  // 2º — Vice (base 84). Bilibili Gaming; enfrentou só LCK (Gen.G/T1). Bin/Knight monstros.
  { id: "blg-msi-2024", team: "Bilibili Gaming", short: "BLG", year: 2024, league: "LPL", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Bin", 95, "cn"], ["JNG", "Xun", 88, "cn"], ["MID", "knight", 93, "cn"], ["BOT", "Elk", 84, "cn"], ["SUP", "ON", 90, "cn"]] },
  // 3º — Semifinal (base 81). T1 dos campeões mundiais; abaixo do esperado, Gumayusi mal.
  { id: "t1-msi-2024", team: "T1", short: "T1", year: 2024, league: "LCK", tournament: "msi", champion: false,
    players: [["TOP", "Zeus", 85, "kr"], ["JNG", "Oner", 82, "kr"], ["MID", "Faker", 82, "kr"], ["BOT", "Gumayusi", 75, "kr"], ["SUP", "Keria", 81, "kr"]] },
  // 4º — Semifinal (base 81). G2, melhor campanha europeia em anos; Caps brilhou (88).
  { id: "g2-msi-2024", team: "G2 Esports", short: "G2", year: 2024, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "BrokenBlade", 83, "de"], ["JNG", "Yike", 84, "se"], ["MID", "Caps", 88, "dk"], ["BOT", "Hans Sama", 81, "fr"], ["SUP", "Mikyx", 85, "si"]] },
  // 5º-6º — Quartas (base 78). Team Liquid, melhor seed da LCS; APA/CoreJJ carregaram.
  { id: "tl-msi-2024", team: "Team Liquid", short: "TL", year: 2024, league: "LCS", tournament: "msi", champion: false,
    players: [["TOP", "Impact", 72, "kr"], ["JNG", "UmTi", 77, "kr"], ["MID", "APA", 84, "us"], ["BOT", "Yeon", 79, "us"], ["SUP", "CoreJJ", 82, "kr"]] },
  // 5º-6º — Quartas (base 78). Top Esports; Meiko e Creme os destaques, JackeyLove apagado.
  { id: "tes-msi-2024", team: "Top Esports", short: "TES", year: 2024, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "369", 80, "cn"], ["JNG", "Tian", 79, "cn"], ["MID", "Creme", 84, "cn"], ["BOT", "JackeyLove", 76, "cn"], ["SUP", "Meiko", 83, "cn"]] },
  // 7º-8º — Quartas (base 78). Fnatic; Jun o destaque, eliminada cedo.
  { id: "fnc-msi-2024", team: "Fnatic", short: "FNC", year: 2024, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Oscarinin", 70, "es"], ["JNG", "Razork", 70, "es"], ["MID", "Humanoid", 72, "cz"], ["BOT", "Noah", 66, "kr"], ["SUP", "Jun", 73, "kr"]] },
  // 7º-8º — Quartas (base 78). PSG Talon, campeã do PCS; varrida cedo (pela G2, LEC).
  { id: "psg-msi-2024", team: "PSG Talon", short: "PSG", year: 2024, league: "PCS", tournament: "msi", champion: false,
    players: [["TOP", "Azhi", 66, "tw"], ["JNG", "JunJia", 66, "tw"], ["MID", "Maple", 69, "tw"], ["BOT", "Betty", 66, "tw"], ["SUP", "Woody", 71, "tw"]] },
];
