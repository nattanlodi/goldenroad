import { useState } from "react";
import type { CSSProperties } from "react";
import type { GameMode } from "../types";
import { Logo6x0 } from "../components/Logo6x0";

interface Props {
  poolCount: number;
  onBegin: (mode: GameMode) => void;
}

const RULES = [
  { label: "01 — SORTEIO", text: "A cada rodada surge a line completa de um time do Worlds." },
  { label: "02 — ESCOLHA", text: "Pegue 1 jogador. Ele ocupa a lane natural dele — sem repetir lane." },
  { label: "03 — 3 RESORTEIOS", text: "Não curtiu? Troque por outro time ou outro Worlds do mesmo time." },
];

const cardSelected: CSSProperties = {
  border: "1.5px solid #E8CE86",
  background: "linear-gradient(160deg,rgba(58,48,22,0.5),rgba(32,39,51,0.8))",
  boxShadow: "0 0 0 3px rgba(201,162,75,0.1)",
};
const cardIdle: CSSProperties = {
  border: "1px solid rgba(201,162,75,0.2)",
  background: "linear-gradient(160deg,rgba(40,46,58,0.5),rgba(26,32,42,0.65))",
};

export function StartScreen({ poolCount, onBegin }: Props) {
  const [mode, setMode] = useState<GameMode>("goldenroad");
  return (
    <div className="anim-fade m-auto w-full max-w-[780px] text-center">
      <Logo6x0
        className="mx-auto mt-2 block h-auto"
        style={{ width: "clamp(280px,68vw,520px)", filter: "drop-shadow(0 6px 30px rgba(201,162,75,0.32))" }}
      />

      <h1 className="mt-[18px] mb-2 font-display text-[clamp(22px,4.5vw,38px)] font-semibold uppercase tracking-[1px] text-cream">
        Monte a line invencível
      </h1>
      <p className="mx-auto mb-[38px] max-w-[520px] text-[clamp(15px,2.2vw,18px)] leading-[1.55] text-[#BFC4CD]">
        Você recebe lines reais de times lendários do Worlds. Escolha{" "}
        <b className="text-cream">um jogador por rodada</b> e preencha as 5 lanes. Depois, vença as 6 séries dos
        playoffs <b className="text-cream">uma a uma</b> e erga a taça com um 6–0 perfeito.
      </p>

      {/* seleção de modo de jogo */}
      <div className="mb-[30px]">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[2px] text-muted">Escolha o modo</div>
        <div className="grid grid-cols-1 gap-3.5 text-left wide:grid-cols-2">
          {/* GOLDENROAD — modo carreira (MSI → Worlds), padrão */}
          <button
            type="button"
            onClick={() => setMode("goldenroad")}
            className="relative cursor-pointer overflow-hidden rounded-[16px] p-[20px] text-left transition-all"
            style={mode === "goldenroad" ? cardSelected : cardIdle}
          >
            <div className="flex items-center justify-between">
              <span className={`font-display text-[19px] font-bold uppercase tracking-[1px] ${mode === "goldenroad" ? "text-gold-bright" : "text-cream"}`}>
                GOLDENROAD
              </span>
              {mode === "goldenroad" ? (
                <span className="font-mono text-[12px] text-gold-bright">✓ Selecionado</span>
              ) : (
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[1px] text-gold-bright"
                  style={{ background: "rgba(201,162,75,0.14)", border: "1px solid rgba(201,162,75,0.35)" }}
                >
                  Novo
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13.5px] leading-[1.45] text-[#D7D4CB]">
              Modo carreira: comece pelo <b className="text-cream">MSI</b> (bracket duplo) e siga pro Worlds com a mesma line.
            </p>
          </button>

          {/* Só Worlds — modo direto */}
          <button
            type="button"
            onClick={() => setMode("worlds")}
            className="relative cursor-pointer overflow-hidden rounded-[16px] p-[20px] text-left transition-all"
            style={mode === "worlds" ? cardSelected : cardIdle}
          >
            <div className="flex items-center justify-between">
              <span className={`font-display text-[19px] font-bold uppercase tracking-[1px] ${mode === "worlds" ? "text-gold-bright" : "text-cream"}`}>
                Só Worlds
              </span>
              {mode === "worlds" && <span className="font-mono text-[12px] text-gold-bright">✓ Selecionado</span>}
            </div>
            <p className="mt-1.5 text-[13.5px] leading-[1.45] text-[#D7D4CB]">
              Monte sua line com astros do Mundial e vença os playoffs rumo ao 6–0.
            </p>
          </button>
        </div>
      </div>

      <div className="mb-[38px] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5 text-left">
        {RULES.map((r) => (
          <div
            key={r.label}
            className="rounded-[14px] border border-gold/25 p-[18px]"
            style={{ background: "linear-gradient(180deg,rgba(46,55,70,0.75),rgba(32,39,51,0.75))" }}
          >
            <div className="mb-2 font-mono text-[13px] text-gold-bright">{r.label}</div>
            <div className="text-[14px] leading-[1.45] text-[#D7D4CB]">{r.text}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onBegin(mode)}
        className="btn-gold cursor-pointer rounded-[11px] border-none px-[46px] py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
      >
        {mode === "goldenroad" ? "Começar carreira" : "Começar campanha"}
      </button>
      <div className="mt-[18px] font-mono text-[13px] text-dim-2">
        {poolCount} campanhas no pool · LCK · LPL · LEC · LMS
      </div>
    </div>
  );
}
