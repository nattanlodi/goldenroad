import type { Role } from "../types";
import topRaw from "../assets/roles/top.svg?raw";
import jngRaw from "../assets/roles/jungle.svg?raw";
import midRaw from "../assets/roles/mid.svg?raw";
import adcRaw from "../assets/roles/adcarry.svg?raw";
import supRaw from "../assets/roles/support.svg?raw";

// SVG inline da role. Trocamos a cor fixa do arquivo por currentColor pra que o
// ícone herde a cor do texto, e tiramos width/height fixos pra escalar pelo CSS.
function prep(raw: string): string {
  return raw
    .replace(/fill="#[0-9a-fA-F]{3,8}"/g, 'fill="currentColor"')
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .replace(/\s(width|height)="[^"]*"/g, "");
}

// BOT usa o ícone de ADC.
const ROLE_SVG: Record<Role, string> = {
  TOP: prep(topRaw),
  JNG: prep(jngRaw),
  MID: prep(midRaw),
  BOT: prep(adcRaw),
  SUP: prep(supRaw),
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
  /** Cor: dourada (sua line), avermelhada (adversário) ou neutra (branco). */
  variant?: "gold" | "red" | "neutral";
  /** Tamanho: define a fonte e o tamanho do ícone. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Badge da lane: ícone da role (SVG inline que herda a cor do texto via
 * currentColor) + a sigla em negrito ao lado. Sem fundo nem caixa. BOT vira "ADC".
 */
export function RoleBadge({ role, variant = "gold", size = "md", className = "" }: Props) {
  const svg = ROLE_SVG[role];
  const text = ROLE_TEXT[role];

  const isSm = size === "sm";
  const box = isSm ? "min-w-[48px] gap-[4px] text-[9px]" : "min-w-[54px] gap-[5px] text-[10px]";
  const iconSize = isSm ? "h-[15px] w-[15px]" : "h-[17px] w-[17px]";
  const color = variant === "red" ? "text-red-soft" : variant === "neutral" ? "text-cream" : "text-gold-bright";

  return (
    <span className={`inline-flex items-center font-mono font-bold tracking-[1px] ${box} ${color} ${className}`}>
      <span
        aria-hidden
        className={`${iconSize} shrink-0 [&>svg]:h-full [&>svg]:w-full`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {text}
    </span>
  );
}
