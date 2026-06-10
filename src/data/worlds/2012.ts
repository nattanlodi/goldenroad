import type { Team } from "../../types";

// Worlds 2012 — Season 2 World Championship (Los Angeles).
// 12 times · campeão: Taipei Assassins (venceu a Azubu Frost na final).
// Tuplas: [role, nome, overall, país]. Notas pela RÉGUA em teams.ts.
export const WORLDS_2012: Team[] = [
  // 1º — Campeão (base 88). Toyz carregou o mid.
  { id: "tpa-2012", team: "Taipei Assassins", short: "TPA", year: 2012, league: "GPL", champion: true,
    players: [["TOP", "Stanley", 90, "tw"], ["JNG", "Lilballz", 89, "tw"], ["MID", "Toyz", 94, "hk"], ["BOT", "bebe", 91, "tw"], ["SUP", "MiSTakE", 90, "tw"]] },
  // 2º — Vice (base 84). MadLife, o suporte lendário.
  { id: "frost-2012", team: "Azubu Frost", short: "AzF", year: 2012, league: "OGN", champion: false, finalist: true,
    players: [["TOP", "Shy", 88, "kr"], ["JNG", "CloudTemplar", 87, "kr"], ["MID", "RapidStar", 86, "kr"], ["BOT", "Woong", 86, "kr"], ["SUP", "MadLife", 89, "kr"]] },
  // 3º-4º — Semifinal (base 81). Diamondprox/Alex Ich.
  { id: "m5-2012", team: "Moscow Five", short: "M5", year: 2012, league: "EU", champion: false,
    players: [["TOP", "Darien", 84, "ru"], ["JNG", "Diamondprox", 87, "ru"], ["MID", "Alex Ich", 86, "ru"], ["BOT", "Genja", 84, "ru"], ["SUP", "GoSu Pepper", 82, "am"]] },
  // 3º-4º — Semifinal (base 81). Froggen.
  { id: "clgeu-2012", team: "CLG Europe", short: "CLG.EU", year: 2012, league: "EU", champion: false,
    players: [["TOP", "Wickd", 83, "dk"], ["JNG", "Snoopeh", 84, "gb"], ["MID", "Froggen", 86, "dk"], ["BOT", "yellowpete", 83, "de"], ["SUP", "Krepo", 83, "be"]] },
  // 5º-8º — Quartas (base 78).
  { id: "ig-2012", team: "Invictus Gaming", short: "IG", year: 2012, league: "China", champion: false,
    players: [["TOP", "PDD", 81, "cn"], ["JNG", "illuSioN", 79, "cn"], ["MID", "Zz1tai", 79, "cn"], ["BOT", "Kid", 80, "cn"], ["SUP", "XiaoXiao", 78, "cn"]] },
  // 5º-8º — Quartas (base 78). PraY/MaKNooN.
  { id: "najins-2012", team: "NaJin Sword", short: "NJS", year: 2012, league: "OGN", champion: false,
    players: [["TOP", "MaKNooN", 81, "kr"], ["JNG", "Watch", 79, "kr"], ["MID", "SSONG", 79, "kr"], ["BOT", "PraY", 82, "kr"], ["SUP", "Cain", 79, "kr"]] },
  // 5º-8º — Quartas (base 78).
  { id: "tsm-2012", team: "Team SoloMid", short: "TSM", year: 2012, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 80, "us"], ["JNG", "TheOddOne", 80, "ca"], ["MID", "Reginald", 81, "us"], ["BOT", "Chaox", 80, "ca"], ["SUP", "Xpecial", 80, "us"]] },
  // 5º-8º — Quartas (base 78). Weixiao/ClearLove/Misaya.
  { id: "we-2012", team: "Team WE", short: "WE", year: 2012, league: "China", champion: false,
    players: [["TOP", "CaoMei", 80, "cn"], ["JNG", "ClearLove", 82, "cn"], ["MID", "Misaya", 82, "cn"], ["BOT", "Weixiao", 83, "cn"], ["SUP", "FZZF", 79, "cn"]] },
  // 9º-12º — Fase de grupos (base 72). Doublelift.
  { id: "clg-2012", team: "Counter Logic Gaming", short: "CLG", year: 2012, league: "NA", champion: false,
    players: [["TOP", "Voyboy", 75, "us"], ["JNG", "HotshotGG", 74, "ca"], ["MID", "bigfatlp", 73, "ca"], ["BOT", "Doublelift", 76, "us"], ["SUP", "Chauster", 74, "us"]] },
  // 9º-12º — Fase de grupos (base 72). Wildcard do Vietnã.
  { id: "saigon-2012", team: "Saigon Jokers", short: "SAJ", year: 2012, league: "GPL", champion: false,
    players: [["TOP", "QTV", 73, "vn"], ["JNG", "Violet", 73, "vn"], ["MID", "NIXWATER", 72, "vn"], ["BOT", "Archie", 72, "vn"], ["SUP", "Junie", 71, "vn"]] },
  // 9º-12º — Fase de grupos (base 72). ocelote/YellOwStaR.
  { id: "sk-2012", team: "SK Gaming", short: "SK", year: 2012, league: "EU", champion: false,
    players: [["TOP", "Kev1n", 73, "de"], ["JNG", "Araneae", 73, "es"], ["MID", "ocelote", 75, "es"], ["BOT", "YellOwStaR", 75, "fr"], ["SUP", "Nyph", 73, "de"]] },
  // 9º-12º — Fase de grupos (base 72).
  { id: "dignitas-2012", team: "Team Dignitas", short: "DIG", year: 2012, league: "NA", champion: false,
    players: [["TOP", "Crumbzz", 72, "ve"], ["JNG", "IWillDominate", 74, "us"], ["MID", "scarra", 74, "us"], ["BOT", "imaqtpie", 74, "us"], ["SUP", "Patoy", 72, "us"]] },
];
