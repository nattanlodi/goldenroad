import type { Team } from "../../types";

// Worlds 2014 — Season 4 World Championship (final em Seul, Sangam Stadium).
// 16 times · campeão: Samsung White (sobre o Star Horn Royal Club) — uma das lines mais dominantes da história.
// Tuplas: [role, nome, overall, país]. Notas pela RÉGUA em teams.ts (política B).
export const WORLDS_2014: Team[] = [
  // 1º — Campeão (base 88). Mata, MVP transcendente = 96; elenco todo de elite.
  { id: "sswhite-2014", team: "Samsung White", short: "SSW", year: 2014, league: "OGN", champion: true,
    players: [["TOP", "Looper", 90, "kr"], ["JNG", "DanDy", 94, "kr"], ["MID", "PawN", 93, "kr"], ["BOT", "imp", 92, "kr"], ["SUP", "Mata", 96, "kr"]] },
  // 2º — Vice (base 84). Uzi de novo na final.
  { id: "shrc-2014", team: "Star Horn Royal Club", short: "SHR", year: 2014, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "Cola", 84, "cn"], ["JNG", "inSec", 87, "kr"], ["MID", "corn", 85, "cn"], ["BOT", "Uzi", 89, "cn"], ["SUP", "Zero", 85, "kr"]] },
  // 3º-4º — Semifinal (base 81). Deft/Dade.
  { id: "ssblue-2014", team: "Samsung Blue", short: "SSB", year: 2014, league: "OGN", champion: false,
    players: [["TOP", "Acorn", 83, "kr"], ["JNG", "Spirit", 84, "kr"], ["MID", "Dade", 84, "kr"], ["BOT", "Deft", 85, "kr"], ["SUP", "Heart", 83, "kr"]] },
  // 3º-4º — Semifinal (base 81).
  { id: "omg-2014", team: "Oh My God", short: "OMG", year: 2014, league: "LPL", champion: false,
    players: [["TOP", "Gogoing", 83, "cn"], ["JNG", "Loveling", 83, "cn"], ["MID", "Cool", 84, "cn"], ["BOT", "San", 84, "cn"], ["SUP", "Cloud", 82, "cn"]] },
  // 5º-8º — Quartas (base 78). Bjergsen.
  { id: "tsm-2014", team: "Team SoloMid", short: "TSM", year: 2014, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 79, "us"], ["JNG", "Amazing", 79, "de"], ["MID", "Bjergsen", 82, "dk"], ["BOT", "WildTurtle", 79, "ca"], ["SUP", "Lustboy", 80, "kr"]] },
  // 5º-8º — Quartas (base 78).
  { id: "c9-2014", team: "Cloud9", short: "C9", year: 2014, league: "NA", champion: false,
    players: [["TOP", "Balls", 79, "us"], ["JNG", "Meteos", 81, "us"], ["MID", "Hai", 80, "us"], ["BOT", "Sneaky", 80, "us"], ["SUP", "LemonNation", 79, "us"]] },
  // 5º-8º — Quartas (base 78). ClearLove.
  { id: "edg-2014", team: "EDward Gaming", short: "EDG", year: 2014, league: "LPL", champion: false,
    players: [["TOP", "Koro1", 80, "cn"], ["JNG", "ClearLove", 82, "cn"], ["MID", "U", 79, "cn"], ["BOT", "NaMei", 80, "cn"], ["SUP", "Fzzf", 79, "cn"]] },
  // 5º-8º — Quartas (base 78). GorillA.
  { id: "najinws-2014", team: "NaJin White Shield", short: "NWS", year: 2014, league: "OGN", champion: false,
    players: [["TOP", "Save", 79, "kr"], ["JNG", "Watch", 79, "kr"], ["MID", "Ggoong", 79, "kr"], ["BOT", "Zefa", 79, "kr"], ["SUP", "GorillA", 81, "kr"]] },
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
