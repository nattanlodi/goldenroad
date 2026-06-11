import { useId } from "react";
import type { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  /** espessura das linhas do "X" (mid lane / rio) */
  strokeWidth?: number;
  /** "stacked" (GOLDEN em cima, R[0]AD embaixo — hero) ou "inline" (tudo numa linha — topo do draft). */
  layout?: "stacked" | "inline";
  /** aceito por compatibilidade com chamadas antigas — não usado mais. */
  dotR?: number;
}

const FONT = "'Bebas Neue', sans-serif";

/**
 * Logo "GOLDENR0AD": o "0" de R0AD é o símbolo do nexus — um quadrado de cantos
 * arredondados (contorno do mapa do LoL) com um X (mid lane dourada / cruzando o
 * rio azul \). Dois layouts: "stacked" (GOLDEN / R0AD em duas linhas, pra hero) e
 * "inline" (GOLDEN R0AD numa linha só, pro topo do draft).
 */
export function Logo6x0({ className, style, strokeWidth = 11, layout = "stacked" }: Props) {
  const id = useId();
  const word: CSSProperties = { fontFamily: FONT, fontWeight: 400, fontSize: "112px", letterSpacing: "4px" };

  const grad = (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F8EBBE" />
        <stop offset="0.58" stopColor="#D8B45A" />
        <stop offset="1" stopColor="#9c7c30" />
      </linearGradient>
    </defs>
  );

  // glifo nexus (quadrado + X), reusável nos dois layouts.
  const nexus = (sqCx: number, cy: number, half: number, arm: number) => (
    <>
      <rect
        x={sqCx - half}
        y={cy - half}
        width={half * 2}
        height={half * 2}
        rx={half * 0.32}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <line x1={sqCx - arm} y1={cy - arm} x2={sqCx + arm} y2={cy + arm} stroke="#6aa0da" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1={sqCx - arm} y1={cy + arm} x2={sqCx + arm} y2={cy - arm} stroke={`url(#${id})`} strokeWidth={strokeWidth} strokeLinecap="round" />
    </>
  );

  const half = 33;
  const arm = 17;
  const gap = 12;

  if (layout === "inline") {
    // GOLDEN R [nexus] AD — tudo numa linha.
    const base = 96;
    const cy = base - 38;
    const wGoldenR = 414; // largura aprox. de "GOLDEN R"
    const wAD = 104;
    const x0 = 8;
    const goldenREndX = x0 + wGoldenR;
    const sqCx = goldenREndX + gap + half;
    const adX = sqCx + half + gap;
    const VW = adX + wAD + 8;
    return (
      <svg viewBox={`0 0 ${VW} 124`} className={className} style={{ display: "block", overflow: "visible", ...style }}>
        {grad}
        <text x={goldenREndX} y={base} textAnchor="end" fill={`url(#${id})`} style={word}>
          GOLDEN R
        </text>
        {nexus(sqCx, cy, half, arm)}
        <text x={adX} y={base} textAnchor="start" fill={`url(#${id})`} style={word}>
          AD
        </text>
      </svg>
    );
  }

  // stacked: GOLDEN (cima) / R [nexus] AD (baixo)
  const VW = 460;
  const cx = VW / 2;
  const topBase = 96;
  const botBase = 196;
  const cy = botBase - 38;
  const wR = 58;
  const wAD = 104;
  const lineW = wR + gap + half * 2 + gap + wAD;
  const x0 = cx - lineW / 2;
  const rRightX = x0 + wR;
  const sqCx = rRightX + gap + half;
  const adX = sqCx + half + gap;
  return (
    <svg viewBox={`0 0 ${VW} 232`} className={className} style={{ display: "block", overflow: "visible", ...style }}>
      {grad}
      <text x={cx} y={topBase} textAnchor="middle" fill={`url(#${id})`} style={word}>
        GOLDEN
      </text>
      <text x={rRightX} y={botBase} textAnchor="end" fill={`url(#${id})`} style={word}>
        R
      </text>
      {nexus(sqCx, cy, half, arm)}
      <text x={adX} y={botBase} textAnchor="start" fill={`url(#${id})`} style={word}>
        AD
      </text>
    </svg>
  );
}
