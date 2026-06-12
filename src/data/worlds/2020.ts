import type { Team } from "../../types";

// Worlds 2020 — campeão: DAMWON Gaming sobre o Suning (final em Xangai, bolha COVID).
// 22 times (GAM e Team Flash não viajaram por COVID). Tuplas: [role, nome, overall, país].
// NOTAS dos times de playoff: mescla colocação + RFT 1.0 (rft.gg), 70% playoff + 30% geral; ver teams.ts.
export const WORLDS_2020: Team[] = [
  // 1º — Campeão (base 88). Domínio total; Canyon MVP (81 na QF), Nuguri/ShowMaker no teto.
  { id: "dwg-2020", team: "DAMWON Gaming", short: "DWG", year: 2020, league: "LCK", champion: true,
    players: [["TOP", "Nuguri", 97, "kr"], ["JNG", "Canyon", 99, "kr"], ["MID", "ShowMaker", 95, "kr"], ["BOT", "Ghost", 89, "kr"], ["SUP", "BeryL", 93, "kr"]] },
  // 2º — Vice (base 84). Bin/SofM cresceram nas séries vencidas; final fraca os segurou.
  { id: "suning-2020", team: "Suning", short: "SN", year: 2020, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "Bin", 93, "cn"], ["JNG", "SofM", 90, "vn"], ["MID", "Angel", 87, "cn"], ["BOT", "huanfeng", 88, "cn"], ["SUP", "SwordArt", 88, "tw"]] },
  // 3º-4º — Semifinal (base 81). knight gigante (79 na QF); JackeyLove apagado na semi.
  { id: "tes-2020", team: "Top Esports", short: "TES", year: 2020, league: "LPL", champion: false,
    players: [["TOP", "369", 83, "cn"], ["JNG", "Karsa", 83, "tw"], ["MID", "knight", 90, "cn"], ["BOT", "JackeyLove", 78, "cn"], ["SUP", "yuyanjia", 80, "cn"]] },
  // 3º-4º — Semifinal (base 81). Caps/Mikyx demoliram a Gen.G na QF (82/84).
  { id: "g2-2020", team: "G2 Esports", short: "G2", year: 2020, league: "LEC", champion: false,
    players: [["TOP", "Wunder", 81, "dk"], ["JNG", "Jankos", 84, "pl"], ["MID", "Caps", 90, "dk"], ["BOT", "Perkz", 83, "hr"], ["SUP", "Mikyx", 89, "si"]] },
  // 5º-8º — Quartas (base 78). Kanavi o destaque; perderam 1-3 pro Suning.
  { id: "jdg-2020", team: "JD Gaming", short: "JDG", year: 2020, league: "LPL", champion: false,
    players: [["TOP", "Zoom", 75, "cn"], ["JNG", "Kanavi", 82, "kr"], ["MID", "Yagao", 77, "cn"], ["BOT", "LokeN", 71, "kr"], ["SUP", "LvMao", 76, "cn"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela DWG. Estreia do Keria; Deft afundou (39).
  { id: "drx-2020", team: "DRX", short: "DRX", year: 2020, league: "LCK", champion: false,
    players: [["TOP", "Doran", 76, "kr"], ["JNG", "Pyosik", 67, "kr"], ["MID", "Chovy", 74, "kr"], ["BOT", "Deft", 66, "kr"], ["SUP", "Keria", 73, "kr"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela G2; Ruler/Bdd apagados.
  { id: "geng-2020", team: "Gen.G Esports", short: "GEN", year: 2020, league: "LCK", champion: false,
    players: [["TOP", "Rascal", 69, "kr"], ["JNG", "Clid", 66, "kr"], ["MID", "Bdd", 74, "kr"], ["BOT", "Ruler", 69, "kr"], ["SUP", "Life", 66, "kr"]] },
  // 5º-8º — Quartas (base 78). Perderam 2-3 pra TES; Selfmade/Hylissang o destaque.
  { id: "fnatic-2020", team: "Fnatic", short: "FNC", year: 2020, league: "LEC", champion: false,
    players: [["TOP", "Bwipo", 74, "be"], ["JNG", "Selfmade", 80, "pl"], ["MID", "Nemesis", 71, "si"], ["BOT", "Rekkles", 76, "se"], ["SUP", "Hylissang", 80, "bg"]] },
  // 9º-16º — Fase de grupos (base 72). Os infames 0-6.
  { id: "tsm-2020", team: "TSM", short: "TSM", year: 2020, league: "LCS", champion: false,
    players: [["TOP", "Broken Blade", 73, "de"], ["JNG", "Spica", 73, "cn"], ["MID", "Bjergsen", 75, "dk"], ["BOT", "Doublelift", 74, "us"], ["SUP", "Biofrost", 73, "ca"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "flyquest-2020", team: "FlyQuest", short: "FLY", year: 2020, league: "LCS", champion: false,
    players: [["TOP", "Solo", 72, "us"], ["JNG", "Santorin", 73, "dk"], ["MID", "PowerOfEvil", 74, "de"], ["BOT", "WildTurtle", 72, "ca"], ["SUP", "IgNar", 73, "kr"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "rogue-2020", team: "Rogue", short: "RGE", year: 2020, league: "LEC", champion: false,
    players: [["TOP", "Finn", 72, "se"], ["JNG", "Inspired", 74, "pl"], ["MID", "Larssen", 74, "se"], ["BOT", "Hans sama", 74, "fr"], ["SUP", "Vander", 73, "pl"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "machi-2020", team: "Machi Esports", short: "MCX", year: 2020, league: "PCS", champion: false,
    players: [["TOP", "PK", 72, "tw"], ["JNG", "Gemini", 72, "tw"], ["MID", "Mission", 72, "tw"], ["BOT", "Bruce", 72, "tw"], ["SUP", "Koala", 72, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in.
  { id: "tl-2020", team: "Team Liquid", short: "TL", year: 2020, league: "LCS", champion: false,
    players: [["TOP", "Impact", 74, "kr"], ["JNG", "Broxah", 73, "dk"], ["MID", "Jensen", 73, "dk"], ["BOT", "Tactical", 73, "us"], ["SUP", "CoreJJ", 74, "kr"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in.
  { id: "psg-2020", team: "PSG Talon", short: "PSG", year: 2020, league: "PCS", champion: false,
    players: [["TOP", "Hanabi", 73, "tw"], ["JNG", "River", 74, "kr"], ["MID", "Tank", 72, "kr"], ["BOT", "Unified", 73, "hk"], ["SUP", "Kaiwing", 73, "hk"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in.
  { id: "lgd-2020", team: "LGD Gaming", short: "LGD", year: 2020, league: "LPL", champion: false,
    players: [["TOP", "Langx", 73, "cn"], ["JNG", "Peanut", 74, "kr"], ["MID", "xiye", 73, "cn"], ["BOT", "Kramer", 73, "kr"], ["SUP", "Mark", 72, "cn"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in.
  { id: "uol-2020", team: "Unicorns Of Love", short: "UOL", year: 2020, league: "LCL", champion: false,
    players: [["TOP", "BOSS", 73, "ru"], ["JNG", "AHaHaCiK", 73, "ru"], ["MID", "Nomanz", 73, "ru"], ["BOT", "Gadget", 72, "ru"], ["SUP", "SaNTaS", 72, "ru"]] },
  // 17º-22º — Play-in eliminado (base 66). ⚠ arquivo.
  { id: "supermassive-2020", team: "SuperMassive eSports", short: "SUP", year: 2020, league: "TCL", champion: false,
    players: [["TOP", "Armut", 66, "tr"], ["JNG", "KaKAO", 66, "kr"], ["MID", "Bolulu", 65, "tr"], ["BOT", "Zeitnot", 66, "tr"], ["SUP", "SnowFlower", 65, "kr"]] },
  // 17º-22º — Play-in (base 66). Josedeodo, o argentino.
  { id: "rainbow7-2020", team: "Rainbow7", short: "R7", year: 2020, league: "LLA", champion: false,
    players: [["TOP", "Acce", 65, "mx"], ["JNG", "Josedeodo", 66, "ar"], ["MID", "Aloned", 65, "mx"], ["BOT", "Leza", 64, "mx"], ["SUP", "Shadow", 64, "mx"]] },
  // 17º-22º — Play-in (base 66). Wildcard do Brasil.
  { id: "intz-2020", team: "INTZ eSports", short: "ITZ", year: 2020, league: "CBLOL", champion: false,
    players: [["TOP", "Tay", 65, "br"], ["JNG", "Shini", 65, "br"], ["MID", "Envy", 66, "br"], ["BOT", "micaO", 66, "br"], ["SUP", "RedBert", 64, "br"]] },
  // 17º-22º — Play-in (base 66).
  { id: "legacy-2020", team: "Legacy Esports", short: "LGC", year: 2020, league: "OPL", champion: false,
    players: [["TOP", "Topoon", 65, "kr"], ["JNG", "Babip", 64, "au"], ["MID", "Tally", 65, "au"], ["BOT", "Raes", 65, "nz"], ["SUP", "Isles", 64, "au"]] },
  // 17º-22º — Play-in (base 66). Bem antes da MAD virar potência.
  { id: "madlions-2020", team: "MAD Lions", short: "MAD", year: 2020, league: "LEC", champion: false,
    players: [["TOP", "Orome", 66, "ro"], ["JNG", "Shad0w", 66, "it"], ["MID", "Humanoid", 67, "cz"], ["BOT", "Carzzy", 66, "cz"], ["SUP", "Kaiser", 66, "de"]] },
  // 17º-22º — Play-in (base 66). Wildcard do Japão.
  { id: "v3-2020", team: "V3 Esports", short: "V3", year: 2020, league: "LJL", champion: false,
    players: [["TOP", "Paz", 65, "jp"], ["JNG", "Bugi", 66, "kr"], ["MID", "Ace", 65, "jp"], ["BOT", "Archer", 65, "kr"], ["SUP", "Raina", 64, "jp"]] },
];
