import type { Team } from "../../types";

// Worlds 2021 — campeão: EDward Gaming sobre o DWG KIA (final em Reykjavík, bolha COVID).
// 22 times. Tuplas: [role, nome, overall, país]. RÉGUA em teams.ts (política B).
// ⚠ Play-in eliminados: best-effort (arquivo); alguns slots de wildcards são palpite.
export const WORLDS_2021: Team[] = [
  // 1º — Campeão (base 88). Scout/Viper carregaram; sem transcendente único.
  { id: "edg-2021", team: "EDward Gaming", short: "EDG", year: 2021, league: "LPL", champion: true,
    players: [["TOP", "Flandre", 88, "cn"], ["JNG", "Jiejie", 90, "cn"], ["MID", "Scout", 92, "kr"], ["BOT", "Viper", 91, "kr"], ["SUP", "Meiko", 90, "cn"]] },
  // 2º — Vice (base 84).
  { id: "dk-2021", team: "DWG KIA", short: "DK", year: 2021, league: "LCK", champion: false, finalist: true,
    players: [["TOP", "Khan", 86, "kr"], ["JNG", "Canyon", 89, "kr"], ["MID", "ShowMaker", 88, "kr"], ["BOT", "Ghost", 85, "kr"], ["SUP", "BeryL", 86, "kr"]] },
  // 3º-4º — Semifinal (base 81).
  { id: "geng-2021", team: "Gen.G Esports", short: "GEN", year: 2021, league: "LCK", champion: false,
    players: [["TOP", "Rascal", 82, "kr"], ["JNG", "Clid", 82, "kr"], ["MID", "Bdd", 83, "kr"], ["BOT", "Ruler", 84, "kr"], ["SUP", "Life", 82, "kr"]] },
  // 3º-4º — Semifinal (base 81). T1 do Faker com Oner/Gumayusi/Keria emergindo.
  { id: "t1-2021", team: "T1", short: "T1", year: 2021, league: "LCK", champion: false,
    players: [["TOP", "Canna", 82, "kr"], ["JNG", "Oner", 83, "kr"], ["MID", "Faker", 86, "kr"], ["BOT", "Gumayusi", 83, "kr"], ["SUP", "Keria", 84, "kr"]] },
  // 5º-8º — Quartas (base 78). GALA/Xiaohu (de top).
  { id: "rng-2021", team: "Royal Never Give Up", short: "RNG", year: 2021, league: "LPL", champion: false,
    players: [["TOP", "Xiaohu", 81, "cn"], ["JNG", "Wei", 80, "cn"], ["MID", "Cryin", 79, "cn"], ["BOT", "GALA", 81, "cn"], ["SUP", "Ming", 80, "cn"]] },
  // 5º-8º — Quartas (base 78).
  { id: "c9-2021", team: "Cloud9", short: "C9", year: 2021, league: "LCS", champion: false,
    players: [["TOP", "Fudge", 79, "au"], ["JNG", "Blaber", 80, "us"], ["MID", "Perkz", 81, "hr"], ["BOT", "Zven", 79, "dk"], ["SUP", "Vulcan", 79, "ca"]] },
  // 5º-8º — Quartas (base 78). Chovy/Deft.
  { id: "hle-2021", team: "Hanwha Life Esports", short: "HLE", year: 2021, league: "LCK", champion: false,
    players: [["TOP", "Morgan", 79, "kr"], ["JNG", "Willer", 79, "kr"], ["MID", "Chovy", 82, "kr"], ["BOT", "Deft", 81, "kr"], ["SUP", "Vsta", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). Elyoya.
  { id: "madlions-2021", team: "MAD Lions", short: "MAD", year: 2021, league: "LEC", champion: false,
    players: [["TOP", "Armut", 79, "tr"], ["JNG", "Elyoya", 80, "es"], ["MID", "Humanoid", 80, "cz"], ["BOT", "Carzzy", 79, "cz"], ["SUP", "Kaiser", 79, "de"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "rogue-2021", team: "Rogue", short: "RGE", year: 2021, league: "LEC", champion: false,
    players: [["TOP", "Odoamne", 73, "ro"], ["JNG", "Inspired", 74, "pl"], ["MID", "Larssen", 74, "se"], ["BOT", "Hans Sama", 74, "fr"], ["SUP", "Trymbi", 73, "pl"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "100t-2021", team: "100 Thieves", short: "100", year: 2021, league: "LCS", champion: false,
    players: [["TOP", "Ssumday", 73, "kr"], ["JNG", "Closer", 74, "tr"], ["MID", "Abbedagge", 73, "de"], ["BOT", "FBI", 73, "au"], ["SUP", "huhi", 73, "us"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "psg-2021", team: "PSG Talon", short: "PSG", year: 2021, league: "PCS", champion: false,
    players: [["TOP", "Hanabi", 73, "tw"], ["JNG", "River", 74, "kr"], ["MID", "Maple", 73, "tw"], ["BOT", "Unified", 73, "hk"], ["SUP", "Kaiwing", 72, "hk"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "tl-2021", team: "Team Liquid", short: "TL", year: 2021, league: "LCS", champion: false,
    players: [["TOP", "Alphari", 74, "gb"], ["JNG", "Santorin", 73, "dk"], ["MID", "Jensen", 73, "dk"], ["BOT", "Tactical", 73, "us"], ["SUP", "CoreJJ", 74, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). Tarzan.
  { id: "lng-2021", team: "LNG Esports", short: "LNG", year: 2021, league: "LPL", champion: false,
    players: [["TOP", "Ale", 73, "cn"], ["JNG", "Tarzan", 75, "kr"], ["MID", "icon", 73, "kr"], ["BOT", "Light", 74, "cn"], ["SUP", "Iwandy", 72, "cn"]] },
  // 9º-16º — Fase de grupos (base 72). Campeã de 2019, decepcionou.
  { id: "fpx-2021", team: "FunPlus Phoenix", short: "FPX", year: 2021, league: "LPL", champion: false,
    players: [["TOP", "Nuguri", 74, "kr"], ["JNG", "Tian", 74, "cn"], ["MID", "Doinb", 74, "kr"], ["BOT", "Lwx", 73, "cn"], ["SUP", "Crisp", 73, "cn"]] },
  // 9º-16º — Fase de grupos (base 72). 1º LJL a escapar do play-in.
  { id: "dfm-2021", team: "DetonatioN FocusMe", short: "DFM", year: 2021, league: "LJL", champion: false,
    players: [["TOP", "Evi", 72, "jp"], ["JNG", "Steal", 73, "kr"], ["MID", "Aria", 73, "kr"], ["BOT", "Yutapon", 72, "jp"], ["SUP", "Gaeng", 72, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). Bwipo de jungler.
  { id: "fnatic-2021", team: "Fnatic", short: "FNC", year: 2021, league: "LEC", champion: false,
    players: [["TOP", "Adam", 72, "fr"], ["JNG", "Bwipo", 74, "be"], ["MID", "Nisqy", 73, "be"], ["BOT", "Bean", 72, "de"], ["SUP", "Hylissang", 73, "bg"]] },
  // 17º-22º — Play-in eliminado (base 66). Wildcard da Oceania. ⚠ mid/bot/sup palpite.
  { id: "peace-2021", team: "PEACE", short: "PCE", year: 2021, league: "LCO", champion: false,
    players: [["TOP", "Vizicsacsi", 65, "hu"], ["JNG", "Babip", 65, "au"], ["MID", "Pabu", 64, "au"], ["BOT", "Doxy", 64, "au"], ["SUP", "Aladoric", 64, "au"]] },
  // 17º-22º — Play-in (base 66). Wildcard de Taiwan/SEA.
  { id: "beyond-2021", team: "Beyond Gaming", short: "BYG", year: 2021, league: "PCS", champion: false,
    players: [["TOP", "Liang", 65, "tw"], ["JNG", "Husha", 65, "tw"], ["MID", "PK", 65, "tw"], ["BOT", "Doggo", 66, "tw"], ["SUP", "Kino", 64, "tw"]] },
  // 17º-22º — Play-in (base 66). Wildcard do Brasil.
  { id: "red-2021", team: "RED Canids", short: "RED", year: 2021, league: "CBLOL", champion: false,
    players: [["TOP", "Guigo", 65, "br"], ["JNG", "Aegis", 65, "br"], ["MID", "Grevthar", 65, "br"], ["BOT", "TitaN", 66, "br"], ["SUP", "Jojo", 64, "br"]] },
  // 17º-22º — Play-in (base 66). Wildcard turco.
  { id: "gala-2021", team: "Galatasaray Esports", short: "GS", year: 2021, league: "TCL", champion: false,
    players: [["TOP", "Crazy", 65, "kr"], ["JNG", "Mojito", 64, "tr"], ["MID", "Bolulu", 65, "tr"], ["BOT", "Alive", 65, "kr"], ["SUP", "Zergsting", 64, "tr"]] },
  // 17º-22º — Play-in (base 66). Wildcard latino.
  { id: "infinity-2021", team: "Infinity", short: "INF", year: 2021, league: "LLA", champion: false,
    players: [["TOP", "Buggax", 64, "uy"], ["JNG", "SolidSnake", 64, "pe"], ["MID", "cody", 65, "cl"], ["BOT", "Whitelotus", 64, "ar"], ["SUP", "Ackerman", 64, "mx"]] },
  // 17º-22º — Play-in (base 66). Wildcard da CIS. ⚠ roster best-effort.
  { id: "uol-2021", team: "Unicorns Of Love", short: "UOL", year: 2021, league: "LCL", champion: false,
    players: [["TOP", "BOSS", 65, "ru"], ["JNG", "AHaHaCiK", 65, "ru"], ["MID", "Nomanz", 65, "ru"], ["BOT", "Argonavt", 64, "ru"], ["SUP", "SaNTaS", 64, "ru"]] },
];
