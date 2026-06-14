import type { Team } from "../../types";

// MSI 2016 (Xangai) — knockout de 4 times (2 semis + final). Campeão: SK Telecom T1 sobre a Counter
// Logic Gaming na final (3-0). Faker MVP do torneio (96; o ano em que ganhou MSI e Worlds). Notas:
// RFT geral (/event/msi-2016/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do
// oponente. Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2016.mjs. Looper (RNG
// semi) brilhou na semi vs SKT (77.4) → 94, acima do CLG vice — fiel aos dados (CLG foi varrida 3-0).
export const MSI_2016: Team[] = [
  // 1º — Campeão (base 86). SKT; Faker MVP do torneio (96), bot lane forte (Bang/Wolf 90).
  { id: "skt-msi-2016", team: "SK Telecom T1", short: "SKT", year: 2016, league: "LCK", tournament: "msi", champion: true,
    players: [["TOP", "Duke", 84, "kr"], ["JNG", "Blank", 82, "kr"], ["MID", "Faker", 92, "kr"], ["BOT", "Bang", 88, "kr"], ["SUP", "Wolf", 87, "kr"]] },
  // 2º — Vice (base 84). CLG; surpresa do torneio, Darshan o destaque, varrida 3-0 na final.
  { id: "clg-msi-2016", team: "Counter Logic Gaming", short: "CLG", year: 2016, league: "LCS", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Darshan", 83, "us"], ["JNG", "Xmithie", 79, "ph"], ["MID", "Huhi", 81, "kr"], ["BOT", "Stixxay", 79, "us"], ["SUP", "aphromoo", 80, "us"]] },
  // 3º-4º — Semifinal (base 81). RNG; geral muito forte, Looper gigante na semi vs SKT (94).
  { id: "rng-msi-2016", team: "Royal Never Give Up", short: "RNG", year: 2016, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "Looper", 92, "kr"], ["JNG", "Mlxg", 85, "cn"], ["MID", "Xiaohu", 85, "cn"], ["BOT", "Wuxx", 83, "cn"], ["SUP", "Mata", 79, "kr"]] },
  // 3º-4º — Semifinal (base 81). Flash Wolves; varrida pela CLG, Maple o melhor.
  { id: "fw-msi-2016", team: "Flash Wolves", short: "FW", year: 2016, league: "LMS", tournament: "msi", champion: false,
    players: [["TOP", "MMD", 69, "tw"], ["JNG", "Karsa", 71, "tw"], ["MID", "Maple", 80, "tw"], ["BOT", "NL", 70, "tw"], ["SUP", "SwordArt", 72, "tw"]] },
];
