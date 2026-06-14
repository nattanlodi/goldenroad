import type { Team } from "../../types";

// MSI 2021 (Reykjavík) — knockout de 4 times (2 semis + final). Campeão: Royal Never Give Up
// sobre a DAMWON Gaming na final (3-2; RNG venceu no clutch, DK teve RFT individual superior).
// Notas: RFT geral (/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do oponente.
// Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2021.mjs. Finals MVP: GALA (+2).
// MVP do torneio: ShowMaker (DK, +2). Roster RNG = titular do título (Xiaobai foi sub, fora da line).
export const MSI_2021: Team[] = [
  // 1º — Campeão (base 86). RNG; venceu apertado, Ming/Cryin os melhores, GALA Finals MVP (+2).
  { id: "rng-msi-2021", team: "Royal Never Give Up", short: "RNG", year: 2021, league: "LPL", tournament: "msi", champion: true,
    players: [["TOP", "Xiaohu", 84, "cn"], ["JNG", "Wei", 81, "cn"], ["MID", "Cryin", 85, "cn"], ["BOT", "GALA", 83, "cn"], ["SUP", "Ming", 87, "cn"]] },
  // 2º — Vice (base 84). DAMWON Gaming; ShowMaker MONSTRO (MVP torneio) e Canyon gigantes; Ghost mal.
  { id: "dk-msi-2021", team: "DAMWON Gaming", short: "DK", year: 2021, league: "LCK", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "Khan", 82, "kr"], ["JNG", "Canyon", 91, "kr"], ["MID", "ShowMaker", 96, "kr"], ["BOT", "Ghost", 75, "kr"], ["SUP", "BeryL", 85, "kr"]] },
  // 3º-4º — Semifinal (base 81). MAD Lions, surpresa europeia; Humanoid afundou na semi vs DK.
  { id: "mad-msi-2021", team: "MAD Lions", short: "MAD", year: 2021, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Armut", 78, "tr"], ["JNG", "Elyoya", 76, "es"], ["MID", "Humanoid", 68, "cz"], ["BOT", "Carzzy", 72, "cz"], ["SUP", "Kaiser", 76, "de"]] },
  // 3º-4º — Semifinal (base 81). PSG Talon, campeã do PCS; Doggo o destaque (bom vs RNG).
  { id: "psg-msi-2021", team: "PSG Talon", short: "PSG", year: 2021, league: "PCS", tournament: "msi", champion: false,
    players: [["TOP", "Hanabi", 78, "tw"], ["JNG", "River", 81, "kr"], ["MID", "Maple", 81, "tw"], ["BOT", "Doggo", 83, "tw"], ["SUP", "Kaiwing", 81, "hk"]] },
];
