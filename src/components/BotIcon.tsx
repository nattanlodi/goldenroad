interface Props {
  /** tamanho (px) do ícone quadrado. */
  size?: number;
  /** cor do traço (padrão: cinza). */
  color?: string;
  className?: string;
}

/**
 * Ícone de ROBÔ (SVG inline) — substitui o emoji 🤖, que renderiza colorido e
 * inconsistente entre sistemas (e era "pintado" pelos gradientes dourados do app).
 * Cinza por padrão, escala por `size`, herda a cor via `color`. Sem peso de CDN.
 */
export function BotIcon({ size = 16, color = "#8a8f98", className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden
    >
      {/* antena */}
      <path d="M12 3v2.2" />
      <circle cx="12" cy="2.2" r="0.9" fill={color} stroke="none" />
      {/* cabeça/corpo */}
      <rect x="4.5" y="5.5" width="15" height="12" rx="2.6" />
      {/* olhos */}
      <circle cx="9" cy="11.2" r="1.25" fill={color} stroke="none" />
      <circle cx="15" cy="11.2" r="1.25" fill={color} stroke="none" />
      {/* orelhas/antenas laterais */}
      <path d="M2.6 10v3M21.4 10v3" />
    </svg>
  );
}
