import { useEffect, type CSSProperties } from "react";
import type { Game } from "../game/useGame";
import type { LiveGame, Role, Side } from "../types";
import { lineupPicks, rarityFor, yy } from "../game/helpers";
import { effLineScore, effOpp, effOppAvg, effYou } from "../game/effects";
import { MSI_BRACKET } from "../game/msi";
import { FS_BRACKET } from "../game/firstStand";
import { teamColor } from "../data/teamColors";
import { EventCardOverlay } from "../components/EventCardOverlay";
import type { FsNode, MsiNode } from "../types";
import { Flag } from "../components/Flag";
import { RoleBadge } from "../components/RoleBadge";
import { ROLE_SVG } from "../components/roleIcons";

// nós do bracket do MSI em ordem de exibição (upper em cima, lower embaixo).
const MSI_UPPER: MsiNode[] = ["UR1", "UR2", "UF"];
const MSI_LOWER: MsiNode[] = ["LR1", "LR2", "LR3", "LF"];
const MSI_SHORT: Record<MsiNode, string> = {
  UR1: "UR1",
  UR2: "UR2",
  UF: "UF",
  LR1: "LR1",
  LR2: "LR2",
  LR3: "LR3",
  LF: "LF",
  GF: "GF",
};

interface SeriesBlock {
  seriesIndex: number;
  games: LiveGame[];
}

/** Agrupa as partidas por série (mantém ordem cronológica dentro do bloco);
 *  retorna os blocos com o mais RECENTE primeiro (pro histórico de cima pra baixo). */
function groupSeries(games: LiveGame[]): SeriesBlock[] {
  const blocks: SeriesBlock[] = [];
  for (const g of games) {
    const idx = g.seriesIndex ?? 0;
    const last = blocks[blocks.length - 1];
    if (last && last.seriesIndex === idx) last.games.push(g);
    else blocks.push({ seriesIndex: idx, games: [g] });
  }
  return blocks.reverse();
}

/** Título + subtítulo do cabeçalho de um bloco de série. */
function seriesHeader(blk: SeriesBlock): { title: string; sub: string } {
  const g = blk.games[0];
  const stage = g.stageLabel ?? "Série";
  const opp = g.oppShort ? `vs ${g.oppShort}${g.oppYear ? ` '${yy(g.oppYear)}` : ""}` : "";
  if (g.swissRound) {
    return { title: `Fase Suíça · Rodada ${g.swissRound}`, sub: [g.format, opp].filter(Boolean).join(" · ") };
  }
  return { title: stage, sub: [g.format, opp].filter(Boolean).join(" · ") };
}

/**
 * MVP da série de um bloco (só Bo3/Bo5): mesma regra do motor — quem foi MVP de
 * mais partidas; desempate por overall + pentakills. Calculado a partir dos jogos
 * do bloco. Retorna null em Bo1 (não há "MVP da série" num jogo único).
 */
function seriesMvp(blk: SeriesBlock): { role: Role; name: string; country?: string; side: Side } | null {
  if (blk.games.length < 2) return null; // Bo1 → sem MVP de série
  // só após a série ACABAR: alguém precisa ter atingido o nº de vitórias do formato.
  const target = blk.games[0].format === "Bo5" ? 3 : blk.games[0].format === "Bo3" ? 2 : 1;
  const yourW = blk.games.filter((g) => g.youWon).length;
  const oppW = blk.games.length - yourW;
  if (yourW < target && oppW < target) return null; // série ainda em andamento
  const won = yourW > oppW;
  const winnerSide: Side = won ? "you" : "opp";
  // candidatos = MVPs de partida do lado vencedor da série
  const cand = blk.games.map((g) => g.mvp).filter((m): m is NonNullable<typeof m> => !!m && m.side === winnerSide);
  if (!cand.length) return null;
  const mvpCount = (role: Role) => cand.filter((m) => m.role === role).length;
  const pentaCount = (role: Role) =>
    blk.games.reduce((a, g) => a + g.pentakills.filter((k) => k.side === winnerSide && k.role === role).length, 0);
  const ratingOf = (role: Role) => cand.find((m) => m.role === role)?.rating ?? 0;
  const tie = (role: Role) => ratingOf(role) + 3 * pentaCount(role);
  const best = cand.reduce((b, m) => {
    const c = mvpCount(m.role);
    const cb = mvpCount(b.role);
    if (c !== cb) return c > cb ? m : b;
    return tie(m.role) > tie(b.role) ? m : b;
  }, cand[0]);
  return { role: best.role, name: best.name, country: best.country, side: best.side };
}

