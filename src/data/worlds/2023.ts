import type { Team } from "../../types";

// Worlds 2023 — campeão: T1 sobre o Weibo Gaming (o tetra do Faker; final em Seul, Gocheok Sky Dome).
// 22 times. 1º Worlds com fase suíça. Tuplas: [role, nome, overall, país]. NOTAS dos times de
// playoff: mescla colocação + RFT 1.0 (rft.gg), 70% playoff + 30% geral; ver teams.ts. Faker'23 curadoria.
export const WORLDS_2023: Team[] = [
  // 1º — Campeão (base 88). Tetra do Faker em casa. Zeus monstro (95 na final, top do evento).
  // Zeus: CENTURIÃO 100 — DUPLO MVP de 2023 (Finals MVP + MVP do torneio). nº1 absoluto do RFT 1.0
  // geral de TODO o evento (80.6, líder isolado, ninguém chega perto). Como duplo-MVP libera o teto 100.
  { id: "t1-2023", team: "T1", short: "T1", year: 2023, league: "LCK", champion: true,
    players: [["TOP", "Zeus", 100, "kr"], ["JNG", "Oner", 94, "kr"], ["MID", "Faker", 92, "kr"], ["BOT", "Gumayusi", 88, "kr"], ["SUP", "Keria", 96, "kr"]] },
  // 2º — Vice (base 84). TheShy de volta a uma final; Crisp 92 na QF, ascensão até a final.
  // Recalibrado com geral real + força do oponente; +2 de curadoria (o vice estava abaixo do merecido).
  { id: "wbg-2023", team: "Weibo Gaming", short: "WBG", year: 2023, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "TheShy", 93, "kr"], ["JNG", "Weiwei", 82, "cn"], ["MID", "Xiaohu", 90, "cn"], ["BOT", "Light", 87, "cn"], ["SUP", "Crisp", 90, "cn"]] },
  // 3º-4º — Semifinal (base 81). ON o destaque; Bin/Elk.
  { id: "blg-2023", team: "Bilibili Gaming", short: "BLG", year: 2023, league: "LPL", champion: false,
    players: [["TOP", "Bin", 80, "cn"], ["JNG", "XUN", 86, "cn"], ["MID", "Yagao", 85, "cn"], ["BOT", "Elk", 85, "cn"], ["SUP", "ON", 88, "cn"]] },
  // 3º-4º — Semifinal (base 81). 1º colocado da LPL; Ruler/MISSING.
  { id: "jdg-2023", team: "JD Gaming", short: "JDG", year: 2023, league: "LPL", champion: false,
    players: [["TOP", "369", 83, "cn"], ["JNG", "Kanavi", 84, "kr"], ["MID", "knight", 83, "cn"], ["BOT", "Ruler", 87, "kr"], ["SUP", "MISSING", 86, "cn"]] },
  // 5º-8º — Quartas (base 78). Perderam 2-3 pra BLG; Chovy o destaque.
  { id: "geng-2023", team: "Gen.G Esports", short: "GEN", year: 2023, league: "LCK", champion: false,
    players: [["TOP", "Doran", 78, "kr"], ["JNG", "Peanut", 75, "kr"], ["MID", "Chovy", 78, "kr"], ["BOT", "Peyz", 76, "kr"], ["SUP", "Delight", 76, "kr"]] },
  // 5º-8º — Quartas (base 78). A surpresa norte-americana; varridos 0-3 pela WBG.
  { id: "nrg-2023", team: "NRG", short: "NRG", year: 2023, league: "LCS", champion: false,
    players: [["TOP", "Dhokla", 73, "us"], ["JNG", "Contractz", 69, "us"], ["MID", "Palafox", 71, "us"], ["BOT", "FBI", 66, "au"], ["SUP", "IgNar", 66, "kr"]] },
  // 5º-8º — Quartas (base 78). Perderam 1-3 pra JDG; Bdd/Aiming o destaque (bom RFT real na suíça).
  { id: "kt-2023", team: "KT Rolster", short: "KT", year: 2023, league: "LCK", champion: false,
    players: [["TOP", "Kiin", 80, "kr"], ["JNG", "Cuzz", 75, "kr"], ["MID", "Bdd", 81, "kr"], ["BOT", "Aiming", 80, "kr"], ["SUP", "Lehends", 75, "kr"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela T1; Scout/Tarzan tiveram um Worlds ruim.
  { id: "lng-2023", team: "LNG Esports", short: "LNG", year: 2023, league: "LPL", champion: false,
    players: [["TOP", "Zika", 72, "cn"], ["JNG", "Tarzan", 67, "kr"], ["MID", "Scout", 76, "kr"], ["BOT", "GALA", 67, "cn"], ["SUP", "Hang", 72, "cn"]] },
  // 9º-18º — Fase suíça eliminados (base 72). Caps/Hans Sama.
  { id: "g2-2023", team: "G2 Esports", short: "G2", year: 2023, league: "LEC", champion: false,
    players: [["TOP", "BrokenBlade", 73, "de"], ["JNG", "Yike", 73, "se"], ["MID", "Caps", 76, "dk"], ["BOT", "Hans Sama", 74, "fr"], ["SUP", "Mikyx", 73, "si"]] },
  // 9º-18º — Fase suíça (base 72). Noah (bot coreano da LEC).
  { id: "fnatic-2023", team: "Fnatic", short: "FNC", year: 2023, league: "LEC", champion: false,
    players: [["TOP", "Oscarinin", 72, "es"], ["JNG", "Razork", 73, "es"], ["MID", "Humanoid", 73, "cz"], ["BOT", "Noah", 74, "kr"], ["SUP", "Trymbi", 73, "pl"]] },
  // 9º-18º — Fase suíça (base 72). A ex-DAMWON; Deft/ShowMaker/Canyon abaixo do esperado.
  { id: "dk-2023", team: "Dplus KIA", short: "DK", year: 2023, league: "LCK", champion: false,
    players: [["TOP", "Canna", 74, "kr"], ["JNG", "Canyon", 76, "kr"], ["MID", "ShowMaker", 75, "kr"], ["BOT", "Deft", 75, "kr"], ["SUP", "Kellin", 73, "kr"]] },
  // 9º-18º — Fase suíça (base 72). Berserker/EMENES.
  { id: "c9-2023", team: "Cloud9", short: "C9", year: 2023, league: "LCS", champion: false,
    players: [["TOP", "Fudge", 73, "au"], ["JNG", "Blaber", 74, "us"], ["MID", "EMENES", 73, "kr"], ["BOT", "Berserker", 74, "kr"], ["SUP", "Zven", 73, "dk"]] },
  // 9º-18º — Fase suíça (base 72). Elyoya/Carzzy.
  { id: "madlions-2023", team: "MAD Lions", short: "MAD", year: 2023, league: "LEC", champion: false,
    players: [["TOP", "Chasy", 72, "kr"], ["JNG", "Elyoya", 74, "es"], ["MID", "Nisqy", 72, "be"], ["BOT", "Carzzy", 73, "cz"], ["SUP", "Hylissang", 73, "bg"]] },
  // 9º-18º — Fase suíça (base 72). Levi e os vietnamitas que assustaram.
  { id: "gam-2023", team: "GAM Esports", short: "GAM", year: 2023, league: "VCS", champion: false,
    players: [["TOP", "Kiaya", 73, "vn"], ["JNG", "Levi", 74, "vn"], ["MID", "Kati", 72, "vn"], ["BOT", "Slayder", 73, "vn"], ["SUP", "Palette", 72, "vn"]] },
  // 9º-18º — Fase suíça (base 72). CoreJJ/APA.
  { id: "tl-2023", team: "Team Liquid", short: "TL", year: 2023, league: "LCS", champion: false,
    players: [["TOP", "Summit", 73, "kr"], ["JNG", "Pyosik", 73, "kr"], ["MID", "APA", 72, "us"], ["BOT", "Yeon", 73, "us"], ["SUP", "CoreJJ", 74, "kr"]] },
  // 9º-18º — Fase suíça (base 72). A 2ª seed da LEC.
  { id: "bds-2023", team: "Team BDS", short: "BDS", year: 2023, league: "LEC", champion: false,
    players: [["TOP", "Adam", 72, "fr"], ["JNG", "Sheo", 72, "fr"], ["MID", "nuc", 72, "fr"], ["BOT", "Crownie", 72, "si"], ["SUP", "Labrov", 73, "gr"]] },
  // 19º-22º — Play-in eliminado (base 66). Maple e a velha guarda de Taiwan.
  { id: "psg-2023", team: "PSG Talon", short: "PSG", year: 2023, league: "PCS", champion: false,
    players: [["TOP", "Azhi", 65, "tw"], ["JNG", "JunJia", 66, "tw"], ["MID", "Maple", 67, "tw"], ["BOT", "Wako", 65, "tw"], ["SUP", "Woody", 65, "tw"]] },
  // 19º-22º — Play-in (base 66). 2ª seed do Vietnã.
  { id: "tw-2023", team: "Team Whales", short: "TW", year: 2023, league: "VCS", champion: false,
    players: [["TOP", "Sparda", 65, "vn"], ["JNG", "BeanJ", 65, "vn"], ["MID", "Glory", 65, "vn"], ["BOT", "Artemis", 65, "vn"], ["SUP", "Bie", 65, "vn"]] },
  // 19º-22º — Play-in (base 66). Wildcard do Brasil (LOUD).
  { id: "loud-2023", team: "LOUD", short: "LLL", year: 2023, league: "CBLOL", champion: false,
    players: [["TOP", "Robo", 65, "br"], ["JNG", "Croc", 66, "kr"], ["MID", "Tinowns", 66, "br"], ["BOT", "Route", 66, "kr"], ["SUP", "Ceos", 64, "br"]] },
  // 19º-22º — Play-in (base 66). Wildcard de Taiwan.
  { id: "cfo-2023", team: "CTBC Flying Oyster", short: "CFO", year: 2023, league: "PCS", champion: false,
    players: [["TOP", "Rest", 64, "tw"], ["JNG", "Gemini", 65, "tw"], ["MID", "JimieN", 65, "tw"], ["BOT", "Shunn", 65, "tw"], ["SUP", "ShiauC", 64, "tw"]] },
  // 19º-22º — Play-in (base 66). Wildcard do Japão.
  { id: "dfm-2023", team: "DetonatioN FocusMe", short: "DFM", year: 2023, league: "LJL", champion: false,
    players: [["TOP", "apaMEN", 64, "jp"], ["JNG", "Steal", 65, "kr"], ["MID", "Aria", 66, "kr"], ["BOT", "Yutapon", 65, "jp"], ["SUP", "Harp", 64, "kr"]] },
  // 19º-22º — Play-in (base 66). Wildcard latino.
  { id: "r7-2023", team: "Rainbow7", short: "R7", year: 2023, league: "LLA", champion: false,
    players: [["TOP", "Bong", 64, "kr"], ["JNG", "Oddie", 65, "pe"], ["MID", "Mireu", 65, "kr"], ["BOT", "Ceo", 64, "ar"], ["SUP", "Lyonz", 64, "ar"]] },
];
