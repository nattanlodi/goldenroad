import type { Team } from "../../types";

// Worlds 2016 — Season 6 World Championship (final no Staples Center, LA).
// 16 times · campeão: SK Telecom T1 (tri) sobre a Samsung Galaxy (final em 5 jogos).
// Tuplas: [role, nome, overall, país]. NOTAS: mescla colocação + RFT 1.0 (rft.gg),
// 70% no RFT dos playoffs (agregado por série) + 30% no geral; ver teams.ts.
// Faker'16 com override de curadoria.
export const WORLDS_2016: Team[] = [
  // 1º — Campeão (base 88). Line equilibrada e dominante; todos altos no playoff.
  { id: "skt-2016", team: "SK Telecom T1", short: "SKT", year: 2016, league: "LCK", champion: true,
    players: [["TOP", "Duke", 92, "kr"], ["JNG", "Bengi", 91, "kr"], ["MID", "Faker", 98, "kr"], ["BOT", "Bang", 89, "kr"], ["SUP", "Wolf", 90, "kr"]] },
  // 2º — Vice (base 84). Crown explodiu (84 na semi); CuVee forte. Núcleo campeão em 2017.
  { id: "samsung-2016", team: "Samsung Galaxy", short: "SSG", year: 2016, league: "LCK", champion: false, finalist: true,
    players: [["TOP", "CuVee", 90, "kr"], ["JNG", "Ambition", 87, "kr"], ["MID", "Crown", 94, "kr"], ["BOT", "Ruler", 85, "kr"], ["SUP", "CoreJJ", 86, "kr"]] },
  // 3º-4º — Semifinal (base 81). O lendário ROX, semi épica de 5 jogos contra a SKT.
  { id: "rox-2016", team: "ROX Tigers", short: "ROX", year: 2016, league: "LCK", champion: false,
    players: [["TOP", "Smeb", 90, "kr"], ["JNG", "Peanut", 86, "kr"], ["MID", "Kuro", 87, "kr"], ["BOT", "PraY", 82, "kr"], ["SUP", "GorillA", 86, "kr"]] },
  // 3º-4º — Semifinal (base 81). Odoamne gigante na QF (90 vs ANX). Melhor semi europeia em anos.
  { id: "h2k-2016", team: "H2K", short: "H2K", year: 2016, league: "EU", champion: false,
    players: [["TOP", "Odoamne", 93, "ro"], ["JNG", "Jankos", 86, "pl"], ["MID", "Ryu", 82, "kr"], ["BOT", "FORG1VEN", 83, "gr"], ["SUP", "Vander", 85, "pl"]] },
  // 5º-8º — Quartas (base 78). Perderam 1-3 pra ROX; RFT modesto.
  { id: "edg-2016", team: "EDward Gaming", short: "EDG", year: 2016, league: "LPL", champion: false,
    players: [["TOP", "Koro1", 74, "cn"], ["JNG", "Clearlove", 68, "cn"], ["MID", "Scout", 76, "kr"], ["BOT", "Deft", 76, "kr"], ["SUP", "Meiko", 73, "cn"]] },
  // 5º-8º — Quartas (base 78). Perderam 1-3 pra SKT; Looper o destaque. Uzi/Mata apagados.
  { id: "rng-2016", team: "Royal Never Give Up", short: "RNG", year: 2016, league: "LPL", champion: false,
    players: [["TOP", "Looper", 83, "kr"], ["JNG", "Mlxg", 70, "cn"], ["MID", "Xiaohu", 78, "cn"], ["BOT", "Uzi", 74, "cn"], ["SUP", "Mata", 74, "kr"]] },
  // 5º-8º — Quartas (base 78). Varridos 0-3 pela SSG; Jensen o destaque.
  { id: "c9-2016", team: "Cloud9", short: "C9", year: 2016, league: "NA", champion: false,
    players: [["TOP", "Impact", 77, "kr"], ["JNG", "Meteos", 73, "us"], ["MID", "Jensen", 84, "dk"], ["BOT", "Sneaky", 67, "us"], ["SUP", "Smoothie", 70, "ca"]] },
  // 5º-8º — Quartas (base 78). Wildcard russo herói dos grupos, mas varrido 0-3 na QF.
  { id: "anx-2016", team: "Albus NoX Luna", short: "ANX", year: 2016, league: "LCL", champion: false,
    players: [["TOP", "Smurf", 66, "ru"], ["JNG", "PvPStejos", 66, "ua"], ["MID", "Kira", 70, "ua"], ["BOT", "aMiracle", 69, "ua"], ["SUP", "Likkrit", 73, "ru"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "fw-2016", team: "Flash Wolves", short: "FW", year: 2016, league: "LMS", champion: false,
    players: [["TOP", "MMD", 73, "tw"], ["JNG", "Karsa", 75, "tw"], ["MID", "Maple", 74, "tw"], ["BOT", "NL", 73, "tw"], ["SUP", "SwordArT", 74, "tw"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "tsm-2016", team: "Team SoloMid", short: "TSM", year: 2016, league: "NA", champion: false,
    players: [["TOP", "Hauntzer", 73, "us"], ["JNG", "Svenskeren", 73, "dk"], ["MID", "Bjergsen", 76, "dk"], ["BOT", "Doublelift", 75, "us"], ["SUP", "Biofrost", 73, "ca"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "clg-2016", team: "Counter Logic Gaming", short: "CLG", year: 2016, league: "NA", champion: false,
    players: [["TOP", "Darshan", 73, "ca"], ["JNG", "Xmithie", 73, "ph"], ["MID", "Huhi", 72, "us"], ["BOT", "Stixxay", 73, "us"], ["SUP", "Aphromoo", 74, "us"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "ahq-2016", team: "ahq e-Sports Club", short: "AHQ", year: 2016, league: "LMS", champion: false,
    players: [["TOP", "Ziv", 73, "tw"], ["JNG", "Mountain", 72, "tw"], ["MID", "Westdoor", 73, "tw"], ["BOT", "AN", 72, "tw"], ["SUP", "Albis", 72, "tw"]] },
  // 9º-16º — Fase de grupos (base 72). Dominante na Europa, flopou no Mundial.
  { id: "g2-2016", team: "G2 Esports", short: "G2", year: 2016, league: "EU", champion: false,
    players: [["TOP", "Expect", 72, "kr"], ["JNG", "Trick", 73, "kr"], ["MID", "Perkz", 75, "hr"], ["BOT", "Zven", 74, "dk"], ["SUP", "mithy", 73, "es"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "imay-2016", team: "I May", short: "IM", year: 2016, league: "LPL", champion: false,
    players: [["TOP", "AmazingJ", 72, "hk"], ["JNG", "Avoidless", 72, "hk"], ["MID", "Athena", 73, "kr"], ["BOT", "Jinjiao", 72, "cn"], ["SUP", "Road", 72, "kr"]] },
  // 9º-16º — Fase de grupos (base 72).
  { id: "splyce-2016", team: "Splyce", short: "SPY", year: 2016, league: "EU", champion: false,
    players: [["TOP", "Wunder", 73, "dk"], ["JNG", "Trashy", 72, "dk"], ["MID", "Sencux", 72, "dk"], ["BOT", "Kobbe", 72, "dk"], ["SUP", "Mikyx", 72, "si"]] },
  // 9º-16º — Fase de grupos, wildcard do Brasil (base 72). Bateu a EDG num upset.
  { id: "intz-2016", team: "INTZ eSports", short: "ITZ", year: 2016, league: "CBLOL", champion: false,
    players: [["TOP", "Yang", 69, "br"], ["JNG", "Revolta", 71, "br"], ["MID", "tockers", 70, "br"], ["BOT", "micaO", 70, "br"], ["SUP", "Jockster", 69, "br"]] },
];