/** Só o ícone da lane (sem texto), herda a cor via currentColor. */
function LaneIcon({ role, className = "h-[15px] w-[15px]" }: { role: Role; className?: string }) {
  return (
    <span
      aria-hidden
      className={`${className} inline-block shrink-0 [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: ROLE_SVG[role] }}
    />
  );
}

/** Badge compacto de destaque: ícone da lane · bandeira · nome. */
function HighlightName({ role, name, country, side }: { role: Role; name: string; country?: string; side: Side }) {
  const color = side === "you" ? "text-gold-bright" : "text-red-soft";
  return (
    <span className="flex items-center gap-1.5">
      <LaneIcon role={role} className={`h-[14px] w-[14px] ${color}`} />
      <Flag cc={country} size={11} />
      <span className={`font-display text-[14px] font-bold ${color}`}>{name}</span>
    </span>
  );
}

/** Uma linha da tabela de line: lane · bandeira · nome · pill de rating (cor por raridade). */
function LineRow({
  role,
  name,
  country,
  rating,
  side,
  showRatings,
  wins,
  oppColor,
  form,
  delta,
}: {
  role: Role;
  name: string;
  country?: string;
  rating: number;
  side: Side;
  showRatings: boolean;
  /** true = essa lane vence (overall ≥ adversário); marca a linha com realce. */
  wins?: boolean;
  /** cor da org do rival (só no lado "opp") — pinta o cromático da linha. */
  oppColor?: string;
  /** forma do dia desse jogador (🔥 fogo / 🧊 gelado). */
  form?: "fogo" | "gelado";
  /** delta de overall por efeito (carta/forma) — mostra selo +/− na badge. */
  delta?: number;
}) {
  const you = side === "you";
  const mod = delta ?? 0;
  // cor do realce do rival: cor da org (se houver) ou o coral padrão.
  const oc = oppColor ?? "rgb(210,122,104)";
  const skin = rarityFor(rating);
  // seta de vantagem: aparece só em quem vence a lane, apontando pro centro (› na sua line, ‹ no rival).
  const arrow = showRatings && wins ? (
    <span className="font-mono text-[15px] font-bold leading-none" style={{ color: "#7fd18a" }}>
      {you ? "›" : "‹"}
    </span>
  ) : (
    <span className="w-[7px]" aria-hidden />
  );
  // pill de overall: fundo transparente tingido pela cor da raridade. Quando há
  // delta por efeito (carta/forma), ganha um selo +/− no canto (verde sobe, vermelho desce).
  const pill = showRatings && (
    <span
      className="relative inline-flex min-w-[30px] items-center justify-center rounded-[7px] px-[6px] py-[4px] text-center font-mono text-[16px] font-black leading-none tabular-nums sm:min-w-[34px] sm:px-[7px] sm:py-[6px] sm:text-[17px]"
      style={{
        color: skin.ratingColor,
        background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`,
        border: `1px solid ${mod !== 0 ? (mod > 0 ? "rgba(127,209,138,0.7)" : "rgba(230,144,128,0.7)") : `color-mix(in srgb, ${skin.ratingColor} 38%, transparent)`}`,
      }}
    >
      {rating}
      {mod !== 0 && (
        <span
          className="absolute -right-2 -top-2 inline-flex items-center justify-center rounded-full px-1 py-[1px] font-mono text-[9px] font-black leading-none"
          style={
            mod > 0
              ? { color: "#0f1a12", background: "#7fd18a", boxShadow: "0 0 7px rgba(127,209,138,0.65)" }
              : { color: "#241010", background: "#e69080", boxShadow: "0 0 7px rgba(230,144,128,0.65)" }
          }
        >
          {mod > 0 ? `+${mod}` : mod}
        </span>
      )}
    </span>
  );
  const badge = <RoleBadge role={role} variant={you ? "gold" : "red"} color={you ? undefined : oc} size="sm" />;
  // chip de forma do dia (🔥 fogo / 🧊 gelado).
  const formChip = form && (
    <span
      title={form === "fogo" ? "Em chamas (+3 nesta série)" : "Gelado (−3 nesta série)"}
      className="shrink-0 text-[14px] leading-none"
      style={form === "fogo" ? { filter: "drop-shadow(0 0 6px rgba(255,120,60,0.7))" } : { filter: "drop-shadow(0 0 6px rgba(120,180,255,0.7))" }}
    >
      {form === "fogo" ? "🔥" : "🧊"}
    </span>
  );
  // bloco bandeira+nome — espelhado no rival (nome à esquerda, bandeira à direita).
  const ident = (
    <span className={`flex min-w-0 flex-1 items-center gap-2 sm:gap-3 ${you ? "" : "flex-row-reverse text-right"}`}>
      <Flag cc={country} size={15} />
      <span className={`truncate font-display text-[16px] font-semibold sm:text-[18px] ${you ? "text-cream" : "text-[#E7E0D6]"}`}>
        {name}
      </span>
      {formChip}
    </span>
  );
  return (
    <div
      className="group/row relative flex items-center gap-2 rounded-[10px] px-2 py-1 transition-all sm:gap-2.5 sm:px-2.5 sm:py-2"
      style={{
        background: you
          ? "linear-gradient(100deg,rgba(42,44,48,0.62),rgba(30,31,34,0.5))"
          : `linear-gradient(100deg, color-mix(in srgb, ${oc} 14%, rgba(28,24,26,0.6)), rgba(28,24,26,0.5))`,
        border: `1px solid ${you ? "rgba(201,162,75,0.14)" : `color-mix(in srgb, ${oc} 26%, transparent)`}`,
      }}
    >
      {you ? (
        // sua line: lane · [bandeira nome] · pill · seta (interna = direita)
        <>
          {badge}
          {ident}
          {pill}
          {arrow}
        </>
      ) : (
        // rival (espelhado): seta (interna = esquerda) · pill · [nome bandeira] · lane
        <>
          {arrow}
          {pill}
          {ident}
          {badge}
        </>
      )}
    </div>
  );
}

