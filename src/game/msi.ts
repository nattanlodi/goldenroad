import type { MsiNode, MsiSide, SeriesSetup } from "../types";
import { drawOpponent } from "./helpers";

// ============================================================
// MSI — bracket double elimination (modo GOLDENROAD)
//
// Caminho do JOGADOR. "Só os confrontos do jogador" importam: o adversário de
// cada nó é sorteado por drawOpponent (com escalada de dificuldade por estágio).
// Tudo Bo5 (target 3). Perdeu na upper → cai pra lower; perdeu na lower → elim.
// ============================================================

interface NodeInfo {
  label: string; // rótulo exibido
  side: MsiSide; // upper/lower (pra UI saber a "vida")
  /** chave de dificuldade pro drawOpponent (reusa STAGE_INTENSITY do Worlds). */
  difficultyKey: string;
  /** próximo nó se VENCER. "champion" = título do MSI. */
  onWin: MsiNode | "champion";
  /** próximo nó se PERDER. "eliminated" = fora (vice na GF). */
  onLoss: MsiNode | "eliminated";
}

// Mapa do bracket (fiel ao MSI real, do ponto de vista do jogador).
// Dificuldade cresce conforme avança; lower bracket tende a adversários fortes
// (quem caiu da upper). Reusa as chaves do Worlds: quarter < semi < final.
export const MSI_BRACKET: Record<MsiNode, NodeInfo> = {
  UR1: { label: "Upper Bracket · Rodada 1", side: "upper", difficultyKey: "quarter", onWin: "UR2", onLoss: "LR1" },
  UR2: { label: "Upper Bracket · Rodada 2", side: "upper", difficultyKey: "semi", onWin: "UF", onLoss: "LR2" },
  UF: { label: "Final da Upper Bracket", side: "upper", difficultyKey: "final", onWin: "GF", onLoss: "LF" },
  LR1: { label: "Lower Bracket · Rodada 1", side: "lower", difficultyKey: "quarter", onWin: "LR2", onLoss: "eliminated" },
  LR2: { label: "Lower Bracket · Rodada 2", side: "lower", difficultyKey: "semi", onWin: "LR3", onLoss: "eliminated" },
  LR3: { label: "Lower Bracket · Rodada 3", side: "lower", difficultyKey: "semi", onWin: "LF", onLoss: "eliminated" },
  LF: { label: "Final da Lower Bracket", side: "lower", difficultyKey: "final", onWin: "GF", onLoss: "eliminated" },
  GF: { label: "Grande Final do MSI", side: "upper", difficultyKey: "final", onWin: "champion", onLoss: "eliminated" },
};

/** Nó inicial: o jogador sempre começa na Upper Round 1. */
export const MSI_START: MsiNode = "UR1";

export interface MsiNextSeries {
  series: SeriesSetup;
  usedOppIds: string[];
}

/** Monta a série (Bo5) do nó atual do bracket, sorteando o adversário. */
export function buildMsiSeries(node: MsiNode, usedIds: string[]): MsiNextSeries {
  const info = MSI_BRACKET[node];
  const opp = drawOpponent(usedIds, info.difficultyKey);
  return {
    series: {
      stageKey: "final", // Bo5 (reusa o tipo; o rótulo do MSI vem de stageLabel)
      stageLabel: info.label,
      format: "Bo5",
      target: 3,
      decisive: true,
      opp,
    },
    usedOppIds: [...usedIds, opp.id],
  };
}

export type MsiOutcome =
  | { kind: "advance"; node: MsiNode } // próxima série (upper ou lower)
  | { kind: "champion" } // venceu a Grand Final
  | { kind: "eliminated" }; // perdeu na lower ou na GF

/** Resolve o que acontece após o resultado de uma série no nó atual. */
export function msiNext(node: MsiNode, won: boolean): MsiOutcome {
  const info = MSI_BRACKET[node];
  const dest = won ? info.onWin : info.onLoss;
  if (dest === "champion") return { kind: "champion" };
  if (dest === "eliminated") return { kind: "eliminated" };
  return { kind: "advance", node: dest };
}
