import type { CSSProperties } from "react";
import type { Game } from "../game/useGame";
import { lineScore, lineupPicks, seriesFlavor, yy } from "../game/helpers";

const dotGreen: CSSProperties = {
  background: "linear-gradient(180deg,#86d79a,#5fae72)",
  boxShadow: "0 0 10px rgba(126,208,143,0.45)",
};
const dotRed: CSSProperties = {
  background: "linear-gradient(180deg,#e09a87,#c46a58)",
  boxShadow: "0 0 10px rgba(210,122,104,0.45)",
};
const dotEmpty: CSSProperties = { background: "rgba(42,51,65,0.7)", border: "1px solid rgba(201,162,75,0.2)" };

/** Linha de marcadores (pips) — vitórias (verde) ou derrotas (vermelho). */
function Pips({ filled, total, kind }: { filled: number; total: number; kind: "win" | "loss" }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-[14px] w-[14px] rounded-[4px] transition-all"
          style={i < filled ? (kind === "win" ? dotGreen : dotRed) : dotEmpty}
        />
      ))}
    </div>
  );
}

const KO = [
  { key: "quarter", label: "Quartas" },
  { key: "semi", label: "Semi" },
  { key: "final", label: "Final" },
] as const;

export function SeriesScreen({ game }: { game: Game }) {
  const {
    series,
    stagePhase,
    swissWins,
    swissLosses,
    koIndex,
    seriesPlaying,
    revealed,
    yourGames,
    oppGames,
    seriesResult,
    difficulty,
    lineup,
    history,
  } = game.state;
  if (!series) return null;

  const showRatings = difficulty !== "especialista";
  const target = series.target;
  const notStarted = !revealed && !seriesPlaying;
  const isWin = seriesResult === "win";
  const flavor = seriesFlavor(isWin, yourGames, oppGames, history.length);
  const yourList = lineupPicks(lineup);
  const yourAvg = lineScore(lineup);
  const isLastWin = isWin && stagePhase === "ko" && koIndex >= 2;

  const nextLabel = (() => {
    if (isWin) {
      if (stagePhase === "swiss") return swissWins + 1 >= 3 ? "Avançar ao mata-mata →" : "Próxima série →";
      return koIndex >= 2 ? "Erguer a taça 🏆" : "Próxima série →";
    }
    return stagePhase === "swiss" && swissLosses + 1 < 3 ? "Próxima série →" : "Ver resultado →";
  })();

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1040px]">
      {/* header + progresso */}
      <div className="mb-[18px] text-center">
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[3px] text-muted">Playoffs · rumo ao 6–0</div>

        {stagePhase === "swiss" ? (
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-[14px] border border-gold/25 px-5 py-2.5">
            <span className="font-display text-[14px] font-semibold uppercase tracking-[1px] text-gold-bright">
              Fase Suíça
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[1px] text-muted">Vitórias</span>
              <Pips filled={swissWins} total={3} kind="win" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[1px] text-muted">Derrotas</span>
              <Pips filled={swissLosses} total={3} kind="loss" />
            </div>
          </div>
        ) : (
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-[8px] border border-win/40 px-2.5 py-1.5 font-mono text-[11px] text-win">
              Suíça {swissWins}–{swissLosses} ✓
            </span>
            {KO.map((s, k) => {
              const won = k < koIndex;
              const cur = k === koIndex;
              const style: CSSProperties = won
                ? { background: "linear-gradient(180deg,#86d79a,#5fae72)", color: "#16241a", border: "1px solid rgba(126,208,143,0.5)" }
                : cur
                  ? { background: "transparent", color: "#E8CE86", border: "1.5px solid #E8CE86", boxShadow: "0 0 0 4px rgba(201,162,75,0.12)" }
                  : { background: "rgba(42,51,65,0.6)", color: "#777E89", border: "1px solid rgba(201,162,75,0.14)" };
              return (
                <span
                  key={s.key}
                  className="rounded-[8px] px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[1px]"
                  style={style}
                >
                  {won ? "✓ " : ""}
                  {s.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 3 colunas */}
      <div className="grid items-stretch gap-4 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.05fr_1fr]">
        {/* sua line */}
        <div className="panel-raised overflow-hidden rounded-2xl border border-gold/30">
          <div className="flex items-baseline justify-between gap-2 border-b border-gold/20 px-3.5 py-[11px]">
            <span className="font-display text-[14px] font-semibold uppercase tracking-[1px] text-gold-bright">
              Sua line
            </span>
            {showRatings && <span className="font-mono text-[11px] text-muted">méd. {yourAvg}</span>}
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
        <div className="flex min-h-[260px] flex-col items-center justify-center px-2.5 py-[18px] text-center">
          <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">{series.stageLabel}</div>
          <div className="mt-[3px] font-mono text-[11px] text-dim">{series.format}</div>

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
              <div className="font-mono text-[46px] leading-none font-bold tracking-[2px]">
                <span className="text-win">{yourGames}</span>
                <span className="text-dim">–</span>
                <span className="text-red-soft">{oppGames}</span>
              </div>
              <div className="mt-2 font-mono text-[11px] tracking-[3px] text-muted">EM JOGO…</div>
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-[44px] text-right font-mono text-[9px] uppercase tracking-[1px] text-muted">Você</span>
                  <div className="flex gap-[7px]">
                    {Array.from({ length: target }, (_, i) => (
                      <div key={i} className="h-[16px] w-[16px] rounded-[5px] transition-all" style={i < yourGames ? dotGreen : dotEmpty} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-[44px] text-right font-mono text-[9px] uppercase tracking-[1px] text-muted">Rival</span>
                  <div className="flex gap-[7px]">
                    {Array.from({ length: target }, (_, i) => (
                      <div key={i} className="h-[16px] w-[16px] rounded-[5px] transition-all" style={i < oppGames ? dotRed : dotEmpty} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {revealed && (
            <div className="anim-pop">
              <div
                className={`mt-3.5 mb-1 font-mono text-[48px] leading-none font-bold tracking-[2px] ${isWin ? "text-win" : "text-red"}`}
              >
                {yourGames}–{oppGames}
              </div>
              <div
                className={`font-display text-[18px] font-bold uppercase tracking-[3px] ${isWin ? "text-win" : "text-red"}`}
              >
                {isWin ? "Vitória" : "Derrota"}
              </div>
              <div className="mx-auto mt-2 mb-[18px] max-w-[260px] text-[13px] text-[#BFC4CD]">{flavor}</div>
              <button
                onClick={game.nextSeries}
                className={
                  isLastWin
                    ? "btn-gold cursor-pointer rounded-[11px] border-none px-9 py-3.5 font-display text-[17px] font-semibold uppercase tracking-[2px]"
                    : "btn-soft-gold cursor-pointer rounded-[10px] px-[30px] py-3 font-display text-[15px] font-semibold uppercase tracking-[1px]"
                }
              >
                {nextLabel}
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
            <span className="truncate font-display text-[14px] font-semibold text-cream">{series.opp.team}</span>
            <span className="font-mono text-[11px] text-red-soft">
              {showRatings ? `méd. ${series.opp.avg} · ` : ""}'{yy(series.opp.year)}
            </span>
          </div>
          <div className="flex flex-col gap-[5px] p-2">
            {series.opp.players.map((p) => (
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
