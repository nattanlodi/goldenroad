// ============================================================
// LineColumn — card de line no estilo do solo (compartilhado)
// ============================================================
// Card de uma line: nome no topo, jogadores com pill de overall colorida por
// raridade (+ forma 🔥/🧊), média no rodapé. Altura própria (não cresce com o
// feed central). Usado no bracket offline E na série 1v1 online — mesmo visual.

import type { Role, Tournament } from "../../types";
import { rarityFor } from "../../game/helpers";
import { competitorSubtitle, lineAvg, type Competitor, type TournamentPick } from "../../game/tournament";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";
import { BotIcon } from "../../components/BotIcon";

/** Rótulo curto da campanha de origem do pick (extensível a novos torneios). */
function campaignLabel(t: Tournament | undefined): string {
  if (t === "msi") return "MSI";
  return "Worlds";
}

export function LineColumn({ c, mine, side, showRatings, subtitle, compactMobile }: { c: Competitor; mine: boolean; side: "left" | "right"; showRatings: boolean; subtitle?: string; compactMobile?: boolean }) {
  const accent = mine ? "#e8ce86" : "#cfd3cb";
  const eff = (p: TournamentPick) => p.rating + (c.form[p.role] ?? 0);
  const avg = lineAvg(c.line.map((p) => ({ ...p, rating: eff(p) })));
  // subtítulo: por padrão o time-base predominante (faz sentido pra bot de 1
  // time só); no 1v1 a line é MISTURADA, então quem usa passa o subtitle (ex.: "").
  const sub = subtitle ?? competitorSubtitle(c);
  // espelhamento do lado direito. No FEED (compactMobile) espelha SEMPRE; no MODAL
  // (sem compactMobile) espelha só no desktop (no mobile fica igual ao esquerdo).
  const isRight = side === "right";
  const rev = !isRight ? "" : compactMobile ? "flex-row-reverse" : "wide:flex-row-reverse";
  const revText = !isRight ? "" : compactMobile ? "flex-row-reverse text-right" : "wide:flex-row-reverse wide:text-right";
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border" style={{ borderColor: mine ? "rgba(201,162,75,0.4)" : "rgba(201,162,75,0.2)", background: "linear-gradient(180deg,rgba(40,41,44,0.82),rgba(28,29,31,0.84))" }}>
      {/* cabeçalho: nome (sem placar — o placar fica no centro e no bracket) */}
      <div className={`flex items-center border-b border-gold/20 px-3 py-2 wide:px-4 wide:py-3 ${revText}`}>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5 truncate font-display text-[14px] font-bold leading-tight wide:text-[16px]" style={{ color: accent }}>
            {c.isBot && <BotIcon size={13} className="-mt-px" />}
            <span className="truncate">{c.name}</span>
          </div>
          {sub && <div className="truncate font-mono text-[9px] text-dim wide:text-[10px]">{sub}</div>}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-1.5 sm:gap-1.5 sm:p-2">
        {c.line.map((p) => {
          const r = eff(p);
          const skin = rarityFor(r);
          const mod = c.form[p.role] ?? 0; // delta de overall por efeito (carta/forma)
          // pill de overall IGUAL ao solo: fundo tingido pela raridade + selo +/− no
          // canto quando há delta (verde sobe, coral desce) + altura do solo.
          const pill = showRatings && (
            <span className="relative inline-flex min-w-[30px] items-center justify-center rounded-[7px] px-[6px] py-[4px] text-center font-mono text-[15px] font-black leading-none tabular-nums wide:min-w-[34px] wide:px-[7px] wide:py-[6px] wide:text-[17px]"
              style={{
                color: skin.ratingColor,
                background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`,
                border: `1px solid ${mod !== 0 ? (mod > 0 ? "rgba(127,209,138,0.7)" : "rgba(230,144,128,0.7)") : `color-mix(in srgb, ${skin.ratingColor} 38%, transparent)`}`,
              }}>
              {r}
              {mod !== 0 && (
                <span
                  className="absolute -right-2 -top-2 inline-flex items-center justify-center rounded-full px-1 py-[1px] font-mono text-[9px] font-black leading-none"
                  style={mod > 0
                    ? { color: "#0f1a12", background: "#7fd18a", boxShadow: "0 0 7px rgba(127,209,138,0.65)" }
                    : { color: "#241010", background: "#e69080", boxShadow: "0 0 7px rgba(230,144,128,0.65)" }}
                >
                  {mod > 0 ? `+${mod}` : mod}
                </span>
              )}
            </span>
          );
          const ident = (
            <span className={`flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 ${rev}`}>
              {/* compactMobile: bandeira menor no mobile (wrappers por breakpoint —
                  o Flag fixa o próprio display, então não dá pra pôr `hidden` nele,
                  senão as duas apareciam juntas). O NOME do jogador SEMPRE aparece. */}
              {compactMobile ? (
                <>
                  <span className="inline-flex wide:hidden"><Flag cc={p.country} size={10} /></span>
                  <span className="hidden wide:inline-flex"><Flag cc={p.country} size={13} /></span>
                </>
              ) : (
                <Flag cc={p.country} size={13} />
              )}
              <span className="truncate font-display text-[13px] font-semibold text-cream wide:text-[15px]">{p.name}</span>
              {mod !== 0 && (
                <span
                  title={mod > 0 ? "Em chamas" : "Gelado"}
                  className="shrink-0 text-[14px] leading-none"
                  style={mod > 0 ? { filter: "drop-shadow(0 0 6px rgba(255,120,60,0.7))" } : { filter: "drop-shadow(0 0 6px rgba(120,180,255,0.7))" }}
                >
                  {mod > 0 ? "🔥" : "🧊"}
                </span>
              )}
              {/* campanha (Worlds/MSI…) em cima + time/ano embaixo — colado na pill de
                  over. No reverse (lado direito) o auto-margin vai pro outro lado.
                  SÓ no desktop/tablet (no mobile não cabe). */}
              <span className={`hidden shrink-0 flex-col whitespace-nowrap leading-tight wide:flex ${side === "right" ? "mr-auto items-start" : "ml-auto items-end"}`}>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[1px] text-muted">{campaignLabel(p.tournament)}</span>
                <span className="font-mono text-[12px] text-dim">{p.short} '{String(p.year).slice(2)}</span>
              </span>
            </span>
          );
          return (
            <div key={p.role} className={`flex items-center gap-2 rounded-[10px] px-2 py-1.5 sm:px-2.5 sm:py-2 ${rev}`}
              style={{ background: "linear-gradient(100deg,rgba(42,44,48,0.62),rgba(30,31,34,0.5))", border: "1px solid rgba(201,162,75,0.14)" }}>
              <RoleBadge role={p.role as Role} variant={mine ? "gold" : "neutral"} size="sm" compactMobile={compactMobile} reverse={isRight} />
              {ident}
              {pill}
            </div>
          );
        })}
      </div>
      {showRatings && (
        <div className={`flex items-center justify-between border-t border-gold/15 px-3 py-1.5 wide:px-3.5 wide:py-2 ${rev}`}>
          <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">Média</span>
          <span className="font-mono text-[15px] font-bold wide:text-[18px]" style={{ color: accent }}>{avg}</span>
        </div>
      )}
    </div>
  );
}
