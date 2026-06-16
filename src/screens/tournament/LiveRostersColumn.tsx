// ============================================================
// LiveRostersColumn — coluna de "elencos ao vivo" dos adversários
// ============================================================
// Card da DIREITA do draft: cada adversário é uma LINHA compacta (nome + média
// parcial + 5 mini-slots de lane que revelam nome/over/time-ano conforme pickam).
// Compartilhado entre o torneio offline (1×7 bots) e o duelo 1v1 online (1
// adversário) — MESMO visual, só muda quantos competidores entram na lista.

import { ROLES } from "../../data/teams";
import { rarityFor, yy } from "../../game/helpers";
import type { Competitor } from "../../game/tournament";
import { ROLE_SVG } from "../../components/roleIcons";

export function LiveRostersColumn({
  others,
  revealed,
  showRatings,
  title = "Outros times",
}: {
  others: Competitor[];
  revealed: number;
  showRatings: boolean;
  title?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold/25 p-2.5" style={{ background: "rgba(26,27,31,0.55)" }}>
      <div className="mb-[14px] flex items-center justify-between px-0.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[1.5px] text-muted">{title}</span>
        <span className="font-mono text-[9.5px] text-gold-bright">{revealed}/5</span>
      </div>
      {/* cabeçalho de colunas: o ícone de cada lane (vale pra todos os cards abaixo) */}
      <div className="mb-1.5 grid grid-cols-5 gap-1 px-2">
        {ROLES.map((r) => (
          <span key={r} className="flex items-center justify-center" title={r === "BOT" ? "ADC" : r}>
            <span aria-hidden className="h-[13px] w-[13px] text-gold-bright/80 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: ROLE_SVG[r] }} />
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {others.map((c) => (
          <LiveRosterRow key={c.id} c={c} revealed={revealed} showRatings={showRatings} />
        ))}
      </div>
    </div>
  );
}

function LiveRosterRow({ c, revealed, showRatings }: { c: Competitor; revealed: number; showRatings: boolean }) {
  // line na ordem das roles; revela só as `revealed` primeiras.
  const ordered = ROLES.map((r) => c.line.find((p) => p.role === r)).filter((p): p is NonNullable<typeof p> => !!p);
  // média PARCIAL das lanes já reveladas — atualiza a cada pick (só com overalls visíveis).
  const shown = ordered.slice(0, revealed);
  const shownAvg = showRatings && shown.length ? Math.round(shown.reduce((a, p) => a + p.rating, 0) / shown.length) : null;
  return (
    <div className="rounded-[9px] border border-gold/12 px-2 py-1.5" style={{ background: "rgba(30,32,38,0.6)" }}>
      {/* nome do time + média (atualiza a cada pick — média das lanes reveladas) */}
      <div className="mb-1 flex items-center justify-between gap-1.5">
        <span className="min-w-0 truncate font-display text-[12.5px] font-bold text-cream">
          {c.isBot ? `🤖 ${c.name}` : c.name}
        </span>
        {shownAvg != null && (
          <span
            className="flex shrink-0 items-baseline gap-1"
            title={revealed >= 5 ? "média do time" : `média parcial (${shown.length}/5 lanes)`}
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.5px] text-muted">méd</span>
            <span className="font-mono text-[12px] font-bold text-gold-bright">{shownAvg}</span>
          </span>
        )}
      </div>
      {/* 5 mini-slots de lane (nome + overall + time/ano) — a lane vem do cabeçalho */}
      <div className="grid grid-cols-5 gap-1">
        {ROLES.map((r, i) => {
          const p = ordered[i];
          const isRevealed = i < revealed && p;
          const skin = isRevealed ? rarityFor(p!.rating) : null;
          // o slot RECÉM-revelado (último a entrar nesta rodada) ganha um "pop".
          const justRevealed = isRevealed && i === revealed - 1;
          return (
            <div
              // key muda quando o slot acaba de revelar → reinicia a animação.
              key={`${r}-${justRevealed ? "in" : "x"}`}
              title={isRevealed ? `${r === "BOT" ? "ADC" : r}: ${p!.name} · ${p!.short} '${yy(p!.year)}${showRatings ? ` (${p!.rating})` : ""}` : `${r === "BOT" ? "ADC" : r}: aguardando`}
              className={`flex flex-col items-center rounded-[5px] px-0.5 py-1 ${justRevealed ? "anim-pop" : ""}`}
              style={{ background: isRevealed ? "rgba(201,162,75,0.1)" : "rgba(20,22,28,0.5)", border: `1px solid ${isRevealed ? "rgba(201,162,75,0.28)" : "rgba(201,162,75,0.08)"}` }}
            >
              {isRevealed ? (
                <>
                  <span className="max-w-full truncate font-display text-[12.5px] font-semibold leading-none text-cream">{p!.name}</span>
                  {showRatings && (
                    <span className="mt-[3px] font-mono text-[13.5px] font-bold leading-none" style={{ color: skin!.ratingColor }}>{p!.rating}</span>
                  )}
                  {/* sem o over (Especialista) o nome e o time/ano ficam grudados → mais respiro. */}
                  <span className={`${showRatings ? "mt-[3px]" : "mt-[8px]"} max-w-full truncate font-mono text-[9px] leading-none text-dim`}>{p!.short} '{yy(p!.year)}</span>
                </>
              ) : (
                // ainda não pickado: MESMA estrutura/altura do preenchido, porém
                // invisível (não mostra nada, mas reserva a altura exata).
                <>
                  <span className="font-display text-[12.5px] font-semibold leading-none invisible">—</span>
                  {showRatings && <span className="mt-[3px] font-mono text-[13.5px] font-bold leading-none invisible">—</span>}
                  <span className={`${showRatings ? "mt-[3px]" : "mt-[8px]"} font-mono text-[9px] leading-none invisible`}>—</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
