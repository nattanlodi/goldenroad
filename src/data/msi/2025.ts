import type { Team } from "../../types";

// MSI 2025 (Vancouver) — campeão: Gen.G sobre a T1 (3-2; título internacional que faltava ao
// Chovy, Finals MVP; Kiin MVP do torneio). 8 times no bracket duplo. Notas: RFT geral (/players)
// + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do oponente (região×colocação, curva
// assimétrica). Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2025.mjs.
// MVP: +2 finals / +2 torneio / +3 duplo. Tuplas: [role, nome, overall, país].
export const MSI_2025: Team[] = [
  // 1º — Campeão (base 86). Gen.G superline; bateram só LCK/LPL. Chovy fMVP (+2), Kiin MVP torneio (+2).
  { id: "geng-msi-2025", team: "Gen.G Esports", short: "GEN", year: 2025, league: "LCK", tournament: "msi", champion: true,
    players: [["TOP", "Kiin", 93, "kr"], ["JNG", "Canyon", 89, "kr"], ["MID", "Chovy", 93, "kr"], ["BOT", "Ruler", 90, "kr"], ["SUP", "Duro", 89, "kr"]] },
  // 2º — Vice (base 84). T1 dos tetracampeões; Gumayusi monstro, enfrentaram Gen.G/AL.
  { id: "t1-msi-2025", team: "T1", short: "T1", year: 2025, league: "LCK", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Doran", 82, "kr"], ["JNG", "Oner", 88, "kr"], ["MID", "Faker", 86, "kr"], ["BOT", "Gumayusi", 91, "kr"], ["SUP", "Keria", 89, "kr"]] },
  // 3º — Semifinal (base 81). Anyone's Legend, surpresa da LPL; Kael e Tarzan brilharam.
  { id: "al-msi-2025", team: "Anyone's Legend", short: "AL", year: 2025, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "Flandre", 82, "cn"], ["JNG", "Tarzan", 84, "kr"], ["MID", "Shanks", 82, "cn"], ["BOT", "Hope", 84, "cn"], ["SUP", "Kael", 86, "kr"]] },
  // 4º — Semifinal (base 81). Bilibili Gaming; Knight e Bin os destaques, resto irregular.
  { id: "blg-msi-2025", team: "Bilibili Gaming", short: "BLG", year: 2025, league: "LPL", tournament: "msi", champion: false,
    players: [["TOP", "Bin", 82, "cn"], ["JNG", "Beichuan", 75, "cn"], ["MID", "knight", 82, "cn"], ["BOT", "Elk", 79, "cn"], ["SUP", "ON", 78, "cn"]] },
  // 5º-6º — Quartas (base 78). FlyQuest brilhou na lower; parte do brilho foi vs G2 (LEC fraco).
  { id: "fly-msi-2025", team: "FlyQuest", short: "FLY", year: 2025, league: "LTA", tournament: "msi", champion: false,
    players: [["TOP", "Bwipo", 80, "be"], ["JNG", "Inspired", 83, "pl"], ["MID", "Quad", 72, "kr"], ["BOT", "Massu", 76, "ca"], ["SUP", "Busio", 81, "us"]] },
  // 5º-6º — Quartas (base 78). CTBC Flying Oyster, campeã da LCP; Doggo o destaque.
  { id: "cfo-msi-2025", team: "CTBC Flying Oyster", short: "CFO", year: 2025, league: "LCP", tournament: "msi", champion: false,
    players: [["TOP", "Driver", 76, "tw"], ["JNG", "JunJia", 75, "tw"], ["MID", "HongQ", 76, "tw"], ["BOT", "Doggo", 79, "tw"], ["SUP", "Kaiwing", 75, "hk"]] },
  // 7º-8º — Quartas (base 78). G2, melhor da Europa; só Caps se salvou.
  { id: "g2-msi-2025", team: "G2 Esports", short: "G2", year: 2025, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "BrokenBlade", 68, "de"], ["JNG", "SkewMond", 66, "fr"], ["MID", "Caps", 73, "dk"], ["BOT", "Hans Sama", 67, "fr"], ["SUP", "Labrov", 67, "gr"]] },
  // 7º-8º — Quartas (base 78). Movistar KOI, 2ª seed da LEC (Elyoya); caiu cedo.
  { id: "mkoi-msi-2025", team: "Movistar KOI", short: "MKOI", year: 2025, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Myrwn", 66, "es"], ["JNG", "Elyoya", 65, "es"], ["MID", "Jojopyun", 67, "ca"], ["BOT", "Supa", 66, "es"], ["SUP", "Alvaro", 68, "es"]] },
];
