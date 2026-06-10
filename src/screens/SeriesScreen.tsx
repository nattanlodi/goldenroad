import type { CSSProperties } from "react";
import type { Game } from "../game/useGame";
import { lineupPicks, seriesTarget, SERIES_FLAVORS, yy } from "../game/helpers";

const dotFilled: CSSProperties = {
  background: "linear-gradient(180deg,#86d79a,#5fae72)",
  boxShadow: "0 0 10px rgba(126,208,143,0.55)",
};
const dotEmpty: CSSProperties = {
  background: "rgba(42,51,65,0.7)",
  border: "1px solid rgba(201,162,75,0.2)",
};

export function SeriesScreen({ game }: { game: Game }) {
  const { journey, seriesIndex, revealed, seriesPlaying, gamesWon, difficulty, lineup } = game.state;
  if (!journey) return null;

  const showRatings = difficulty !== "especialista";
  const j = journey[seriesIndex];
  const target = seriesTarget(j.score);
  const notStarted = !revealed && !seriesPlaying;
  const isLast = seriesIndex >= 5;
  const flavor = SERIES_FLAVORS[seriesIndex % SERIES_FLAVORS.length];
  const yourList = lineupPicks(lineup);

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1040px]">
      {/* header + progresso */}
      <div className="mb-[18px] text-center">
        <div className="mb-3.5 font-mono text-[12px] uppercase tracking-[3px] text-muted">Playoffs · rumo ao 6–0</div>
        <div className="flex flex-wrap justify-center gap-2">
          {journey.map((_, i) => {
            const won = i < seriesIndex || (i === seriesIndex && revealed);
            const cur = i === seriesIndex && !revealed;
            const style: CSSProperties = won
              ? { background: "linear-gradient(180deg,#86d79a,#5fae72)", color: "#16241a", border: "1px solid rgba(126,208,143,0.5)" }
              : cur
                ? { background: "transparent", color: "#E8CE86", border: "1.5px solid #E8CE86", boxShadow: "0 0 0 4px rgba(201,162,75,0.12)" }
                : { background: "rgba(42,51,65,0.6)", color: "#777E89", border: "1px solid rgba(201,162,75,0.14)" };
            return (
              <div
                key={i}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] font-mono text-[13px] font-bold"
                style={style}
              >
                {won ? "✓" : i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 colunas */}
      <div className="grid items-stretch gap-4 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.05fr_1fr]">
        {/* sua line */}
        <div className="panel-raised overflow-hidden rounded-2xl border border-gold/30">
          <div className="border-b border-gold/20 px-3.5 py-[11px] font-display text-[14px] font-semibold uppercase tracking-[1px] text-gold-bright">
            Sua line
          </div>
          <div className="flex flex-col gap-[5px] p-2">
            {yourList.map((p) => (
              <div
                key={p.role}
                className="flex items-center gap-2.5 rounded-[9px] px-[9px] py-[7px]"
                style={{ background: "rgba(28,34,45,0.5)" }}
              >
                <span className="min-w-[36px] rounded-[4px] bg-gold-bright px-[5px] py-[3px] text-center font-mono text-[9px] text-ink">
                  {p.role}
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold text-cream">{p.name}</span>
                {showRatings && <span className="font-mono text-[14px] font-bold text-gold-bright">{p.rating}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* centro */}
        <div className="flex min-h-[240px] flex-col items-center justify-center px-2.5 py-[18px] text-center">
          <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">{j.stage}</div>
          <div className="mt-[3px] font-mono text-[11px] text-dim">{j.format}</div>

          {notStarted && (
            <>
              <div className="my-[18px] font-display text-[34px] font-bold tracking-[6px] text-dim">VS</div>
              <button
                onClick={game.playSeries}
                className="btn-gold cursor-pointer rounded-[10px] border-none px-[34px] py-[13px] font-display text-[16px] font-semibold uppercase tracking-[2px]"
              >
                ▶ Jogar série
              </button>
            </>
          )}

          {seriesPlaying && (
            <div className="my-3.5">
              <div className="font-mono text-[46px] leading-none font-bold tracking-[3px] text-win">{gamesWon}–0</div>
              <div className="mt-2 font-mono text-[11px] tracking-[3px] text-muted">EM JOGO…</div>
              <div className="mt-4 flex justify-center gap-[7px]">
                {Array.from({ length: target }, (_, i) => (
                  <div
                    key={i}
                    className="h-[18px] w-[18px] rounded-[5px] transition-all"
                    style={i < gamesWon ? dotFilled : dotEmpty}
                  />
                ))}
              </div>
            </div>
          )}

          {revealed && (
            <div className="anim-pop">
              <div className="mt-3.5 mb-1 font-mono text-[48px] leading-none font-bold tracking-[3px] text-win">
                {j.score}
              </div>
              <div className="font-display text-[18px] font-bold uppercase tracking-[3px] text-win">Vitória</div>
              <div className="mx-auto mt-2 mb-[18px] max-w-[240px] text-[13px] text-[#BFC4CD]">{flavor}</div>
              <button
                onClick={game.nextSeries}
                className={
                  isLast
                    ? "btn-gold cursor-pointer rounded-[11px] border-none px-9 py-3.5 font-display text-[17px] font-semibold uppercase tracking-[2px]"
                    : "btn-soft-gold cursor-pointer rounded-[10px] px-[30px] py-3 font-display text-[15px] font-semibold uppercase tracking-[1px]"
                }
              >
                {isLast ? "Erguer a taça 🏆" : "Próxima série →"}
              </button>
            </div>
          )}
        </div>

        {/* adversário */}
        <div
          className="overflow-hidden rounded-2xl border border-red/30"
          style={{ background: "linear-gradient(180deg,rgba(58,44,44,0.7),rgba(34,28,30,0.7))" }}
        >
          <div className="flex items-baseline justify-between gap-2 border-b px-3.5 py-[11px]" style={{ borderColor: "rgba(210,122,104,0.28)" }}>
            <span className="truncate font-display text-[14px] font-semibold text-cream">{j.team}</span>
            <span className="font-mono text-[11px] text-red-soft">'{yy(j.year)}</span>
          </div>
          <div className="flex flex-col gap-[5px] p-2">
            {j.players.map((p) => (
              <div
                key={p[0]}
                className="flex items-center gap-2.5 rounded-[9px] px-[9px] py-[7px]"
                style={{ background: "rgba(34,28,30,0.5)" }}
              >
                <span
                  className="min-w-[36px] rounded-[4px] px-[5px] py-[3px] text-center font-mono text-[9px] text-cream"
                  style={{ background: "rgba(210,122,104,0.35)" }}
                >
                  {p[0]}
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold text-[#E7E0D6]">
                  {p[1]}
                </span>
                {showRatings && <span className="font-mono text-[14px] font-bold text-red-soft">{p[2]}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
