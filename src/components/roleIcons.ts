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

// SVG (string) de cada role, pronto pra injetar inline. BOT usa o ícone de ADC.
export const ROLE_SVG: Record<Role, string> = {
  TOP: prep(topRaw),
  JNG: prep(jngRaw),
  MID: prep(midRaw),
  BOT: prep(adcRaw),
  SUP: prep(supRaw),
};

// Texto exibido pra cada role. BOT aparece como "ADC".
export const ROLE_TEXT: Record<Role, string> = {
  TOP: "TOP",
  JNG: "JNG",
  MID: "MID",
  BOT: "ADC",
  SUP: "SUP",
};
