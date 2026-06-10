import type { Role, Team } from "../types";
import { WORLDS_2011 } from "./worlds/2011";
import { WORLDS_2012 } from "./worlds/2012";
import { WORLDS_2013 } from "./worlds/2013";
import { LEGACY } from "./legacy";

// Pool de campanhas do Worlds. Vai sendo montado edição por edição em
// src/data/worlds/<ano>.ts (rosters reais via Leaguepedia/Liquipedia, notas pela
// régua de desempenho no evento). LEGACY é o conjunto curado antigo que ainda
// não foi reconstruído — some quando todos os anos estiverem prontos.
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
  ...LEGACY,
];

export const ROLES: Role[] = ["TOP", "JNG", "MID", "BOT", "SUP"];

export const ROLE_LABELS: Record<Role, string> = {
  TOP: "Top",
  JNG: "Jungle",
  MID: "Mid",
  BOT: "Atirador",
  SUP: "Suporte",
};
