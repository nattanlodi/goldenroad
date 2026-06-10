import type { Team } from "../../types";

// Worlds 2018 — campeão: Invictus Gaming (1ª taça da China) sobre a Fnatic (final em Incheon).
// 24 times. Tuplas: [role, nome, overall, país]. RÉGUA em teams.ts (política B).
// ⚠ Times de play-in eliminados: rosters best-effort (fonte furada na cauda) — arquivo, não gameplay.
export const WORLDS_2018: Team[] = [
  // 1º — Campeão (base 88). Superequipe equilibrada (TheShy/Rookie/JackeyLove), sem transcendente único.
  { id: "ig-2018", team: "Invictus Gaming", short: "IG", year: 2018, league: "LPL", champion: true,
    players: [["TOP", "TheShy", 93, "kr"], ["JNG", "Ning", 90, "cn"], ["MID", "Rookie", 93, "kr"], ["BOT", "JackeyLove", 92, "cn"], ["SUP", "Baolan", 88, "cn"]] },
  // 2º — Vice (base 84). Caps, o "baby Faker".
  { id: "fnatic-2018", team: "Fnatic", short: "FNC", year: 2018, league: "EU", champion: false, finalist: true,
    players: [["TOP", "Bwipo", 86, "be"], ["JNG", "Broxah", 86, "dk"], ["MID", "Caps", 89, "dk"], ["BOT", "Rekkles", 88, "se"], ["SUP", "Hylissang", 86, "bg"]] },
  // 3º-4º — Semifinal (base 81). 1º semifinalista da NA.
  { id: "c9-2018", team: "Cloud9", short: "C9", year: 2018, league: "NA", champion: false,
    players: [["TOP", "Licorice", 83, "ca"], ["JNG", "Svenskeren", 83, "dk"], ["MID", "Jensen", 84, "dk"], ["BOT", "Sneaky", 83, "us"], ["SUP", "Zeyzal", 82, "us"]] },
  // 3º-4º — Semifinal (base 81). Perkz.
  { id: "g2-2018", team: "G2 Esports", short: "G2", year: 2018, league: "EU", champion: false,
    players: [["TOP", "Wunder", 83, "dk"], ["JNG", "Jankos", 84, "pl"], ["MID", "Perkz", 85, "hr"], ["BOT", "Hjärnan", 83, "se"], ["SUP", "Wadid", 82, "kr"]] },
  // 5º-8º — Quartas (base 78).
  { id: "afreeca-2018", team: "Afreeca Freecs", short: "AFS", year: 2018, league: "LCK", champion: false,
    players: [["TOP", "Kiin", 81, "kr"], ["JNG", "Spirit", 79, "kr"], ["MID", "Kuro", 79, "kr"], ["BOT", "Kramer", 79, "kr"], ["SUP", "TusiN", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). Scout.
  { id: "edg-2018", team: "EDward Gaming", short: "EDG", year: 2018, league: "LPL", champion: false,
    players: [["TOP", "Ray", 79, "kr"], ["JNG", "Haro", 79, "cn"], ["MID", "Scout", 81, "kr"], ["BOT", "iBoy", 80, "cn"], ["SUP", "Meiko", 80, "cn"]] },
  // 5º-8º — Quartas (base 78). Uzi no auge, mas RNG (favorita) caiu nas quartas.
  { id: "rng-2018", team: "Royal Never Give Up", short: "RNG", year: 2018, league: "LPL", champion: false,
    players: [["TOP", "Letme", 79, "cn"], ["JNG", "Karsa", 80, "tw"], ["MID", "Xiaohu", 80, "cn"], ["BOT", "Uzi", 82, "cn"], ["SUP", "Ming", 80, "cn"]] },
  // 5º-8º — Quartas (base 78). Quartas épica contra a IG.
  { id: "kt-2018", team: "KT Rolster", short: "KT", year: 2018, league: "LCK", champion: false,
    players: [["TOP", "Smeb", 80, "kr"], ["JNG", "Score", 80, "kr"], ["MID", "Ucal", 80, "kr"], ["BOT", "Deft", 81, "kr"], ["SUP", "Mata", 80, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). Campeã anterior (núcleo Samsung), naufragou.
  { id: "geng-2018", team: "Gen.G Esports", short: "GEN", year: 2018, league: "LCK", champion: false,
    players: [["TOP", "CuVee", 74, "kr"], ["JNG", "Haru", 73, "kr"], ["MID", "Crown", 74, "kr"], ["BOT", "Ruler", 75, "kr"], ["SUP", "CoreJJ", 75, "kr"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "tl-2018", team: "Team Liquid", short: "TL", year: 2018, league: "NA", champion: false,
    players: [["TOP", "Impact", 74, "kr"], ["JNG", "Xmithie", 74, "ph"], ["MID", "Pobelter", 73, "us"], ["BOT", "Doublelift", 75, "us"], ["SUP", "Olleh", 73, "kr"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "100t-2018", team: "100 Thieves", short: "100", year: 2018, league: "NA", champion: false,
    players: [["TOP", "ssumday", 74, "kr"], ["JNG", "AnDa", 72, "ca"], ["MID", "Huhi", 72, "us"], ["BOT", "Cody Sun", 73, "us"], ["SUP", "aphromoo", 74, "us"]] },
  // 9º-16º — Fase de grupos (base 72). Levou a RNG ao limite nos grupos.
  { id: "vitality-2018", team: "Team Vitality", short: "VIT", year: 2018, league: "EU", champion: false,
    players: [["TOP", "Cabochard", 73, "fr"], ["JNG", "Kikis", 72, "pl"], ["MID", "Jiizuke", 74, "it"], ["BOT", "Attila", 72, "pt"], ["SUP", "Jactroll", 72, "pl"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "fw-2018", team: "Flash Wolves", short: "FW", year: 2018, league: "LMS", champion: false,
    players: [["TOP", "Hanabi", 72, "tw"], ["JNG", "Moojin", 73, "kr"], ["MID", "Maple", 74, "tw"], ["BOT", "Betty", 73, "tw"], ["SUP", "SwordArt", 74, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Wildcard do Vietnã.
  { id: "pvb-2018", team: "Phong Vũ Buffalo", short: "PVB", year: 2018, league: "VCS", champion: false,
    players: [["TOP", "Zeros", 72, "vn"], ["JNG", "Meliodas", 72, "vn"], ["MID", "Naul", 72, "vn"], ["BOT", "BigKoro", 72, "vn"], ["SUP", "Palette", 72, "vn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "mad-2018", team: "MAD Team", short: "MAD", year: 2018, league: "LMS", champion: false,
    players: [["TOP", "Liang", 72, "tw"], ["JNG", "Kongyue", 72, "cn"], ["MID", "Uniboy", 73, "tw"], ["BOT", "Breeze", 72, "tw"], ["SUP", "K", 71, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in. ⚠ rotas/país do suporte a confirmar.
  { id: "grex-2018", team: "G-Rex", short: "GRX", year: 2018, league: "LMS", champion: false,
    players: [["TOP", "PK", 72, "tw"], ["JNG", "Empt2y", 72, "hk"], ["MID", "Candy", 72, "kr"], ["BOT", "Stitch", 72, "kr"], ["SUP", "Koala", 71, "tw"]] },
  // 17º-24º — Play-in eliminado (base 66). ⚠ cauda longa (arquivo).
  { id: "supermassive-2018", team: "SuperMassive eSports", short: "SUP", year: 2018, league: "TCL", champion: false,
    players: [["TOP", "fabFabulous", 66, "tr"], ["JNG", "Stomaged", 65, "tr"], ["MID", "GBM", 67, "kr"], ["BOT", "Zeitnot", 66, "tr"], ["SUP", "SnowFlower", 66, "kr"]] },
  // 17º-24º — Play-in (base 66). Diamondprox, lenda em fim de linha. ⚠
  { id: "gambit-2018", team: "Gambit Esports", short: "GMB", year: 2018, league: "LCL", champion: false,
    players: [["TOP", "Kira", 66, "ua"], ["JNG", "Diamondprox", 67, "ru"], ["MID", "Lodik", 65, "ru"], ["BOT", "Unforgiven", 65, "ru"], ["SUP", "Vander", 66, "pl"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "dfm-2018", team: "DetonatioN FocusMe", short: "DFM", year: 2018, league: "LJL", champion: false,
    players: [["TOP", "Evi", 66, "jp"], ["JNG", "Steal", 65, "kr"], ["MID", "Ceros", 65, "jp"], ["BOT", "Yutapon", 66, "jp"], ["SUP", "ViViD", 65, "kr"]] },
  // 17º-24º — Play-in (base 66). Wildcard do Brasil. ⚠
  { id: "kabum-2018", team: "KaBuM! e-Sports", short: "KBM", year: 2018, league: "CBLOL", champion: false,
    players: [["TOP", "Ranger", 65, "br"], ["JNG", "Revolta", 66, "br"], ["MID", "Pereira", 65, "br"], ["BOT", "Hugs", 65, "br"], ["SUP", "Petter", 64, "br"]] },
  // 17º-24º — Play-in (base 66). Wildcard latino. ⚠
  { id: "infinity-2018", team: "Infinity eSports", short: "INF", year: 2018, league: "LLN", champion: false,
    players: [["TOP", "Relic", 64, "mx"], ["JNG", "SolidSnake", 64, "mx"], ["MID", "Cotopaco", 65, "co"], ["BOT", "Renyu", 64, "mx"], ["SUP", "Arce", 65, "pe"]] },
  // 17º-24º — Play-in (base 66). Wildcard chileno. ⚠
  { id: "klg-2018", team: "Kaos Latin Gamers", short: "KLG", year: 2018, league: "LAS", champion: false,
    players: [["TOP", "Nate", 64, "cl"], ["JNG", "Tierwulf", 65, "cl"], ["MID", "Plugo", 65, "cl"], ["BOT", "Fix", 64, "ar"], ["SUP", "Slow", 64, "cl"]] },
  // 17º-24º — Play-in (base 66). Wildcard da Oceania. ⚠
  { id: "direwolves-2018", team: "Dire Wolves", short: "DW", year: 2018, league: "OPL", champion: false,
    players: [["TOP", "BioPanther", 64, "au"], ["JNG", "Shernfire", 65, "au"], ["MID", "Triple", 65, "au"], ["BOT", "K1ng", 64, "au"], ["SUP", "Cupcake", 64, "au"]] },
  // 17º-24º — Play-in (base 66). Wildcard do sudeste asiático. ⚠ roster parcial (linhagem ex-Bangkok Titans).
  { id: "ascension-2018", team: "Ascension Gaming", short: "ASC", year: 2018, league: "SEA", champion: false,
    players: [["TOP", "WarL0cK", 64, "th"], ["JNG", "Lloyd", 64, "th"], ["MID", "G4", 65, "th"], ["BOT", "Niksar", 65, "ru"], ["SUP", "Moss", 64, "th"]] },
];
