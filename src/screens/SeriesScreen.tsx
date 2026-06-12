import { useEffect, type CSSProperties } from "react";
import type { Game } from "../game/useGame";
import type { LiveGame, Role, Side } from "../types";
import { lineScore, lineupPicks, seriesFlavor, yy } from "../game/helpers";
import { MSI_BRACKET } from "../game/msi";
import type { MsiNode } from "../types";
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

// ordem linear do caminho (pra saber o que já foi "passado" no destaque visual).
const MSI_PATH_ORDER: MsiNode[] = ["UR1", "UR2", "UF", "LR1", "LR2", "LR3", "LF", "GF"];

/** Cabeçalho do bracket do MSI: linha da upper, linha da lower e a GF, com o nó atual destacado. */
function MsiBracketHeader({ node }: { node: MsiNode }) {
  const side = MSI_BRACKET[node].side;
  const curIdx = MSI_PATH_ORDER.indexOf(node);
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
    <div className="inline-flex flex-col items-center gap-2 rounded-[14px] border border-gold/25 px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="w-[44px] text-right font-mono text-[9px] uppercase tracking-[1px] text-muted">Upper</span>
        {MSI_UPPER.map(chip)}
      </div>
      <div className="flex items-center gap-2">
        <span className="w-[44px] text-right font-mono text-[9px] uppercase tracking-[1px] text-muted">Lower</span>
        {MSI_LOWER.map(chip)}
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        {chip("GF")}
        <span className="font-display text-[12px] font-semibold uppercase tracking-[1px] text-gold-bright">
          {MSI_BRACKET[node].label}
        </span>
        {side === "lower" && (
          <span className="rounded-full bg-red/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[1px] text-red-soft">
            sem mais erros
          </span>
        )}
      </div>
    </div>
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
    history,
    highlight,
    pentaFlash,
    gameMvpFlash,
    campaignGames,
  } = game.state;

  const isMsi = mode === "goldenroad" && !!msiNode;

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
  const flavor = seriesFlavor(isWin, yourGames, oppGames, history.length);
  const yourList = lineupPicks(lineup);
  const yourAvg = lineScore(lineup);
  const isLastWin = isMsi
    ? isWin && msiNode === "GF"
    : isWin && stagePhase === "ko" && koIndex >= 2;

  const nextLabel = (() => {
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
    <div className="anim-fade-fast mx-auto w-full max-w-[1040px]">
      {/* header + progresso */}
      <div className="mb-[18px] text-center">
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[3px] text-muted">
          {isMsi ? "MSI · GOLDENROAD · Bracket duplo" : "Playoffs · rumo ao 6–0"}
        </div>

        {isMsi ? (
          <MsiBracketHeader node={msiNode!} />
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
      <div className="grid items-stretch gap-4 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.05fr_1fr]">
        {/* sua line */}
        <div className="panel-raised overflow-hidden rounded-2xl border border-gold/30">
          <div className="flex items-baseline justify-between gap-2 border-b border-gold/20 px-3.5 py-[11px]">
            <span className="font-display text-[14px] font-semibold uppercase tracking-[1px] text-gold-bright">
              Sua line
            </span>
            {showRatings && <span className="font-mono text-[11px] text-muted">méd. {yourAvg}</span>}
          </div>
          <div className="flex flex-col gap-[5px] p-2">
            {yourList.map((p) => (
              <div
                key={p.role}
                className="flex items-center gap-2.5 rounded-[9px] px-[9px] py-[7px]"
                style={{ background: "rgba(28,34,45,0.5)" }}
              >
                <RoleBadge role={p.role} size="sm" />
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                  <Flag cc={p.country} size={12} />
                  <span className="truncate font-display text-[15px] font-semibold text-cream">{p.name}</span>
                </span>
                {showRatings && <span className="font-mono text-[14px] font-bold text-gold-bright">{p.rating}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* centro */}
        <div className="flex min-h-[260px] flex-col items-center justify-center px-2.5 py-[18px] text-center">
          <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">{series.stageLabel}</div>
          <div className="mt-[3px] font-mono text-[11px] text-dim">{series.format}</div>

          {notStarted && (
            <>
              <div className="my-[18px] font-display text-[34px] font-bold tracking-[6px] text-dim">VS</div>
              <button
                onClick={game.playSeries}
                className="btn-gold cursor-pointer rounded-[10px] border-none px-[34px] py-[13px] font-display text-[16px] font-semibold uppercase tracking-[2px]"
              >
                ▶ Jogar série
              </button>
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
                <div className="flex items-center gap-2">
                  <span className="w-[44px] text-right font-mono text-[9px] uppercase tracking-[1px] text-muted">Você</span>
                  <div className="flex gap-[7px]">
                    {Array.from({ length: target }, (_, i) => (
                      <div key={i} className="h-[16px] w-[16px] rounded-[5px] transition-all" style={i < yourGames ? dotGreen : dotEmpty} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-[44px] text-right font-mono text-[9px] uppercase tracking-[1px] text-muted">Rival</span>
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
              <div
                className={`mt-3.5 mb-1 font-mono text-[48px] leading-none font-bold tracking-[2px] ${isWin ? "text-win" : "text-red"}`}
              >
                {yourGames}–{oppGames}
              </div>
              <div
                className={`font-display text-[18px] font-bold uppercase tracking-[3px] ${isWin ? "text-win" : "text-red"}`}
              >
                {isWin ? "Vitória" : "Derrota"}
              </div>
              <div className="mx-auto mt-2 mb-3 max-w-[260px] text-[13px] text-[#BFC4CD]">{flavor}</div>

              {highlight?.mvp && series.target > 1 && (
                <div
                  className="anim-pop mx-auto mb-2.5 inline-flex items-center gap-2 rounded-[11px] px-3.5 py-2"
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

              <div className="mb-1" />

              <button
                onClick={game.nextSeries}
                className={
                  isLastWin
                    ? "btn-gold cursor-pointer rounded-[11px] border-none px-9 py-3.5 font-display text-[17px] font-semibold uppercase tracking-[2px]"
                    : "btn-soft-gold cursor-pointer rounded-[10px] px-[30px] py-3 font-display text-[15px] font-semibold uppercase tracking-[1px]"
                }
              >
                {nextLabel}
              </button>
            </div>
          )}
        </div>

        {/* adversário */}
        <div
          className="overflow-hidden rounded-2xl border border-red/30"
          style={{ background: "linear-gradient(180deg,rgba(58,44,44,0.7),rgba(34,28,30,0.7))" }}
        >
          <div className="flex items-baseline justify-between gap-2 border-b px-3.5 py-[11px]" style={{ borderColor: "rgba(210,122,104,0.28)" }}>
            <span className="truncate font-display text-[14px] font-semibold text-cream">{series.opp.team}</span>
            <span className="font-mono text-[11px] text-red-soft">
              {showRatings ? `méd. ${series.opp.avg} · ` : ""}'{yy(series.opp.year)}
            </span>
          </div>
          <div className="flex flex-col gap-[5px] p-2">
            {series.opp.players.map((p) => (
              <div
                key={p[0]}
                className="flex items-center gap-2.5 rounded-[9px] px-[9px] py-[7px]"
                style={{ background: "rgba(34,28,30,0.5)" }}
              >
                <RoleBadge role={p[0]} variant="red" size="sm" />
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                  <Flag cc={p[3]} size={12} />
                  <span className="truncate font-display text-[15px] font-semibold text-[#E7E0D6]">{p[1]}</span>
                </span>
                {showRatings && <span className="font-mono text-[14px] font-bold text-red-soft">{p[2]}</span>}
              </div>
            ))}
          </div>
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
  );
}
