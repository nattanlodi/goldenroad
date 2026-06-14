import type { Team } from "../../types";

// Worlds 2019 — campeão: FunPlus Phoenix sobre a G2 Esports (final em Paris).
// 24 times. Tuplas: [role, nome, overall, país]. NOTAS dos times de playoff: mescla
// colocação + RFT 1.0 (rft.gg), 70% playoff (agregado por série) + 30% geral; ver teams.ts.
// ⚠ Play-in eliminados: best-effort (cauda/arquivo); alguns slots de wildcards são palpite.
export const WORLDS_2019: Team[] = [
  // 1º — Campeão (base 88). Varreram a final 3-0; Tian MVP, Doinb cérebro, Crisp sensacional (80 na semi).
  { id: "fpx-2019", team: "FunPlus Phoenix", short: "FPX", year: 2019, league: "LPL", champion: true,
    players: [["TOP", "GimGoon", 86, "kr"], ["JNG", "Tian", 93, "cn"], ["MID", "doinb", 96, "kr"], ["BOT", "lwx", 87, "cn"], ["SUP", "Crisp", 97, "cn"]] },
  // 2º — Vice (base 84). A super-G2, mas massacrada 0-3 na final (Caps 37, Perkz 40).
  { id: "g2-2019", team: "G2 Esports", short: "G2", year: 2019, league: "LEC", champion: false, finalist: true,
    players: [["TOP", "Wunder", 85, "dk"], ["JNG", "Jankos", 81, "pl"], ["MID", "Caps", 83, "dk"], ["BOT", "Perkz", 79, "hr"], ["SUP", "Mikyx", 82, "si"]] },
  // 3º-4º — Semifinal (base 81). TheShy 77 na QF; Rookie consistente.
  { id: "ig-2019", team: "Invictus Gaming", short: "IG", year: 2019, league: "LPL", champion: false,
    players: [["TOP", "TheShy", 86, "kr"], ["JNG", "Ning", 72, "cn"], ["MID", "Rookie", 84, "kr"], ["BOT", "JackeyLove", 74, "cn"], ["SUP", "Baolan", 73, "cn"]] },
  // 3º-4º — Semifinal (base 81). Khan 90 (top do evento na fase); Faker sólido na derrota.
  { id: "skt-2019", team: "SK Telecom T1", short: "SKT", year: 2019, league: "LCK", champion: false,
    players: [["TOP", "Khan", 85, "kr"], ["JNG", "Clid", 80, "kr"], ["MID", "Faker", 78, "kr"], ["BOT", "Teddy", 73, "kr"], ["SUP", "Effort", 76, "kr"]] },
  // 5º-8º — Quartas (base 78). Os jovens talentos: Lehends 84, Tarzan 82, Viper 81.
  { id: "griffin-2019", team: "Griffin", short: "GRF", year: 2019, league: "LCK", champion: false,
    players: [["TOP", "Sword", 65, "kr"], ["JNG", "Tarzan", 81, "kr"], ["MID", "Chovy", 78, "kr"], ["BOT", "Viper", 78, "kr"], ["SUP", "Lehends", 85, "kr"]] },
  // 5º-8º — Quartas (base 78). Perderam 1-3 pra FPX; bot apagado.
  { id: "fnatic-2019", team: "Fnatic", short: "FNC", year: 2019, league: "LEC", champion: false,
    players: [["TOP", "Bwipo", 75, "be"], ["JNG", "Broxah", 70, "dk"], ["MID", "Nemesis", 79, "si"], ["BOT", "Rekkles", 68, "se"], ["SUP", "Hylissang", 75, "bg"]] },
  // 5º-8º — Quartas (base 78). Estreia da futura campeã 2020; ShowMaker/BeryL já brilhando.
  { id: "dwg-2019", team: "DAMWON Gaming", short: "DWG", year: 2019, league: "LCK", champion: false,
    players: [["TOP", "Nuguri", 73, "kr"], ["JNG", "Canyon", 73, "kr"], ["MID", "ShowMaker", 80, "kr"], ["BOT", "Nuclear", 69, "kr"], ["SUP", "BeryL", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). Subiu do play-in; Tore o destaque.
  { id: "splyce-2019", team: "Splyce", short: "SPY", year: 2019, league: "LEC", champion: false,
    players: [["TOP", "Vizicsacsi", 69, "hu"], ["JNG", "Xerxe", 74, "ro"], ["MID", "Humanoid", 73, "cz"], ["BOT", "Kobbe", 75, "dk"], ["SUP", "Norskeren", 79, "dk"]] },
  // 9º-16º — Fase de grupos (base 72). Último Worlds do Uzi com a RNG.
  { id: "rng-2019", team: "Royal Never Give Up", short: "RNG", year: 2019, league: "LPL", champion: false,
    players: [["TOP", "Langx", 72, "cn"], ["JNG", "Karsa", 74, "tw"], ["MID", "Xiaohu", 74, "cn"], ["BOT", "Uzi", 75, "cn"], ["SUP", "Ming", 73, "cn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "tl-2019", team: "Team Liquid", short: "TL", year: 2019, league: "LCS", champion: false,
    players: [["TOP", "Impact", 73, "kr"], ["JNG", "Xmithie", 73, "ph"], ["MID", "Jensen", 73, "dk"], ["BOT", "Doublelift", 74, "us"], ["SUP", "CoreJJ", 74, "kr"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "c9-2019", team: "Cloud9", short: "C9", year: 2019, league: "LCS", champion: false,
    players: [["TOP", "Licorice", 73, "ca"], ["JNG", "Svenskeren", 73, "dk"], ["MID", "Nisqy", 73, "be"], ["BOT", "Sneaky", 73, "us"], ["SUP", "Zeyzal", 72, "us"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "jteam-2019", team: "J Team", short: "JT", year: 2019, league: "LMS", champion: false,
    players: [["TOP", "Rest", 72, "tw"], ["JNG", "Hana", 72, "tw"], ["MID", "FoFo", 73, "tw"], ["BOT", "Lilv", 72, "tw"], ["SUP", "Koala", 72, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Levi.
  { id: "gam-2019", team: "GAM Esports", short: "GAM", year: 2019, league: "VCS", champion: false,
    players: [["TOP", "Zeros", 72, "vn"], ["JNG", "Levi", 73, "vn"], ["MID", "Kiaya", 72, "vn"], ["BOT", "Zin", 72, "vn"], ["SUP", "Slay", 72, "vn"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "ahq-2019", team: "ahq e-Sports Club", short: "AHQ", year: 2019, league: "LMS", champion: false,
    players: [["TOP", "Ziv", 72, "tw"], ["JNG", "Alex", 72, "tw"], ["MID", "Apex", 72, "tw"], ["BOT", "Wako", 72, "tw"], ["SUP", "Ysera", 71, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in.
  { id: "clutch-2019", team: "Clutch Gaming", short: "CG", year: 2019, league: "LCS", champion: false,
    players: [["TOP", "Huni", 73, "kr"], ["JNG", "Lira", 72, "kr"], ["MID", "Damonte", 72, "us"], ["BOT", "Cody Sun", 72, "ca"], ["SUP", "Vulcan", 72, "ca"]] },
  // 9º-16º — Fase de grupos (base 72). Subiu do play-in.
  { id: "hka-2019", team: "Hong Kong Attitude", short: "HKA", year: 2019, league: "LMS", champion: false,
    players: [["TOP", "3z", 72, "hk"], ["JNG", "Crash", 73, "kr"], ["MID", "M1ssion", 72, "tw"], ["BOT", "Unified", 72, "hk"], ["SUP", "Kaiwing", 72, "hk"]] },
  // 17º-24º — Play-in eliminado (base 66). ⚠ arquivo.
  { id: "dfm-2019", team: "DetonatioN FocusMe", short: "DFM", year: 2019, league: "LJL", champion: false,
    players: [["TOP", "Evi", 66, "jp"], ["JNG", "Steal", 65, "kr"], ["MID", "Ceros", 65, "jp"], ["BOT", "Yutapon", 66, "jp"], ["SUP", "Gaeng", 65, "kr"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "lowkey-2019", team: "Lowkey Esports", short: "LK", year: 2019, league: "VCS", champion: false,
    players: [["TOP", "Soul", 65, "vn"], ["JNG", "Malice", 65, "vn"], ["MID", "Artifact", 66, "vn"], ["BOT", "DNK", 65, "vn"], ["SUP", "Jisu", 65, "kr"]] },
  // 17º-24º — Play-in (base 66). 4/5 ex-Vega. ⚠
  { id: "uol-2019", team: "Unicorns Of Love", short: "UOL", year: 2019, league: "LCL", champion: false,
    players: [["TOP", "BOSS", 66, "ru"], ["JNG", "AHaHaCiK", 66, "ru"], ["MID", "Nomanz", 66, "ru"], ["BOT", "Innaxe", 65, "ru"], ["SUP", "Edward", 65, "ru"]] },
  // 17º-24º — Play-in (base 66). Wildcard latino. ⚠ slots de bot/sup a confirmar.
  { id: "isurus-2019", team: "Isurus Gaming", short: "ISG", year: 2019, league: "LLA", champion: false,
    players: [["TOP", "Warangelus", 64, "cl"], ["JNG", "Oddie", 65, "pe"], ["MID", "Seiya", 66, "mx"], ["BOT", "stroObject", 64, "ar"], ["SUP", "Slow", 64, "cl"]] },
  // 17º-24º — Play-in (base 66). ⚠
  { id: "royalyouth-2019", team: "Royal Youth", short: "RY", year: 2019, league: "TCL", champion: false,
    players: [["TOP", "Armut", 66, "tr"], ["JNG", "Closer", 66, "tr"], ["MID", "cyeol", 65, "kr"], ["BOT", "Pilot", 65, "kr"], ["SUP", "Tolerant", 65, "tr"]] },
  // 17º-24º — Play-in (base 66). Ex-Dire Wolves. ⚠ jungle a confirmar.
  { id: "mammoth-2019", team: "MAMMOTH", short: "MMT", year: 2019, league: "OPL", champion: false,
    players: [["TOP", "Topoon", 65, "kr"], ["JNG", "Pabu", 64, "au"], ["MID", "Triple", 64, "au"], ["BOT", "k1ng", 64, "au"], ["SUP", "Destiny", 64, "au"]] },
  // 17º-24º — Play-in (base 66). Wildcard do sudeste asiático. ⚠ roster parcial (palpites).
  { id: "mega-2019", team: "MEGA Esports", short: "MG", year: 2019, league: "LST", champion: false,
    players: [["TOP", "Rockky", 65, "th"], ["JNG", "Lloyd", 65, "th"], ["MID", "G4", 64, "th"], ["BOT", "Sye", 64, "th"], ["SUP", "Lzmond", 64, "th"]] },
  // 17º-24º — Play-in (base 66). Wildcard do Brasil. ⚠ slots de mid/sup a confirmar.
  { id: "flamengo-2019", team: "Flamengo eSports", short: "FLA", year: 2019, league: "CBLOL", champion: false,
    players: [["TOP", "Luci", 65, "kr"], ["JNG", "Shrimp", 65, "kr"], ["MID", "Goku", 64, "br"], ["BOT", "brTT", 66, "br"], ["SUP", "dgama", 64, "br"]] },
];
