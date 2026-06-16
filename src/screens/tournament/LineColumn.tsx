// ============================================================
// LineColumn — card de line no estilo do solo (compartilhado)
// ============================================================
// Card de uma line: nome no topo, jogadores com pill de overall colorida por
// raridade (+ forma 🔥/🧊), média no rodapé. Altura própria (não cresce com o
// feed central). Usado no bracket offline E na série 1v1 online — mesmo visual.

import type { Role } from "../../types";
import { rarityFor } from "../../game/helpers";
import { competitorLabel, competitorSubtitle, lineAvg, type Competitor, type TournamentPick } from "../../game/tournament";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";

export function LineColumn({ c, mine, side, showRatings, subtitle }: { c: Competitor; mine: boolean; side: "left" | "right"; showRatings: boolean; subtitle?: string }) {
  const accent = mine ? "#e8ce86" : "#cfd3cb";
  const eff = (p: TournamentPick) => p.rating + (c.form[p.role] ?? 0);
  const avg = lineAvg(c.line.map((p) => ({ ...p, rating: eff(p) })));
  // subtítulo: por padrão o time-base predominante (faz sentido pra bot de 1
  // time só); no 1v1 a line é MISTURADA, então quem usa passa o subtitle (ex.: "").
  const sub = subtitle ?? competitorSubtitle(c);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border" style={{ borderColor: mine ? "rgba(201,162,75,0.4)" : "rgba(201,162,75,0.2)", background: "linear-gradient(180deg,rgba(40,41,44,0.82),rgba(28,29,31,0.84))" }}>
      {/* cabeçalho: nome (sem placar — o placar fica no centro e no bracket) */}
      <div className={`flex items-center border-b border-gold/20 px-4 py-3 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
        <div className="min-w-0">
          <div className="truncate font-display text-[16px] font-bold leading-tight" style={{ color: accent }}>{competitorLabel(c)}</div>
          {sub && <div className="truncate font-mono text-[10px] text-dim">{sub}</div>}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-1.5 sm:gap-1.5 sm:p-2">
        {c.line.map((p) => {
          const r = eff(p);
          const skin = rarityFor(r);
          const form = c.form[p.role] ?? 0;
          // pill de overall tingida pela raridade (igual ao solo).
          const pill = showRatings && (
            <span className="relative inline-flex min-w-[32px] items-center justify-center rounded-[7px] px-[6px] py-[4px] font-mono text-[16px] font-black leading-none tabular-nums"
              style={{ color: skin.ratingColor, background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`, border: `1px solid ${form !== 0 ? (form > 0 ? "rgba(127,209,138,0.7)" : "rgba(120,180,255,0.7)") : `color-mix(in srgb, ${skin.ratingColor} 38%, transparent)`}` }}>
              {r}
            </span>
          );
          const ident = (
            <span className={`flex min-w-0 flex-1 items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
              <Flag cc={p.country} size={13} />
              <span className="truncate font-display text-[15px] font-semibold text-cream">{p.name}</span>
              {form !== 0 && <span title={form > 0 ? "Em chamas (+)" : "Gelado (−)"} className="shrink-0 text-[12px]">{form > 0 ? "🔥" : "🧊"}</span>}
            </span>
          );
          return (
            <div key={p.role} className={`flex items-center gap-2 rounded-[10px] px-2 py-1.5 sm:px-2.5 sm:py-2 ${side === "right" ? "flex-row-reverse" : ""}`}
              style={{ background: "linear-gradient(100deg,rgba(42,44,48,0.62),rgba(30,31,34,0.5))", border: "1px solid rgba(201,162,75,0.14)" }}>
              <RoleBadge role={p.role as Role} variant={mine ? "gold" : "neutral"} size="sm" />
              {ident}
              {pill}
            </div>
          );
        })}
      </div>
      {showRatings && (
        <div className={`flex items-center justify-between border-t border-gold/15 px-3.5 py-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
          <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">Média</span>
          <span className="font-mono text-[18px] font-bold" style={{ color: accent }}>{avg}</span>
        </div>
      )}
    </div>
  );
}
