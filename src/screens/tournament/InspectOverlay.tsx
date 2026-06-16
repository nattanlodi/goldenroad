// ============================================================
// InspectOverlay — modal das 2 lines de um confronto (compartilhado)
// ============================================================
// Popover que mostra as duas lines completas de um confronto clicado no bracket,
// com VS no meio (vira o placar parcial/final quando a série começa/termina).
// Usado no torneio offline (1×7) E no online (Degrau 2) — exatamente o mesmo modal.

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Role } from "../../types";
import { competitorLabel, competitorSubtitle, type BracketMatch, type Competitor } from "../../game/tournament";
import { rarityFor } from "../../game/helpers";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";

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
      <div className="w-full max-w-[860px]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-display text-[13px] font-bold uppercase tracking-[2px] text-gold-bright">{STAGE_LABEL[match.stage]}</span>
          <button onClick={onClose} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[1px]">✕ Fechar</button>
        </div>
        <div className="grid items-stretch gap-3 [grid-template-columns:1fr] sm:[grid-template-columns:1fr_auto_1fr]">
          <InspectLine c={a} mine={match.a === myId} showRatings={showRatings} />
          {/* centro: VS → vira o placar quando a série começa/termina */}
          <div className="flex items-center justify-center sm:px-1">
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
          <InspectLine c={b} mine={match.b === myId} showRatings={showRatings} />
        </div>
      </div>
    </div>
  );
  // portal no body: escapa do container com transform (anim-fade) que prenderia o fixed.
  return createPortal(overlay, document.body);
}

function InspectLine({ c, mine, showRatings }: { c: Competitor | null; mine: boolean; showRatings: boolean }) {
  if (!c) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-gold/20" style={{ background: "rgba(26,27,31,0.6)" }}>
        <span className="font-mono text-[12px] text-dim">a definir</span>
      </div>
    );
  }
  const avg = showRatings ? c.avg : null;
  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: mine ? "rgba(201,162,75,0.4)" : "rgba(201,162,75,0.2)", background: "linear-gradient(180deg,rgba(40,41,44,0.92),rgba(28,29,31,0.94))" }}>
      <div className="flex items-center justify-between gap-2 border-b border-gold/20 px-4 py-3">
        <div className="min-w-0">
          <div className={`truncate font-display text-[16px] font-bold ${mine ? "text-gold-bright" : "text-cream"}`}>{competitorLabel(c)}{mine ? " (você)" : ""}</div>
          <div className="truncate font-mono text-[10px] text-dim">{competitorSubtitle(c)}</div>
        </div>
        {avg != null && <span className="shrink-0 font-mono text-[20px] font-black text-gold-bright">{avg}</span>}
      </div>
      <div className="flex flex-col gap-1 p-2">
        {c.line.map((p) => {
          const skin = rarityFor(p.rating);
          return (
            <div key={p.role} className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2" style={{ background: "linear-gradient(100deg,rgba(42,44,48,0.62),rgba(30,31,34,0.5))", border: "1px solid rgba(201,162,75,0.12)" }}>
              <RoleBadge role={p.role as Role} variant={mine ? "gold" : "neutral"} size="sm" />
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <Flag cc={p.country} size={13} />
                <span className="truncate font-display text-[15px] font-semibold text-cream">{p.name}</span>
                <span className="ml-auto shrink-0 font-mono text-[9px] text-dim">{p.short} '{String(p.year).slice(2)}</span>
              </span>
              {showRatings && (
                <span className="inline-flex min-w-[32px] items-center justify-center rounded-[7px] px-[6px] py-[4px] font-mono text-[16px] font-black leading-none tabular-nums"
                  style={{ color: skin.ratingColor, background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`, border: `1px solid color-mix(in srgb, ${skin.ratingColor} 38%, transparent)` }}>
                  {p.rating}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
