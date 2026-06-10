import { useId } from "react";
import type { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  /** espessura das linhas do "X" (mid lane / rio) */
  strokeWidth?: number;
  /** raio dos pontos (nexus) */
  dotR?: number;
}

/**
 * Logo "6X0": dígitos em Bebas Neue (gradiente dourado) com um X formado pela
 * mid lane (dourada) cruzando o rio (azul) e os pontos dos nexus azul/vermelho.
 */
export function Logo6x0({ className, style, strokeWidth = 10, dotR = 5.4 }: Props) {
  const id = useId();
  const digit: CSSProperties = { fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: "118px" };
  return (
    <svg viewBox="58 -6 224 132" className={className} style={{ display: "block", overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8EBBE" />
          <stop offset="0.58" stopColor="#D8B45A" />
          <stop offset="1" stopColor="#9c7c30" />
        </linearGradient>
      </defs>
      <text x="100" y="116" textAnchor="middle" fill={`url(#${id})`} style={digit}>
        6
      </text>
      <text x="240" y="116" textAnchor="middle" fill={`url(#${id})`} style={digit}>
        0
      </text>
      <line x1="142" y1="48" x2="198" y2="104" stroke="#6aa0da" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="142" y1="104" x2="198" y2="48" stroke={`url(#${id})`} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="142" cy="104" r={dotR} fill="#6aa0da" />
      <circle cx="198" cy="48" r={dotR} fill="#d27a68" />
    </svg>
  );
}
