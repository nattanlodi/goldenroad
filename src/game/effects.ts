import type { FormNote, Lineup, Opponent, Role, SeriesHighlight, SeriesMods } from "../types";
import { lineupPicks } from "./helpers";

// ============================================================
// Efeitos de pré-série: notas efetivas + Forma do dia
//
// Notas EFETIVAS = nota base (lineup/opp) + delta TEMPORÁRIO (SeriesMods).
// Os deltas valem só a série atual e zeram ao trocar de oponente. Buffs
// PERMANENTES alteram direto o lineup (fonte da verdade), não passam por aqui.
// ============================================================

export const emptyMods = (): SeriesMods => ({ you: {}, opp: {} });

/** Nota efetiva de um jogador SEU (base + delta temporário). */
export function effYou(lineup: Lineup, mods: SeriesMods, role: Role): number {
  const p = lineup[role];
  if (!p) return 0;
  return p.rating + (mods.you[role] ?? 0);
}

/** Nota efetiva de um jogador do RIVAL (base + delta temporário). */
export function effOpp(baseRating: number, mods: SeriesMods, role: Role): number {
  return baseRating + (mods.opp[role] ?? 0);
}

/** Média efetiva da sua line (com deltas temporários). */
export function effLineScore(lineup: Lineup, mods: SeriesMods): number {
  const picks = lineupPicks(lineup);
  if (!picks.length) return 0;
  const sum = picks.reduce((a, p) => a + p.rating + (mods.you[p.role] ?? 0), 0);
  return Math.round(sum / picks.length);
}

/** Média efetiva do rival (com deltas temporários). */
export function effOppAvg(opp: Opponent, mods: SeriesMods): number {
  if (!opp.players.length) return opp.avg;
  const sum = opp.players.reduce((a, p) => a + p[2] + (mods.opp[p[0]] ?? 0), 0);
  return Math.round(sum / opp.players.length);
}

// ============================================================
// Forma do dia (fogo / gelado)
//   🔥 Fogo: na Bo5 anterior, um SEU jogador foi MVP de 2+ jogos → +3 na
//      próxima série (recompensa quem carregou).
//   🧊 Gelado: após uma DERROTA (qualquer formato), 50% de chance de um
//      jogador SEU aleatório (que não esteja em fogo) levar -3 na próxima
//      série. Não empilha; pode ser descongelado por carta.
// ============================================================

export interface FormaResult {
  mods: SeriesMods;
  notes: FormNote[];
}

export function computeForma(
  prevResult: "win" | "loss" | null,
  prevHighlight: SeriesHighlight | null,
  prevFormat: string | undefined,
  lineup: Lineup,
): FormaResult {
  const mods = emptyMods();
  const notes: FormNote[] = [];
  const picks = lineupPicks(lineup);
  if (!picks.length) return { mods, notes };

  // 🔥 FOGO — só vindo de uma Bo5; conta MVPs de jogo do seu lado por role.
  if (prevFormat === "Bo5" && prevHighlight) {
    const counts = new Map<Role, number>();
    for (const gm of prevHighlight.gameMvps) {
      if (gm.side === "you") counts.set(gm.role, (counts.get(gm.role) ?? 0) + 1);
    }
    for (const [role, c] of counts) {
      if (c >= 2 && lineup[role]) {
        mods.you[role] = (mods.you[role] ?? 0) + 3;
        notes.push({ side: "you", role, kind: "fogo", delta: 3 });
      }
    }
  }

  // 🧊 GELADO — após derrota, 50% de chance; vítima aleatória que não esteja em fogo.
  if (prevResult === "loss" && Math.random() < 0.5) {
    const hot = new Set(notes.map((n) => n.role));
    const candidates = picks.filter((p) => !hot.has(p.role));
    if (candidates.length) {
      const victim = candidates[Math.floor(Math.random() * candidates.length)];
      mods.you[victim.role] = (mods.you[victim.role] ?? 0) - 3;
      notes.push({ side: "you", role: victim.role, kind: "gelado", delta: -3 });
    }
  }

  return { mods, notes };
}
