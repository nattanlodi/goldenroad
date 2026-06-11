import type { Team } from "../../types";

// Worlds 2022 — campeão: DRX sobre a T1 (o "conto de fadas" do Deft; final em São Francisco).
// 24 times. Tuplas: [role, nome, overall, país]. NOTAS dos times de playoff: mescla
// colocação + RFT 1.0 (rft.gg), 70% playoff (agregado por série) + 30% geral; ver teams.ts.
// ⚠ Alguns times de grupo/play-in obscuros: rosters best-effort (fonte furada).
export const WORLDS_2022: Team[] = [
  // 1º — Campeão (base 88). Cinderela (4ª seed); título de consistência crescente. Zeka o destaque, Kingen MVP da final.
  { id: "drx-2022", team: "DRX", short: "DRX", year: 2022, league: "LCK", champion: true,
    players: [["TOP", "Kingen", 91, "kr"], ["JNG", "Pyosik", 88, "kr"], ["MID", "Zeka", 91, "kr"], ["BOT", "Deft", 86, "kr"], ["SUP", "BeryL", 89, "kr"]] },
  // 2º — Vice (base 84). Trio jovem + Faker; monstros na semi (Gumayusi/Keria 80). Final em 5 jogos.
  { id: "t1-2022", team: "T1", short: "T1", year: 2022, league: "LCK", champion: false, finalist: true,
    players: [["TOP", "Zeus", 92, "kr"], ["JNG", "Oner", 88, "kr"], ["MID", "Faker", 88, "kr"], ["BOT", "Gumayusi", 92, "kr"], ["SUP", "Keria", 94, "kr"]] },
  // 3º — Semifinal (base 81). Kanavi gigante na QF (82); 369 forte.
  { id: "jdg-2022", team: "JD Gaming", short: "JDG", year: 2022, league: "LPL", champion: false,
    players: [["TOP", "369", 90, "cn"], ["JNG", "Kanavi", 91, "kr"], ["MID", "Yagao", 79, "cn"], ["BOT", "Hope", 79, "cn"], ["SUP", "Missing", 84, "cn"]] },
  // 4º — Semifinal (base 81). Chovy/Ruler; varridos cedo pela DRX na semi.
  { id: "geng-2022", team: "Gen.G Esports", short: "GEN", year: 2022, league: "LCK", champion: false,
    players: [["TOP", "Doran", 80, "kr"], ["JNG", "Peanut", 74, "kr"], ["MID", "Chovy", 83, "kr"], ["BOT", "Ruler", 83, "kr"], ["SUP", "Lehends", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela JDG; Larssen o único a brilhar (73).
  { id: "rogue-2022", team: "Rogue", short: "RGE", year: 2022, league: "LEC", champion: false,
    players: [["TOP", "Odoamne", 67, "ro"], ["JNG", "Malrang", 66, "kr"], ["MID", "Larssen", 87, "se"], ["BOT", "Comp", 67, "gr"], ["SUP", "Trymbi", 68, "pl"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela T1; Xiaohu o destaque.
  { id: "rng-2022", team: "Royal Never Give Up", short: "RNG", year: 2022, league: "LPL", champion: false,
    players: [["TOP", "Breathe", 73, "cn"], ["JNG", "Wei", 67, "cn"], ["MID", "Xiaohu", 76, "cn"], ["BOT", "GALA", 70, "cn"], ["SUP", "Ming", 66, "cn"]] },
  // 5º-8º — Quartas (base 78). Perderam 2-3 pra Gen.G; Canyon/ShowMaker o destaque.
  { id: "dk-2022", team: "DWG KIA", short: "DK", year: 2022, league: "LCK", champion: false,
    players: [["TOP", "Nuguri", 82, "kr"], ["JNG", "Canyon", 85, "kr"], ["MID", "ShowMaker", 82, "kr"], ["BOT", "deokdam", 74, "kr"], ["SUP", "Kellin", 80, "kr"]] },
  // 5º-8º — Quartas (base 78). Perderam 2-3 pra DRX; Scout o destaque (72).
  { id: "edg-2022", team: "EDward Gaming", short: "EDG", year: 2022, league: "LPL", champion: false,
    players: [["TOP", "Flandre", 83, "cn"], ["JNG", "Jiejie", 76, "cn"], ["MID", "Scout", 87, "kr"], ["BOT", "Viper", 75, "kr"], ["SUP", "Meiko", 74, "cn"]] },
  // 9º-10º — Fase de grupos (base 72). Razork de jungler.
  { id: "fnatic-2022", team: "Fnatic", short: "FNC", year: 2022, league: "LEC", champion: false,
    players: [["TOP", "Wunder", 73, "de"], ["JNG", "Razork", 73, "es"], ["MID", "Humanoid", 74, "cz"], ["BOT", "Upset", 74, "de"], ["SUP", "Hylissang", 73, "bg"]] },
  // 9º-10º — Fase de grupos (base 72).
  { id: "tes-2022", team: "Top Esports", short: "TES", year: 2022, league: "LPL", champion: false,
    players: [["TOP", "Wayward", 72, "cn"], ["JNG", "Tian", 74, "cn"], ["MID", "knight", 75, "cn"], ["BOT", "JackeyLove", 74, "cn"], ["SUP", "Mark", 72, "cn"]] },
  // 11º-14º — Fase de grupos (base 72).
  { id: "eg-2022", team: "Evil Geniuses", short: "EG", year: 2022, league: "LCS", champion: false,
    players: [["TOP", "Impact", 73, "kr"], ["JNG", "Inspired", 74, "pl"], ["MID", "PoE", 73, "lt"], ["BOT", "Kaori", 72, "jp"], ["SUP", "Vulcan", 73, "us"]] },
  // 11º-14º — Fase de grupos (base 72).
  { id: "g2-2022", team: "G2 Esports", short: "G2", year: 2022, league: "LEC", champion: false,
    players: [["TOP", "BrokenBlade", 73, "de"], ["JNG", "Jankos", 73, "pl"], ["MID", "caPs", 75, "dk"], ["BOT", "Flakked", 72, "es"], ["SUP", "Mikyx", 73, "si"]] },
  // 11º-14º — Fase de grupos (base 72). Closer de jungler.
  { id: "100t-2022", team: "100 Thieves", short: "100", year: 2022, league: "LCS", champion: false,
    players: [["TOP", "ssumday", 73, "kr"], ["JNG", "Closer", 73, "tr"], ["MID", "Abbedagge", 72, "de"], ["BOT", "FBI", 73, "us"], ["SUP", "Huhi", 72, "us"]] },
  // 11º-14º — Fase de grupos (base 72).
  { id: "cfo-2022", team: "CTBC Flying Oyster", short: "CFO", year: 2022, league: "PCS", champion: false,
    players: [["TOP", "Zikz", 72, "tw"], ["JNG", "Moojin", 72, "kr"], ["MID", "ATLUS", 73, "tw"], ["BOT", "AN", 72, "tw"], ["SUP", "Kaiwing", 72, "hk"]] },
  // 15º-16º — Fase de grupos (base 72). ⚠ roster a confirmar.
  { id: "c9-2022", team: "Cloud9", short: "C9", year: 2022, league: "LCS", champion: false,
    players: [["TOP", "Fudge", 73, "ca"], ["JNG", "Blaber", 74, "us"], ["MID", "Jensen", 73, "dk"], ["BOT", "Berserker", 73, "kr"], ["SUP", "Winsome", 72, "us"]] },
  // 15º-16º — Fase de grupos (base 72). Levi. ⚠ mid/sup a confirmar.
  { id: "gam-2022", team: "GAM Esports", short: "GAM", year: 2022, league: "VCS", champion: false,
    players: [["TOP", "Kiaya", 72, "vn"], ["JNG", "Levi", 73, "vn"], ["MID", "Kati", 72, "vn"], ["BOT", "Slayder", 72, "vn"], ["SUP", "Bie", 71, "vn"]] },
  // 17º-18º — Play-in eliminado (base 66). Elyoya.
  { id: "madlions-2022", team: "MAD Lions", short: "MAD", year: 2022, league: "LEC", champion: false,
    players: [["TOP", "Armut", 65, "tr"], ["JNG", "Elyoya", 66, "es"], ["MID", "Nisqy", 65, "be"], ["BOT", "Carzzy", 65, "cz"], ["SUP", "Kaiser", 65, "de"]] },
  // 17º-18º — Play-in (base 66).
  { id: "dfm-2022", team: "DetonatioN FocusMe", short: "DFM", year: 2022, league: "LJL", champion: false,
    players: [["TOP", "Evi", 65, "jp"], ["JNG", "Steal", 65, "jp"], ["MID", "Clozer", 66, "kr"], ["BOT", "Yutapon", 65, "jp"], ["SUP", "Gaeng", 65, "kr"]] },
  // 19º-20º — Play-in (base 66). Wildcard do Vietnã. ⚠
  { id: "sgb-2022", team: "Saigon Buffalo", short: "SGB", year: 2022, league: "VCS", champion: false,
    players: [["TOP", "Hasmed", 65, "vn"], ["JNG", "BeanJ", 65, "vn"], ["MID", "Froggy", 66, "vn"], ["BOT", "Shogun", 65, "vn"], ["SUP", "Taki", 64, "vn"]] },
  // 19º-20º — Play-in (base 66). Wildcard do Brasil (LOUD).
  { id: "loud-2022", team: "LOUD", short: "LLL", year: 2022, league: "CBLOL", champion: false,
    players: [["TOP", "Robo", 65, "br"], ["JNG", "Croc", 65, "kr"], ["MID", "tinowns", 66, "br"], ["BOT", "Brance", 66, "br"], ["SUP", "Ceos", 64, "br"]] },
  // 21º-22º — Play-in (base 66). Wildcard de Taiwan/SEA. ⚠ roster best-effort.
  { id: "beyond-2022", team: "Beyond Gaming", short: "BYG", year: 2022, league: "PCS", champion: false,
    players: [["TOP", "Liang", 64, "tw"], ["JNG", "Husha", 64, "tw"], ["MID", "Maoan", 65, "tw"], ["BOT", "Doggo", 65, "tw"], ["SUP", "Kino", 64, "tw"]] },
  // 21º-22º — Play-in (base 66). Wildcard latino. ⚠ suporte a confirmar.
  { id: "isurus-2022", team: "Isurus", short: "ISG", year: 2022, league: "LLA", champion: false,
    players: [["TOP", "Ixtal", 64, "ar"], ["JNG", "Mapache", 65, "ar"], ["MID", "Tenebra", 65, "ar"], ["BOT", "MichaeLJ", 64, "ar"], ["SUP", "Gavotto", 64, "ar"]] },
  // 23º-24º — Play-in (base 66). Wildcard da Oceania. ⚠ roster best-effort.
  { id: "chiefs-2022", team: "Chiefs Esports Club", short: "CHF", year: 2022, league: "LCO", champion: false,
    players: [["TOP", "Fury", 64, "au"], ["JNG", "Arthur", 64, "au"], ["MID", "Tally", 65, "au"], ["BOT", "Raes", 65, "nz"], ["SUP", "Aladoric", 64, "au"]] },
  // 23º-24º — Play-in (base 66). Wildcard turco. ⚠ rotas a confirmar.
  { id: "istanbul-2022", team: "İstanbul Wildcats", short: "IW", year: 2022, league: "TCL", champion: false,
    players: [["TOP", "Farfetch", 64, "tr"], ["JNG", "Ferret", 64, "kr"], ["MID", "Serin", 65, "kr"], ["BOT", "StarScreen", 64, "tr"], ["SUP", "HolyPhoenix", 64, "tr"]] },
];
