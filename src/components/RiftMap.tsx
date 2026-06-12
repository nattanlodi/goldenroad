import type { CSSProperties } from "react";
import type { Lineup, Role } from "../types";
import { ROLES } from "../data/teams";
import { rarityFor, yy } from "../game/helpers";
import { ROLE_SVG, ROLE_TEXT } from "./roleIcons";

interface Props {
  lineup: Lineup;
  showRatings: boolean;
  filledCount: number;
}

// poeira luminosa flutuando dentro da arena (posições/tempos fixos pra não
// recalcular a cada render). Cada uma sobe e some, em loop defasado.
const SPORES = [
  { x: 28, y: 70, r: 0.5, d: 0, dur: 7 },
  { x: 46, y: 60, r: 0.4, d: 1.4, dur: 8.5 },
  { x: 64, y: 78, r: 0.55, d: 2.6, dur: 6.5 },
  { x: 36, y: 44, r: 0.42, d: 3.2, dur: 9 },
  { x: 72, y: 52, r: 0.48, d: 0.8, dur: 7.8 },
  { x: 54, y: 34, r: 0.4, d: 4.1, dur: 8 },
  { x: 22, y: 50, r: 0.45, d: 2, dur: 9.5 },
  { x: 80, y: 38, r: 0.4, d: 5, dur: 7 },
];

