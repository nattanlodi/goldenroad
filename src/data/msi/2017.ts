import type { Team } from "../../types";

// MSI 2017 (Brasil — Rio/São Paulo/Brasília) — knockout de 4 times (2 semis + final). Campeão:
// SK Telecom T1 sobre a G2 Esports na final (3-1; o bi da SKT). Notas: RFT geral
// (/event/msi-2017/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do oponente.
// Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2017.mjs. MVP do torneio = Wolf
// (oficial) + Huni (maior RFT entre finalistas) → ambos +2. A G2 vice jogou muito individualmente
// (Perkz devastou: 95), por isso vários da G2 ficam acima de parte da SKT — fiel aos dados.
export const MSI_2017: Team[] = [
  // 1º — Campeão (base 86). SKT; o bi, Huni dominante no top (91), Wolf MVP do torneio (87).
  { id: "skt-msi-2017", team: "SK Telecom T1", short: "SKT", year: 2017, league: "LCK", tournament: "msi", champion: true,
    players: [["TOP", "Huni", 91, "kr"], ["JNG", "Peanut", 84, "kr"], ["MID", "Faker", 81, "kr"], ["BOT", "Bang", 86, "kr"], ["SUP", "Wolf", 87, "kr"]] },
  // 2º — Vice (base 84). G2; Perkz devastou (95), Expect/Mithy fortes; melhor MSI ocidental até então.
  { id: "g2-msi-2017", team: "G2 Esports", short: "G2", year: 2017, league: "LEC", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Expect", 92, "kr"], ["JNG", "Trick", 85, "cz"], ["MID", "Perkz", 95, "hr"], ["BOT", "Zven", 80, "dk"], ["SUP", "Mithy", 89, "es"]] },
  // 3º-4º — Semifinal (base 81). Team WE; xiye o melhor, caiu pra G2 numa semi de 5 jogos.
  { id: "we-msi-2017", team: "Team WE", short: "WE", year: 2017, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "957", 76, "cn"], ["JNG", "Condi", 76, "cn"], ["MID", "xiye", 81, "cn"], ["BOT", "Mystic", 81, "kr"], ["SUP", "zero", 70, "cn"]] },
  // 3º-4º — Semifinal (base 81). Flash Wolves; varrida pela SKT, Karsa/Maple os destaques.
  { id: "fw-msi-2017", team: "Flash Wolves", short: "FW", year: 2017, league: "LMS", tournament: "msi", champion: false,
    players: [["TOP", "MMD", 76, "tw"], ["JNG", "Karsa", 86, "tw"], ["MID", "Maple", 86, "tw"], ["BOT", "Betty", 76, "tw"], ["SUP", "SwordArt", 80, "tw"]] },
];