// ordem linear do caminho (pra saber o que já foi "passado" no destaque visual).
const MSI_PATH_ORDER: MsiNode[] = ["UR1", "UR2", "UF", "LR1", "LR2", "LR3", "LF", "GF"];

/** Cabeçalho do bracket do MSI: só a linha do lado atual (upper OU lower) + a GF no final. Label fora do card. */
function MsiBracketHeader({ node, format }: { node: MsiNode; format?: string }) {
  const side = MSI_BRACKET[node].side;
  const curIdx = MSI_PATH_ORDER.indexOf(node);
  // se ainda está no upper (e não na GF), mostra a trilha upper; senão, a lower.
  const isGF = node === "GF";
  const lane = side === "upper" && !isGF ? MSI_UPPER : MSI_LOWER;
  const laneLabel = side === "upper" && !isGF ? "Upper" : "Lower";
  const chip = (n: MsiNode) => {
    const cur = n === node;
    const passed = MSI_PATH_ORDER.indexOf(n) < curIdx;
    const style: CSSProperties = cur
      ? { background: "transparent", color: "#E8CE86", border: "1.5px solid #E8CE86", boxShadow: "0 0 0 4px rgba(201,162,75,0.12)" }
      : passed
        ? { background: "linear-gradient(180deg,#86d79a,#5fae72)", color: "#16241a", border: "1px solid rgba(126,208,143,0.5)" }
        : { background: "rgba(42,51,65,0.6)", color: "#777E89", border: "1px solid rgba(201,162,75,0.14)" };
    return (
      <span key={n} className="rounded-[7px] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[1px]" style={style}>
        {passed ? "✓ " : ""}
        {MSI_SHORT[n]}
      </span>
    );
  };
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-[14px] border border-gold/25 px-5 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">{laneLabel}</span>
        {lane.map(chip)}
        <span className="mx-1 font-mono text-[12px] text-dim">→</span>
        {chip("GF")}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="font-display text-[13px] font-semibold uppercase tracking-[1px] text-gold-bright">
          {MSI_BRACKET[node].label}
        </span>
        {format && <span className="font-mono text-[11px] tracking-[1px] text-dim">· {format}</span>}
        {side === "lower" && (
          <span className="rounded-full bg-red/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[1px] text-red-soft">
            sem mais erros
          </span>
        )}
      </div>
    </>
  );
}

// ── FIRST STAND: trilha do grupo (upper/lower) + knockout (semi/final) ──
const FS_PATH_ORDER: FsNode[] = ["USF", "UBF", "LBF", "KSF", "KGF"];
const FS_GROUP_UPPER: FsNode[] = ["USF", "UBF"];
const FS_KNOCKOUT: FsNode[] = ["KSF", "KGF"];
const FS_SHORT: Record<FsNode, string> = { USF: "Semi", UBF: "Final", LBF: "L. Final", KSF: "Semi", KGF: "Final" };

function FsBracketHeader({ node, format }: { node: FsNode; format?: string }) {
  const side = FS_BRACKET[node].side;
  const curIdx = FS_PATH_ORDER.indexOf(node);
  const inKnockout = node === "KSF" || node === "KGF";
  // na fase de grupos: mostra a trilha upper (USF/UBF) ou, se caiu, a L. Final.
  const groupLane: FsNode[] = !inKnockout && side === "lower" ? ["LBF"] : FS_GROUP_UPPER;
  const chip = (n: FsNode) => {
    const cur = n === node;
    const passed = FS_PATH_ORDER.indexOf(n) < curIdx;
    const style: CSSProperties = cur
      ? { background: "transparent", color: "#E8CE86", border: "1.5px solid #E8CE86", boxShadow: "0 0 0 4px rgba(201,162,75,0.12)" }
      : passed
        ? { background: "linear-gradient(180deg,#86d79a,#5fae72)", color: "#16241a", border: "1px solid rgba(126,208,143,0.5)" }
        : { background: "rgba(42,51,65,0.6)", color: "#777E89", border: "1px solid rgba(201,162,75,0.14)" };
    return (
      <span key={n} className="shrink-0 rounded-[7px] px-1.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.5px] sm:px-2 sm:text-[10px] sm:tracking-[1px]" style={style}>
        {passed ? "✓ " : ""}
        {FS_SHORT[n]}
      </span>
    );
  };
  return (
    <>
      <div className="inline-flex flex-nowrap items-center justify-center gap-1 rounded-[14px] border border-gold/25 px-2.5 py-2 sm:gap-2 sm:px-5 sm:py-3">
        <span className="font-mono text-[8px] uppercase tracking-[0.5px] text-muted sm:text-[9px] sm:tracking-[1px]">Grupo</span>
        {groupLane.map(chip)}
        <span className="mx-0.5 font-mono text-[11px] text-dim sm:mx-1 sm:text-[12px]">→</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.5px] text-muted sm:text-[9px] sm:tracking-[1px]">Knockout</span>
        {FS_KNOCKOUT.map(chip)}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="font-display text-[13px] font-semibold uppercase tracking-[1px] text-gold-bright">
          {FS_BRACKET[node].label}
        </span>
        {format && <span className="font-mono text-[11px] tracking-[1px] text-dim">· {format}</span>}
        {(side === "lower" || inKnockout) && (
          <span className="rounded-full bg-red/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[1px] text-red-soft">
            sem mais erros
          </span>
        )}
      </div>
    </>
  );
}

