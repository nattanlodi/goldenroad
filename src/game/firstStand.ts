import type { FsNode, FsSide, SeriesSetup } from "../types";
import { drawOpponent } from "./helpers";

// ============================================================
// FIRST STAND — primeiro campeonato da temporada (modo GOLDENROAD).
//
// Estrutura (fiel ao formato real): FASE DE GRUPOS em double-elimination de 4
// times → KNOCKOUT (semifinal + grande final). Aqui modelamos só o CAMINHO do
// jogador. Tudo Bo5 (target 3).
//
// Trilha do jogador (4 séries; 5 se cair na lower):
//   Grupo:  USF → UBF (vencer = classificado pro knockout)
//                 └ perder → LBF (última chance de classificar)
//   Knockout: KSF → KGF (campeão)
// É o 1º torneio do ano: adversários um pouco mais fracos que os do MSI.
// ============================================================

interface NodeInfo {
  label: string;
  side: FsSide; // upper/lower (pra UI saber a "vida")
  difficultyKey: string; // chave de dificuldade pro drawOpponent (fs_*)
  onWin: FsNode | "champion";
  onLoss: FsNode | "eliminated";
}

export const FS_BRACKET: Record<FsNode, NodeInfo> = {
  USF: { label: "Semifinal da Upper Bracket", side: "upper", difficultyKey: "fs_usf", onWin: "UBF", onLoss: "LBF" },
  UBF: { label: "Final da Upper Bracket", side: "upper", difficultyKey: "fs_ubf", onWin: "KSF", onLoss: "LBF" },
  LBF: { label: "Final da Lower Bracket", side: "lower", difficultyKey: "fs_lbf", onWin: "KSF", onLoss: "eliminated" },
  KSF: { label: "Semifinal (Knockout)", side: "upper", difficultyKey: "fs_ksf", onWin: "KGF", onLoss: "eliminated" },
  KGF: { label: "Grande Final do First Stand", side: "upper", difficultyKey: "fs_kgf", onWin: "champion", onLoss: "eliminated" },
};

/** Nó inicial: o jogador sempre começa na Semifinal da Upper Bracket. */
export const FS_START: FsNode = "USF";

export interface FsNextSeries {
  series: SeriesSetup;
  usedOppIds: string[];
}

/** Monta a série (Bo5) do nó atual, sorteando o adversário.
 *  KGF → sempre finalista; KSF → 60% vice / 40% semifinalista (igual ao resto). */
export function buildFsSeries(node: FsNode, usedIds: string[]): FsNextSeries {
  const info = FS_BRACKET[node];
  const restrict = node === "KGF" ? "finalists" : node === "KSF" ? "semifinal" : undefined;
  const opp = drawOpponent(usedIds, info.difficultyKey, restrict);
  return {
    series: {
      stageKey: "final", // Bo5 (reusa o tipo; o rótulo vem de stageLabel)
      stageLabel: info.label,
      format: "Bo5",
      target: 3,
      decisive: true,
      opp,
    },
    usedOppIds: [...usedIds, opp.id],
  };
}

export type FsOutcome =
  | { kind: "advance"; node: FsNode } // próxima série
  | { kind: "champion" } // venceu a Grande Final do First Stand
  | { kind: "eliminated" }; // eliminado

/** Resolve o que acontece após o resultado de uma série no nó atual. */
export function fsNext(node: FsNode, won: boolean): FsOutcome {
  const info = FS_BRACKET[node];
  const dest = won ? info.onWin : info.onLoss;
  if (dest === "champion") return { kind: "champion" };
  if (dest === "eliminated") return { kind: "eliminated" };
  return { kind: "advance", node: dest };
}
