import type { Role } from "../types";
import { ROLE_SVG, ROLE_TEXT } from "./roleIcons";

interface Props {
  role: Role;
  /** Cor: dourada (sua line), avermelhada (adversário) ou neutra (branco). */
  variant?: "gold" | "red" | "neutral";
  /** Cor explícita (sobrepõe o variant) — ex.: cor da org do rival. */
  color?: string;
  /** Tamanho: define a fonte e o tamanho do ícone. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Badge da lane: ícone da role (SVG inline que herda a cor do texto via
 * currentColor) + a sigla em negrito ao lado. Sem fundo nem caixa. BOT vira "ADC".
 */
export function RoleBadge({ role, variant = "gold", color, size = "md", className = "" }: Props) {
  const svg = ROLE_SVG[role];
  const text = ROLE_TEXT[role];

  const isSm = size === "sm";
  const box = isSm ? "min-w-[48px] gap-[4px] text-[9px]" : "min-w-[54px] gap-[5px] text-[10px]";
  const iconSize = isSm ? "h-[15px] w-[15px]" : "h-[17px] w-[17px]";
  // cor explícita sobrepõe o variant (usa style inline); senão, classe utilitária.
  const colorClass = color ? "" : variant === "red" ? "text-red-soft" : variant === "neutral" ? "text-cream" : "text-gold-bright";

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-[1px] ${box} ${colorClass} ${className}`}
      style={color ? { color } : undefined}
    >
      <span
        aria-hidden
        className={`${iconSize} shrink-0 [&>svg]:h-full [&>svg]:w-full`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {text}
    </span>
  );
}
