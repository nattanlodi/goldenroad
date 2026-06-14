import type { Team } from "../../types";

// Worlds 2015 — Season 5 World Championship (final em Berlim).
// 16 times · campeão: SK Telecom T1 (bi) sobre os KOO Tigers — outra line histórica.
// Tuplas: [role, nome, overall, país]. NOTAS: mescla colocação + RFT 1.0 (rft.gg),
// 70% no RFT dos playoffs (agregado por série) + 30% no geral; ver teams.ts.
// Faker'15 com override de curadoria. (ROX no RFT = KOO Tigers, mesmo elenco.)
export const WORLDS_2015: Team[] = [
  // 1º — Campeão (base 88). Faker dominante no playoff (75/77/75). Bengi o mais discreto da line.
  { id: "skt-2015", team: "SK Telecom T1", short: "SKT", year: 2015, league: "LCK", champion: true,
    players: [["TOP", "MaRin", 95, "kr"], ["JNG", "Bengi", 82, "kr"], ["MID", "Faker", 98, "kr"], ["BOT", "Bang", 86, "kr"], ["SUP", "Wolf", 89, "kr"]] },
  // 2º — Vice (base 84). Smeb/GorillA/Kuro carregaram (78/76/68 na semi); Hojin/PraY modestos.
  { id: "koo-2015", team: "KOO Tigers", short: "KOO", year: 2015, league: "LCK", champion: false, finalist: true,
    players: [["TOP", "Smeb", 93, "kr"], ["JNG", "Hojin", 80, "kr"], ["MID", "Kuro", 91, "kr"], ["BOT", "PraY", 82, "kr"], ["SUP", "GorillA", 90, "kr"]] },
  // 3º-4º — Semifinal (base 81). Febiven o destaque (80 na QF), Huni forte; bot apagado na semi.
  { id: "fnatic-2015", team: "Fnatic", short: "FNC", year: 2015, league: "EU", champion: false,
    players: [["TOP", "Huni", 85, "kr"], ["JNG", "Reignover", 78, "kr"], ["MID", "Febiven", 94, "nl"], ["BOT", "Rekkles", 78, "se"], ["SUP", "YellOwStaR", 80, "fr"]] },
  // 3º-4º — Semifinal (base 81). Varridos pela SKT na semi; Soaz/Niels o melhor.
  { id: "origen-2015", team: "Origen", short: "OG", year: 2015, league: "EU", champion: false,
    players: [["TOP", "Soaz", 75, "fr"], ["JNG", "Amazing", 71, "de"], ["MID", "xPeke", 75, "es"], ["BOT", "Niels", 75, "dk"], ["SUP", "Mithy", 75, "es"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela Fnatic; RFT puxa pra baixo.
  { id: "edg-2015", team: "EDward Gaming", short: "EDG", year: 2015, league: "LPL", champion: false,
    players: [["TOP", "Koro1", 67, "cn"], ["JNG", "ClearLove", 69, "cn"], ["MID", "PawN", 73, "kr"], ["BOT", "Deft", 69, "kr"], ["SUP", "Meiko", 71, "cn"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela SKT.
  { id: "ahq-2015", team: "ahq e-Sports Club", short: "AHQ", year: 2015, league: "LMS", champion: false,
    players: [["TOP", "Ziv", 72, "tw"], ["JNG", "Mountain", 72, "tw"], ["MID", "Westdoor", 69, "tw"], ["BOT", "AN", 71, "tw"], ["SUP", "Albis", 74, "tw"]] },
  // 5º-8º — Quartas (base 78). Levaram um game da ROX; RFT equilibrado.
  { id: "kt-2015", team: "KT Rolster", short: "KT", year: 2015, league: "LCK", champion: false,
    players: [["TOP", "Ssumday", 80, "kr"], ["JNG", "Score", 76, "kr"], ["MID", "Nagne", 77, "kr"], ["BOT", "Arrow", 78, "kr"], ["SUP", "Piccaboo", 81, "kr"]] },
  // 5º-8º — Quartas (base 78). Maple o destaque (65 na QF).
  { id: "fw-2015", team: "Flash Wolves", short: "FW", year: 2015, league: "LMS", champion: false,
    players: [["TOP", "Steak", 73, "tw"], ["JNG", "Karsa", 72, "tw"], ["MID", "Maple", 82, "tw"], ["BOT", "NL", 73, "tw"], ["SUP", "SwordArT", 74, "tw"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "clg-2015", team: "Counter Logic Gaming", short: "CLG", year: 2015, league: "NA", champion: false,
    players: [["TOP", "ZionSpartan", 73, "ca"], ["JNG", "Xmithie", 73, "ph"], ["MID", "Pobelter", 73, "us"], ["BOT", "Doublelift", 75, "us"], ["SUP", "aphromoo", 74, "us"]] },
  // 9º-16º — Fase de grupos (base 72). Favorito que naufragou.
  { id: "lgd-2015", team: "LGD Gaming", short: "LGD", year: 2015, league: "LPL", champion: false,
    players: [["TOP", "Flame", 74, "kr"], ["JNG", "TBQ", 73, "cn"], ["MID", "GODV", 73, "cn"], ["BOT", "imp", 75, "kr"], ["SUP", "Pyl", 73, "cn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "tsm-2015", team: "Team SoloMid", short: "TSM", year: 2015, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 73, "us"], ["JNG", "Santorin", 73, "dk"], ["MID", "Bjergsen", 75, "dk"], ["BOT", "WildTurtle", 73, "ca"], ["SUP", "Lustboy", 73, "kr"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "h2k-2015", team: "H2K", short: "H2K", year: 2015, league: "EU", champion: false,
    players: [["TOP", "Odoamne", 73, "ro"], ["JNG", "loulex", 72, "fr"], ["MID", "Ryu", 74, "kr"], ["BOT", "Hjarnan", 73, "se"], ["SUP", "kaSing", 73, "gb"]] },
  // 9º-16º — Fase de grupos (base 72). Rookie.
  { id: "ig-2015", team: "Invictus Gaming", short: "IG", year: 2015, league: "LPL", champion: false,
    players: [["TOP", "Zz1tai", 73, "cn"], ["JNG", "KAKAO", 74, "kr"], ["MID", "Rookie", 75, "kr"], ["BOT", "Kid", 73, "cn"], ["SUP", "Kitties", 72, "cn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "c9-2015", team: "Cloud9", short: "C9", year: 2015, league: "NA", champion: false,
    players: [["TOP", "Balls", 73, "us"], ["JNG", "Hai", 73, "us"], ["MID", "Incarnati0n", 74, "dk"], ["BOT", "Sneaky", 74, "us"], ["SUP", "LemonNation", 73, "us"]] },
  // 9º-16º — Fase de grupos, wildcard da Tailândia (base 72, fundo da tabela).
  { id: "bkt-2015", team: "Bangkok Titans", short: "BKT", year: 2015, league: "SEA", champion: false,
    players: [["TOP", "WarL0cK", 67, "th"], ["JNG", "007x", 66, "th"], ["MID", "G4", 67, "th"], ["BOT", "Lloyd", 67, "th"], ["SUP", "Moss", 66, "th"]] },
  // 9º-16º — Fase de grupos, wildcard do Brasil (base 72).
  { id: "pain-2015", team: "paiN Gaming", short: "PNG", year: 2015, league: "CBLOL", champion: false,
    players: [["TOP", "Mylon", 69, "br"], ["JNG", "SirT", 68, "br"], ["MID", "Kami", 70, "br"], ["BOT", "brTT", 70, "br"], ["SUP", "Dioud", 68, "fr"]] },
];
