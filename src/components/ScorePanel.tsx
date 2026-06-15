import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { RunScore, ScoreLine } from "../game/score";

/** Cor de cada tipo de linha do breakdown. */
const LINE_STYLE: Record<ScoreLine["kind"], { color: string; sign: string }> = {
  base: { color: "#e8ce86", sign: "+" },
  bonus: { color: "#7fd18a", sign: "+" },
  penalty: { color: "#e69080", sign: "" }, // já vem negativo
  mult: { color: "#c061e8", sign: "" }, // o valor é o ganho/perda do multiplicador
};

/** Formata número com separador de milhar (pt-BR). */
const fmt = (n: number) => n.toLocaleString("pt-BR");

/**
 * Card grande de PONTUAÇÃO da run, com contador animado (count-up) e o breakdown
 * das parcelas entrando uma a uma. É o momento "uau" da tela de resultado.
 */
export function ScorePanel({
  score,
  isNewRecord,
  record,
  isChampion,
}: {
  score: RunScore;
  isNewRecord: boolean;
  record: number;
  isChampion: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  // count-up do total (ease-out) ao montar.
  useEffect(() => {
    const target = score.total;
    const dur = 1100;
    let start: number | undefined;
    const tick = (t: number) => {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score.total]);

  // as linhas do breakdown entram depois do número (delay base + escada).
  const lineBaseDelay = 0.5; // s

  return (
    <div
      className="anim-pop overflow-hidden rounded-2xl border"
      style={{
        borderColor: isNewRecord ? "rgba(232,206,134,0.8)" : "rgba(201,162,75,0.4)",
        background: isChampion
          ? "linear-gradient(165deg,rgba(30,22,10,0.96),rgba(14,11,7,0.97))"
          : "linear-gradient(165deg,rgba(34,32,40,0.92),rgba(20,20,26,0.95))",
        boxShadow: isNewRecord ? "0 0 40px -6px rgba(201,162,75,0.55)" : undefined,
      }}
    >
      {/* topo: total + selo de recorde */}
      <div className="relative flex flex-col items-center px-6 pt-6 pb-4">
        {isNewRecord && (
          <div
            className="anim-pop mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[12px] font-bold uppercase tracking-[2px]"
            style={{ color: "#1a1206", background: "linear-gradient(180deg,#f0dca0,#c9a24b)", boxShadow: "0 0 16px rgba(201,162,75,0.5)" }}
          >
            ★ Novo recorde de pontos!
          </div>
        )}
        <div className="font-mono text-[11px] uppercase tracking-[3px] text-muted">Pontuação da run</div>
        <div
          className="mt-1 font-mono text-[clamp(52px,9vw,80px)] font-black leading-none tabular-nums"
          style={{
            background: "linear-gradient(180deg,#f4e4b0,#c9a24b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 18px rgba(201,162,75,0.45))",
          }}
        >
          {fmt(display)}
        </div>
        {/* zebra: a "manchete" que dá identidade ao score */}
        <ZebraTag score={score} />
      </div>

      {/* breakdown */}
      <div className="border-t border-gold/15 px-5 py-4">
        <div className="mb-2.5 text-center font-mono text-[9px] uppercase tracking-[2px] text-dim">Como foi calculado</div>
        <div className="mx-auto flex max-w-[440px] flex-col gap-1">
          {score.lines.map((l, i) => {
            const st = LINE_STYLE[l.kind];
            const val = l.kind === "penalty" ? l.value : l.value >= 0 ? l.value : l.value;
            return (
              <div
                key={l.key}
                className="row-in flex items-center gap-2 rounded-[8px] px-2.5 py-1.5"
                style={
                  {
                    "--i": i + lineBaseDelay * 22, // empilha o delay após o count-up
                    background: l.kind === "mult" ? "rgba(192,97,232,0.08)" : "rgba(255,255,255,0.025)",
                  } as CSSProperties
                }
              >
                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-[#C9C7BD]">{l.label}</span>
                {l.note && (
                  <span className="font-mono text-[12px] font-bold" style={{ color: st.color }}>
                    {l.note}
                  </span>
                )}
                <span className="w-[78px] text-right font-mono text-[13px] font-bold tabular-nums" style={{ color: st.color }}>
                  {val >= 0 ? st.sign : "−"}
                  {fmt(Math.abs(val))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* rodapé: recorde */}
      <div className="flex items-center justify-between border-t border-gold/15 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[1px] text-muted">Seu recorde</span>
        <span className="font-mono text-[16px] font-bold" style={{ color: isNewRecord ? "#e8ce86" : "#cfd3cb" }}>
          {fmt(record)}
        </span>
      </div>
    </div>
  );
}

/** Manchete da zebra: o tempero que dá identidade ao score. */
function ZebraTag({ score }: { score: RunScore }) {
  const { zebraDiff, zebraMult } = score;
  if (zebraDiff >= 2) {
    return (
      <div
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[12px] font-bold uppercase tracking-[1px]"
        style={{ color: "#7fd18a", background: "rgba(127,209,138,0.12)", border: "1px solid rgba(127,209,138,0.45)" }}
      >
        🐴 Zebra! Sua line {score.lineAvg} bateu rivais média {score.oppAvg} · ×{zebraMult.toFixed(2)}
      </div>
    );
  }
  if (zebraDiff <= -2) {
    return (
      <div className="mt-2.5 font-mono text-[11px] tracking-[1px] text-muted">
        Favorito — sua line {score.lineAvg} vs rivais {score.oppAvg}
      </div>
    );
  }
  return (
    <div className="mt-2.5 font-mono text-[11px] tracking-[1px] text-muted">
      Equilíbrio — line {score.lineAvg} vs rivais {score.oppAvg}
    </div>
  );
}
