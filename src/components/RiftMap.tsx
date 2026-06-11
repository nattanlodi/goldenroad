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
  width: "clamp(64px,12.4vw,84px)",
  height: "clamp(64px,12.4vw,84px)",
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

/**
 * Base de um time: a plataforma do CANTO do mapa, como no jogo — um setor de
 * 90° ancorado no vértice, com a borda interna arredondada virada pro centro.
 * `corner` diz qual canto ocupar; `color` é o acento do nexus (azul/vermelho).
 *   raio do setor = R; o vértice fica no canto da arena (x0,y0).
 */
function Nexus({
  corner,
  color,
}: {
  corner: "bl" | "tr";
  color: string;
}) {
  // lo = recuo a partir da borda da arena (4). Um pouquinho pra DENTRO pra a
  // base ficar por dentro do traçado dourado mais externo, sem cair em cima.
  const lo = 7;
  const R = 27;
  const cr = 5; // raio do canto arredondado (acompanha a curva do mapa)
  const hi = lo + R;
  // os dois pontos onde o arco grande (frente da base) encosta nas bordas
  const a = corner === "bl" ? { x: lo, y: 100 - hi } : { x: 100 - lo, y: hi };
  const b = corner === "bl" ? { x: hi, y: 100 - lo } : { x: 100 - hi, y: lo };
  // pontos onde começa/termina o arredondamento do canto (recuados de cr)
  const b2 = corner === "bl" ? { x: lo + cr, y: 100 - lo } : { x: 100 - lo - cr, y: lo };
  const a2 = corner === "bl" ? { x: lo, y: 100 - lo - cr } : { x: 100 - lo, y: lo + cr };
  const d =
    `M ${a.x} ${a.y}` +
    ` A ${R} ${R} 0 0 1 ${b.x} ${b.y}` + // frente da base (arco grande)
    ` L ${b2.x} ${b2.y}` + // segue a borda até o início do canto
    ` A ${cr} ${cr} 0 0 1 ${a2.x} ${a2.y}` + // canto arredondado (igual à arena)
    ` Z`; // fecha pela borda de volta até a
  // centro aproximado do piso (≈ 0.38·R do vértice na diagonal)
  const off = R * 0.38;
  const c = corner === "bl" ? { x: lo + off, y: 100 - lo - off } : { x: 100 - lo - off, y: lo + off };
  return (
    <g>
      {/* piso da base: SÓLIDO (muralha escura) sobreposto às lanes */}
      <path d={d} fill="#2b3530" />
      {/* cristal do nexus ao centro do piso */}
      <g transform={`translate(${c.x} ${c.y})`}>
        <rect x="-1.8" y="-1.8" width="3.6" height="3.6" rx="0.5" transform="rotate(45)" fill={color} />
        <circle r="0.9" fill="#fff" opacity="0.6" />
      </g>
    </g>
  );
}

