import { useId } from "react";
import type { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  /** espessura das linhas do "X" (mid lane / rio) */
  strokeWidth?: number;
  /** cor sólida que substitui o gradiente dourado (ex.: escuro sobre fundo dourado). */
  fill?: string;
  /** aceitos por compatibilidade com chamadas antigas — não usados mais. */
  layout?: "stacked" | "inline";
  dotR?: number;
}

const FONT = "'Bebas Neue', sans-serif";

/**
 * Logo "GOLDENR0AD": wordmark único numa linha. O "0" de R0AD é o símbolo do
 * nexus — um quadrado de cantos arredondados (contorno do mapa do LoL) com um X
 * (mid lane dourada / rio azul \). Gradiente dourado por padrão (ou cor sólida
 * via `fill`). Versão única — sem layout empilhado.
 */
export function Logo6x0({ className, style, strokeWidth = 11, fill }: Props) {
  const id = useId();
  const word: CSSProperties = { fontFamily: FONT, fontWeight: 400, fontSize: "112px", letterSpacing: "4px" };

  // cor da marca: gradiente dourado por padrão, ou uma cor sólida (ex.: escuro).
  const ink = fill ?? `url(#${id})`;
  const river = fill ?? "#6aa0da"; // o "\" do nexus (rio azul) também escurece quando fill é setado

  const grad = fill ? null : (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F8EBBE" />
        <stop offset="0.58" stopColor="#D8B45A" />
        <stop offset="1" stopColor="#9c7c30" />
      </linearGradient>
    </defs>
  );

  // glifo nexus (quadrado + X) no lugar do "0".
  const nexus = (sqCx: number, cy: number, half: number, arm: number) => (
    <>
      <rect
        x={sqCx - half}
        y={cy - half}
        width={half * 2}
        height={half * 2}
        rx={half * 0.32}
        fill="none"
        stroke={ink}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <line x1={sqCx - arm} y1={cy - arm} x2={sqCx + arm} y2={cy + arm} stroke={river} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1={sqCx - arm} y1={cy + arm} x2={sqCx + arm} y2={cy - arm} stroke={ink} strokeWidth={strokeWidth} strokeLinecap="round" />
    </>
  );

  const half = 33;
  const arm = 17;
  const gap = 6;

  // GOLDENR [nexus] AD — tudo numa linha, sem o espaço entre GOLDEN e R.
  const base = 96;
  const cy = base - 38;
  const wGoldenR = 372; // largura aprox. de "GOLDENR" (sem espaço de palavra)
  const wAD = 104;
  const x0 = 8;
  const goldenREndX = x0 + wGoldenR;
  const sqCx = goldenREndX + gap + half;
  const adX = sqCx + half + gap;
  const VW = adX + wAD + 8;
  return (
    <svg viewBox={`0 0 ${VW} 124`} className={className} style={{ display: "block", overflow: "visible", ...style }}>
      {grad}
      <text x={goldenREndX} y={base} textAnchor="end" fill={ink} style={word}>
        GOLDENR
      </text>
      {nexus(sqCx, cy, half, arm)}
      <text x={adX} y={base} textAnchor="start" fill={ink} style={word}>
        AD
      </text>
    </svg>
  );
}
