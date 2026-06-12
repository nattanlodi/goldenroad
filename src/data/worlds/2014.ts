import type { Team } from "../../types";

// Worlds 2014 — Season 4 World Championship (final em Seul, Sangam Stadium).
// 16 times · campeão: Samsung White (sobre o Star Horn Royal Club) — uma das lines mais dominantes da história.
// Tuplas: [role, nome, overall, país]. NOTAS: mescla colocação + RFT 1.0 (rft.gg),
// 70% no RFT dos playoffs (agregado por série) + 30% no geral; ver teams.ts.
// Mata'14 e PawN'14 com override de curadoria (MVP transcendente do evento).
export const WORLDS_2014: Team[] = [
  // 1º — Campeão (base 88). O mais dominante da história; RFT de playoff absurdo
  // (PawN 98 na semi, Looper 90, Mata 85). 4 jogadores no teto; imp 88 (QF1 fraco).
  { id: "sswhite-2014", team: "Samsung White", short: "SSW", year: 2014, league: "OGN", champion: true,
    players: [["TOP", "Looper", 97, "kr"], ["JNG", "DanDy", 97, "kr"], ["MID", "PawN", 97, "kr"], ["BOT", "imp", 85, "kr"], ["SUP", "Mata", 99, "kr"]] },
  // 2º — Vice (base 84). +3 de curadoria em todos: jogaram a final muito mal (SSW os destruiu),
  // mas chegar à final do mundial não merece nota tão baixa. RFT puxou demais pra baixo.
  { id: "shrc-2014", team: "Star Horn Royal Club", short: "SHR", year: 2014, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "Cola", 82, "cn"], ["JNG", "inSec", 81, "kr"], ["MID", "corn", 87, "cn"], ["BOT", "Uzi", 87, "cn"], ["SUP", "Zero", 89, "kr"]] },
  // 3º-4º — Semifinal (base 81). Foram varridos 0-3 pela SSW na semi; QF2 melhor equilibrou.
  { id: "ssblue-2014", team: "Samsung Blue", short: "SSB", year: 2014, league: "OGN", champion: false,
    players: [["TOP", "Acorn", 75, "kr"], ["JNG", "Spirit", 76, "kr"], ["MID", "Dade", 78, "kr"], ["BOT", "Deft", 77, "kr"], ["SUP", "Heart", 79, "kr"]] },
  // 3º-4º — Semifinal (base 81). Os verdadeiros carrys: Gogoing 88, Cool 87, Cloud 86 (2 séries fortes).
  { id: "omg-2014", team: "Oh My God", short: "OMG", year: 2014, league: "LPL", champion: false,
    players: [["TOP", "Gogoing", 90, "cn"], ["JNG", "Loveling", 83, "cn"], ["MID", "Cool", 88, "cn"], ["BOT", "San", 83, "cn"], ["SUP", "Cloud", 87, "cn"]] },
  // 5º-8º — Quartas (base 78). RFT playoff: Bjergsen 65 o único que apareceu; WildTurtle 23.
  { id: "tsm-2014", team: "Team SoloMid", short: "TSM", year: 2014, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 79, "us"], ["JNG", "Amazing", 68, "de"], ["MID", "Bjergsen", 83, "dk"], ["BOT", "WildTurtle", 66, "ca"], ["SUP", "Lustboy", 71, "kr"]] },
  // 5º-8º — Quartas (base 78). RFT playoff (QF2): LemonNation 63 o destaque.
  { id: "c9-2014", team: "Cloud9", short: "C9", year: 2014, league: "NA", champion: false,
    players: [["TOP", "Balls", 76, "us"], ["JNG", "Meteos", 75, "us"], ["MID", "Hai", 76, "us"], ["BOT", "Sneaky", 79, "us"], ["SUP", "LemonNation", 82, "us"]] },
  // 5º-8º — Quartas (base 78). RFT playoff (QF3): Koro1 63, U 60 (jungler real ClearLove = Mann 52).
  { id: "edg-2014", team: "EDward Gaming", short: "EDG", year: 2014, league: "LPL", champion: false,
    players: [["TOP", "Koro1", 82, "cn"], ["JNG", "ClearLove", 77, "cn"], ["MID", "U", 82, "cn"], ["BOT", "NaMei", 74, "cn"], ["SUP", "Fzzf", 78, "cn"]] },
  // 5º-8º — Quartas (base 78). Ggoong tinha RFT geral nº1, mas foi VARRIDO 0-3 na QF (46) → 78.
  { id: "najinws-2014", team: "NaJin White Shield", short: "NWS", year: 2014, league: "OGN", champion: false,
    players: [["TOP", "Save", 69, "kr"], ["JNG", "Watch", 71, "kr"], ["MID", "Ggoong", 77, "kr"], ["BOT", "Zefa", 73, "kr"], ["SUP", "GorillA", 73, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). westdoor (o Fizz lendário).
  { id: "ahq-2014", team: "ahq e-Sports Club", short: "AHQ", year: 2014, league: "GPL", champion: false,
    players: [["TOP", "Prydz", 72, "tw"], ["JNG", "NAZ", 72, "tw"], ["MID", "westdoor", 74, "tw"], ["BOT", "GarnetDevil", 73, "tw"], ["SUP", "GreenTea", 72, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Svenskeren.
  { id: "sk-2014", team: "SK Gaming", short: "SK", year: 2014, league: "EU", champion: false,
    players: [["TOP", "fredy122", 73, "gb"], ["JNG", "Svenskeren", 74, "dk"], ["MID", "Jesiz", 73, "dk"], ["BOT", "CandyPanda", 73, "de"], ["SUP", "nRated", 72, "de"]] },
  // 9º-16º — Fase de grupos (base 72). Froggen.
  { id: "alliance-2014", team: "Alliance", short: "ALL", year: 2014, league: "EU", champion: false,
    players: [["TOP", "Wickd", 73, "dk"], ["JNG", "Shook", 73, "nl"], ["MID", "Froggen", 75, "dk"], ["BOT", "Tabzz", 73, "nl"], ["SUP", "Nyph", 72, "de"]] },
  // 9º-16º — Fase de grupos (base 72). Roster chinês que jogou a NA LCS.
  { id: "lmq-2014", team: "LMQ", short: "LMQ", year: 2014, league: "NA", champion: false,
    players: [["TOP", "ackerman", 72, "cn"], ["JNG", "NoName", 73, "cn"], ["MID", "XiaoWeiXiao", 74, "cn"], ["BOT", "Vasilii", 73, "cn"], ["SUP", "Mor", 72, "cn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "fnatic-2014", team: "Fnatic", short: "FNC", year: 2014, league: "EU", champion: false,
    players: [["TOP", "sOAZ", 73, "fr"], ["JNG", "Cyanide", 73, "fi"], ["MID", "xPeke", 75, "es"], ["BOT", "Rekkles", 75, "se"], ["SUP", "YellOwStaR", 75, "fr"]] },
  // 9º-16º — Fase de grupos (base 72). Campeão de 2012, em declínio.
  { id: "tpa-2014", team: "Taipei Assassins", short: "TPA", year: 2014, league: "GPL", champion: false,
    players: [["TOP", "Achie", 72, "tw"], ["JNG", "Winds", 72, "tw"], ["MID", "Morning", 72, "tw"], ["BOT", "bebe", 73, "tw"], ["SUP", "Jay", 71, "tw"]] },
  // 9º-16º — Fase de grupos, wildcard da Turquia (base 72, fundo da tabela).
  { id: "darkpassage-2014", team: "Dark Passage", short: "DP", year: 2014, league: "TCL", champion: false,
    players: [["TOP", "fabFabulous", 69, "tr"], ["JNG", "Crystal", 68, "tr"], ["MID", "Naru", 69, "tr"], ["BOT", "HolyPhoenix", 69, "tr"], ["SUP", "Touch", 68, "no"]] },
  // 9º-16º — Fase de grupos, wildcard do Brasil (base 72). Bateu a Alliance num upset histórico.
  { id: "kabum-2014", team: "KaBuM! e-Sports", short: "KBM", year: 2014, league: "CBLOL", champion: false,
    players: [["TOP", "LEP", 69, "br"], ["JNG", "Danagorn", 68, "br"], ["MID", "TinOwns", 70, "br"], ["BOT", "Minerva", 69, "br"], ["SUP", "dans", 68, "br"]] },
];