/** Painel direito do draft: o Summoner's Rift estilizado + bolinhas das lanes. */
export function RiftMap({ lineup, showRatings, filledCount }: Props) {
  return (
    <div
      className="flex h-full flex-col rounded-2xl border border-gold/25 p-[clamp(14px,2.5vw,22px)] [backdrop-filter:blur(7px)]"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(58,66,78,0.34), rgba(28,34,45,0.8))" }}
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
            {/* degradê do rio em coordenadas do mapa (userSpaceOnUse):
                assim o fill dos covis casa EXATAMENTE com a cor do rio naquele
                ponto, parecendo parte dele. Eixo = mesma diagonal do rio (19→81). */}
            <linearGradient id="riverGradUser" x1="19" y1="19" x2="81" y2="81" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="rgba(96,150,210,0.1)" />
              <stop offset="0.5" stopColor="rgba(128,182,232,0.42)" />
              <stop offset="1" stopColor="rgba(96,150,210,0.1)" />
            </linearGradient>
          </defs>

          <rect x="2.5" y="2.5" width="95" height="95" rx="6" fill="none" stroke="rgba(201,162,75,0.1)" strokeWidth="2.6" />
          <rect x="4" y="4" width="92" height="92" rx="5" fill="url(#riftFill)" stroke="rgba(201,162,75,0.5)" strokeWidth="0.8" />
          <rect className="rift-ambient" x="4" y="4" width="92" height="92" rx="5" fill="url(#riftGlow)" />

          {/* rio (canto a canto). Os covis são bojos do PRÓPRIO rio: meios-círculos
              com o mesmo fill, encostados na linha — um pro lado do Baron (acima),
              outro pro lado do Dragão (abaixo). A base reta cola no leito. */}
          <g fill="url(#riverGradUser)" stroke="none">
            {/* covil do Baron: base na borda superior do rio (centro ~37.15,31.85),
                bojo encostado na água, saltando pro lado de cima. */}
            <path d="M 32.20 26.90 A 7 7 0 0 1 42.10 36.80 Z" />
            {/* covil do Dragão: base na borda inferior do rio (centro ~62.85,68.15). */}
            <path d="M 67.80 73.10 A 7 7 0 0 1 57.90 63.20 Z" />
          </g>
          <line x1="19" y1="19" x2="81" y2="81" stroke="url(#riverGradUser)" strokeWidth="7.5" strokeLinecap="round" />

          {/* leitos opacos pras lanes passarem por cima do rio */}
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="#202c25" strokeWidth="9.5" strokeLinejoin="round" />
          <line x1="15" y1="85" x2="85" y2="15" stroke="#202c25" strokeWidth="9.5" strokeLinecap="round" />

          {/* anel de lanes */}
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="rgba(201,162,75,0.26)" strokeWidth="9.5" strokeLinejoin="round" />
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="rgba(201,162,75,0.34)" strokeWidth="5" />
          <rect x="15" y="15" width="70" height="70" rx="9" fill="none" stroke="rgba(236,210,140,0.3)" strokeWidth="1.2" />

          {/* mid lane (diagonal) */}
          <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(201,162,75,0.26)" strokeWidth="9.5" strokeLinecap="round" />
          <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(201,162,75,0.34)" strokeWidth="5" strokeLinecap="round" />
          <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(236,210,140,0.3)" strokeWidth="1.2" strokeLinecap="round" />

          {/* covil do Baron (roxo, acima do rio) e do Dragão (laranja, abaixo) */}
          <circle cx="38.4" cy="30.6" r="2.1" fill="rgba(154,114,201,0.22)" stroke="#9a72c9" strokeWidth="0.7" />
          <circle className="rift-pit" cx="38.4" cy="30.6" r="1" fill="#9a72c9" />
          <circle cx="61.6" cy="69.4" r="2.1" fill="rgba(210,129,74,0.22)" stroke="#d2814a" strokeWidth="0.7" />
          <circle className="rift-pit rift-pit-dragon" cx="61.6" cy="69.4" r="1" fill="#d2814a" />

          {/* base azul (canto inferior-esquerdo) */}
          <Nexus corner="bl" color="#6096d2" />

          {/* base vermelha (canto superior-direito) */}
          <Nexus corner="tr" color="#d27a68" />
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
                      style={{ fontSize: "clamp(14px,2.7vw,19px)", padding: "0 3px", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {f.name}
                    </span>
                    {showRatings && (
                      <span className="mt-1 font-mono text-[15px] font-bold text-gold-bright">{f.rating}</span>
                    )}
                  </>
                ) : (
                  <span className="font-mono text-[13px] tracking-[1px]" style={{ color: "rgba(232,206,134,0.75)" }}>
                    {disp}
                  </span>
                )}
              </div>
              <span className="min-h-[14px] font-mono text-[11px] text-muted">
                {f ? `${f.short} '${yy(f.year)}` : ""}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
