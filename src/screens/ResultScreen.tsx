import type { Game } from "../game/useGame";
import { lineScore, lineupPicks, tierFor, yy } from "../game/helpers";

export function ResultScreen({ game }: { game: Game }) {
  const { lineup, journey, record, isNewRecord, copied } = game.state;
  const picks = lineupPicks(lineup);
  const avg = lineScore(lineup);
  const champs = picks.filter((p) => p.champion).length;
  const { tier, desc } = tierFor(avg);

  return (
    <div className="anim-fade mx-auto w-full max-w-[1100px]">
      {/* header */}
      <div className="mb-[30px] text-center">
        <div className="mb-2.5 font-mono text-[12px] uppercase tracking-[3px] text-gold-bright">
          ★ Campeões do Mundo · 6–0 ★
        </div>
        <div className="text-gold-fill font-display text-[clamp(40px,8vw,72px)] font-bold leading-[0.95] tracking-[-1px]">
          {tier}
        </div>
        <p className="mt-2.5 text-[16px] text-[#BFC4CD]">{desc}</p>
      </div>

      {/* stats */}
      <div className="mb-[34px] flex flex-wrap justify-center gap-6">
        <div
          className="rounded-[14px] border border-gold/30 px-[26px] py-3.5 text-center"
          style={{ background: "rgba(40,49,63,0.65)" }}
        >
          <div className="font-mono text-[42px] leading-none font-bold text-gold-bright">{avg}</div>
          <div className="mt-[5px] font-mono text-[11px] tracking-[1px] text-muted">NOTA DA LINE</div>
        </div>
        <div
          className="rounded-[14px] border border-gold/30 px-[26px] py-3.5 text-center"
          style={{ background: "rgba(40,49,63,0.65)" }}
        >
          <div className="font-mono text-[42px] leading-none font-bold text-cream">
            {champs}
            <span className="text-[24px] text-dim">/5</span>
          </div>
          <div className="mt-[5px] font-mono text-[11px] tracking-[1px] text-muted">CAMPEÕES MUNDIAIS</div>
        </div>
      </div>

      {/* grid: sua line + jornada */}
      <div className="grid items-start gap-6 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1fr]">
        <div>
          <div className="mb-3 font-display text-[16px] font-semibold uppercase tracking-[2px] text-muted">Sua line</div>
          <div className="flex flex-col gap-2">
            {picks.map((p) => (
              <div
                key={p.role}
                className="panel-raised flex items-center gap-3 rounded-[12px] border border-gold/25 px-3.5 py-3"
              >
                <span className="min-w-[42px] rounded-[5px] bg-gold-bright px-[7px] py-1 text-center font-mono text-[10px] tracking-[1px] text-ink">
                  {p.role}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[17px] font-semibold text-cream">{p.name}</span>
                  <span className="block font-mono text-[11px] text-muted">
                    {p.short} '{yy(p.year)}
                  </span>
                </span>
                <span className="font-mono text-[18px] font-bold text-gold-bright">{p.rating}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 font-display text-[16px] font-semibold uppercase tracking-[2px] text-muted">
            A jornada 6–0
          </div>
          <div className="flex flex-col gap-2">
            {(journey ?? []).map((jj, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-[12px] border border-gold/20 px-3.5 py-[11px]"
                style={{ background: "rgba(32,39,51,0.7)" }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[1px] text-muted">
                    {jj.stage} · {jj.format}
                  </span>
                  <span className="mt-px block font-display text-[16px] font-semibold text-cream">
                    vs {jj.team} <span className="text-[13px] text-muted">'{yy(jj.year)}</span>
                  </span>
                </span>
                <span className="font-mono text-[18px] font-bold tracking-[1px] text-win">{jj.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* compartilhar */}
      <div
        className="mt-[30px] rounded-2xl border border-gold/20 p-[22px] text-center"
        style={{ background: "rgba(20,25,33,0.5)" }}
      >
        {isNewRecord && (
          <div className="mb-1.5 font-display text-[18px] font-bold uppercase tracking-[2px] text-win-bright">
            ★ Novo recorde!
          </div>
        )}
        <div className="mb-4 font-mono text-[12px] tracking-[1px] text-muted">
          Seu recorde de nota: <b className="text-gold-bright">{record}</b>
        </div>
        <div className="flex flex-wrap justify-center gap-[11px]">
          <button
            onClick={game.copyResult}
            className="btn-ghost cursor-pointer rounded-[11px] px-6 py-[13px] font-display text-[15px] font-semibold uppercase tracking-[1px]"
          >
            {copied ? "✓ Copiado!" : "⧉ Copiar resultado"}
          </button>
          <button
            onClick={game.downloadCard}
            className="btn-gold cursor-pointer rounded-[11px] border-none px-6 py-[13px] font-display text-[15px] font-semibold uppercase tracking-[1px]"
          >
            ⬇ Baixar imagem
          </button>
          <button
            onClick={game.restart}
            className="btn-ghost cursor-pointer rounded-[11px] px-6 py-[13px] font-display text-[15px] font-semibold uppercase tracking-[1px]"
          >
            Jogar de novo
          </button>
        </div>
      </div>
    </div>
  );
}
