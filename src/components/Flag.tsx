interface Props {
  /** código ISO 3166-1 alpha-2 minúsculo (ex.: "kr", "br"). */
  cc?: string;
  /** altura da bandeira em px (largura ~1.5x). */
  size?: number;
  className?: string;
}

/**
 * Bandeira do país via flagcdn (SVG sob demanda, sem peso de bundle e renderiza
 * igual em todo navegador — ao contrário do emoji 🇰🇷, que no Windows/Chrome vira "KR").
 * O app já depende de CDN (fontes do Google), então é coerente.
 * Sem `cc`, não renderiza nada (entradas antigas sem país seguem funcionando).
 */
export function Flag({ cc, size = 13, className = "" }: Props) {
  if (!cc) return null;
  const code = cc.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={code.toUpperCase()}
      loading="lazy"
      className={`inline-block shrink-0 rounded-[2px] object-cover ${className}`}
      style={{ height: `${size}px`, width: `${Math.round(size * 1.5)}px`, boxShadow: "0 0 0 1px rgba(0,0,0,0.35)" }}
    />
  );
}
