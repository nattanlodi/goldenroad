import type { Team } from "../../types";

// MSI 2022 (Busan) — knockout de só 4 times (2 semis + final). Campeão: Royal Never Give Up
// sobre a T1 na final (3-2; o bi seguido da RNG). Notas: RFT geral (/players) + RFT por SÉRIE de
// mata-mata, mescla 80/20 COM força do oponente. Pipeline: scripts/rft-msi-calc.mjs +
// opp-strength.mjs + rft-msi-2022.mjs. Finals MVP: Ming (+2). MVP do torneio: Zeus (T1, +2).
export const MSI_2022: Team[] = [
  // 1º — Campeão (base 86). RNG; line chinesa equilibrada, Ming Finals MVP (+2).
  { id: "rng-msi-2022", team: "Royal Never Give Up", short: "RNG", year: 2022, league: "LPL", tournament: "msi", champion: true,
    players: [["TOP", "Bin", 90, "cn"], ["JNG", "Wei", 87, "cn"], ["MID", "Xiaohu", 89, "cn"], ["BOT", "GALA", 84, "cn"], ["SUP", "Ming", 88, "cn"]] },
  // 2º — Vice (base 84). T1; Zeus MONSTRO o torneio todo (MVP do torneio, RFT geral líder), Guma mal.
  { id: "t1-msi-2022", team: "T1", short: "T1", year: 2022, league: "LCK", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Zeus", 96, "kr"], ["JNG", "Oner", 87, "kr"], ["MID", "Faker", 87, "kr"], ["BOT", "Gumayusi", 81, "kr"], ["SUP", "Keria", 87, "kr"]] },
  // 3º-4º — Semifinal (base 81). Evil Geniuses, surpresa da LCS; line jovem (jojo/Danny).
  { id: "eg-msi-2022", team: "Evil Geniuses", short: "EG", year: 2022, league: "LCS", tournament: "msi", champion: false,
    players: [["TOP", "Impact", 74, "kr"], ["JNG", "Inspired", 79, "pl"], ["MID", "Jojopyun", 80, "ca"], ["BOT", "Danny", 79, "us"], ["SUP", "Vulcan", 79, "ca"]] },
  // 3º-4º — Semifinal (base 81). G2; varridos pela T1 na semi, Caps abaixo no mata-mata.
  { id: "g2-msi-2022", team: "G2 Esports", short: "G2", year: 2022, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "BrokenBlade", 74, "de"], ["JNG", "Jankos", 68, "pl"], ["MID", "Caps", 73, "dk"], ["BOT", "Flakked", 71, "es"], ["SUP", "Targamas", 73, "be"]] },
];
