import type { Team } from "../../types";

// Worlds 2017 — campeão: Samsung Galaxy sobre a SK Telecom T1 (final em Pequim).
// 24 times (entrou o play-in). Tuplas: [role, nome, overall, país]. NOTAS dos times de
// playoff: mescla colocação + RFT 1.0 (rft.gg), 70% playoff + 30% geral; ver teams.ts.
// Times de play-in eliminados ⚠ têm rosters menos verificáveis (cauda longa).
export const WORLDS_2017: Team[] = [
  // 1º — Campeão (base 88). Equilibrado, sem transcendente; mas TODOS gigantes no playoff
  // (CuVee 81 na QF, CoreJJ 74). Varreram a SKT 3-0 na final.
  { id: "ssg-2017", team: "Samsung Galaxy", short: "SSG", year: 2017, league: "LCK", champion: true,
    players: [["TOP", "CuVee", 96, "kr"], ["JNG", "Ambition", 92, "kr"], ["MID", "Crown", 92, "kr"], ["BOT", "Ruler", 93, "kr"], ["SUP", "CoreJJ", 95, "kr"]] },
  // 2º — Vice (base 84). Faker ainda elite (89), mas o bot (Bang/Wolf) desabou na final 0-3.
  { id: "skt-2017", team: "SK Telecom T1", short: "SKT", year: 2017, league: "LCK", champion: false, finalist: true,
    players: [["TOP", "Huni", 88, "kr"], ["JNG", "Peanut", 76, "kr"], ["MID", "Faker", 89, "kr"], ["BOT", "Bang", 80, "kr"], ["SUP", "Wolf", 80, "kr"]] },
  // 3º-4º — Semifinal (base 81). Xiaohu 90 e Uzi 87 (77 na QF) carregaram.
  { id: "rng-2017", team: "Royal Never Give Up", short: "RNG", year: 2017, league: "LPL", champion: false,
    players: [["TOP", "Letme", 82, "cn"], ["JNG", "Mlxg", 81, "cn"], ["MID", "Xiaohu", 91, "cn"], ["BOT", "Uzi", 88, "cn"], ["SUP", "Ming", 83, "cn"]] },
  // 3º-4º — Semifinal (base 81). xiye o destaque.
  { id: "we-2017", team: "Team WE", short: "WE", year: 2017, league: "LPL", champion: false,
    players: [["TOP", "957", 80, "cn"], ["JNG", "Condi", 75, "cn"], ["MID", "xiye", 85, "cn"], ["BOT", "Mystic", 79, "kr"], ["SUP", "Ben", 75, "kr"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela SSG; só Bdd apareceu (62).
  { id: "lz-2017", team: "Longzhu Gaming", short: "LZ", year: 2017, league: "LCK", champion: false,
    players: [["TOP", "Khan", 70, "kr"], ["JNG", "Cuzz", 66, "kr"], ["MID", "Bdd", 80, "kr"], ["BOT", "PraY", 66, "kr"], ["SUP", "GorillA", 67, "kr"]] },
  // 5º-8º — Quartas (base 78). Levaram a SKT ao 5º jogo; RFT equilibrado.
  { id: "msf-2017", team: "Misfits Gaming", short: "MSF", year: 2017, league: "EU", champion: false,
    players: [["TOP", "Alphari", 77, "gb"], ["JNG", "Maxlore", 74, "gb"], ["MID", "PowerOfEvil", 73, "de"], ["BOT", "Hans Sama", 79, "fr"], ["SUP", "IgNar", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). Perderam 1-3 pra RNG; Rekkles o destaque.
  { id: "fnatic-2017", team: "Fnatic", short: "FNC", year: 2017, league: "EU", champion: false,
    players: [["TOP", "sOAZ", 69, "fr"], ["JNG", "Broxah", 74, "dk"], ["MID", "Caps", 76, "dk"], ["BOT", "Rekkles", 83, "se"], ["SUP", "Jesiz", 71, "dk"]] },
  // 5º-8º — Quartas (base 78). Jogaram muito bem no 2-3 vs WE; line toda forte.
  { id: "c9-2017", team: "Cloud9", short: "C9", year: 2017, league: "NA", champion: false,
    players: [["TOP", "Impact", 84, "kr"], ["JNG", "Contractz", 83, "us"], ["MID", "Jensen", 88, "dk"], ["BOT", "Sneaky", 85, "us"], ["SUP", "Smoothie", 87, "ca"]] },
  // 9º-16º — Fase de grupos (base 72). Clearlove/Scout.
  { id: "edg-2017", team: "EDward Gaming", short: "EDG", year: 2017, league: "LPL", champion: false,
    players: [["TOP", "Mouse", 72, "cn"], ["JNG", "Clearlove7", 75, "cn"], ["MID", "Scout", 76, "kr"], ["BOT", "iBoy", 74, "cn"], ["SUP", "Meiko", 75, "cn"]] },
  // 9º-16º — Fase de grupos (base 72). Levi/Marines vietnamita.
  { id: "gam-2017", team: "GIGABYTE Marines", short: "GAM", year: 2017, league: "VCS", champion: false,
    players: [["TOP", "Archie", 72, "vn"], ["JNG", "Levi", 74, "vn"], ["MID", "Optimus", 73, "vn"], ["BOT", "Noway", 72, "vn"], ["SUP", "Sya", 71, "vn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "g2-2017", team: "G2 Esports", short: "G2", year: 2017, league: "EU", champion: false,
    players: [["TOP", "Expect", 72, "kr"], ["JNG", "Trick", 73, "kr"], ["MID", "Perkz", 75, "hr"], ["BOT", "Zven", 74, "dk"], ["SUP", "mithy", 73, "es"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "tsm-2017", team: "Team SoloMid", short: "TSM", year: 2017, league: "NA", champion: false,
    players: [["TOP", "Hauntzer", 73, "us"], ["JNG", "Svenskeren", 73, "dk"], ["MID", "Bjergsen", 76, "dk"], ["BOT", "Doublelift", 75, "us"], ["SUP", "Biofrost", 73, "ca"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "imt-2017", team: "Immortals", short: "IMT", year: 2017, league: "NA", champion: false,
    players: [["TOP", "Flame", 73, "kr"], ["JNG", "Xmithie", 73, "ph"], ["MID", "Pobelter", 73, "us"], ["BOT", "Cody Sun", 73, "ca"], ["SUP", "Olleh", 72, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). Karsa.
  { id: "fw-2017", team: "Flash Wolves", short: "FW", year: 2017, league: "LMS", champion: false,
    players: [["TOP", "MMD", 73, "tw"], ["JNG", "Karsa", 75, "tw"], ["MID", "Maple", 74, "tw"], ["BOT", "Betty", 73, "tw"], ["SUP", "SwordArT", 74, "tw"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "ahq-2017", team: "ahq e-Sports Club", short: "AHQ", year: 2017, league: "LMS", champion: false,
    players: [["TOP", "Ziv", 73, "tw"], ["JNG", "Mountain", 72, "tw"], ["MID", "Chawy", 72, "sg"], ["BOT", "AN", 72, "tw"], ["SUP", "Albis", 72, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Wildcard turco que subiu do play-in.
  { id: "fb-2017", team: "1907 Fenerbahçe", short: "FB", year: 2017, league: "TCL", champion: false,
    players: [["TOP", "Thaldrin", 70, "tr"], ["JNG", "Crash", 72, "kr"], ["MID", "Frozen", 72, "kr"], ["BOT", "Padden", 70, "tr"], ["SUP", "Japone", 70, "tr"]] },
  // 17º-24º — Play-in eliminado (base 66). ⚠ cauda longa.
  { id: "hka-2017", team: "Hong Kong Attitude", short: "HKA", year: 2017, league: "LMS", champion: false,
    players: [["TOP", "Riris", 66, "kr"], ["JNG", "GodKwai", 66, "hk"], ["MID", "M1ssion", 67, "tw"], ["BOT", "Unified", 68, "hk"], ["SUP", "Kaiwing", 67, "hk"]] },
  // 17º-24º — Play-in (base 66). Wildcard do Brasil. ⚠
  { id: "onee-2017", team: "Team oNe eSports", short: "ONE", year: 2017, league: "CBLOL", champion: false,
    players: [["TOP", "VVvert", 66, "br"], ["JNG", "4LaN", 67, "br"], ["MID", "Brucer", 66, "br"], ["BOT", "Absolut", 66, "br"], ["SUP", "RedBert", 65, "br"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "yg-2017", team: "Young Generation", short: "YG", year: 2017, league: "VCS", champion: false,
    players: [["TOP", "Ren", 66, "vn"], ["JNG", "Venus", 66, "vn"], ["MID", "Naul", 67, "vn"], ["BOT", "BigKoro", 66, "vn"], ["SUP", "Palette", 66, "vn"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "dw-2017", team: "Dire Wolves", short: "DW", year: 2017, league: "OPL", champion: false,
    players: [["TOP", "Chippys", 65, "nz"], ["JNG", "Shernfire", 66, "au"], ["MID", "Phantiks", 65, "au"], ["BOT", "k1ng", 65, "au"], ["SUP", "Destiny", 65, "au"]] },
  // 17º-24º — Play-in (base 66). Diamondprox, lenda em fim de linha. ⚠
  { id: "gmb-2017", team: "Gambit Esports", short: "GMB", year: 2017, league: "LCL", champion: false,
    players: [["TOP", "PvPStejos", 65, "ua"], ["JNG", "Diamondprox", 67, "ru"], ["MID", "Kira", 66, "ua"], ["BOT", "Blasting", 65, "lv"], ["SUP", "Edward", 66, "am"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "klg-2017", team: "Kaos Latin Gamers", short: "KLG", year: 2017, league: "LLN", champion: false,
    players: [["TOP", "MANTARRAYA", 64, "uy"], ["JNG", "Tierwulf", 64, "cl"], ["MID", "Plugo", 65, "cl"], ["BOT", "Fix", 64, "ar"], ["SUP", "Slow", 64, "cl"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "lyon-2017", team: "Lyon Gaming", short: "LYN", year: 2017, league: "LLN", champion: false,
    players: [["TOP", "Jirall", 64, "mx"], ["JNG", "Oddie", 65, "pe"], ["MID", "Seiya", 66, "mx"], ["BOT", "WhiteLotus", 64, "ar"], ["SUP", "Genthix", 64, "ar"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "rpg-2017", team: "Rampage", short: "RPG", year: 2017, league: "LJL", champion: false,
    players: [["TOP", "Evi", 66, "jp"], ["JNG", "Tussle", 65, "kr"], ["MID", "Ramune", 65, "jp"], ["BOT", "YutoriMoyasi", 64, "jp"], ["SUP", "Dara", 65, "kr"]] },
];
