import type { Role, Team, Tournament } from "../types";
import { MSI_TEAMS } from "./msi";
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
// ── RÉGUA DE OVERALL ──
//   A nota mescla ATÉ ONDE O TIME FOI + COMO O JOGADOR JOGOU (desempenho individual real).
//   Base pela colocação (âncora):  Campeão 86 · Vice 84 · Semi 81 · Quartas 78 · Grupos/Suíça 72 · Play-in 66
//
//   2013-2025 (times de PLAYOFF): mescla com o RFT 1.0 do rft.gg —
//     overall = clamp( base + round(zFinal * 7), caps[base] ) + (MVP da final ? +1 : 0)
//     zFinal = 0.8*zPlayoff + 0.2*zGeral  (z-score por evento; 80% do peso vem do RFT DOS PLAYOFFS
//     — quartas/semi/final, agregado por série — e 20% do RFT geral do torneio). SPREAD 7 => o RFT
//     pesa ~57% e a colocação ~43% na variação. Caps por colocação evitam quebrar a coerência.
//     SEM curadoria: o único ajuste manual é +1 pro MVP da grande final. Scripts versionados:
//     scripts/rft-merge.mjs + rft-<ano>.mjs. Times fora dos playoffs (grupos/suíça/play-in) e
//     2011-2012 (sem página RFT) seguem só a régua de colocação abaixo.
//
//   Régua de colocação (modificador individual sobre a base, piso ~56 / teto 97):
//     transcendente / MVP do evento  +6 a +8     destaque forte / melhor da posição  +3 a +5
//     sólido (esperado)  0 a +2     apagado/abaixo  −3 a −5     peso-morto  −6 a −10
//   MVP da final: +1 sobre o resultado da fórmula (todas as edições; em 2011/2012, sem RFT, soma
//     direto na régua de colocação — Shushei'11 97, Toyz'12 95).
//   Ex.: Mata'14=98 · Tian'19/Canyon'20/Zeus'23=98 (campeão+MVP) · campeão sólido ~88-93 ·
//        astro de vice ~86-92 · carry de quartas ~83-87 · time varrido no mata-mata ~66-73.
// Normaliza o torneio: arquivos de Worlds não trazem o campo → default "worlds".
// Os de MSI vêm com tournament:"msi". Assim o agrupamento separa as campanhas.
const norm = (teams: Team[], tournament: Tournament): Team[] =>
  teams.map((t) => ({ ...t, tournament: t.tournament ?? tournament }));

export const TEAMS: Team[] = [
  ...norm(WORLDS_2011, "worlds"),
  ...norm(WORLDS_2012, "worlds"),
  ...norm(WORLDS_2013, "worlds"),
  ...norm(WORLDS_2014, "worlds"),
  ...norm(WORLDS_2015, "worlds"),
  ...norm(WORLDS_2016, "worlds"),
  ...norm(WORLDS_2017, "worlds"),
  ...norm(WORLDS_2018, "worlds"),
  ...norm(WORLDS_2019, "worlds"),
  ...norm(WORLDS_2020, "worlds"),
  ...norm(WORLDS_2021, "worlds"),
  ...norm(WORLDS_2022, "worlds"),
  ...norm(WORLDS_2023, "worlds"),
  ...norm(WORLDS_2024, "worlds"),
  ...norm(WORLDS_2025, "worlds"),
  ...norm(MSI_TEAMS, "msi"),
];

// ── POOL DE JOGO (só playoffs) ──────────────────────────────────────────────
// O draft e os adversários só usam times que chegaram aos playoffs/bracket de cada
// edição. Os times de cada campanha estão listados em ORDEM DE COLOCAÇÃO, então o
// pool são os N primeiros. Worlds: 8 (campeão + vice + 2 semis + 4 quartas); 2011
// teve só 4 semis. MSI: varia por edição (ver MSI_PLAYOFF_COUNT). As demais
// campanhas continuam em TEAMS — só não entram no sorteio.
//
// Chave de campeonato = `${tournament}-${year}` (separa MSI 2024 de Worlds 2024).
type ChampKey = string;
const champKey = (t: { tournament?: Tournament; year: number }): ChampKey => `${t.tournament ?? "worlds"}-${t.year}`;

const WORLDS_PLAYOFF_COUNT: Record<number, number> = { 2011: 4 };
const DEFAULT_WORLDS_PLAYOFF = 8;
// MSI: nº de times do bracket principal por edição. 2023-2025 = 8 (bracket duplo);
// 2015-2019/2021/2022 = só 4 no knockout (semis + final). Default 8.
const MSI_PLAYOFF_COUNT: Record<number, number> = { 2015: 4, 2016: 4, 2017: 4, 2018: 4, 2019: 4, 2021: 4, 2022: 4 };
const DEFAULT_MSI_PLAYOFF = 8;

function playoffCountFor(tournament: Tournament, year: number): number {
  if (tournament === "msi") return MSI_PLAYOFF_COUNT[year] ?? DEFAULT_MSI_PLAYOFF;
  return WORLDS_PLAYOFF_COUNT[year] ?? DEFAULT_WORLDS_PLAYOFF;
}

// Campanhas (tournament+year) na ordem cronológica em que aparecem em TEAMS.
const CHAMP_KEYS: ChampKey[] = [...new Set(TEAMS.map(champKey))];

function playoffTeamsOf(key: ChampKey): Team[] {
  const teams = TEAMS.filter((t) => champKey(t) === key);
  const first = teams[0];
  if (!first) return [];
  const n = playoffCountFor(first.tournament ?? "worlds", first.year);
  return teams.slice(0, n);
}

// Times elegíveis no jogo (draft + adversários). Mantém a ordem cronológica.
export const DRAFT_TEAMS: Team[] = CHAMP_KEYS.flatMap(playoffTeamsOf);

// Ids dos times que pararam nas QUARTAS (5º+ colocados de cada campanha — fora do
// top 4). Usado pra ponderar o sorteio do draft. 2011 (4 times) não tem quartas.
export const QUARTERFINAL_IDS: Set<string> = new Set(
  CHAMP_KEYS.flatMap((key) => playoffTeamsOf(key).slice(4).map((t) => t.id)),
);

// Ids dos SEMIFINALISTAS (3º-4º colocados de cada campanha). Usado pra selo de
// bronze no card e pra restrição de pool nas semis.
export const SEMIFINAL_IDS: Set<string> = new Set(
  CHAMP_KEYS.flatMap((key) => playoffTeamsOf(key).slice(2, 4).map((t) => t.id)),
);

export const ROLES: Role[] = ["TOP", "JNG", "MID", "BOT", "SUP"];

export const ROLE_LABELS: Record<Role, string> = {
  TOP: "Top",
  JNG: "Jungle",
  MID: "Mid",
  BOT: "Atirador",
  SUP: "Suporte",
};
