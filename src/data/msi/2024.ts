import type { Team } from "../../types";

// MSI 2024 (Chengdu) — campeão: Gen.G sobre a Bilibili Gaming (3-2; o bi do Chovy no MSI,
// monstruoso o torneio todo — MVP do torneio; Lehends Finals MVP). 8 times no bracket duplo.
// Notas: RFT geral (/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do oponente
// (região×colocação, curva assimétrica). Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs
// + rft-msi-2024.mjs. MVP: +2 finals / +2 torneio / +3 duplo. Tuplas: [role, nome, overall, país].
export const MSI_2024: Team[] = [
  // 1º — Campeão (base 86). Gen.G; Chovy líder do RFT (99, MVP torneio +2), Lehends fMVP (+2).
  { id: "geng-msi-2024", team: "Gen.G Esports", short: "GEN", year: 2024, league: "LCK", tournament: "msi", champion: true,
    players: [["TOP", "Kiin", 89, "kr"], ["JNG", "Canyon", 92, "kr"], ["MID", "Chovy", 96, "kr"], ["BOT", "Peyz", 86, "kr"], ["SUP", "Lehends", 90, "kr"]] },
  // 2º — Vice (base 84). Bilibili Gaming; enfrentou só LCK (Gen.G/T1). Bin/Knight monstros.
  { id: "blg-msi-2024", team: "Bilibili Gaming", short: "BLG", year: 2024, league: "LPL", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Bin", 93, "cn"], ["JNG", "Xun", 86, "cn"], ["MID", "knight", 90, "cn"], ["BOT", "Elk", 82, "cn"], ["SUP", "ON", 88, "cn"]] },
  // 3º — Semifinal (base 81). T1 dos campeões mundiais; abaixo do esperado, Gumayusi mal.
  { id: "t1-msi-2024", team: "T1", short: "T1", year: 2024, league: "LCK", tournament: "msi", champion: false,
    players: [["TOP", "Zeus", 83, "kr"], ["JNG", "Oner", 80, "kr"], ["MID", "Faker", 80, "kr"], ["BOT", "Gumayusi", 73, "kr"], ["SUP", "Keria", 79, "kr"]] },
  // 4º — Semifinal (base 81). G2, melhor campanha europeia em anos; Caps brilhou (88).
  { id: "g2-msi-2024", team: "G2 Esports", short: "G2", year: 2024, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "BrokenBlade", 81, "de"], ["JNG", "Yike", 82, "se"], ["MID", "Caps", 85, "dk"], ["BOT", "Hans Sama", 81, "fr"], ["SUP", "Mikyx", 83, "si"]] },
  // 5º-6º — Quartas (base 78). Team Liquid, melhor seed da LCS; APA/CoreJJ carregaram.
  { id: "tl-msi-2024", team: "Team Liquid", short: "TL", year: 2024, league: "LCS", tournament: "msi", champion: false,
    players: [["TOP", "Impact", 70, "kr"], ["JNG", "UmTi", 75, "kr"], ["MID", "APA", 82, "us"], ["BOT", "Yeon", 76, "us"], ["SUP", "CoreJJ", 80, "kr"]] },
  // 5º-6º — Quartas (base 78). Top Esports; Meiko e Creme os destaques, JackeyLove apagado.
  { id: "tes-msi-2024", team: "Top Esports", short: "TES", year: 2024, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "369", 78, "cn"], ["JNG", "Tian", 77, "cn"], ["MID", "Creme", 82, "cn"], ["BOT", "JackeyLove", 74, "cn"], ["SUP", "Meiko", 81, "cn"]] },
  // 7º-8º — Quartas (base 78). Fnatic; Jun o destaque, eliminada cedo.
  { id: "fnc-msi-2024", team: "Fnatic", short: "FNC", year: 2024, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Oscarinin", 69, "es"], ["JNG", "Razork", 69, "es"], ["MID", "Humanoid", 71, "cz"], ["BOT", "Noah", 65, "kr"], ["SUP", "Jun", 72, "kr"]] },
  // 7º-8º — Quartas (base 78). PSG Talon, campeã do PCS; varrida cedo (pela G2, LEC).
  { id: "psg-msi-2024", team: "PSG Talon", short: "PSG", year: 2024, league: "PCS", tournament: "msi", champion: false,
    players: [["TOP", "Azhi", 65, "tw"], ["JNG", "JunJia", 66, "tw"], ["MID", "Maple", 68, "tw"], ["BOT", "Betty", 65, "tw"], ["SUP", "Woody", 70, "tw"]] },
];
