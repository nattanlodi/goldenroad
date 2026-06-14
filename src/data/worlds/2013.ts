import type { Team } from "../../types";

// Worlds 2013 — Season 3 World Championship (final no Staples Center, LA).
// 14 times · campeão: SK Telecom T1 (1ª taça do Faker) sobre o Royal Club (3-0).
// Tuplas: [role, nome, overall, país]. NOTAS: motor novo — força do oponente + geral REAL dos
// grupos (rft.gg), 80% playoff / 20% geral, bases −2, shrinkage. Ver scripts/rft-w-2013.mjs.
// ⚠ FORMATO ESPECIAL: 4 times do mata-mata (Royal/NaJin/C9/Gamania) entraram direto, sem grupos no
// rft.gg → ponderados 100% playoff. Impact = Finals MVP. Faker'13 cru 84 (rookie, grupos modestos).
export const WORLDS_2013: Team[] = [
  // 1º — Campeão (LCK). A 1ª SKT. Impact (fMVP) gigante; Faker rookie, brilhou no coletivo (cru 84).
  { id: "skt-2013", team: "SK Telecom T1", short: "SKT", year: 2013, league: "LCK", champion: true,
    players: [["TOP", "Impact", 92, "kr"], ["JNG", "Bengi", 82, "kr"], ["MID", "Faker", 84, "kr"], ["BOT", "Piglet", 87, "kr"], ["SUP", "PoohManDu", 87, "kr"]] },
  // 2º — Vice (LPL). Uzi na 1ª final. Sem grupos (100% playoff) → Ackerman/Wh1t3zZ subiram a 91.
  { id: "royal-2013", team: "Royal Club", short: "RC", year: 2013, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "Ackerman", 91, "cn"], ["JNG", "Lucky", 79, "cn"], ["MID", "Wh1t3zZ", 91, "cn"], ["BOT", "Uzi", 85, "cn"], ["SUP", "Tabe", 79, "hk"]] },
  // 3º-4º — Semifinal (LCK). Sem grupos (100% playoff). Expession brilhou contra a SKT (88).
  { id: "najinbs-2013", team: "NaJin Black Sword", short: "NJBS", year: 2013, league: "LCK", champion: false,
    players: [["TOP", "Expession", 88, "kr"], ["JNG", "Watch", 76, "kr"], ["MID", "Nagne", 81, "kr"], ["BOT", "PraY", 76, "kr"], ["SUP", "Cain", 71, "kr"]] },
  // 3º-4º — Semifinal (LEC). Jogou grupos. sOAZ o destaque (83); melhor campanha europeia até então.
  { id: "fnatic-2013", team: "Fnatic", short: "FNC", year: 2013, league: "EU", champion: false,
    players: [["TOP", "sOAZ", 83, "fr"], ["JNG", "Cyanide", 69, "fi"], ["MID", "xPeke", 78, "es"], ["BOT", "Puszu", 80, "ee"], ["SUP", "YellOwStaR", 78, "fr"]] },
  // 5º-8º — Quartas (LEC). Jogou grupos. O lendário Gambit (ex-Moscow5); Darien/Alex Ich o melhor.
  { id: "gambit-2013", team: "Gambit Gaming", short: "GMB", year: 2013, league: "EU", champion: false,
    players: [["TOP", "Darien", 84, "ru"], ["JNG", "Diamondprox", 80, "ru"], ["MID", "Alex Ich", 81, "ru"], ["BOT", "Genja", 79, "ru"], ["SUP", "Voidle", 78, "ee"]] },
  // 5º-8º — Quartas (LPL). Jogou grupos. Cool o destaque (84); perderam 0-2 pro Royal na QF.
  { id: "omg-2013", team: "Oh My God", short: "OMG", year: 2013, league: "LPL", champion: false,
    players: [["TOP", "Gogoing", 81, "cn"], ["JNG", "LoveLing", 73, "cn"], ["MID", "Cool", 84, "cn"], ["BOT", "san", 70, "cn"], ["SUP", "pomelo", 72, "cn"]] },
  // 5º-8º — Quartas (LCS). Sem grupos (100% playoff). BalIs o destaque (83); varridos pela Fnatic.
  { id: "c9-2013", team: "Cloud9", short: "C9", year: 2013, league: "NA", champion: false,
    players: [["TOP", "BalIs", 83, "us"], ["JNG", "Meteos", 68, "us"], ["MID", "Hai", 69, "us"], ["BOT", "Sneaky", 70, "us"], ["SUP", "LemonNation", 74, "us"]] },
  // 5º-8º — Quartas (wild). Sem grupos (100% playoff). Varridos pela SKT na QF (todos 38-50).
  { id: "gamania-2013", team: "Gamania Bears", short: "GB", year: 2013, league: "LMS", champion: false,
    players: [["TOP", "Steak", 77, "tw"], ["JNG", "Winds", 71, "tw"], ["MID", "Maple", 70, "tw"], ["BOT", "NL", 67, "tw"], ["SUP", "SwordArt", 67, "tw"]] },
  // 9º-14º — Fase de grupos (base 72). Surpresa europeia, melhor que o seed dizia nos grupos.
  { id: "lemondogs-2013", team: "Lemondogs", short: "LD", year: 2013, league: "EU", champion: false,
    players: [["TOP", "Zorozero", 74, "dk"], ["JNG", "Dexter", 72, "de"], ["MID", "Nukeduck", 73, "no"], ["BOT", "Tabzz", 72, "nl"], ["SUP", "Mithy", 71, "es"]] },
  // 9º-14º — Fase de grupos (base 72). Núcleo do futuro Samsung White/campeão'14; caiu cedo aqui.
  { id: "ozone-2013", team: "Samsung Ozone", short: "OZ", year: 2013, league: "LCK", champion: false,
    players: [["TOP", "Looper", 75, "kr"], ["JNG", "DanDy", 73, "kr"], ["MID", "Dade", 74, "kr"], ["BOT", "imp", 73, "kr"], ["SUP", "Mata", 74, "kr"]] },
  // 9º-14º — Fase de grupos (base 72). TSM clássico (Dyrus/Reginald/Xpecial).
  { id: "tsm-2013", team: "Team SoloMid", short: "TSM", year: 2013, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 73, "us"], ["JNG", "TheOddOne", 72, "ca"], ["MID", "Reginald", 72, "us"], ["BOT", "WildTurtle", 71, "ca"], ["SUP", "Xpecial", 73, "us"]] },
  // 9º-14º — Fase de grupos (base 72). 2ª NA; campanha modesta.
  { id: "vulcun-2013", team: "Team Vulcun", short: "VUL", year: 2013, league: "NA", champion: false,
    players: [["TOP", "Benny", 73, "us"], ["JNG", "Xmithie", 71, "ph"], ["MID", "mancloud", 73, "us"], ["BOT", "Zuna", 71, "us"], ["SUP", "BloodWater", 73, "bg"]] },
  // 9º-14º — Fase de grupos, wildcard europeia (base 72, fundo da tabela).
  { id: "gaminggear-2013", team: "GamingGear.eu", short: "GG", year: 2013, league: "EU", champion: false,
    players: [["TOP", "Nbs", 71, "lt"], ["JNG", "Alunir", 70, "lt"], ["MID", "Mazzerin", 71, "lt"], ["BOT", "DeadlyBrother", 70, "lt"], ["SUP", "Inspirro", 71, "lt"]] },
  // 9º-14º — Fase de grupos, wildcard das Filipinas (base 72, fundo da tabela).
  { id: "mineski-2013", team: "Mineski", short: "MSK", year: 2013, league: "LMS", champion: false,
    players: [["TOP", "Snoy", 71, "ph"], ["JNG", "Kaigu", 70, "ph"], ["MID", "Yume", 70, "ph"], ["BOT", "Exo", 69, "ph"], ["SUP", "Tgee", 71, "ph"]] },
];
