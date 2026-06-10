import type { CSSProperties } from "react";
import type { Lineup, Role } from "../types";
import { ROLES } from "../data/teams";
import { yy } from "../game/helpers";

interface Props {
  lineup: Lineup;
  showRatings: boolean;
  filledCount: number;
}

// Posições no viewBox 0–100 (espelham o protótipo).
const POS: Record<Role, [number, number]> = {
  TOP: [21, 20],
  JNG: [30, 52],
  MID: [50, 50],
  BOT: [84, 85],
  SUP: [71, 84],
};

const circleBase: CSSProperties = {
  width: "clamp(52px,10.2vw,68px)",
  height: "clamp(52px,10.2vw,68px)",
  borderRadius: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const circleFilled: CSSProperties = {
  ...circleBase,
  background: "radial-gradient(circle at 50% 26%, rgba(240,214,140,0.46), rgba(30,38,32,0.96) 76%)",
  border: "2px solid #E8CE86",
  boxShadow:
    "0 0 16px rgba(201,162,75,0.38), 0 0 0 3px rgba(201,162,75,0.16), 0 8px 22px rgba(0,0,0,0.5), inset 0 2px 7px rgba(255,255,255,0.24)",
};

const circleEmpty: CSSProperties = {
  ...circleBase,
  background: "radial-gradient(circle at 50% 28%, rgba(66,80,70,0.62), rgba(20,26,22,0.9))",
  border: "1.5px dashed rgba(201,162,75,0.55)",
  boxShadow: "inset 0 2px 9px rgba(0,0,0,0.45), 0 5px 14px rgba(0,0,0,0.38)",
  animation: "scPulse 2.6s ease-in-out infinite",
};

/** Painel direito do draft: o Summoner's Rift estilizado + bolinhas das lanes. */
export function RiftMap({ lineup, showRatings, filledCount }: Props) {
  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-gold/25 p-[clamp(14px,2.5vw,22px)]"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(48,62,48,0.4), rgba(28,34,45,0.92))" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[3px] text-muted">Summoner's Rift</div>
        <div className="font-mono text-[12px] text-gold-bright">{filledCount}/5 lanes</div>
      </div>

      <div
        className="relative mx-auto mt-1 aspect-square w-full max-w-[660px]"
        style={{ filter: "drop-shadow(0 18px 42px rgba(0,0,0,0.42))" }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="riftFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#26342b" />
              <stop offset="0.55" stopColor="#1e2a24" />
              <stop offset="1" stopColor="#18211d" />
            </linearGradient>
            <radialGradient id="riftGlow" cx="0.5" cy="0.45" r="0.62">
              <stop offset="0" stopColor="rgba(201,162,75,0.16)" />
              <stop offset="0.6" stopColor="rgba(201,162,75,0.04)" />
              <stop offset="1" stopColor="rgba(201,162,75,0)" />
            </radialGradient>
            <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(96,150,210,0.1)" />
              <stop offset="0.5" stopColor="rgba(128,182,232,0.42)" />
              <stop offset="1" stopColor="rgba(96,150,210,0.1)" />
            </linearGradient>
            <pattern id="jungleTex" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <path d="M0,4 q2,-3 4,0 t4,0" fill="none" stroke="rgba(201,162,75,0.055)" strokeWidth="0.5" />
              <path d="M0,7.4 q2,-2.6 4,0 t4,0" fill="none" stroke="rgba(201,162,75,0.04)" strokeWidth="0.45" />
              <circle cx="1.6" cy="2" r="0.45" fill="rgba(201,162,75,0.05)" />
            </pattern>
          </defs>

          <rect x="2.5" y="2.5" width="95" height="95" rx="6" fill="none" stroke="rgba(201,162,75,0.1)" strokeWidth="2.6" />
          <rect x="4" y="4" width="92" height="92" rx="5" fill="url(#riftFill)" stroke="rgba(201,162,75,0.5)" strokeWidth="0.8" />
          <rect x="4" y="4" width="92" height="92" rx="5" fill="url(#jungleTex)" />
          <rect x="4" y="4" width="92" height="92" rx="5" fill="url(#riftGlow)" />

          {/* rio (canto a canto) */}
          <line x1="19" y1="19" x2="81" y2="81" stroke="url(#riverGrad)" strokeWidth="10.5" strokeLinecap="round" />

          {/* leitos opacos pras lanes passarem por cima do rio */}
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="#202c25" strokeWidth="9.5" strokeLinejoin="round" />
          <line x1="15" y1="85" x2="85" y2="15" stroke="#202c25" strokeWidth="9.5" strokeLinecap="round" />

          {/* anel de lanes */}
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="rgba(201,162,75,0.26)" strokeWidth="9.5" strokeLinejoin="round" />
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="rgba(201,162,75,0.34)" strokeWidth="5" />
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="rgba(236,210,140,0.55)" strokeWidth="1.2" />

          {/* mid lane (diagonal) */}
          <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(201,162,75,0.26)" strokeWidth="9.5" strokeLinecap="round" />
          <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(201,162,75,0.34)" strokeWidth="5" strokeLinecap="round" />
          <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(236,210,140,0.55)" strokeWidth="1.2" strokeLinecap="round" />

          {/* covas */}
          <circle cx="36" cy="31" r="3.6" fill="rgba(154,114,201,0.2)" stroke="#9a72c9" strokeWidth="0.7" />
          <circle cx="36" cy="31" r="1.2" fill="#9a72c9" opacity="0.75" />
          <circle cx="64" cy="69" r="3.6" fill="rgba(210,129,74,0.2)" stroke="#d2814a" strokeWidth="0.7" />
          <circle cx="64" cy="69" r="1.2" fill="#d2814a" opacity="0.75" />

          {/* base azul (canto inferior-esquerdo) */}
          <circle cx="12" cy="88" r="9" fill="rgba(96,150,210,0.1)" stroke="rgba(96,150,210,0.32)" strokeWidth="0.5" />
          <circle cx="12" cy="88" r="4.4" fill="rgba(96,150,210,0.24)" stroke="#6096d2" strokeWidth="1.1" />
          <rect x="9.4" y="85.4" width="5.2" height="5.2" transform="rotate(45 12 88)" fill="#6096d2" />

          {/* base vermelha (canto superior-direito) */}
          <circle cx="88" cy="12" r="9" fill="rgba(210,122,104,0.1)" stroke="rgba(210,122,104,0.32)" strokeWidth="0.5" />
          <circle cx="88" cy="12" r="4.4" fill="rgba(210,122,104,0.24)" stroke="#d27a68" strokeWidth="1.1" />
          <rect x="85.4" y="9.4" width="5.2" height="5.2" transform="rotate(45 88 12)" fill="#d27a68" />
        </svg>

        {ROLES.map((r) => {
          const f = lineup[r];
          const [x, y] = POS[r];
          const disp = r === "BOT" ? "ADC" : r;
          return (
            <div
              key={r}
              className="absolute z-[2] flex flex-col items-center gap-[5px]"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
            >
              <div style={f ? circleFilled : circleEmpty}>
                {f ? (
                  <>
                    <span
                      className="font-display font-semibold leading-none text-cream"
                      style={{ fontSize: "clamp(10px,1.9vw,13px)", padding: "0 2px", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {f.name}
                    </span>
                    {showRatings && (
                      <span className="mt-0.5 font-mono text-[9px] font-bold text-gold-bright">{f.rating}</span>
                    )}
                  </>
                ) : (
                  <span className="font-mono text-[11px] tracking-[1px]" style={{ color: "rgba(232,206,134,0.75)" }}>
                    {disp}
                  </span>
                )}
              </div>
              <span className="min-h-[13px] font-mono text-[10px] text-muted">
                {f ? `${f.short} '${yy(f.year)}` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-3.5 text-center font-mono text-[12px] text-dim-2">
        Escolha um jogador à esquerda para preencher uma lane
      </div>
    </div>
  );
}
