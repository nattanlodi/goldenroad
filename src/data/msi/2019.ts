import type { Team } from "../../types";

// MSI 2019 (Vietnã/Taiwan) — knockout de 4 times (2 semis + final). Campeão: G2 Esports sobre a
// Team Liquid na final (3-0; a line lendária da G2, melhor time ocidental da história). Notas:
// RFT geral (/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do oponente. Pipeline:
// scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2019.mjs. Caps DUPLO MVP (finals+torneio, 100).
export const MSI_2019: Team[] = [
  // 1º — Campeão (base 86). G2; demolição na final, Caps DUPLO MVP (+3 → 100), Mikyx 95.
  { id: "g2-msi-2019", team: "G2 Esports", short: "G2", year: 2019, league: "LEC", tournament: "msi", champion: true,
    players: [["TOP", "Wunder", 91, "dk"], ["JNG", "Jankos", 89, "pl"], ["MID", "Caps", 100, "dk"], ["BOT", "Perkz", 85, "hr"], ["SUP", "Mikyx", 95, "si"]] },
  // 2º — Vice (base 84). Team Liquid; CoreJJ/Jensen carregaram, Doublelift/Impact mal na final.
  { id: "tl-msi-2019", team: "Team Liquid", short: "TL", year: 2019, league: "LCS", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Impact", 76, "kr"], ["JNG", "Xmithie", 79, "ph"], ["MID", "Jensen", 89, "dk"], ["BOT", "Doublelift", 78, "us"], ["SUP", "CoreJJ", 91, "kr"]] },
  // 3º-4º — Semifinal (base 81). Invictus Gaming, campeã mundial vigente; TheShy o destaque, caiu pra TL.
  { id: "ig-msi-2019", team: "Invictus Gaming", short: "IG", year: 2019, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "TheShy", 84, "kr"], ["JNG", "Ning", 70, "cn"], ["MID", "Rookie", 78, "kr"], ["BOT", "JackeyLove", 72, "cn"], ["SUP", "Baolan", 73, "cn"]] },
  // 3º-4º — Semifinal (base 81). SK Telecom T1; o retorno do Faker, line forte mas varrida pela G2.
  { id: "skt-msi-2019", team: "SK Telecom T1", short: "SKT", year: 2019, league: "LCK", tournament: "msi", champion: false,
    players: [["TOP", "Khan", 83, "kr"], ["JNG", "Clid", 83, "kr"], ["MID", "Faker", 82, "kr"], ["BOT", "Teddy", 81, "kr"], ["SUP", "Mata", 83, "kr"]] },
];
