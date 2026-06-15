// ============================================================
// PONTUAÇÃO DE RUN (score arcade)
// ============================================================
// A "nota da line" premia MONTAR bem. O SCORE premia JOGAR bem a run inteira:
// ir longe, dominar (sweeps/pentas) e — o tempero principal — VENCER SENDO ZEBRA.
// Uma line 86 que atropela rivais mais fortes pontua mais que uma line 99 tranquila.
//
// Filosofia (decisões travadas com o usuário):
//  - FATOR ZEBRA FORTE: o multiplicador de "underdog" pesa muito.
//  - TODA RUN PONTUA: mesmo eliminado você leva o score acumulado até onde chegou.
//  - Usa a nota BASE da line (real, sem buffs de carta) pra medir a zebra.
//
// A fórmula é transparente e fácil de calibrar — todos os pesos ficam em SCORE_CFG.

import type { CampaignEnd, CareerStage, Difficulty, GameMode, LineupPlayer, PlayedSeries } from "../types";

/** Pesos da pontuação — mexa aqui pra recalibrar tudo. */
export const SCORE_CFG = {
  // pontos-base por série VENCIDA, conforme a fase (ir longe vale mais).
  perStage: {
    swiss: 100,
    quarter: 320,
    semi: 560,
    final: 900,
  } as Record<string, number>,
  // bônus por CAMPEONATO conquistado (First Stand < MSI < Worlds).
  champBonus: {
    first_stand: 600,
    msi: 1100,
    worlds: 2200,
  } as Record<CareerStage, number>,
  perfectBonus: 2500, // run invicta (campeão sem perder NENHUMA série)

  sweepBonus: 140, // série fechada sem perder jogo (Bo5 3-0 / Bo3 2-0)
  gameLostPenalty: 45, // cada jogo perdido desconta (premia domínio — vencer limpo importa)

  pentaBonus: 130, // cada pentakill SEU
  seriesMvpBonus: 90, // cada série vencida em que um SEU foi MVP

  // ── FATOR ZEBRA (forte) ──
  // diff = média dos rivais enfrentados − nota base da sua line.
  // multiplicador aplicado ao SUBTOTAL (progresso+domínio+destaques):
  //   mult = 1 + max(0, diff) * zebraGain   (só bônus quando você é o mais fraco)
  //   + um floor pra quem joga com line MAIS forte não ser punido (mult>=minMult).
  zebraGain: 0.16, // +16% de score por ponto de overall que sua line está ABAIXO dos rivais
  zebraCap: 3.2, // teto do multiplicador de zebra (evita explodir)
  favoredFloor: 0.7, // line muito mais forte que os rivais: piso do multiplicador

  // multiplicadores finais.
  diffMult: { classico: 1, especialista: 1.3 } as Record<Difficulty, number>,
  modeMult: { worlds: 1, goldenroad: 1.5 } as Record<GameMode, number>,
} as const;

export interface ScoreLine {
  key: string;
  label: string;
  value: number; // pontos somados nesta linha (pode ser negativo)
  kind: "base" | "bonus" | "penalty" | "mult"; // pro estilo na UI
  /** texto auxiliar (ex.: "×1.84" pra linhas de multiplicador). */
  note?: string;
}

export interface RunScore {
  total: number;
  /** quebra do cálculo, na ordem de exibição (pro breakdown animado). */
  lines: ScoreLine[];
  /** nota base média da sua line (real). */
  lineAvg: number;
  /** média dos rivais que você ENFRENTOU na run. */
  oppAvg: number;
  /** diferença (oppAvg − lineAvg): positivo = você foi a zebra. */
  zebraDiff: number;
  /** multiplicador de zebra aplicado. */
  zebraMult: number;
}

const round = (n: number) => Math.round(n);

/**
 * Calcula a pontuação de uma run a partir do que já vive no estado:
 *  - history: todas as séries disputadas (com placar, fase e campeonato)
 *  - pentakills/seriesMvpsYou: contados dos campaignGames (ver useGame)
 *  - lineup: pra nota base da line (zebra)
 *  - mode/difficulty/finished: multiplicadores + bônus de título/perfeito
 */
