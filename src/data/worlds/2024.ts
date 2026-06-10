import type { Team } from "../../types";

// Worlds 2024 — campeão: T1 sobre o Bilibili Gaming (3-2; o penta... 4º título; final no O2 Arena, Londres).
// 20 times. Tuplas: [role, nome, overall, país]. RÉGUA em teams.ts (política B).
export const WORLDS_2024: Team[] = [
  // 1º — Campeão (base 88). T1 entrou como 4ª seed da LCK e venceu de novo; Faker MVP da final.
  { id: "t1-2024", team: "T1", short: "T1", year: 2024, league: "LCK", champion: true,
    players: [["TOP", "Zeus", 90, "kr"], ["JNG", "Oner", 90, "kr"], ["MID", "Faker", 94, "kr"], ["BOT", "Gumayusi", 90, "kr"], ["SUP", "Keria", 92, "kr"]] },
  // 2º — Vice (base 84). BLG levou a final pro 5º jogo; Bin/Elk monstruosos.
  { id: "blg-2024", team: "Bilibili Gaming", short: "BLG", year: 2024, league: "LPL", champion: false, finalist: true,
    players: [["TOP", "Bin", 88, "cn"], ["JNG", "XUN", 85, "cn"], ["MID", "knight", 87, "cn"], ["BOT", "Elk", 87, "cn"], ["SUP", "ON", 84, "cn"]] },
  // 3º-4º — Semifinal (base 81). Light/Tarzan.
  { id: "wbg-2024", team: "Weibo Gaming", short: "WBG", year: 2024, league: "LPL", champion: false,
    players: [["TOP", "Breathe", 81, "cn"], ["JNG", "Tarzan", 82, "kr"], ["MID", "Xiaohu", 82, "cn"], ["BOT", "Light", 83, "cn"], ["SUP", "Crisp", 81, "cn"]] },
  // 3º-4º — Semifinal (base 81). Chovy/Canyon/Peyz; favoritos que pararam na semi.
  { id: "geng-2024", team: "Gen.G Esports", short: "GEN", year: 2024, league: "LCK", champion: false,
    players: [["TOP", "Kiin", 82, "kr"], ["JNG", "Canyon", 84, "kr"], ["MID", "Chovy", 85, "kr"], ["BOT", "Peyz", 82, "kr"], ["SUP", "Lehends", 82, "kr"]] },
  // 5º-8º — Quartas (base 78). Scout/GALA.
  { id: "lng-2024", team: "LNG Esports", short: "LNG", year: 2024, league: "LPL", champion: false,
    players: [["TOP", "Zika", 78, "cn"], ["JNG", "Weiwei", 79, "cn"], ["MID", "Scout", 81, "kr"], ["BOT", "GALA", 80, "cn"], ["SUP", "Hang", 78, "cn"]] },
  // 5º-8º — Quartas (base 78). Zeka/Viper/Delight (núcleo da futura HLE de 2025).
  { id: "hle-2024", team: "Hanwha Life Esports", short: "HLE", year: 2024, league: "LCK", champion: false,
    players: [["TOP", "Doran", 78, "kr"], ["JNG", "Peanut", 79, "kr"], ["MID", "Zeka", 81, "kr"], ["BOT", "Viper", 81, "kr"], ["SUP", "Delight", 79, "kr"]] },
  // 5º-8º — Quartas (base 78). JackeyLove/369/Meiko.
  { id: "tes-2024", team: "Top Esports", short: "TES", year: 2024, league: "LPL", champion: false,
    players: [["TOP", "369", 79, "cn"], ["JNG", "Tian", 79, "cn"], ["MID", "Creme", 78, "cn"], ["BOT", "JackeyLove", 81, "cn"], ["SUP", "Meiko", 79, "cn"]] },
  // 5º-8º — Quartas (base 78). A melhor campanha da NA em anos (Bwipo/Inspired).
  { id: "flyquest-2024", team: "FlyQuest", short: "FLY", year: 2024, league: "LCS", champion: false,
    players: [["TOP", "Bwipo", 79, "be"], ["JNG", "Inspired", 79, "pl"], ["MID", "Quad", 78, "kr"], ["BOT", "Massu", 78, "ca"], ["SUP", "Busio", 78, "us"]] },
  // 9º-12º — Fase suíça eliminados (base 72). Caps/Hans Sama.
  { id: "g2-2024", team: "G2 Esports", short: "G2", year: 2024, league: "LEC", champion: false,
    players: [["TOP", "BrokenBlade", 73, "de"], ["JNG", "Yike", 73, "se"], ["MID", "Caps", 75, "dk"], ["BOT", "Hans Sama", 74, "fr"], ["SUP", "Mikyx", 73, "si"]] },
  // 9º-12º — Fase suíça (base 72). Kingen/ShowMaker/Aiming.
  { id: "dk-2024", team: "Dplus KIA", short: "DK", year: 2024, league: "LCK", champion: false,
    players: [["TOP", "Kingen", 73, "kr"], ["JNG", "Lucid", 74, "kr"], ["MID", "ShowMaker", 75, "kr"], ["BOT", "Aiming", 74, "kr"], ["SUP", "Moham", 72, "kr"]] },
  // 9º-12º — Fase suíça (base 72). CoreJJ/Impact/APA.
  { id: "tl-2024", team: "Team Liquid", short: "TL", year: 2024, league: "LCS", champion: false,
    players: [["TOP", "Impact", 73, "kr"], ["JNG", "UmTi", 73, "kr"], ["MID", "APA", 72, "us"], ["BOT", "Yeon", 73, "us"], ["SUP", "CoreJJ", 74, "kr"]] },
  // 9º-12º — Fase suíça (base 72). Noah/Humanoid.
  { id: "fnatic-2024", team: "Fnatic", short: "FNC", year: 2024, league: "LEC", champion: false,
    players: [["TOP", "Oscarinin", 72, "es"], ["JNG", "Razork", 73, "es"], ["MID", "Humanoid", 73, "cz"], ["BOT", "Noah", 73, "kr"], ["SUP", "Jun", 72, "kr"]] },
  // 13º-20º — Play-in eliminado (base 66). Elyoya e a fusão MAD+KOI.
  { id: "mdk-2024", team: "MAD Lions KOI", short: "MDK", year: 2024, league: "LEC", champion: false,
    players: [["TOP", "Myrwn", 65, "es"], ["JNG", "Elyoya", 67, "es"], ["MID", "Fresskowy", 65, "pl"], ["BOT", "Supa", 65, "es"], ["SUP", "Alvaro", 65, "es"]] },
  // 13º-20º — Play-in (base 66). River/Quid.
  { id: "100t-2024", team: "100 Thieves", short: "100", year: 2024, league: "LCS", champion: false,
    players: [["TOP", "Sniper", 65, "ca"], ["JNG", "River", 67, "kr"], ["MID", "Quid", 66, "kr"], ["BOT", "Tomo", 64, "us"], ["SUP", "Eyla", 65, "au"]] },
  // 13º-20º — Play-in (base 66). Maple e os taiwaneses.
  { id: "psg-2024", team: "PSG Talon", short: "PSG", year: 2024, league: "PCS", champion: false,
    players: [["TOP", "Azhi", 65, "tw"], ["JNG", "JunJia", 66, "tw"], ["MID", "Maple", 67, "tw"], ["BOT", "Betty", 65, "tw"], ["SUP", "Woody", 65, "tw"]] },
  // 13º-20º — Play-in (base 66). Wildcard do Japão (sob a SoftBank HAWKS).
  { id: "shg-2024", team: "SoftBank HAWKS gaming", short: "SHG", year: 2024, league: "LJL", champion: false,
    players: [["TOP", "Evi", 64, "jp"], ["JNG", "Forest", 65, "kr"], ["MID", "DasheR", 65, "kr"], ["BOT", "Marble", 64, "jp"], ["SUP", "Vsta", 64, "kr"]] },
  // 13º-20º — Play-in (base 66). Levi e a GAM.
  { id: "gam-2024", team: "GAM Esports", short: "GAM", year: 2024, league: "VCS", champion: false,
    players: [["TOP", "Kiaya", 65, "vn"], ["JNG", "Levi", 67, "vn"], ["MID", "Emo", 65, "vn"], ["BOT", "Easylove", 65, "vn"], ["SUP", "Elio", 64, "vn"]] },
  // 13º-20º — Play-in (base 66). 2ª seed do Vietnã. ⚠ roster best-effort.
  { id: "vke-2024", team: "Vikings Esports", short: "VKE", year: 2024, league: "VCS", champion: false,
    players: [["TOP", "Nanaue", 64, "vn"], ["JNG", "Gury", 64, "vn"], ["MID", "Kati", 65, "vn"], ["BOT", "Shogun", 65, "vn"], ["SUP", "Bie", 64, "vn"]] },
  // 13º-20º — Play-in (base 66). Wildcard do Brasil (paiN). TitaN o destaque.
  { id: "pain-2024", team: "paiN Gaming", short: "PNG", year: 2024, league: "CBLOL", champion: false,
    players: [["TOP", "Wizer", 64, "kr"], ["JNG", "Cariok", 65, "br"], ["MID", "dyNquedo", 64, "br"], ["BOT", "TitaN", 66, "br"], ["SUP", "Kuri", 64, "kr"]] },
  // 13º-20º — Play-in (base 66). Wildcard latino.
  { id: "r7-2024", team: "Rainbow7", short: "R7", year: 2024, league: "LLA", champion: false,
    players: [["TOP", "Summit", 65, "kr"], ["JNG", "Oddie", 64, "pe"], ["MID", "Keine", 65, "kr"], ["BOT", "Ceo", 64, "ar"], ["SUP", "Lyonz", 64, "ar"]] },
];
