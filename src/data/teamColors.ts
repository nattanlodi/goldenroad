// Cor principal de cada organização (chave = `short` do time). Usada pra dar
// identidade visual ao card do RIVAL na tela de jogo (borda, fundo, nome, ano,
// média, ícone de role, seta). As pills de rating seguem coloridas por raridade.
//
// `accent` é a cor da marca (texto/realce). Orgs sem entrada caem no fallback
// neutro (cinza). Adicione novos `short` aqui conforme novos times entrarem.

export interface TeamColor {
  /** cor da marca — usada em texto/realce/borda. */
  accent: string;
}

// Fallback neutro (cinza escuro) pra orgs sem cor mapeada.
export const NEUTRAL_TEAM_COLOR: TeamColor = { accent: "#9aa3b0" };

export const TEAM_COLORS: Record<string, TeamColor> = {
  // ── Coreia (LCK) ──
  T1: { accent: "#e2012d" }, // vermelho T1
  SKT: { accent: "#e2012d" }, // SK Telecom T1 (mesma org)
  GEN: { accent: "#e5b611" }, // amarelo Gen.G
  DK: { accent: "#0066b3" }, // azul DWG KIA
  DWG: { accent: "#0066b3" }, // DAMWON (mesma org)
  DRX: { accent: "#5870e0" }, // azul DRX
  KT: { accent: "#d4001f" }, // vermelho KT Rolster
  HLE: { accent: "#ff7a00" }, // laranja Hanwha Life
  AFS: { accent: "#1c63b8" }, // azul Afreeca
  GRF: { accent: "#16c79a" }, // verde-água Griffin
  ROX: { accent: "#e8a317" }, // dourado ROX Tigers
  KOO: { accent: "#e8a317" }, // KOO Tigers (mesma linhagem)
  LZ: { accent: "#c0392b" }, // Longzhu
  SSW: { accent: "#1f5fbf" }, // Samsung White
  SSB: { accent: "#3a86d4" }, // Samsung Blue
  SSG: { accent: "#1f5fbf" }, // Samsung Galaxy
  NJBS: { accent: "#2c3e50" }, // NaJin Black Sword
  NWS: { accent: "#bdc3c7" }, // NaJin White Shield
  NJS: { accent: "#2c3e50" }, // NaJin Sword
  AzF: { accent: "#2980b9" }, // Azubu Frost

  // ── China (LPL) ──
  FPX: { accent: "#e3000f" }, // vermelho FunPlus Phoenix
  EDG: { accent: "#c8ccd0" }, // branco/prata EDward Gaming
  RNG: { accent: "#d4af37" }, // dourado Royal Never Give Up
  IG: { accent: "#1a1a2e" }, // Invictus (escuro/dourado) -> usa azul-noite
  JDG: { accent: "#c8102e" }, // vermelho JD Gaming
  TES: { accent: "#e10600" }, // vermelho Top Esports
  BLG: { accent: "#1f8fff" }, // azul Bilibili Gaming
  WBG: { accent: "#d11f2d" }, // Weibo Gaming
  LNG: { accent: "#e6322e" }, // LNG Esports
  WE: { accent: "#c0392b" }, // Team WE
  OMG: { accent: "#27ae60" }, // Oh My God
  SN: { accent: "#ff6a00" }, // Suning (laranja)
  AL: { accent: "#b8002e" }, // Anyone's Legend
  RC: { accent: "#d4af37" }, // Royal Club
  SHR: { accent: "#d4af37" }, // Star Horn Royal Club

  // ── Ocidente (LEC / LCS / históricos EU-NA) ──
  FNC: { accent: "#ff5800" }, // laranja Fnatic
  G2: { accent: "#e8eaed" }, // branco/prata G2 (logo P&B; prata p/ contrastar no fundo escuro)
  TSM: { accent: "#c1121f" }, // Team SoloMid
  C9: { accent: "#0090d4" }, // azul Cloud9
  CLG: { accent: "#5b2d8e" }, // CLG (roxo)
  "CLG.EU": { accent: "#5b2d8e" }, // CLG Europe
  MAD: { accent: "#1b9e4b" }, // MAD Lions
  RGE: { accent: "#0e9c4a" }, // Rogue (verde)
  OG: { accent: "#d4001f" }, // Origen
  MSF: { accent: "#e8112d" }, // Misfits
  SPY: { accent: "#2e86c1" }, // Splyce
  H2K: { accent: "#1f3a93" }, // H2K
  GMB: { accent: "#1a1a1a" }, // Gambit
  M5: { accent: "#1a1a1a" }, // Moscow Five
  ANX: { accent: "#34495e" }, // Albus NoX Luna
  NRG: { accent: "#ff0033" }, // NRG
  FLY: { accent: "#0c8a3e" }, // FlyQuest (verde)
  EG: { accent: "#1565c0" }, // Epik/Evil Geniuses azul
  aAa: { accent: "#2c3e50" }, // against All authority

  // ── PCS / Taiwan / Vietnã / Wild ──
  TPA: { accent: "#1b5e20" }, // Taipei Assassins
  FW: { accent: "#e63946" }, // Flash Wolves
  AHQ: { accent: "#111111" }, // ahq (preto/dourado)
  CFO: { accent: "#0a3d62" }, // CTBC Flying Oyster
  GB: { accent: "#8e44ad" }, // Gamania Bears
};

// ── piso de luminância ──────────────────────────────────────────────────
// Cores muito escuras (Moscow Five preto, Gambit, IG, ahq...) somem no fundo
// escuro do app. Garantimos um brilho mínimo: se a luminância da cor for
// abaixo do piso, clareamos (lerp em direção ao branco) até passar do piso —
// preservando o matiz. Cores normais (T1 vermelho, Gen.G amarelo) não mudam.

const MIN_LUM = 0.34; // luminância relativa mínima (0..1)

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
// luminância perceptual (Rec. 709), normalizada 0..1
const lum = (r: number, g: number, b: number) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Clareia a cor (em direção ao branco) só o necessário pra atingir o piso de brilho. */
export function ensureReadable(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const L = lum(r, g, b);
  if (L >= MIN_LUM) return hex;
  // busca o menor t (lerp p/ branco) que atinge o piso — preserva o matiz.
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const t = (lo + hi) / 2;
    const nr = r + (255 - r) * t;
    const ng = g + (255 - g) * t;
    const nb = b + (255 - b) * t;
    if (lum(nr, ng, nb) < MIN_LUM) lo = t;
    else hi = t;
  }
  return rgbToHex(r + (255 - r) * hi, g + (255 - g) * hi, b + (255 - b) * hi);
}

/** Cor da org pelo `short`, com fallback neutro e piso de luminância (legível no escuro). */
export function teamColor(short: string): TeamColor {
  const base = TEAM_COLORS[short] ?? NEUTRAL_TEAM_COLOR;
  return { accent: ensureReadable(base.accent) };
}
