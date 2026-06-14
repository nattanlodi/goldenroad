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
    players: [["TOP", "Huni", 88, "kr"], ["JNG", "Peanut", 82, "kr"], ["MID", "Faker", 80, "kr"], ["BOT", "Bang", 84, "kr"], ["SUP", "Wolf", 84, "kr"]] },
  // 2º — Vice (base 84). G2; Perkz devastou (95), Expect/Mithy fortes; melhor MSI ocidental até então.
  { id: "g2-msi-2017", team: "G2 Esports", short: "G2", year: 2017, league: "LEC", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Expect", 89, "kr"], ["JNG", "Trick", 83, "cz"], ["MID", "Perkz", 97, "hr"], ["BOT", "Zven", 78, "dk"], ["SUP", "Mithy", 86, "es"]] },
  // 3º-4º — Semifinal (base 81). Team WE; xiye o melhor, caiu pra G2 numa semi de 5 jogos.
  { id: "we-msi-2017", team: "Team WE", short: "WE", year: 2017, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "957", 75, "cn"], ["JNG", "Condi", 75, "cn"], ["MID", "xiye", 79, "cn"], ["BOT", "Mystic", 79, "kr"], ["SUP", "zero", 69, "cn"]] },
  // 3º-4º — Semifinal (base 81). Flash Wolves; varrida pela SKT, Karsa/Maple os destaques.
  { id: "fw-msi-2017", team: "Flash Wolves", short: "FW", year: 2017, league: "LMS", tournament: "msi", champion: false,
    players: [["TOP", "MMD", 75, "tw"], ["JNG", "Karsa", 84, "tw"], ["MID", "Maple", 83, "tw"], ["BOT", "Betty", 75, "tw"], ["SUP", "SwordArt", 79, "tw"]] },
];
