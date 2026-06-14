import type { Team } from "../../types";

// MSI 2015 (Tallahassee, EUA) — a PRIMEIRA edição do MSI. Knockout de 4 times (2 semis + final).
// Campeão: EDward Gaming sobre a SK Telecom T1 na final (3-2; a glória da LPL contra a favorita SKT).
// Notas: RFT geral (/event/msi-2015/players) + RFT por SÉRIE de mata-mata, mescla 80/20 COM força do
// oponente. Pipeline: scripts/rft-msi-calc.mjs + opp-strength.mjs + rft-msi-2015.mjs. MVP do torneio
// = Clearlove (oficial) + Meiko (maior RFT entre finalistas) → ambos +2. SKT rodíziou o mid: Easyhoon
// jogou a FINAL (91.3, maior nota da SKT) e é o titular do card; Faker jogou a semi.
export const MSI_2015: Team[] = [
  // 1º — Campeão (base 86). EDG; a primeira glória da LPL no MSI, Meiko monstro (90), Clearlove MVP.
  { id: "edg-msi-2015", team: "EDward Gaming", short: "EDG", year: 2015, league: "LPL", tournament: "msi", champion: true,
    players: [["TOP", "Korol", 86, "kr"], ["JNG", "Clearlove", 82, "cn"], ["MID", "PawN", 84, "kr"], ["BOT", "Deft", 81, "kr"], ["SUP", "Meiko", 90, "cn"]] },
  // 2º — Vice (base 84). SKT; favorita, Easyhoon gigante na final (95), bot lane forte; caiu 3-2.
  { id: "skt-msi-2015", team: "SK Telecom T1", short: "SKT", year: 2015, league: "LCK", tournament: "msi", champion: false, finalist: true,
    players: [["TOP", "MaRin", 88, "kr"], ["JNG", "Bengi", 87, "kr"], ["MID", "Easyhoon", 95, "kr"], ["BOT", "Bang", 84, "kr"], ["SUP", "Wolf", 90, "kr"]] },
  // 3º-4º — Semifinal (base 81). Fnatic; varrida pela SKT, Huni o destaque.
  { id: "fnc-msi-2015", team: "Fnatic", short: "FNC", year: 2015, league: "LEC", tournament: "msi", champion: false,
    players: [["TOP", "Huni", 86, "kr"], ["JNG", "Reignover", 79, "kr"], ["MID", "FEBIVEN", 72, "nl"], ["BOT", "Steeelback", 77, "fr"], ["SUP", "YellOwStaR", 74, "fr"]] },
  // 3º-4º — Semifinal (base 81). ahq eSports Club; varrida pelo EDG, Westdoor/Albis os melhores.
  { id: "ahq-msi-2015", team: "ahq eSports Club", short: "AHQ", year: 2015, league: "LMS", tournament: "msi", champion: false,
    players: [["TOP", "Ziv", 76, "tw"], ["JNG", "Mountain", 76, "tw"], ["MID", "Westdoor", 86, "tw"], ["BOT", "An", 78, "tw"], ["SUP", "Albis", 85, "tw"]] },
];
