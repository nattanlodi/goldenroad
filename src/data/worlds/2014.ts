import type { Team } from "../../types";

// Worlds 2014 — Season 4 World Championship (final em Seul, Sangam Stadium, 40k pessoas).
// 16 times · campeão: Samsung White sobre o Star Horn Royal Club (3-1) — uma das lines mais dominantes da história.
// Tuplas: [role, nome, overall, país]. NOTAS: motor novo — força do oponente + geral REAL da
// fase de grupos (rft.gg), 80% playoff / 20% geral, bases −2, shrinkage. Ver scripts/rft-w-2014.mjs.
// Mata (SSW) = Finals MVP. PawN o melhor do torneio de fato (97). Tudo cru, sem curadoria.
export const WORLDS_2014: Team[] = [
  // 1º — Campeão (LCK). A SSW lendária: PawN/Mata gigantes, line inteira 87+. Dominaram do começo ao fim.
  { id: "sswhite-2014", team: "Samsung White", short: "SSW", year: 2014, league: "LCK", champion: true,
    players: [["TOP", "Looper", 95, "kr"], ["JNG", "DanDy", 92, "kr"], ["MID", "PawN", 97, "kr"], ["BOT", "imp", 87, "kr"], ["SUP", "Mata", 96, "kr"]] },
  // 2º — Vice (LPL). Uzi & cia. atropelados na final (notas humilhantes vs SSW). zero o melhor.
  { id: "shrc-2014", team: "Star Horn Royal Club", short: "SHRC", year: 2014, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "Cola", 79, "cn"], ["JNG", "inSec", 78, "kr"], ["MID", "Corn", 82, "cn"], ["BOT", "Uzi", 80, "cn"], ["SUP", "zero", 83, "kr"]] },
  // 3º-4º — Semifinal (LPL). Explodiram no playoff (Gogoing 95 vs Royal); melhor que o seed dizia.
  { id: "omg-2014", team: "Oh My God", short: "OMG", year: 2014, league: "LPL", champion: false,
    players: [["TOP", "Gogoing", 86, "cn"], ["JNG", "LoveLing", 81, "cn"], ["MID", "Cool", 82, "cn"], ["BOT", "san", 81, "cn"], ["SUP", "Cloud", 83, "cn"]] },
  // 3º-4º — Semifinal (LCK). A irmã mais fraca da SSW: levou 0-3 na semi e suou contra a C9. RFT pune.
  { id: "ssblue-2014", team: "Samsung Blue", short: "SSB", year: 2014, league: "LCK", champion: false,
    players: [["TOP", "Acorn", 73, "kr"], ["JNG", "Spirit", 74, "kr"], ["MID", "Dade", 74, "kr"], ["BOT", "Deft", 74, "kr"], ["SUP", "Heart", 74, "kr"]] },
  // 5º-8º — Quartas (LCS). Levaram a SSB ao limite (2-3); LemonNation/Sneaky o destaque.
  { id: "c9-2014", team: "Cloud9", short: "C9", year: 2014, league: "NA", champion: false,
    players: [["TOP", "BalIs", 78, "us"], ["JNG", "Meteos", 79, "us"], ["MID", "Hai", 79, "us"], ["BOT", "Sneaky", 81, "us"], ["SUP", "LemonNation", 84, "us"]] },
  // 5º-8º — Quartas (LPL). Varridos pela RC. U/Koro1 o melhor. (Korol=Koro1, Mann=ClearLove.)
  { id: "edg-2014", team: "EDward Gaming", short: "EDG", year: 2014, league: "LPL", champion: false,
    players: [["TOP", "Koro1", 75, "cn"], ["JNG", "ClearLove", 70, "cn"], ["MID", "U", 76, "kr"], ["BOT", "NaMei", 71, "cn"], ["SUP", "fzzf", 74, "cn"]] },
  // 5º-8º — Quartas (LCK). Varridos pela OMG; Ggoong forte nos grupos, apagado na QF.
  { id: "najinws-2014", team: "NaJin White Shield", short: "NJWS", year: 2014, league: "LCK", champion: false,
    players: [["TOP", "Save", 73, "kr"], ["JNG", "Watch", 73, "kr"], ["MID", "Ggoong", 77, "kr"], ["BOT", "Zefa", 73, "kr"], ["SUP", "GorillA", 74, "kr"]] },
  // 5º-8º — Quartas (LCS). Varridos 0-3 pela SSW; Bjergsen bom nos grupos, apagado na QF (15).
  { id: "tsm-2014", team: "Team SoloMid", short: "TSM", year: 2014, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 75, "us"], ["JNG", "Amazing", 68, "de"], ["MID", "Bjergsen", 70, "dk"], ["BOT", "WildTurtle", 70, "ca"], ["SUP", "Lustboy", 73, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). Melhor campanha europeia dos grupos (Froggen/Wickd 76).
  { id: "alliance-2014", team: "Alliance", short: "ALL", year: 2014, league: "EU", champion: false,
    players: [["TOP", "Wickd", 76, "se"], ["JNG", "Shook", 73, "nl"], ["MID", "Froggen", 76, "dk"], ["BOT", "Tabzz", 72, "se"], ["SUP", "Nyph", 74, "se"]] },
  // 9º-16º — Fase de grupos (base 72). xPeke/Rekkles o melhor; não passaram dos grupos.
  { id: "fnatic-2014", team: "Fnatic", short: "FNC", year: 2014, league: "EU", champion: false,
    players: [["TOP", "sOAZ", 72, "fr"], ["JNG", "Cyanide", 70, "fi"], ["MID", "xPeke", 74, "es"], ["BOT", "Rekkles", 74, "se"], ["SUP", "YellOwStaR", 73, "fr"]] },
  // 9º-16º — Fase de grupos (base 72). xiaoweixiao o destaque; roster chinês que jogou a NA LCS.
  { id: "lmq-2014", team: "LMQ", short: "LMQ", year: 2014, league: "NA", champion: false,
    players: [["TOP", "Ackerman", 71, "cn"], ["JNG", "NONAME", 71, "cn"], ["MID", "XiaoWeiXiao", 73, "cn"], ["BOT", "Vasilii", 71, "cn"], ["SUP", "Mor", 72, "cn"]] },
  // 9º-16º — Fase de grupos (base 72). Westdoor (o Fizz lendário); melhor da wildcard de Taiwan.
  { id: "ahq-2014", team: "ahq e-Sports Club", short: "AHQ", year: 2014, league: "LMS", champion: false,
    players: [["TOP", "Prydz", 72, "tw"], ["JNG", "Naz", 70, "tw"], ["MID", "Westdoor", 74, "tw"], ["BOT", "GarnetDevil", 70, "tw"], ["SUP", "GreenTea", 73, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Wildcard de Taiwan; Morning o melhor. Campeão de 2012 em declínio.
  { id: "tpa-2014", team: "Taipei Assassins", short: "TPA", year: 2014, league: "LMS", champion: false,
    players: [["TOP", "Achie", 71, "tw"], ["JNG", "Winds", 72, "tw"], ["MID", "Morning", 74, "tw"], ["BOT", "bebe", 71, "tw"], ["SUP", "Jay", 73, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). SK europeia fraca nesse ano; Svenskeren ainda rookie.
  { id: "sk-2014", team: "SK Gaming", short: "SK", year: 2014, league: "EU", champion: false,
    players: [["TOP", "fredy122", 73, "de"], ["JNG", "Svenskeren", 72, "dk"], ["MID", "Jesiz", 70, "dk"], ["BOT", "CandyPanda", 70, "de"], ["SUP", "nRated", 71, "de"]] },
  // 9º-16º — Fase de grupos (base 72). Wildcard do Brasil; upset histórico (venceu a Alliance).
  { id: "kabum-2014", team: "KaBuM! e-Sports", short: "KBM", year: 2014, league: "CBLOL", champion: false,
    players: [["TOP", "Lep", 70, "br"], ["JNG", "Danagorn", 68, "br"], ["MID", "tinowns", 71, "br"], ["BOT", "Minerva", 70, "br"], ["SUP", "dans", 70, "br"]] },
  // 9º-16º — Fase de grupos, wildcard da Turquia (base 72, fundo da tabela).
  { id: "darkpassage-2014", team: "Dark Passage", short: "DP", year: 2014, league: "TR", champion: false,
    players: [["TOP", "fabFabulous", 69, "tr"], ["JNG", "Crystal", 66, "tr"], ["MID", "Naru", 68, "tr"], ["BOT", "HolyPhoenix", 68, "tr"], ["SUP", "Touch", 69, "tr"]] },
];
