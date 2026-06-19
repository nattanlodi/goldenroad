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
  /** No MOBILE mostra só o ícone (esconde a sigla) e encolhe a caixa — usado onde
   * o espaço é apertado (lines lado a lado no bracket). No desktop, normal. */
  compactMobile?: boolean;
  /** Espelha o badge (sigla → ícone), pra casar com lines do lado DIREITO que
   * usam flex-row-reverse — mantém o ícone "do lado de fora" simetricamente. */
  reverse?: boolean;
  className?: string;
}

/**
 * Badge da lane: ícone da role (SVG inline que herda a cor do texto via
 * currentColor) + a sigla em negrito ao lado. Sem fundo nem caixa. BOT vira "ADC".
 */
export function RoleBadge({ role, variant = "gold", color, size = "md", compactMobile = false, reverse = false, className = "" }: Props) {
  const svg = ROLE_SVG[role];
  const text = ROLE_TEXT[role];

  const isSm = size === "sm";
  // compactMobile: sem min-width largo nem gap no mobile (só o ícone); no desktop volta ao normal.
  const box = compactMobile
    ? (isSm ? "gap-0 wide:min-w-[48px] wide:gap-[4px] text-[9px]" : "gap-0 wide:min-w-[54px] wide:gap-[5px] text-[10px]")
    : (isSm ? "min-w-[48px] gap-[4px] text-[9px]" : "min-w-[54px] gap-[5px] text-[10px]");
  const iconSize = isSm ? "h-[15px] w-[15px]" : "h-[17px] w-[17px]";
  // cor explícita sobrepõe o variant (usa style inline); senão, classe utilitária.
  const colorClass = color ? "" : variant === "red" ? "text-red-soft" : variant === "neutral" ? "text-cream" : "text-gold-bright";

  const icon = (
    <span
      aria-hidden
      className={`${iconSize} shrink-0 [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
  // sigla: escondida no mobile quando compactMobile (só o ícone fica).
  const label = <span className={compactMobile ? "hidden wide:inline" : undefined}>{text}</span>;

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-[1px] ${reverse ? "wide:flex-row-reverse wide:justify-end" : ""} ${box} ${colorClass} ${className}`}
      style={color ? { color } : undefined}
    >
      {icon}
      {label}
    </span>
  );
}
