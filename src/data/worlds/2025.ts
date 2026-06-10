import type { Team } from "../../types";

// Worlds 2025 — campeão: T1 sobre o KT Rolster (3-2; o TRICAMPEONATO seguido — 6º título de T1; final na China).
// 17 times. Tuplas: [role, nome, overall, país]. RÉGUA em teams.ts (política B).
// Final 100% LCK (clássico T1 x KT). Gumayusi MVP da final. Doran no top (lugar do Zeus).
export const WORLDS_2025: Team[] = [
  // 1º — Campeão (base 88). Terceiro título seguido, façanha inédita. Gumayusi MVP; Faker eterno.
  { id: "t1-2025", team: "T1", short: "T1", year: 2025, league: "LCK", champion: true,
    players: [["TOP", "Doran", 89, "kr"], ["JNG", "Oner", 91, "kr"], ["MID", "Faker", 94, "kr"], ["BOT", "Gumayusi", 93, "kr"], ["SUP", "Keria", 92, "kr"]] },
  // 2º — Vice (base 84). O eterno rival levou T1 ao 5º jogo.
  { id: "kt-2025", team: "KT Rolster", short: "KT", year: 2025, league: "LCK", champion: false, finalist: true,
    players: [["TOP", "PerfecT", 85, "kr"], ["JNG", "Cuzz", 86, "kr"], ["MID", "Bdd", 86, "kr"], ["BOT", "deokdam", 85, "kr"], ["SUP", "Peter", 84, "kr"]] },
  // 3º-4º — Semifinal (base 81). JackeyLove/369/Kanavi.
  { id: "tes-2025", team: "Top Esports", short: "TES", year: 2025, league: "LPL", champion: false,
    players: [["TOP", "369", 82, "cn"], ["JNG", "Kanavi", 83, "kr"], ["MID", "Creme", 81, "cn"], ["BOT", "JackeyLove", 84, "cn"], ["SUP", "Hang", 81, "cn"]] },
  // 3º-4º — Semifinal (base 81). Chovy/Canyon/Ruler — superlinha que de novo não levou.
  { id: "geng-2025", team: "Gen.G Esports", short: "GEN", year: 2025, league: "LCK", champion: false,
    players: [["TOP", "Kiin", 82, "kr"], ["JNG", "Canyon", 84, "kr"], ["MID", "Chovy", 85, "kr"], ["BOT", "Ruler", 84, "kr"], ["SUP", "Duro", 81, "kr"]] },
  // 5º-8º — Quartas (base 78). A LPL renomeada (ex-Weibo/núcleo novo); Tarzan.
  { id: "al-2025", team: "Anyone's Legend", short: "AL", year: 2025, league: "LPL", champion: false,
    players: [["TOP", "Flandre", 79, "cn"], ["JNG", "Tarzan", 80, "kr"], ["MID", "Shanks", 78, "cn"], ["BOT", "Hope", 80, "cn"], ["SUP", "Kael", 78, "kr"]] },
  // 5º-8º — Quartas (base 78). A melhor campanha do Ocidente; Caps.
  { id: "g2-2025", team: "G2 Esports", short: "G2", year: 2025, league: "LEC", champion: false,
    players: [["TOP", "BrokenBlade", 78, "de"], ["JNG", "SkewMond", 78, "fr"], ["MID", "Caps", 80, "dk"], ["BOT", "Hans Sama", 79, "fr"], ["SUP", "Labrov", 78, "gr"]] },
  // 5º-8º — Quartas (base 78). Zeus migrou pra cá; Zeka/Viper.
  { id: "hle-2025", team: "Hanwha Life Esports", short: "HLE", year: 2025, league: "LCK", champion: false,
    players: [["TOP", "Zeus", 80, "kr"], ["JNG", "Peanut", 79, "kr"], ["MID", "Zeka", 81, "kr"], ["BOT", "Viper", 81, "kr"], ["SUP", "Delight", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). Surpresa de Taiwan, bateu na trave das semis.
  { id: "cfo-2025", team: "CTBC Flying Oyster", short: "CFO", year: 2025, league: "PCS", champion: false,
    players: [["TOP", "Driver", 78, "tw"], ["JNG", "JunJia", 79, "tw"], ["MID", "HongQ", 79, "tw"], ["BOT", "Doggo", 80, "tw"], ["SUP", "Kaiwing", 78, "hk"]] },
  // 9º-16º — Fase suíça eliminados (base 72). De novo a melhor NA (Bwipo/Inspired).
  { id: "flyquest-2025", team: "FlyQuest", short: "FLY", year: 2025, league: "LCS", champion: false,
    players: [["TOP", "Bwipo", 74, "be"], ["JNG", "Inspired", 74, "pl"], ["MID", "Quad", 73, "kr"], ["BOT", "Massu", 73, "ca"], ["SUP", "Busio", 73, "us"]] },
  // 9º-16º — Fase suíça (base 72). A ex-MAD/KOI rebatizada; Elyoya.
  { id: "mkoi-2025", team: "Movistar KOI", short: "MKOI", year: 2025, league: "LEC", champion: false,
    players: [["TOP", "Myrwn", 72, "es"], ["JNG", "Elyoya", 74, "es"], ["MID", "Jojopyun", 73, "ca"], ["BOT", "Supa", 72, "es"], ["SUP", "Alvaro", 72, "es"]] },
  // 9º-16º — Fase suíça (base 72). Vice de 2024 caiu cedo; Bin/Elk/Knight.
  { id: "blg-2025", team: "Bilibili Gaming", short: "BLG", year: 2025, league: "LPL", champion: false,
    players: [["TOP", "Bin", 76, "cn"], ["JNG", "shad0w", 73, "it"], ["MID", "knight", 76, "cn"], ["BOT", "Elk", 76, "cn"], ["SUP", "ON", 73, "cn"]] },
  // 9º-16º — Fase suíça (base 72). 1ª seed do Vietnã. ⚠ roster best-effort.
  { id: "sw-2025", team: "Secret Whales", short: "SW", year: 2025, league: "VCS", champion: false,
    players: [["TOP", "Hiro02", 72, "vn"], ["JNG", "Hizto", 72, "vn"], ["MID", "Dire", 73, "vn"], ["BOT", "Eddie", 73, "vn"], ["SUP", "Taki", 72, "vn"]] },
  // 9º-16º — Fase suíça (base 72). River/FBI.
  { id: "100t-2025", team: "100 Thieves", short: "100", year: 2025, league: "LCS", champion: false,
    players: [["TOP", "Dhokla", 72, "us"], ["JNG", "River", 74, "kr"], ["MID", "Quid", 73, "kr"], ["BOT", "FBI", 74, "au"], ["SUP", "Eyla", 72, "au"]] },
  // 9º-16º — Fase suíça (base 72). Wildcard do Brasil (Keyd / ex-Vivo Keyd Stars).
  { id: "keyd-2025", team: "Vivo Keyd Stars", short: "VKS", year: 2025, league: "CBLOL", champion: false,
    players: [["TOP", "Boal", 72, "br"], ["JNG", "Disamis", 72, "br"], ["MID", "Mireu", 73, "kr"], ["BOT", "Morttheus", 72, "br"], ["SUP", "Trymbi", 73, "pl"]] },
  // 9º-16º — Fase suíça (base 72). Poby (mid novato coreano), Upset de volta.
  { id: "fnatic-2025", team: "Fnatic", short: "FNC", year: 2025, league: "LEC", champion: false,
    players: [["TOP", "Oscarinin", 72, "es"], ["JNG", "Razork", 73, "es"], ["MID", "Poby", 73, "kr"], ["BOT", "Upset", 74, "de"], ["SUP", "Mikyx", 73, "si"]] },
  // 9º-16º — Fase suíça (base 72). Karsa de volta; Maple/Betty.
  { id: "psg-2025", team: "PSG Talon", short: "PSG", year: 2025, league: "PCS", champion: false,
    players: [["TOP", "Azhi", 72, "tw"], ["JNG", "Karsa", 73, "tw"], ["MID", "Maple", 73, "tw"], ["BOT", "Betty", 73, "tw"], ["SUP", "Woody", 72, "tw"]] },
  // 17º — Play-in eliminado (base 66). A volta nostálgica de TheShy/Rookie/Meiko, mas caiu cedo.
  { id: "ig-2025", team: "Invictus Gaming", short: "IG", year: 2025, league: "LPL", champion: false,
    players: [["TOP", "TheShy", 67, "kr"], ["JNG", "Wei", 66, "cn"], ["MID", "Rookie", 67, "kr"], ["BOT", "GALA", 67, "cn"], ["SUP", "Meiko", 66, "cn"]] },
];
