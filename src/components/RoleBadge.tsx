import type { Role } from "../types";
import topIcon from "../assets/roles/top.svg";
import jngIcon from "../assets/roles/jng.svg";
import midIcon from "../assets/roles/mid.svg";
import adcIcon from "../assets/roles/adc.svg";
import supIcon from "../assets/roles/sup.svg";

// Ícone (URL do SVG) de cada role. BOT usa o ícone de ADC.
const ROLE_ICON: Record<Role, string> = {
  TOP: topIcon,
  JNG: jngIcon,
  MID: midIcon,
  BOT: adcIcon,
  SUP: supIcon,
};

// Texto exibido na badge. BOT aparece como "ADC".
const ROLE_TEXT: Record<Role, string> = {
  TOP: "TOP",
  JNG: "JNG",
  MID: "MID",
  BOT: "ADC",
  SUP: "SUP",
};

interface Props {
  role: Role;
  /** Estilo da badge: dourada (sua line) ou vermelha (adversário). */
  variant?: "gold" | "red";
  /** Tamanho: define padding, fonte e largura mínima. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Badge da lane: ícone SVG + sigla, em negrito. Os ícones ficam em
 * src/assets/roles/ e são pintados via CSS `mask`, então herdam a cor do texto
 * (a cor do arquivo SVG é ignorada). BOT é rotulado como "ADC".
 */
export function RoleBadge({ role, variant = "gold", size = "md", className = "" }: Props) {
  const icon = ROLE_ICON[role];
  const text = ROLE_TEXT[role];

  const box =
    size === "sm"
      ? "min-w-[44px] gap-[3px] px-[5px] py-[3px] text-[9px]"
      : "min-w-[50px] gap-1 px-[7px] py-1 text-[10px]";
  const iconSize = size === "sm" ? "h-[11px] w-[11px]" : "h-3 w-3";
  const skin =
    variant === "red"
      ? "text-cream"
      : "bg-gold-bright text-ink";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[5px] text-center font-mono font-bold tracking-[1px] ${box} ${skin} ${className}`}
      style={variant === "red" ? { background: "rgba(210,122,104,0.35)" } : undefined}
    >
      <span
        aria-hidden
        className={`${iconSize} shrink-0 bg-current`}
        style={{
          maskImage: `url(${icon})`,
          WebkitMaskImage: `url(${icon})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
      {text}
    </span>
  );
}
