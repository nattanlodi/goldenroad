// ============================================================
// InspectOverlay — modal das 2 lines de um confronto (compartilhado)
// ============================================================
// Popover que mostra as duas lines completas de um confronto clicado no bracket,
// com VS no meio (vira o placar parcial/final quando a série começa/termina).
// Usado no torneio offline (1×7) E no online (Degrau 2) — exatamente o mesmo modal.

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { BracketMatch, Competitor } from "../../game/tournament";
import { LineColumn } from "./LineColumn";

const STAGE_LABEL: Record<BracketMatch["stage"], string> = { qf: "Quartas", sf: "Semifinal", gf: "Grande Final" };

export function InspectOverlay({ match, byId, myId, showRatings, score, onClose }: {
  match: BracketMatch;
  byId: Map<string, Competitor>;
  myId: string;
  showRatings: boolean;
  score: { a: number; b: number; done: boolean };
  onClose: () => void;
}) {
  const a = (match.a ? byId.get(match.a) : null) ?? null;
  const b = (match.b ? byId.get(match.b) : null) ?? null;
  // fecha no ESC.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // VS antes de começar; placar (parcial/final) depois.
  const started = score.a > 0 || score.b > 0 || score.done;
  const aWon = score.done && score.a > score.b;
  const bWon = score.done && score.b > score.a;

  const overlay = (
    <div className="anim-fade-fast fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8" style={{ background: "rgba(10,11,15,0.78)", backdropFilter: "blur(5px)" }} onClick={onClose}>
      <div className="w-full max-w-[940px]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-display text-[13px] font-bold uppercase tracking-[2px] text-gold-bright">{STAGE_LABEL[match.stage]}</span>
          <button onClick={onClose} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[1px]">✕ Fechar</button>
        </div>
        <div className="grid items-stretch gap-3 [grid-template-columns:1fr] sm:gap-7 sm:[grid-template-columns:1fr_auto_1fr]">
          <InspectSide c={a} mine={match.a === myId} side="left" showRatings={showRatings} />
          {/* centro: VS → vira o placar quando a série começa/termina */}
          <div className="flex items-center justify-center sm:px-3">
            {!started ? (
              <span className="font-display text-[28px] font-black tracking-[2px] text-gold-bright">VS</span>
            ) : (
              <span className="font-mono text-[34px] font-black tabular-nums">
                <span className={aWon ? "text-win" : score.a === 0 ? "text-dim" : "text-muted"}>{score.a}</span>
                <span className="px-1 text-dim">–</span>
                <span className={bWon ? "text-win" : score.b === 0 ? "text-dim" : "text-muted"}>{score.b}</span>
              </span>
            )}
          </div>
          <InspectSide c={b} mine={match.b === myId} side="right" showRatings={showRatings} />
        </div>
      </div>
    </div>
  );
  // portal no body: escapa do container com transform (anim-fade) que prenderia o fixed.
  return createPortal(overlay, document.body);
}

/** Um lado do modal: reusa o MESMO LineColumn do feed (espelha o lado direito,
 * mostra time+ano, deltas etc.) — assim modal e feed ficam idênticos. */
function InspectSide({ c, mine, side, showRatings }: { c: Competitor | null; mine: boolean; side: "left" | "right"; showRatings: boolean }) {
  if (!c) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-gold/20" style={{ background: "rgba(26,27,31,0.6)" }}>
        <span className="font-mono text-[12px] text-dim">a definir</span>
      </div>
    );
  }
  return <LineColumn c={c} mine={mine} side={side} showRatings={showRatings} subtitle="" />;
}
