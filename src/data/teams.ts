import type { Role, Team } from "../types";
import { WORLDS_2011 } from "./worlds/2011";
import { WORLDS_2012 } from "./worlds/2012";
import { WORLDS_2013 } from "./worlds/2013";
import { WORLDS_2014 } from "./worlds/2014";
import { WORLDS_2015 } from "./worlds/2015";
import { WORLDS_2016 } from "./worlds/2016";
import { WORLDS_2017 } from "./worlds/2017";
import { WORLDS_2018 } from "./worlds/2018";
import { WORLDS_2019 } from "./worlds/2019";
import { WORLDS_2020 } from "./worlds/2020";
import { WORLDS_2021 } from "./worlds/2021";
import { WORLDS_2022 } from "./worlds/2022";
import { WORLDS_2023 } from "./worlds/2023";
import { WORLDS_2024 } from "./worlds/2024";
import { WORLDS_2025 } from "./worlds/2025";

// Pool de campanhas do Worlds. Montado edição por edição em
// src/data/worlds/<ano>.ts (rosters reais via Leaguepedia/Liquipedia, notas pela
// régua de desempenho no evento). Cobertura completa: 2011 → 2025.
//
// ── RÉGUA DE OVERALL (desempenho NAQUELE Worlds; topo comprimido / base espalhada) ──
//   Base pela colocação:  Campeão 88 · Vice 84 · Semi 81 · Quartas 78 · Grupos/Suíça 72 · Play-in 66
//   Modificador individual (sobre a base, piso ~56 / teto 97):
//     transcendente / MVP do evento  +6 a +8  (teto 95-97 — RESERVADO; ver política abaixo)
//     destaque forte / melhor da posição  +3 a +5     sólido (esperado)  0 a +2
//     apagado/abaixo  −3 a −5      peso-morto  −6 a −10
//   POLÍTICA (opção B): o teto 95-96 é só pra performances TRANSCENDENTES (Shushei'11, Faker…).
//     Campeão equilibrado, sem um superastro óbvio, topa ~92-94 (ex.: Toyz'12 = 94).
//     => nem todo campeão tem um 96, de propósito.
//   Ex.: Shushei 2011 (MVP transcendente)=96 · Toyz 2012 (destaque)=94 · campeão sólido ~88-89 ·
//        semifinalista estrela ~86-89 · time de grupos ~71-77 · play-in winless ~61-64.
export const TEAMS: Team[] = [
  ...WORLDS_2011,
  ...WORLDS_2012,
  ...WORLDS_2013,
  ...WORLDS_2014,
  ...WORLDS_2015,
  ...WORLDS_2016,
  ...WORLDS_2017,
  ...WORLDS_2018,
  ...WORLDS_2019,
  ...WORLDS_2020,
  ...WORLDS_2021,
  ...WORLDS_2022,
  ...WORLDS_2023,
  ...WORLDS_2024,
  ...WORLDS_2025,
];

// ── POOL DE JOGO (só playoffs) ──────────────────────────────────────────────
// O draft e os adversários só usam times que chegaram aos playoffs de cada Worlds.
// Em todas as edições os times estão listados em ordem de colocação, então os de
// playoff são os 8 primeiros (campeão + vice + 2 semis + 4 quartas). Exceção: 2011,
// formato diferente, só teve 4 semifinalistas (Fnatic, aAa, TSM, Epik Gamer).
// As demais campanhas continuam no arquivo (TEAMS) — só não entram no sorteio.
const PLAYOFF_COUNT: Record<number, number> = { 2011: 4 };
const DEFAULT_PLAYOFF_COUNT = 8;

function playoffTeamsOf(year: number): Team[] {
  const teams = TEAMS.filter((t) => t.year === year);
  const n = PLAYOFF_COUNT[year] ?? DEFAULT_PLAYOFF_COUNT;
  return teams.slice(0, n);
}

const YEARS = [...new Set(TEAMS.map((t) => t.year))].sort((a, b) => a - b);

// Times elegíveis no jogo (draft + adversários). Mantém a ordem cronológica.
export const DRAFT_TEAMS: Team[] = YEARS.flatMap(playoffTeamsOf);

export const ROLES: Role[] = ["TOP", "JNG", "MID", "BOT", "SUP"];

export const ROLE_LABELS: Record<Role, string> = {
  TOP: "Top",
  JNG: "Jungle",
  MID: "Mid",
  BOT: "Atirador",
  SUP: "Suporte",
};
