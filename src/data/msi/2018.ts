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
    players: [["TOP", "Letme", 95, "cn"], ["JNG", "Karsa", 95, "tw"], ["MID", "Xiaohu", 89, "cn"], ["BOT", "Uzi", 100, "cn"], ["SUP", "Ming", 93, "cn"]] },
  // 2º — Vice (base 84). Kingzone DragonX; foram bem na semi mas apagaram na final (PraY 35.1).
  { id: "kz-msi-2018", team: "Kingzone DragonX", short: "KZ", year: 2018, league: "LCK", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Khan", 81, "kr"], ["JNG", "Peanut", 77, "kr"], ["MID", "Bdd", 83, "kr"], ["BOT", "PraY", 81, "kr"], ["SUP", "GorillA", 78, "kr"]] },
  // 3º-4º — Semifinal (base 81). Fnatic; Caps o destaque (90), caiu pra RNG.
  { id: "fnc-msi-2018", team: "Fnatic", short: "FNC", year: 2018, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Bwipo", 78, "be"], ["JNG", "Broxah", 78, "dk"], ["MID", "Caps", 90, "dk"], ["BOT", "Rekkles", 81, "se"], ["SUP", "Hylissang", 79, "bg"]] },
  // 3º-4º — Semifinal (base 81). Flash Wolves; varrida pela Kingzone, Maple/SwordArt os melhores.
  { id: "fw-msi-2018", team: "Flash Wolves", short: "FW", year: 2018, league: "LMS", tournament: "msi", champion: false,
    players: [["TOP", "Hanabi", 76, "tw"], ["JNG", "Moojin", 71, "kr"], ["MID", "Maple", 78, "tw"], ["BOT", "Betty", 75, "tw"], ["SUP", "SwordArt", 81, "tw"]] },
];
