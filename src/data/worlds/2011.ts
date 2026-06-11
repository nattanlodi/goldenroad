import type { Team } from "../../types";

// Worlds 2011 — Riot Season 1 Championship (DreamHack Summer, Suécia).
// 8 times · campeão: Fnatic (venceu a aAa 2–1 na final). MVP: Shushei.
// Notas pela régua "desempenho no evento" (topo comprimido / base espalhada) — ver RUBRICA em teams.ts.
// Tuplas: [role, nome, overall, país]. Rotas pré-padronização eram fluidas (listagem da Liquipedia).
export const WORLDS_2011: Team[] = [
  // 1º — Campeão (base 88). Shushei foi o MVP do torneio.
  { id: "fnatic-2011", team: "Fnatic", short: "FNC", year: 2011, league: "EU", champion: true,
    players: [["TOP", "xPeke", 92, "es"], ["JNG", "CyanideFI", 91, "fi"], ["MID", "Shushei", 97, "pl"], ["BOT", "LaMiaZealot", 89, "de"], ["SUP", "Mellisan", 88, "de"]] },
  // 2º — Vice (base 84).
  { id: "aaa-2011", team: "against All authority", short: "aAa", year: 2011, league: "EU", champion: false, finalist: true,
    players: [["TOP", "sOAZ", 88, "fr"], ["JNG", "Linak", 85, "fr"], ["MID", "MoMa", 86, "de"], ["BOT", "YellOwStaR", 89, "fr"], ["SUP", "kujaa", 84, "fr"]] },
  // 3º — Semifinal (base 81).
  { id: "tsm-2011", team: "Team SoloMid", short: "TSM", year: 2011, league: "NA", champion: false,
    players: [["TOP", "TheRainMan", 82, "us"], ["JNG", "TheOddOne", 85, "ca"], ["MID", "Reginald", 86, "us"], ["BOT", "Chaox", 84, "ca"], ["SUP", "Xpecial", 84, "us"]] },
  // 4º — Semifinal (base 81; 3–0 na fase de grupos).
  { id: "epik-2011", team: "Epik Gamer", short: "EG", year: 2011, league: "NA", champion: false,
    players: [["TOP", "Dyrus", 84, "us"], ["JNG", "Dan Dinh", 83, "us"], ["MID", "Salce", 82, "us"], ["BOT", "Westrice", 83, "us"], ["SUP", "Doublelift", 85, "us"]] },
  // 5º — caiu na fase de grupos, 2–1 (base 72).
  { id: "clg-2011", team: "Counter Logic Gaming", short: "CLG", year: 2011, league: "NA", champion: false,
    players: [["TOP", "Chauster", 75, "us"], ["JNG", "Saintvicious", 76, "us"], ["MID", "HotshotGG", 77, "ca"], ["BOT", "bigfatlp", 75, "ca"], ["SUP", "Elementz", 75, "ca"]] },
  // 6º — caiu na fase de grupos, 1–2 (base 72).
  { id: "gamedde-2011", team: "Team gamed!de", short: "GMD", year: 2011, league: "EU", champion: false,
    players: [["TOP", "kev1n", 72, "de"], ["JNG", "Zylor", 71, "de"], ["MID", "Reyk", 73, "de"], ["BOT", "CandyPanda", 75, "de"], ["SUP", "Nyph", 73, "de"]] },
  // 8º — caiu na fase de grupos, 1–2 (Singapura). ⚠ rotas a confirmar
  { id: "xan-2011", team: "Xan", short: "XAN", year: 2011, league: "SEA", champion: false,
    players: [["TOP", "Vech", 66, "sg"], ["JNG", "Radeon6870", 65, "sg"], ["MID", "Axion", 66, "sg"], ["BOT", "d4rkness", 65, "sg"], ["SUP", "iNtrigueD", 64, "sg"]] },
  // 7º — caiu na fase de grupos, 0–3 (Filipinas, sem vitórias). ⚠ rotas a confirmar
  { id: "pacific-2011", team: "Pacific eSports", short: "PAC", year: 2011, league: "SEA", champion: false,
    players: [["TOP", "VYY", 62, "ph"], ["JNG", "dabe", 61, "ph"], ["MID", "wormy", 62, "ph"], ["BOT", "iddo", 62, "ph"], ["SUP", "gibo", 61, "ph"]] },
];
