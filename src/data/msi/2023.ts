import type { Team } from "../../types";

// MSI 2023 (Londres) — 1º MSI de bracket duplo. Campeão: JD Gaming sobre a Bilibili Gaming (3-2;
// a superline do Ruler dominou; Knight Finals MVP E MVP do torneio = DUPLO MVP, Centurião 100).
// 8 times no bracket. Notas: RFT geral (/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM
// força do oponente. Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2023.mjs.
export const MSI_2023: Team[] = [
  // 1º — Campeão (base 86). JD Gaming, line montada pra dominar; Knight DUPLO MVP (+3 → 100).
  { id: "jdg-msi-2023", team: "JD Gaming", short: "JDG", year: 2023, league: "LPL", tournament: "msi", champion: true,
    players: [["TOP", "369", 92, "cn"], ["JNG", "Kanavi", 97, "kr"], ["MID", "knight", 100, "cn"], ["BOT", "Ruler", 97, "kr"], ["SUP", "MISSING", 97, "cn"]] },
  // 2º — Vice (base 84). Bilibili Gaming; subiu da lower (5 séries), Elk e ON os destaques.
  { id: "blg-msi-2023", team: "Bilibili Gaming", short: "BLG", year: 2023, league: "LPL", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Bin", 89, "cn"], ["JNG", "Xun", 88, "cn"], ["MID", "Yagao", 85, "cn"], ["BOT", "Elk", 92, "cn"], ["SUP", "ON", 92, "cn"]] },
  // 3º — Semifinal (base 81). T1; Zeus o destaque, Faker abaixo do habitual no MSI.
  { id: "t1-msi-2023", team: "T1", short: "T1", year: 2023, league: "LCK", tournament: "msi", champion: false,
    players: [["TOP", "Zeus", 88, "kr"], ["JNG", "Oner", 85, "kr"], ["MID", "Faker", 80, "kr"], ["BOT", "Gumayusi", 87, "kr"], ["SUP", "Keria", 84, "kr"]] },
  // 4º — Semifinal (base 81). Gen.G; Chovy e Peanut carregaram (Peanut gigante vs C9).
  { id: "geng-msi-2023", team: "Gen.G Esports", short: "GEN", year: 2023, league: "LCK", tournament: "msi", champion: false,
    players: [["TOP", "Doran", 77, "kr"], ["JNG", "Peanut", 83, "kr"], ["MID", "Chovy", 84, "kr"], ["BOT", "Peyz", 81, "kr"], ["SUP", "Delight", 83, "kr"]] },
  // 5º-6º — Quartas (base 78). G2, melhor do Ocidente; BrokenBlade/Yike, Caps apagado.
  { id: "g2-msi-2023", team: "G2 Esports", short: "G2", year: 2023, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "BrokenBlade", 81, "de"], ["JNG", "Yike", 82, "se"], ["MID", "Caps", 71, "dk"], ["BOT", "Hans Sama", 78, "fr"], ["SUP", "Mikyx", 80, "si"]] },
  // 5º-6º — Quartas (base 78). Cloud9, campeã da LCS; jogo ruim vs Gen.G, melhor vs GG.
  { id: "c9-msi-2023", team: "Cloud9", short: "C9", year: 2023, league: "LCS", tournament: "msi", champion: false,
    players: [["TOP", "Fudge", 74, "au"], ["JNG", "Blaber", 68, "us"], ["MID", "EMENES", 74, "kr"], ["BOT", "Berserker", 72, "kr"], ["SUP", "Zven", 69, "dk"]] },
  // 7º-8º — Quartas (base 78). MAD Lions KOI; Nisqy o destaque, eliminada cedo pela G2.
  { id: "mad-msi-2023", team: "MAD Lions KOI", short: "MAD", year: 2023, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Chasy", 66, "kr"], ["JNG", "Elyoya", 69, "es"], ["MID", "Nisqy", 78, "be"], ["BOT", "Carzzy", 73, "cz"], ["SUP", "Hylissang", 72, "bg"]] },
  // 7º-8º — Quartas (base 78). Golden Guardians, 1ª internacional da org; Licorice/Huhi, caiu cedo.
  { id: "gg-msi-2023", team: "Golden Guardians", short: "GG", year: 2023, league: "LCS", tournament: "msi", champion: false,
    players: [["TOP", "Licorice", 74, "us"], ["JNG", "River", 71, "kr"], ["MID", "Gori", 68, "kr"], ["BOT", "Stixxay", 69, "us"], ["SUP", "huhi", 73, "kr"]] },
];