// Posições no viewBox 0–100 (espelham o protótipo).
const POS: Record<Role, [number, number]> = {
  TOP: [18.2, 19.3],
  JNG: [30.75, 40.2],
  MID: [50, 51],
  BOT: [71, 84],
  SUP: [85.8, 86.8],
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

/**
 * Círculo do jogador escolhido, TINGIDO pela cor da raridade do over.
 * A moldura, o glow externo, o anel e o brilho do topo seguem `c` (a cor do
 * tier). `c` é a cor base da raridade; derivamos os tons com color-mix pra
 * casar com a identidade de cada tier (azul/roxo/dourado/rubi…).
 */
function circleFilled(c: string): CSSProperties {
  return {
    ...circleBase,
    gap: "2px",
    // topo brilha na cor da raridade, fundo desce pra grafite bem escuro.
    background: `radial-gradient(circle at 50% 20%, color-mix(in srgb, ${c} 42%, transparent), rgba(13,16,21,0.98) 70%)`,
    border: `2px solid ${c}`,
    boxShadow: [
      `0 0 20px color-mix(in srgb, ${c} 45%, transparent)`, // glow externo tingido
      `0 0 0 3px color-mix(in srgb, ${c} 22%, transparent)`, // anel suave
      "0 8px 22px rgba(0,0,0,0.5)",
      `inset 0 2px 9px color-mix(in srgb, ${c} 32%, rgba(255,255,255,0.22))`, // brilho interno
    ].join(", "),
  };
}

// slot vazio: disco escuro translúcido com anel pontilhado suave que respira.
const circleEmpty: CSSProperties = {
  ...circleBase,
  gap: "3px",
  background: "radial-gradient(circle at 50% 30%, rgba(40,48,58,0.55), rgba(18,22,28,0.78))",
  border: "2.5px dashed rgba(201,162,75,0.45)",
  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.35)",
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
      {/* cristal do nexus ao centro do piso — pulsa e gira sutil */}
      <g transform={`translate(${c.x} ${c.y})`}>
        <circle className="rift-nexus-aura" r="3.2" fill={color} opacity="0.18" />
        <rect className="rift-nexus-gem" x="-1.8" y="-1.8" width="3.6" height="3.6" rx="0.5" fill={color} />
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

          {/* ── ENERGIA FLUINDO PELAS LANES ──────────────────────────────────
              pulsos dourados marchando pelo traçado das três lanes (dash que
              corre). Dá a sensação de poder circulando o Rift. */}
          <rect
            className="rift-flow"
            x="15" y="15" width="70" height="70" rx="9"
            fill="none" stroke="rgba(245,221,150,0.55)" strokeWidth="1.6" strokeLinejoin="round"
            pathLength={100} strokeDasharray="9 91" strokeLinecap="round"
          />
          <line
            className="rift-flow rift-flow-mid"
            x1="15" y1="85" x2="85" y2="15"
            stroke="rgba(245,221,150,0.55)" strokeWidth="1.6"
            pathLength={100} strokeDasharray="8 92" strokeLinecap="round"
          />

          {/* poeira luminosa flutuando dentro da arena */}
          {SPORES.map((s, i) => (
            <circle
              key={i}
              className="rift-spore"
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="rgba(232,206,134,0.6)"
              style={{ animationDelay: `${s.d}s`, animationDuration: `${s.dur}s` }}
            />
          ))}

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
          // cor da raridade do over (no especialista o over fica oculto → usa
          // o dourado padrão pra não vazar a informação da nota).
          const skin = f ? rarityFor(f.rating) : null;
          const rarColor = skin && showRatings ? skin.ratingColor : "#e8ce86";
          return (
            <div
              key={r}
              className="absolute z-[2] flex flex-col items-center gap-[5px]"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
            >
              <div className="relative">
                {/* anel de energia girando atrás do círculo pickado, na cor do
                    tier — dá um "aura" viva ao jogador escolhido. */}
                {f && (
                  <span
                    aria-hidden
                    className="lane-aura"
                    style={
                      {
                        "--rar": rarColor,
                      } as CSSProperties
                    }
                  />
                )}
                <div
                  className={f ? "lane-filled lane-live" : "lane-empty"}
                  style={
                    // o JG fica sobre o centro do mapa; deixa o fundo do slot vazio
                    // mais translúcido pra deixar o mapa transparecer por baixo.
                    !f && r === "JNG"
                      ? { ...circleEmpty, background: "radial-gradient(circle at 50% 30%, rgba(40,48,58,0.28), rgba(18,22,28,0.4))" }
                      : f
                        ? circleFilled(rarColor)
                        : circleEmpty
                  }
                >
                {f ? (
                  <>
                    <span
                      className="font-display font-semibold leading-none text-cream"
                      style={{ fontSize: "clamp(12.5px,2.4vw,17px)", padding: "0 3px", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {f.name}
                    </span>
                    {showRatings && (
                      <span
                        className="mt-1 font-mono font-bold leading-none"
                        style={{
                          fontSize: "clamp(20px,3.6vw,26px)",
                          color: rarColor,
                          textShadow: `0 0 9px color-mix(in srgb, ${rarColor} 50%, transparent)`,
                        }}
                      >
                        {f.rating}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {/* ícone da lane grande e sutil + sigla pequena embaixo */}
                    <span
                      aria-hidden
                      className="lane-empty-icon [&>svg]:h-full [&>svg]:w-full"
                      style={{ width: "clamp(26px,5vw,34px)", height: "clamp(26px,5vw,34px)", color: "rgba(232,206,134,0.55)" }}
                      dangerouslySetInnerHTML={{ __html: ROLE_SVG[r] }}
                    />
                    <span
                      className="font-mono text-[10px] font-bold tracking-[1.5px]"
                      style={{ color: "rgba(232,206,134,0.62)" }}
                    >
                      {ROLE_TEXT[r]}
                    </span>
                  </>
                )}
                </div>
              </div>
              {f ? (
                <span
                  className="font-mono text-[10.5px] font-bold tracking-[0.5px]"
                  style={{
                    padding: "2px 9px",
                    borderRadius: "999px",
                    color: rarColor,
                    background: `color-mix(in srgb, ${rarColor} 14%, rgba(18,22,28,0.82))`,
                    border: `1px solid color-mix(in srgb, ${rarColor} 42%, transparent)`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {f.short} '{yy(f.year)}
                </span>
              ) : (
                <span className="min-h-[14px]" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
