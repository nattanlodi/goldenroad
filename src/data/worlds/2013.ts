import type { Team } from "../../types";

// Worlds 2013 — Season 3 World Championship (final no Staples Center, LA).
// 14 times · campeão: SK Telecom T1 (1ª taça do Faker) sobre o Royal Club.
// Tuplas: [role, nome, overall, país]. Notas pela RÉGUA em teams.ts (política B).
export const WORLDS_2013: Team[] = [
  // 1º — Campeão (base 88). Faker transcendente (MVP) = 96.
  { id: "skt-2013", team: "SK Telecom T1", short: "SKT", year: 2013, league: "OGN", champion: true,
    players: [["TOP", "Impact", 90, "kr"], ["JNG", "Bengi", 92, "kr"], ["MID", "Faker", 96, "kr"], ["BOT", "Piglet", 91, "kr"], ["SUP", "PoohManDu", 89, "kr"]] },
  // 2º — Vice (base 84). Uzi carregando.
  { id: "royal-2013", team: "Royal Club", short: "RC", year: 2013, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "GoDlike", 85, "cn"], ["JNG", "Lucky", 84, "cn"], ["MID", "Wh1t3zZ", 85, "cn"], ["BOT", "Uzi", 89, "cn"], ["SUP", "Tabe", 85, "hk"]] },
  // 3º — Semifinal (base 81).
  { id: "najinbs-2013", team: "NaJin Black Sword", short: "NJBS", year: 2013, league: "OGN", champion: false,
    players: [["TOP", "Expession", 83, "kr"], ["JNG", "Watch", 82, "kr"], ["MID", "Nagne", 83, "kr"], ["BOT", "PraY", 85, "kr"], ["SUP", "Cain", 82, "kr"]] },
  // 4º — Semifinal (base 81).
  { id: "fnatic-2013", team: "Fnatic", short: "FNC", year: 2013, league: "EU", champion: false,
    players: [["TOP", "sOAZ", 83, "fr"], ["JNG", "Cyanide", 82, "fi"], ["MID", "xPeke", 85, "es"], ["BOT", "Puszu", 82, "ee"], ["SUP", "YellOwStaR", 84, "fr"]] },
  // 5º-8º — Quartas (base 78).
  { id: "gamania-2013", team: "Gamania Bears", short: "GB", year: 2013, league: "GPL", champion: false,
    players: [["TOP", "Steak", 79, "tw"], ["JNG", "Winds", 78, "tw"], ["MID", "Maple", 80, "tw"], ["BOT", "NL", 79, "tw"], ["SUP", "SwordArT", 80, "tw"]] },
  // 5º-8º — Quartas (base 78). Diamondprox/Alex Ich.
  { id: "gambit-2013", team: "Gambit Gaming", short: "GMB", year: 2013, league: "EU", champion: false,
    players: [["TOP", "Darien", 79, "ru"], ["JNG", "Diamondprox", 81, "ru"], ["MID", "Alex Ich", 81, "ru"], ["BOT", "Genja", 80, "ru"], ["SUP", "Voidle", 78, "ee"]] },
  // 5º-8º — Quartas (base 78).
  { id: "omg-2013", team: "Oh My God", short: "OMG", year: 2013, league: "LPL", champion: false,
    players: [["TOP", "Gogoing", 80, "cn"], ["JNG", "LoveLin", 79, "cn"], ["MID", "Cool", 80, "cn"], ["BOT", "San", 80, "cn"], ["SUP", "Bigpomelo", 78, "cn"]] },
  // 5º-8º — Quartas (base 78).
  { id: "c9-2013", team: "Cloud9", short: "C9", year: 2013, league: "NA", champion: false,
    players: [["TOP", "Balls", 79, "us"], ["JNG", "Meteos", 81, "us"], ["MID", "Hai", 80, "us"], ["BOT", "Sneaky", 80, "us"], ["SUP", "LemonNation", 79, "us"]] },
  // 9º-10º — Fase de grupos (base 72).
  { id: "lemondogs-2013", team: "Lemondogs", short: "LD", year: 2013, league: "EU", champion: false,
    players: [["TOP", "Zorozero", 73, "dk"], ["JNG", "Dexter", 73, "de"], ["MID", "Nukeduck", 74, "no"], ["BOT", "Tabzz", 73, "nl"], ["SUP", "Mithy", 74, "es"]] },
  // 9º-10º — Fase de grupos (base 72). Núcleo talentoso (futuro Samsung White), mas caiu cedo.
  { id: "ozone-2013", team: "Samsung Ozone", short: "OZ", year: 2013, league: "OGN", champion: false,
    players: [["TOP", "Looper", 74, "kr"], ["JNG", "DanDy", 76, "kr"], ["MID", "Dade", 74, "kr"], ["BOT", "Imp", 75, "kr"], ["SUP", "Mata", 76, "kr"]] },
  // 11º-12º — Fase de grupos (base 72).
  { id: "tsm-2013", team: "Team SoloMid", short: "TSM", year: 2013, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 73, "us"], ["JNG", "TheOddOne", 73, "ca"], ["MID", "Reginald", 74, "us"], ["BOT", "WildTurtle", 73, "ca"], ["SUP", "Xpecial", 73, "us"]] },
  // 11º-12º — Fase de grupos (base 72).
  { id: "vulcun-2013", team: "Team Vulcun", short: "VUL", year: 2013, league: "NA", champion: false,
    players: [["TOP", "Sycho Sid", 72, "us"], ["JNG", "Xmithie", 74, "ph"], ["MID", "Mancloud", 73, "us"], ["BOT", "Zuna", 72, "us"], ["SUP", "BloodWater", 72, "bg"]] },
  // 13º-14º — Fase de grupos, wildcard (base 72, fundo da tabela).
  { id: "gaminggear-2013", team: "GamingGear.eu", short: "GG", year: 2013, league: "EU", champion: false,
    players: [["TOP", "NBs", 69, "lt"], ["JNG", "Alunir", 68, "lt"], ["MID", "Mazzerin", 69, "lt"], ["BOT", "DeadlyBrother", 69, "lt"], ["SUP", "Inspirro", 68, "lt"]] },
  // 13º-14º — Fase de grupos, wildcard das Filipinas (base 72, fundo da tabela).
  { id: "mineski-2013", team: "Mineski", short: "MSK", year: 2013, league: "GPL", champion: false,
    players: [["TOP", "Snoy", 68, "ph"], ["JNG", "Kaigu", 67, "ph"], ["MID", "Yume", 68, "ph"], ["BOT", "Exo", 68, "ph"], ["SUP", "Tgee", 67, "ph"]] },
];
