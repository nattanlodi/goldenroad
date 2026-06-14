import type { Team } from "../../types";

// MSI 2018 (Berlim/Paris/Vancouver) — knockout de 4 times (2 semis + final). Campeão: Royal Never
// Give Up sobre a Kingzone DragonX na final (3-1). Uzi devastou (87.1 na final) e levou Finals MVP
// E MVP do torneio → DUPLO MVP (+3 → 100). Notas: RFT geral (/event/msi-2018/players) + RFT por
// SÉRIE de mata-mata, mescla 80/20 COM força do oponente. Pipeline: scripts/rft-msi-calc.mjs +
// opp-strength.mjs + rft-msi-2018.mjs. Rosters do bracket: RNG com Karsa no jungle (titular do
// mata-mata), Fnatic com Bwipo no top.
export const MSI_2018: Team[] = [
  // 1º — Campeão (base 86). RNG; Uzi DUPLO MVP (+3 → 100), Letme/Karsa 95.
  { id: "rng-msi-2018", team: "Royal Never Give Up", short: "RNG", year: 2018, league: "LPL", tournament: "msi", champion: true,
    players: [["TOP", "Letme", 92, "cn"], ["JNG", "Karsa", 92, "tw"], ["MID", "Xiaohu", 87, "cn"], ["BOT", "Uzi", 98, "cn"], ["SUP", "Ming", 90, "cn"]] },
  // 2º — Vice (base 84). Kingzone DragonX; foram bem na semi mas apagaram na final (PraY 35.1).
  { id: "kz-msi-2018", team: "Kingzone DragonX", short: "KZ", year: 2018, league: "LCK", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Khan", 79, "kr"], ["JNG", "Peanut", 76, "kr"], ["MID", "Bdd", 81, "kr"], ["BOT", "PraY", 79, "kr"], ["SUP", "GorillA", 77, "kr"]] },
  // 3º-4º — Semifinal (base 81). Fnatic; Caps o destaque (90), caiu pra RNG.
  { id: "fnc-msi-2018", team: "Fnatic", short: "FNC", year: 2018, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Bwipo", 77, "be"], ["JNG", "Broxah", 77, "dk"], ["MID", "Caps", 87, "dk"], ["BOT", "Rekkles", 79, "se"], ["SUP", "Hylissang", 78, "bg"]] },
  // 3º-4º — Semifinal (base 81). Flash Wolves; varrida pela Kingzone, Maple/SwordArt os melhores.
  { id: "fw-msi-2018", team: "Flash Wolves", short: "FW", year: 2018, league: "LMS", tournament: "msi", champion: false,
    players: [["TOP", "Hanabi", 75, "tw"], ["JNG", "Moojin", 71, "kr"], ["MID", "Maple", 76, "tw"], ["BOT", "Betty", 74, "tw"], ["SUP", "SwordArt", 79, "tw"]] },
];