const dotGreen: CSSProperties = {
  background: "linear-gradient(180deg,#86d79a,#5fae72)",
  boxShadow: "0 0 10px rgba(126,208,143,0.45)",
};
const dotRed: CSSProperties = {
  background: "linear-gradient(180deg,#e09a87,#c46a58)",
  boxShadow: "0 0 10px rgba(210,122,104,0.45)",
};
const dotEmpty: CSSProperties = { background: "rgba(42,51,65,0.7)", border: "1px solid rgba(201,162,75,0.2)" };

/** Linha de marcadores (pips) — vitórias (verde) ou derrotas (vermelho). */
function Pips({ filled, total, kind }: { filled: number; total: number; kind: "win" | "loss" }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-[14px] w-[14px] rounded-[4px] transition-all"
          style={i < filled ? (kind === "win" ? dotGreen : dotRed) : dotEmpty}
        />
      ))}
    </div>
  );
}

const KO = [
  { key: "quarter", label: "Quartas" },
  { key: "semi", label: "Semi" },
  { key: "final", label: "Final" },
] as const;

export function SeriesScreen({ game }: { game: Game }) {
  const {
    series,
    mode,
    msiNode,
    fsNode,
    stagePhase,
    swissWins,
    swissLosses,
    koIndex,
    seriesPlaying,
    revealed,
    yourGames,
    oppGames,
    seriesResult,
    difficulty,
    lineup,
    highlight,
    pentaFlash,
    gameMvpFlash,
    campaignGames,
    seriesMods,
    permMods,
    formNotes,
    activeBuffs,
    pendingEvent,
    pendingHostile,
  } = game.state;

  const isMsi = mode === "goldenroad" && !!msiNode;
  const isFs = mode === "goldenroad" && !!fsNode;

  // os flashes (penta / MVP de partida) somem sozinhos após um tempo.
  useEffect(() => {
    if (!pentaFlash && !gameMvpFlash) return;
    const id = setTimeout(() => game.clearFlashes(), 1700);
    return () => clearTimeout(id);
  }, [pentaFlash, gameMvpFlash, game]);

  if (!series) return null;

  const showRatings = difficulty !== "especialista";
  const target = series.target;
  const notStarted = !revealed && !seriesPlaying;
  const isWin = seriesResult === "win";
  const yourList = lineupPicks(lineup);
  // notas EFETIVAS (base + deltas temporários da forma/cartas) no display.
  const yourAvg = effLineScore(lineup, seriesMods);
  const oppAvgEff = effOppAvg(series.opp, seriesMods);
  // overall efetivo do adversário e do seu time por lane (pra realçar quem vence cada lane).
  const oppByRole = new Map<Role, number>(series.opp.players.map((p) => [p[0], effOpp(p[2], seriesMods, p[0])]));
  const youByRole = new Map<Role, number>(yourList.map((p) => [p.role, effYou(lineup, seriesMods, p.role)]));
  // forma do dia por role (pra badge 🔥/🧊).
  const formByRole = new Map<Role, "fogo" | "gelado">(formNotes.filter((n) => n.side === "you").map((n) => [n.role, n.kind]));
  // cor principal da org do rival (T1 vermelho, Gen.G amarelo...) — identidade
  // visual do card do adversário. Fallback neutro pra orgs sem cor mapeada.
  const oppColor = teamColor(series.opp.short).accent;
  const isLastWin = isFs
    ? isWin && fsNode === "KGF"
    : isMsi
      ? isWin && msiNode === "GF"
      : isWin && stagePhase === "ko" && koIndex >= 2;

  const nextLabel = (() => {
    if (isFs) {
      if (isWin) {
        if (fsNode === "KGF") return "Campeão do First Stand! Rumo ao MSI →";
        if (fsNode === "UBF" || fsNode === "LBF") return "Classificado ao Knockout →";
        if (fsNode === "KSF") return "Avançar à Grande Final →";
        return "Próxima série →";
      }
      const info = FS_BRACKET[fsNode!];
      return info.onLoss === "eliminated" ? "Ver resultado →" : "Cair pra Lower Bracket →";
    }
    if (isMsi) {
      if (isWin) {
        if (msiNode === "GF") return "Campeão do MSI! Rumo ao Worlds →";
        if (msiNode === "UF") return "Avançar à Grande Final →";
        return "Próxima série →";
      }
      // derrota: cai pra lower (continua) ou elimina
      const info = MSI_BRACKET[msiNode!];
      return info.onLoss === "eliminated" ? "Ver resultado →" : "Cair pra Lower Bracket →";
    }
    if (isWin) {
      if (stagePhase === "swiss") return swissWins + 1 >= 3 ? "Avançar ao mata-mata →" : "Próxima série →";
      return koIndex >= 2 ? "Erguer a taça 🏆" : "Próxima série →";
    }
    return stagePhase === "swiss" && swissLosses + 1 < 3 ? "Próxima série →" : "Ver resultado →";
  })();

  return (
    <>
      <EventCardOverlay game={game} />
      <div className="anim-fade-fast mx-auto w-full max-w-[1140px]">
        {/* HUD de buffs PERMANENTES da run (a forma do dia 🔥/🧊 fica na linha do jogador). */}
        {activeBuffs.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {activeBuffs.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.5px]"
                style={
                  b.bad
                    ? { background: "rgba(224,88,74,0.14)", border: "1px solid rgba(224,88,74,0.45)", color: "#f0867a" }
                    : { background: "rgba(201,162,75,0.14)", border: "1px solid rgba(232,206,134,0.4)", color: "#e8ce86" }
                }
              >
                <span className="text-[12px]">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        )}
        {/* header + progresso */}
        <div className="mb-[18px] text-center">
        {isFs ? (
          <div className="mb-8 flex items-center justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[2px]"
              style={{
                color: "#1a1206",
                background: "linear-gradient(180deg,#e8ce86,#c9a24b)",
                boxShadow: "0 0 18px rgba(201,162,75,0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              🚩 First Stand
              <span className="font-mono text-[10px] font-bold tracking-[1px] opacity-80">GOLDENROAD · GRUPO + KNOCKOUT</span>
            </span>
          </div>
        ) : isMsi ? (
          <div className="mb-8 flex items-center justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[2px]"
              style={{
                color: "#1a1206",
                background: "linear-gradient(180deg,#e8ce86,#c9a24b)",
                boxShadow: "0 0 18px rgba(201,162,75,0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              ⚔ MSI
              <span className="font-mono text-[10px] font-bold tracking-[1px] opacity-80">GOLDENROAD · BRACKET DUPLO</span>
            </span>
          </div>
        ) : (
          <div className="mb-3 font-mono text-[12px] uppercase tracking-[3px] text-muted">Playoffs · rumo ao 6–0</div>
        )}

        {isFs ? (
          <FsBracketHeader node={fsNode!} format={series.format} />
        ) : isMsi ? (
          <MsiBracketHeader node={msiNode!} format={series.format} />
        ) : stagePhase === "swiss" ? (
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-[14px] border border-gold/25 px-5 py-2.5">
            <span className="font-display text-[14px] font-semibold uppercase tracking-[1px] text-gold-bright">
              Fase Suíça
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[1px] text-muted">Vitórias</span>
              <Pips filled={swissWins} total={3} kind="win" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[1px] text-muted">Derrotas</span>
              <Pips filled={swissLosses} total={3} kind="loss" />
            </div>
          </div>
        ) : (
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-[8px] border border-win/40 px-2.5 py-1.5 font-mono text-[11px] text-win">
              Suíça {swissWins}–{swissLosses} ✓
            </span>
            {KO.map((s, k) => {
              const won = k < koIndex;
              const cur = k === koIndex;
              const style: CSSProperties = won
                ? { background: "linear-gradient(180deg,#86d79a,#5fae72)", color: "#16241a", border: "1px solid rgba(126,208,143,0.5)" }
                : cur
                  ? { background: "transparent", color: "#E8CE86", border: "1.5px solid #E8CE86", boxShadow: "0 0 0 4px rgba(201,162,75,0.12)" }
                  : { background: "rgba(42,51,65,0.6)", color: "#777E89", border: "1px solid rgba(201,162,75,0.14)" };
              return (
                <span
                  key={s.key}
                  className="rounded-[8px] px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[1px]"
                  style={style}
                >
                  {won ? "✓ " : ""}
                  {s.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 3 colunas */}
      <div className="grid items-stretch gap-4 [grid-template-columns:1fr] wide:[grid-template-columns:1.15fr_0.9fr_1.15fr]">
        {/* sua line — fundo cinza escuro neutro (sem azulado) */}
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-gold/30"
          style={{ background: "linear-gradient(180deg,rgba(40,41,44,0.82),rgba(28,29,31,0.84))" }}
        >
          <div className="flex items-center border-b border-gold/20 px-[18px] py-2.5 sm:min-h-[74px] sm:py-4">
            <span className="font-display text-[17px] font-semibold uppercase tracking-[1px] text-gold-bright sm:text-[21px]">
              Sua line
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1 p-1.5 sm:gap-1.5 sm:p-2">
            {yourList.map((p) => {
              const eff = youByRole.get(p.role) ?? p.rating;
              return (
                <LineRow
                  key={p.role}
                  role={p.role}
                  name={p.name}
                  country={p.country}
                  rating={eff}
                  side="you"
                  showRatings={showRatings}
                  wins={eff >= (oppByRole.get(p.role) ?? 0)}
                  form={formByRole.get(p.role)}
                  delta={(permMods[p.role] ?? 0) + (seriesMods.you[p.role] ?? 0)}
                />
              );
            })}
          </div>
          {showRatings && (
            <div className="flex items-center justify-between border-t border-gold/15 px-3.5 py-2">
              <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">Média</span>
              <span className="font-mono text-[18px] font-bold text-gold-bright">{yourAvg}</span>
            </div>
          )}
        </div>

        {/* centro */}
        <div className="flex flex-col items-center justify-center px-2.5 py-2.5 text-center sm:min-h-[260px] sm:py-[18px]">
          {/* no MSI/First Stand a etapa+formato ficam embaixo do badge (BracketHeader); aqui só no modo Worlds */}
          {!isMsi && !isFs && (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">{series.stageLabel}</div>
              <div className="mt-[3px] font-mono text-[11px] text-dim">{series.format}</div>
            </>
          )}

          {notStarted && (
            <>
              <div
                className="my-2 font-display text-[44px] leading-none font-extrabold tracking-[4px] sm:my-[20px] sm:text-[64px]"
                style={{
                  background: "linear-gradient(180deg,#f0dca0,#c9a24b)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 18px rgba(201,162,75,0.4))",
                }}
              >
                VS
              </div>
              {pendingEvent ? (
                // evento a caminho: trava o início até o jogador escolher uma carta.
                pendingHostile ? (
                  <div className="flex items-center gap-2 rounded-[10px] border border-red/40 px-[28px] py-[13px] font-display text-[15px] font-semibold uppercase tracking-[2px]" style={{ background: "rgba(224,88,74,0.1)", color: "#f0867a" }}>
                    <span className="animate-pulse">⚠️</span> Evento de azar…
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-[10px] border border-gold/30 px-[28px] py-[13px] font-display text-[15px] font-semibold uppercase tracking-[2px] text-gold-bright" style={{ background: "rgba(201,162,75,0.08)" }}>
                    <span className="animate-pulse">⚡</span> Evento a caminho…
                  </div>
                )
              ) : (
                <button
                  onClick={game.playSeries}
                  className="btn-gold cursor-pointer rounded-[10px] border-none px-[34px] py-[13px] font-display text-[16px] font-semibold uppercase tracking-[2px]"
                >
                  ▶ Jogar série
                </button>
              )}
            </>
          )}

          {seriesPlaying && (
            <div className="my-3.5">
              <div className="font-mono text-[46px] leading-none font-bold tracking-[2px]">
                <span className="text-win">{yourGames}</span>
                <span className="text-dim">–</span>
                <span className="text-red-soft">{oppGames}</span>
              </div>
              <div className="mt-2 font-mono text-[11px] tracking-[3px] text-muted">EM JOGO…</div>
              {pentaFlash && (
                <div key={`${pentaFlash.side}-${pentaFlash.role}-${pentaFlash.gameNumber}`} className="anim-penta mt-3">
                  <div
                    className="mx-auto inline-flex flex-col items-center rounded-[12px] px-4 py-2"
                    style={
                      pentaFlash.side === "you"
                        ? {
                            background: "linear-gradient(180deg,rgba(201,162,75,0.22),rgba(140,90,30,0.18))",
                            border: "1.5px solid rgba(232,206,134,0.7)",
                            boxShadow: "0 0 22px rgba(201,162,75,0.45)",
                          }
                        : {
                            background: "linear-gradient(180deg,rgba(210,122,104,0.2),rgba(80,40,40,0.18))",
                            border: "1.5px solid rgba(224,154,135,0.6)",
                            boxShadow: "0 0 18px rgba(210,122,104,0.35)",
                          }
                    }
                  >
                    <span
                      className={`font-display text-[18px] font-extrabold uppercase tracking-[3px] ${pentaFlash.side === "you" ? "text-gold-bright" : "text-red-soft"}`}
                    >
                      ⚔ Pentakill!
                    </span>
                    <span className="mt-1 flex items-center gap-1">
                      <HighlightName role={pentaFlash.role} name={pentaFlash.name} country={pentaFlash.country} side={pentaFlash.side} />
                      <span className="ml-1 font-mono text-[10px] text-muted">
                        {pentaFlash.side === "you" ? "(você)" : "(rival)"}
                      </span>
                    </span>
                  </div>
                </div>
              )}
              {gameMvpFlash && !pentaFlash && (
                <div key={`gm-${gameMvpFlash.gameNumber}`} className="anim-penta mt-3">
                  <div
                    className="mx-auto inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5"
                    style={
                      gameMvpFlash.side === "you"
                        ? { background: "rgba(201,162,75,0.16)", border: "1px solid rgba(232,206,134,0.5)" }
                        : { background: "rgba(210,122,104,0.14)", border: "1px solid rgba(224,154,135,0.45)" }
                    }
                  >
                    <span className="text-[13px]">⭐</span>
                    <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">
                      MVP Jogo {gameMvpFlash.gameNumber}
                    </span>
                    <HighlightName role={gameMvpFlash.role} name={gameMvpFlash.name} country={gameMvpFlash.country} side={gameMvpFlash.side} />
                  </div>
                </div>
              )}
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <div className="relative flex justify-center">
                  <span className="absolute right-full mr-2 self-center font-mono text-[9px] uppercase tracking-[1px] text-muted">Você</span>
                  <div className="flex gap-[7px]">
                    {Array.from({ length: target }, (_, i) => (
                      <div key={i} className="h-[16px] w-[16px] rounded-[5px] transition-all" style={i < yourGames ? dotGreen : dotEmpty} />
                    ))}
                  </div>
                </div>
                <div className="relative flex justify-center">
                  <span className="absolute right-full mr-2 self-center font-mono text-[9px] uppercase tracking-[1px] text-muted">Rival</span>
                  <div className="flex gap-[7px]">
                    {Array.from({ length: target }, (_, i) => (
                      <div key={i} className="h-[16px] w-[16px] rounded-[5px] transition-all" style={i < oppGames ? dotRed : dotEmpty} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {revealed && (
            <div className="anim-pop">
              <div className="mt-3.5 mb-2 font-mono text-[48px] leading-none font-bold tracking-[2px]">
                {/* só o SEU placar colora pelo resultado; traço e nº do oponente em cinza neutro. */}
                <span className={isWin ? "text-win" : "text-red"}>{yourGames}</span>
                <span style={{ color: "rgba(160,168,176,0.4)" }}>–</span>
                <span style={{ color: "rgba(160,168,176,0.5)" }}>{oppGames}</span>
              </div>
              <div
                className={`mb-6 font-display text-[18px] font-bold uppercase tracking-[3px] ${isWin ? "text-win" : "text-red"}`}
              >
                {isWin ? "Vitória" : "Derrota"}
              </div>

              {highlight?.mvp && series.target > 1 && (
                <div
                  className="anim-pop mx-auto mb-7 mr-3 inline-flex items-center gap-2 rounded-[11px] px-3.5 py-2 sm:mr-auto"
                  style={
                    highlight.mvp.side === "you"
                      ? {
                          background: "linear-gradient(180deg,rgba(201,162,75,0.18),rgba(40,48,60,0.5))",
                          border: "1px solid rgba(232,206,134,0.55)",
                        }
                      : {
                          background: "linear-gradient(180deg,rgba(210,122,104,0.16),rgba(40,32,34,0.5))",
                          border: "1px solid rgba(224,154,135,0.5)",
                        }
                  }
                >
                  <span className="font-display text-[16px]">🏅</span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-mono text-[9px] uppercase tracking-[2px] text-muted">
                      MVP da série{highlight.mvp.side === "opp" ? ` · ${series.opp.short}` : ""}
                    </span>
                    <span className="mt-0.5">
                      <HighlightName role={highlight.mvp.role} name={highlight.mvp.name} country={highlight.mvp.country} side={highlight.mvp.side} />
                    </span>
                  </span>
                </div>
              )}

              <button
                onClick={game.nextSeries}
                className={`btn-gold cursor-pointer border-none font-display font-semibold uppercase ${
                  isLastWin
                    ? "rounded-[11px] px-5 py-3.5 text-[17px] tracking-[2px] sm:px-9"
                    : "rounded-[10px] px-5 py-3 text-[15px] tracking-[1.5px] sm:px-[30px]"
                }`}
              >
                {nextLabel}
              </button>
            </div>
          )}
        </div>

        {/* adversário — cromático na cor da org (oppColor) */}
        <div
          className="flex flex-col overflow-hidden rounded-2xl border"
          style={{
            borderColor: `color-mix(in srgb, ${oppColor} 32%, transparent)`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${oppColor} 16%, rgba(30,26,28,0.72)), rgba(26,24,26,0.72))`,
          }}
        >
          <div
            className="flex items-center justify-between gap-2.5 border-b px-[18px] py-2.5 sm:min-h-[74px] sm:py-4"
            style={{ borderColor: `color-mix(in srgb, ${oppColor} 30%, transparent)` }}
          >
            <div className="min-w-0">
              <div className="truncate font-display text-[17px] font-semibold leading-[1.1] text-cream sm:text-[21px]">{series.opp.team}</div>
              <div className="mt-[3px] font-mono text-[11px] tracking-[1px] text-muted">{series.opp.league}</div>
            </div>
            <div className="font-display text-[20px] leading-none font-bold sm:text-[24px]" style={{ color: oppColor }}>
              {series.opp.year}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1 p-1.5 sm:gap-1.5 sm:p-2">
            {series.opp.players.map((p) => {
              const eff = oppByRole.get(p[0]) ?? p[2];
              return (
                <LineRow
                  key={p[0]}
                  role={p[0]}
                  name={p[1]}
                  country={p[3]}
                  rating={eff}
                  side="opp"
                  showRatings={showRatings}
                  wins={eff > (youByRole.get(p[0]) ?? 0)}
                  oppColor={oppColor}
                  delta={seriesMods.opp[p[0]] ?? 0}
                />
              );
            })}
          </div>
          {showRatings && (
            <div
              className="flex items-center justify-between border-t px-3.5 py-2"
              style={{ borderColor: `color-mix(in srgb, ${oppColor} 22%, transparent)` }}
            >
              <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">Média</span>
              <span className="font-mono text-[18px] font-bold" style={{ color: oppColor }}>
                {oppAvgEff}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* histórico da campanha — agrupado por série, bloco mais recente no topo */}
      {campaignGames.length > 0 && (
        <div className="anim-fade-fast mx-auto mt-6 max-w-[880px]">
          <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[3px] text-muted">
            Histórico de partidas
          </div>
          <div className="flex flex-col gap-5">
            {groupSeries(campaignGames).map((blk, bi) => {
              const yourW = blk.games.filter((g) => g.youWon).length;
              const oppW = blk.games.length - yourW;
              const head = seriesHeader(blk);
              const sMvp = seriesMvp(blk);
              return (
                <div key={blk.seriesIndex} className={bi === 0 ? "anim-fade-fast" : ""}>
                  {/* cabeçalho do bloco da série */}
                  <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 px-1">
                    <span className="font-display text-[13px] font-bold uppercase tracking-[1.5px] text-gold-bright">
                      {head.title}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[1px] text-dim">{head.sub}</span>
                    {sMvp && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                        style={
                          sMvp.side === "you"
                            ? { background: "rgba(201,162,75,0.14)", border: "1px solid rgba(232,206,134,0.45)" }
                            : { background: "rgba(210,122,104,0.13)", border: "1px solid rgba(224,154,135,0.4)" }
                        }
                      >
                        <span className="text-[11px]">🏅</span>
                        <span className="font-mono text-[8.5px] uppercase tracking-[1px] text-muted">MVP da série</span>
                        <HighlightName role={sMvp.role} name={sMvp.name} country={sMvp.country} side={sMvp.side} />
                      </span>
                    )}
                    <span className="h-px flex-1" style={{ background: "rgba(201,162,75,0.18)" }} />
                    <span className={`font-mono text-[13px] font-bold tracking-[1px] ${yourW > oppW ? "text-win" : "text-red"}`}>
                      {yourW}–{oppW}
                    </span>
                  </div>

                  {/* jogos da série */}
                  <div className="flex flex-col gap-1.5">
                    {blk.games
                      .slice()
                      .reverse()
                      .map((g, gi) => (
                        <div
                          key={gi}
                          className="flex items-center gap-3 rounded-[11px] border px-3.5 py-2.5"
                          style={{
                            background: g.youWon ? "rgba(30,40,33,0.55)" : "rgba(44,32,33,0.5)",
                            borderColor: g.youWon ? "rgba(126,208,143,0.24)" : "rgba(210,122,104,0.26)",
                          }}
                        >
                          {/* badge resultado (à esquerda) + nº do jogo */}
                          <span
                            className={`w-[78px] flex-none rounded-[6px] px-2 py-1 text-center font-mono text-[10px] font-bold uppercase tracking-[1px] ${g.youWon ? "text-win" : "text-red-soft"}`}
                            style={{
                              background: g.youWon ? "rgba(126,208,143,0.14)" : "rgba(210,122,104,0.14)",
                              border: `1px solid ${g.youWon ? "rgba(126,208,143,0.4)" : "rgba(210,122,104,0.4)"}`,
                            }}
                          >
                            {g.youWon ? "Vitória" : "Derrota"}
                          </span>
                          <span className="w-[52px] flex-none font-mono text-[11px] font-bold tracking-[1px] text-muted">
                            Jogo {g.gameNumber}
                          </span>

                          {/* MVP da partida */}
                          <span className="flex min-w-0 flex-1 items-center gap-1.5">
                            {g.mvp && (
                              <>
                                <span className="text-[12px]">⭐</span>
                                <HighlightName role={g.mvp.role} name={g.mvp.name} country={g.mvp.country} side={g.mvp.side} />
                              </>
                            )}
                          </span>

                          {/* todos os pentakills do jogo, à direita */}
                          {g.pentakills.length > 0 && (
                            <span className="flex flex-wrap items-center justify-end gap-1.5">
                              {g.pentakills.map((k, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.5px] ${k.side === "you" ? "text-gold-bright" : "text-red-soft"}`}
                                  style={
                                    k.side === "you"
                                      ? { background: "rgba(201,162,75,0.14)", border: "1px solid rgba(201,162,75,0.3)" }
                                      : { background: "rgba(210,122,104,0.13)", border: "1px solid rgba(210,122,104,0.3)" }
                                  }
                                >
                                  ⚔ <LaneIcon role={k.role} className="h-[11px] w-[11px]" /> {k.name}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
