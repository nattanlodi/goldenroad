import { useState } from "react";
import type { CSSProperties } from "react";
import type { GameMode } from "../types";
import { Logo6x0 } from "../components/Logo6x0";

interface Props {
  poolCount: number;
  onBegin: (mode: GameMode) => void;
  onCodex: () => void;
}

const STEPS = [
  { n: "01", title: "Sorteio", text: "A cada rodada surge a line completa de um time lendário." },
  { n: "02", title: "Escolha", text: "Pegue 1 jogador. Ele ocupa a lane natural — sem repetir." },
  { n: "03", title: "Conquiste", text: "Vença as séries dos playoffs, uma a uma, rumo à taça." },
];

const LEAGUES = ["LCK", "LPL", "LEC", "LMS"];

export function StartScreen({ poolCount, onBegin, onCodex }: Props) {
  const [mode, setMode] = useState<GameMode>("goldenroad");

  // delay escalonado de entrada por bloco
  const rise = (i: number): CSSProperties => ({ animationDelay: `${i * 90}ms` });

  return (
    <div className="start-screen anim-fade m-auto flex w-full max-w-[860px] flex-col items-center text-center">
      {/* ── HERO: logo ── */}
      <div className="start-rise relative" style={rise(0)}>
        <Logo6x0
          className="mx-auto mt-2 block h-auto"
          style={{ width: "clamp(280px,64vw,500px)", filter: "drop-shadow(0 6px 30px rgba(201,162,75,0.32))" }}
        />
      </div>

      <h1
        className="start-rise mt-7 mb-3 font-display font-semibold uppercase tracking-[2px] text-cream"
        style={{ ...rise(1), fontSize: "clamp(20px,4vw,36px)", lineHeight: 1.05 }}
      >
        Monte a line <span className="text-gold-fill">invencível</span>
      </h1>
      <p
        className="start-rise mx-auto mb-[40px] max-w-[620px] text-[clamp(15px,2.1vw,18px)] leading-[1.6] text-[#C2C7D0]"
        style={rise(2)}
      >
        Lines reais dos maiores times da história. Escolha{" "}
        <b className="text-cream">um astro por rodada</b>, preencha as 5 lanes e erga a taça
        com uma campanha <b className="text-cream">perfeita</b>.
      </p>

      {/* ── ESCOLHA DE MODO ── */}
      <div className="start-rise w-full" style={rise(3)}>
        <div className="start-eyebrow">Escolha o modo</div>
        <div className="grid grid-cols-1 gap-4 text-left wide:grid-cols-2">
          {/* GOLDENROAD */}
          <button
            type="button"
            onClick={() => setMode("goldenroad")}
            aria-pressed={mode === "goldenroad"}
            className={`mode-card ${mode === "goldenroad" ? "mode-card-on" : ""}`}
          >
            <div className="mode-card-glow" aria-hidden />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="mode-icon" aria-hidden>
                  🏆
                </span>
                <span
                  className={`font-display text-[20px] font-bold uppercase tracking-[1.5px] ${mode === "goldenroad" ? "text-gold-bright" : "text-cream"}`}
                >
                  GOLDENROAD
                </span>
              </div>
              <span className="mode-badge">Modo carreira</span>
            </div>
            <p className="relative mt-3 text-[13.5px] leading-[1.5] text-[#D0D4CC]">
              Do <b className="text-cream">First Stand</b> ao <b className="text-cream">Worlds</b>, com a
              mesma line. Uma temporada inteira.
            </p>
            <div className="relative mt-3.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[1px] text-gold-bright/90">
              <span className="mode-chip">First Stand</span>
              <span className="mode-arrow">→</span>
              <span className="mode-chip">MSI</span>
              <span className="mode-arrow">→</span>
              <span className="mode-chip">Worlds</span>
            </div>
          </button>

          {/* Só Worlds */}
          <button
            type="button"
            onClick={() => setMode("worlds")}
            aria-pressed={mode === "worlds"}
            className={`mode-card ${mode === "worlds" ? "mode-card-on" : ""}`}
          >
            <div className="mode-card-glow" aria-hidden />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="mode-icon" aria-hidden>
                  ⚔️
                </span>
                <span
                  className={`font-display text-[20px] font-bold uppercase tracking-[1.5px] ${mode === "worlds" ? "text-gold-bright" : "text-cream"}`}
                >
                  Só Worlds
                </span>
              </div>
              <span className="mode-badge">Direto ao ponto</span>
            </div>
            <p className="relative mt-3 text-[13.5px] leading-[1.5] text-[#D0D4CC]">
              Monte sua line com astros do Mundial e vença os playoffs rumo ao{" "}
              <b className="text-cream">6–0</b>.
            </p>
            <div className="relative mt-3.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[1px] text-gold-bright/90">
              <span className="mode-chip">Worlds</span>
              <span className="mode-chip">Playoffs</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── TIMELINE DE COMO JOGA ── */}
      <div className="start-rise mt-[42px] w-full" style={rise(4)}>
        <div className="start-steps">
          {STEPS.map((s, i) => (
            <div key={s.n} className="start-step">
              <div className="start-step-num">{s.n}</div>
              <div>
                <div className="font-display text-[14px] font-bold uppercase tracking-[1.5px] text-gold-bright">
                  {s.title}
                </div>
                <div className="mt-1 text-[13.5px] leading-[1.45] text-[#C9CDD4]">{s.text}</div>
              </div>
              {i < STEPS.length - 1 && <div className="start-step-link" aria-hidden />}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="start-rise mt-[44px] flex flex-wrap items-center justify-center gap-3" style={rise(5)}>
        <button
          onClick={() => onBegin(mode)}
          className="btn-gold cursor-pointer rounded-[12px] border-none px-[48px] py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
        >
          {mode === "goldenroad" ? "Começar carreira" : "Começar campanha"}
        </button>
        <button
          onClick={onCodex}
          className="btn-ghost cursor-pointer rounded-[12px] px-[28px] py-4 font-display text-[15px] font-semibold uppercase tracking-[1px]"
        >
          📖 Almanaque
        </button>
      </div>

      {/* ── RODAPÉ: ligas + pool ── */}
      <div className="start-rise mt-[26px] flex flex-wrap items-center justify-center gap-2.5" style={rise(6)}>
        {LEAGUES.map((l) => (
          <span key={l} className="start-league">
            {l}
          </span>
        ))}
        <span className="ml-1 font-mono text-[12.5px] text-dim-2">{poolCount} campanhas no pool</span>
      </div>
    </div>
  );
}