export function computeRunScore(args: {
  history: PlayedSeries[];
  lineup: LineupPlayer[];
  pentakillsYou: number;
  seriesMvpWins: number; // nº de séries vencidas em que um jogador SEU foi MVP
  mode: GameMode;
  difficulty: Difficulty;
  finished: CampaignEnd | null;
}): RunScore {
  const { history, lineup, pentakillsYou, seriesMvpWins, mode, difficulty, finished } = args;
  const cfg = SCORE_CFG;
  const lines: ScoreLine[] = [];

  // nota base média da line (real, sem buffs).
  const lineAvg = lineup.length ? lineup.reduce((a, p) => a + p.baseRating, 0) / lineup.length : 0;

  // média dos rivais enfrentados (todas as séries, vencidas ou não).
  const oppAvg = history.length ? history.reduce((a, h) => a + h.opp.avg, 0) / history.length : 0;

  // ── progresso: pontos por série vencida, conforme a fase ──
  let progresso = 0;
  const wonByStage: Record<string, number> = {};
  for (const h of history) {
    if (!h.won) continue;
    const pts = cfg.perStage[h.stageKey] ?? 0;
    progresso += pts;
    wonByStage[h.stageKey] = (wonByStage[h.stageKey] ?? 0) + 1;
  }
  if (progresso > 0) {
    const wins = history.filter((h) => h.won).length;
    lines.push({ key: "progress", label: `Progresso · ${wins} série${wins === 1 ? "" : "s"} vencida${wins === 1 ? "" : "s"}`, value: round(progresso), kind: "base" });
  }

  // ── bônus de campeonatos conquistados ──
  // você só avança de campeonato sendo campeão; o ÚLTIMO grupo é campeão só se finished==="champion".
  const champStages = championshipsWon(history, finished);
  for (const stage of champStages) {
    const b = cfg.champBonus[stage];
    lines.push({ key: `champ-${stage}`, label: `${CHAMP_LABEL[stage]} conquistado`, value: b, kind: "bonus" });
  }

  // ── domínio: sweeps somam, jogos perdidos descontam ──
  let sweeps = 0;
  let gamesLost = 0;
  for (const h of history) {
    if (h.won && h.oppGames === 0 && h.yourGames >= 2) sweeps++; // 2-0 / 3-0 (Bo1 não conta como sweep)
    gamesLost += h.oppGames;
  }
  if (sweeps > 0) lines.push({ key: "sweeps", label: `Domínio · ${sweeps} série${sweeps === 1 ? "" : "s"} sem perder jogo`, value: sweeps * cfg.sweepBonus, kind: "bonus" });
  if (gamesLost > 0) lines.push({ key: "gameslost", label: `${gamesLost} jogo${gamesLost === 1 ? "" : "s"} perdido${gamesLost === 1 ? "" : "s"}`, value: -gamesLost * cfg.gameLostPenalty, kind: "penalty" });

  // ── destaques: pentakills seus + séries com MVP seu ──
  if (pentakillsYou > 0) lines.push({ key: "pentas", label: `${pentakillsYou} pentakill${pentakillsYou === 1 ? "" : "s"}`, value: pentakillsYou * cfg.pentaBonus, kind: "bonus" });
  if (seriesMvpWins > 0) lines.push({ key: "mvps", label: `${seriesMvpWins} MVP de série`, value: seriesMvpWins * cfg.seriesMvpBonus, kind: "bonus" });

  // ── bônus de run perfeita (invicta) ──
  const perfect = finished === "champion" && history.every((h) => h.won);
  if (perfect) lines.push({ key: "perfect", label: "Campanha invicta — sem derrotas!", value: cfg.perfectBonus, kind: "bonus" });

  // subtotal antes dos multiplicadores.
  const subtotal = lines.reduce((a, l) => a + l.value, 0);

  // ── fator zebra (forte): line mais fraca que os rivais multiplica o subtotal ──
  const zebraDiff = oppAvg - lineAvg;
  let zebraMult: number;
  if (zebraDiff >= 0) {
    zebraMult = Math.min(cfg.zebraCap, 1 + zebraDiff * cfg.zebraGain);
  } else {
    // line MAIS forte que os rivais: desconto suave, com piso (não zera o esforço).
    zebraMult = Math.max(cfg.favoredFloor, 1 + zebraDiff * cfg.zebraGain * 0.5);
  }

  const diffMult = cfg.diffMult[difficulty] ?? 1;
  const modeMult = cfg.modeMult[mode] ?? 1;
  const totalMult = zebraMult * diffMult * modeMult;

  // linhas de multiplicador (só aparecem se != 1, pra não poluir).
  if (Math.abs(zebraMult - 1) > 0.001) {
    const label =
      zebraDiff >= 1.5 ? `Zebra! Sua line (${round(lineAvg)}) < rivais (${round(oppAvg)})`
      : zebraDiff <= -1.5 ? `Favorito · line (${round(lineAvg)}) > rivais (${round(oppAvg)})`
      : "Equilíbrio de forças";
    lines.push({ key: "zebra", label, value: round(subtotal * (zebraMult - 1)), kind: "mult", note: `×${zebraMult.toFixed(2)}` });
  }
  if (diffMult !== 1) lines.push({ key: "diff", label: "Modo Especialista", value: round(subtotal * zebraMult * (diffMult - 1)), kind: "mult", note: `×${diffMult.toFixed(1)}` });
  if (modeMult !== 1) lines.push({ key: "mode", label: "Carreira GOLDENROAD", value: round(subtotal * zebraMult * diffMult * (modeMult - 1)), kind: "mult", note: `×${modeMult.toFixed(1)}` });

  const total = Math.max(0, round(subtotal * totalMult));

  return { total, lines, lineAvg: round(lineAvg), oppAvg: round(oppAvg), zebraDiff: round(zebraDiff), zebraMult };
}

const CHAMP_LABEL: Record<CareerStage, string> = {
  first_stand: "First Stand",
  msi: "MSI",
  worlds: "Mundial",
};

/** Quais campeonatos a run conquistou (mesma lógica do ResultScreen). */
function championshipsWon(history: PlayedSeries[], finished: CampaignEnd | null): CareerStage[] {
  const order: CareerStage[] = [];
  const seen = new Set<CareerStage>();
  for (const h of history) {
    if (!seen.has(h.championship)) {
      seen.add(h.championship);
      order.push(h.championship);
    }
  }
  // todos menos o último foram vencidos (só se avança sendo campeão);
  // o último só conta como vencido se a run terminou em título.
  return order.filter((_, idx) => (idx < order.length - 1 ? true : finished === "champion"));
}
