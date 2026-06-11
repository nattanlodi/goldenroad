import type { Team } from "../../types";

// Worlds 2018 — campeão: Invictus Gaming (1ª taça da China) sobre a Fnatic (final em Incheon).
// 24 times. Tuplas: [role, nome, overall, país]. NOTAS dos times de playoff: mescla
// colocação + RFT 1.0 (rft.gg), 70% playoff (agregado por série) + 30% geral; ver teams.ts.
// ⚠ Times de play-in eliminados: rosters best-effort (fonte furada na cauda) — arquivo, não gameplay.
export const WORLDS_2018: Team[] = [
  // 1º — Campeão (base 88). Superequipe que dominou o playoff (Rookie/TheShy/Baolan no teto);
  // -2 geral (vs o cálculo bruto) porque o campo de 2018 era mais fraco e o IG não
  // achou resistência real — final 3-0 tranquila sobre uma Fnatic abaixo.
  { id: "ig-2018", team: "Invictus Gaming", short: "IG", year: 2018, league: "LPL", champion: true,
    players: [["TOP", "TheShy", 95, "kr"], ["JNG", "Ning", 94, "cn"], ["MID", "Rookie", 95, "kr"], ["BOT", "JackeyLove", 91, "cn"], ["SUP", "Baolan", 95, "cn"]] },
  // 2º — Vice (base 84). Demolidores na semi (Bwipo 86) mas massacrados 0-3 na final — bot/mid caíram.
  { id: "fnatic-2018", team: "Fnatic", short: "FNC", year: 2018, league: "EU", champion: false, finalist: true,
    players: [["TOP", "Bwipo", 89, "be"], ["JNG", "Broxah", 88, "dk"], ["MID", "Caps", 84, "dk"], ["BOT", "Rekkles", 84, "se"], ["SUP", "Hylissang", 84, "bg"]] },
  // 3º-4º — Semifinal (base 81). 1º semifinalista da NA; Jensen/Svenskeren brilharam na QF.
  { id: "c9-2018", team: "Cloud9", short: "C9", year: 2018, league: "NA", champion: false,
    players: [["TOP", "Licorice", 70, "ca"], ["JNG", "Svenskeren", 83, "dk"], ["MID", "Jensen", 85, "dk"], ["BOT", "Sneaky", 79, "us"], ["SUP", "Zeyzal", 80, "us"]] },
  // 3º-4º — Semifinal (base 81). Perkz o destaque (79 na QF vs RNG).
  { id: "g2-2018", team: "G2 Esports", short: "G2", year: 2018, league: "EU", champion: false,
    players: [["TOP", "Wunder", 81, "dk"], ["JNG", "Jankos", 79, "pl"], ["MID", "Perkz", 87, "hr"], ["BOT", "Hjärnan", 78, "se"], ["SUP", "Wadid", 84, "kr"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela C9; só Kiin apareceu (72).
  { id: "afreeca-2018", team: "Afreeca Freecs", short: "AFS", year: 2018, league: "LCK", champion: false,
    players: [["TOP", "Kiin", 88, "kr"], ["JNG", "Spirit", 66, "kr"], ["MID", "Kuro", 69, "kr"], ["BOT", "Kramer", 68, "kr"], ["SUP", "TusiN", 77, "kr"]] },
  // 5º-8º — Quartas (base 78). Perderam 1-3 pra Fnatic; Scout/Meiko o destaque.
  { id: "edg-2018", team: "EDward Gaming", short: "EDG", year: 2018, league: "LPL", champion: false,
    players: [["TOP", "Ray", 71, "kr"], ["JNG", "Haro", 75, "cn"], ["MID", "Scout", 84, "kr"], ["BOT", "iBoy", 77, "cn"], ["SUP", "Meiko", 80, "cn"]] },
  // 5º-8º — Quartas (base 78). A maior zebra: favoritos absolutos, caíram 2-3 pra G2. Uzi só 78.
  { id: "rng-2018", team: "Royal Never Give Up", short: "RNG", year: 2018, league: "LPL", champion: false,
    players: [["TOP", "Letme", 73, "cn"], ["JNG", "Karsa", 74, "tw"], ["MID", "Xiaohu", 70, "cn"], ["BOT", "Uzi", 77, "cn"], ["SUP", "Ming", 71, "cn"]] },
  // 5º-8º — Quartas (base 78). Quartas épica de 5 jogos contra a IG; Smeb/Deft o destaque.
  { id: "kt-2018", team: "KT Rolster", short: "KT", year: 2018, league: "LCK", champion: false,
    players: [["TOP", "Smeb", 80, "kr"], ["JNG", "Score", 77, "kr"], ["MID", "Ucal", 69, "kr"], ["BOT", "Deft", 76, "kr"], ["SUP", "Mata", 73, "kr"]] },
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
