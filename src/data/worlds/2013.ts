import type { Team } from "../../types";

// Worlds 2013 — Season 3 World Championship (final no Staples Center, LA).
// 14 times · campeão: SK Telecom T1 (1ª taça do Faker) sobre o Royal Club.
// Tuplas: [role, nome, overall, país]. NOTAS: mescla colocação + RFT 1.0 (rft.gg),
// com 70% do peso no RFT DOS PLAYOFFS (quartas/semi/final, agregado por série) e
// 30% no geral; ver teams.ts. Faker'13 e Impact'13 com override de curadoria.
export const WORLDS_2013: Team[] = [
  // 1º — Campeão (base 88). Bengi gigante no playoff (59/74/60); Piglet equilibrado
  // (35 na final, 68/63 nas outras). Faker/Impact 96 por curadoria.
  { id: "skt-2013", team: "SK Telecom T1", short: "SKT", year: 2013, league: "OGN", champion: true,
    players: [["TOP", "Impact", 96, "kr"], ["JNG", "Bengi", 94, "kr"], ["MID", "Faker", 96, "kr"], ["BOT", "Piglet", 90, "kr"], ["SUP", "PoohManDu", 92, "kr"]] },
  // 2º — Vice (base 84). Final/S2 fracas; QF4 melhor equilibrou. Wh1t3zZ o destaque.
  { id: "royal-2013", team: "Royal Club", short: "RC", year: 2013, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "GoDlike", 82, "cn"], ["JNG", "Lucky", 78, "cn"], ["MID", "Wh1t3zZ", 87, "cn"], ["BOT", "Uzi", 84, "cn"], ["SUP", "Tabe", 84, "hk"]] },
  // 3º — Semifinal (base 81). Watch (74 na semi) e Cain (66) brilharam mesmo perdendo.
  { id: "najinbs-2013", team: "NaJin Black Sword", short: "NJBS", year: 2013, league: "OGN", champion: false,
    players: [["TOP", "Expession", 85, "kr"], ["JNG", "Watch", 85, "kr"], ["MID", "Nagne", 83, "kr"], ["BOT", "PraY", 79, "kr"], ["SUP", "Cain", 83, "kr"]] },
  // 4º — Semifinal (base 81). sOAZ dominante no playoff (74/71 — top do evento).
  { id: "fnatic-2013", team: "Fnatic", short: "FNC", year: 2013, league: "EU", champion: false,
    players: [["TOP", "sOAZ", 94, "fr"], ["JNG", "Cyanide", 82, "fi"], ["MID", "xPeke", 88, "es"], ["BOT", "Puszu", 86, "ee"], ["SUP", "YellOwStaR", 86, "fr"]] },
  // 5º-8º — Quartas (base 78). Varridos pela SKT na QF3 (todos 35-42) — RFT puxa pra baixo.
  { id: "gamania-2013", team: "Gamania Bears", short: "GB", year: 2013, league: "GPL", champion: false,
    players: [["TOP", "Steak", 71, "tw"], ["JNG", "Winds", 69, "tw"], ["MID", "Maple", 69, "tw"], ["BOT", "NL", 68, "tw"], ["SUP", "SwordArT", 71, "tw"]] },
  // 5º-8º — Quartas (base 78). RFT playoff (QF2): Darien 58 o destaque.
  { id: "gambit-2013", team: "Gambit Gaming", short: "GMB", year: 2013, league: "EU", champion: false,
    players: [["TOP", "Darien", 82, "ru"], ["JNG", "Diamondprox", 74, "ru"], ["MID", "Alex Ich", 78, "ru"], ["BOT", "Genja", 74, "ru"], ["SUP", "Voidle", 75, "ee"]] },
  // 5º-8º — Quartas (base 78). Bons nos grupos, modestos na QF4 (perderam 0-2): Gogoing 56.
  { id: "omg-2013", team: "Oh My God", short: "OMG", year: 2013, league: "LPL", champion: false,
    players: [["TOP", "Gogoing", 83, "cn"], ["JNG", "LoveLin", 74, "cn"], ["MID", "Cool", 81, "cn"], ["BOT", "San", 71, "cn"], ["SUP", "Bigpomelo", 76, "cn"]] },
  // 5º-8º — Quartas (base 78). RFT playoff (QF1): Balls 62 o destaque.
  { id: "c9-2013", team: "Cloud9", short: "C9", year: 2013, league: "NA", champion: false,
    players: [["TOP", "Balls", 84, "us"], ["JNG", "Meteos", 76, "us"], ["MID", "Hai", 73, "us"], ["BOT", "Sneaky", 73, "us"], ["SUP", "LemonNation", 75, "us"]] },
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
