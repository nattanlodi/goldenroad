import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Tournament } from "../../game/useTournament";
import type { Role } from "../../types";
import { competitorLabel, competitorSubtitle, lineAvg, type BracketMatch, type Competitor, type TournamentPick } from "../../game/tournament";
import type { LiveSeries, SideMatch, TourHl, TourSeries } from "../../game/tournamentReducer";
import { rarityFor } from "../../game/helpers";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";
import { ROLE_SVG } from "../../components/roleIcons";

/** Conta regressiva pro início de série. */
function useCountdown(deadline: number | null): number {
  const [, force] = useState(0);
  useEffect(() => {
    if (deadline == null) return;
    const id = setInterval(() => force((n) => n + 1), 200);
    return () => clearInterval(id);
  }, [deadline]);
  if (deadline == null) return 0;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

const STAGE_LABEL: Record<BracketMatch["stage"], string> = { qf: "Quartas", sf: "Semifinal", gf: "Grande Final" };

export function BracketScreen({ t }: { t: Tournament }) {
  const { state, startSeriesNow, advanceAfterSeries } = t;
  const { bracket, competitors, live, sideMatches, startDeadline, queue, queueIndex, myId, config, history } = state;
  const byId = new Map(competitors.map((c) => [c.id, c]));
  const secs = useCountdown(live ? null : startDeadline);
  const showRatings = !config.hideRatings;
  // confronto cujas lines estão sendo inspecionadas (clique num card do bracket).
  const [inspectId, setInspectId] = useState<string | null>(null);

  if (!bracket) return null;

  const currentMatchId = queue[queueIndex] ?? null;
  const currentMatch = currentMatchId
    ? [...bracket.qf, ...bracket.sf, bracket.gf].find((m) => m.id === currentMatchId)
    : null;

  // o humano está nesta série?
  const iAmIn = !!currentMatch && (currentMatch.a === myId || currentMatch.b === myId);

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1180px]">
      {/* selo do modo */}
      <div className="mb-5 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[2px]"
          style={{ color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)", boxShadow: "0 0 18px rgba(201,162,75,0.45)" }}>
          🏆 Worlds ao Vivo <span className="font-mono text-[10px] font-bold tracking-[1px] opacity-80">BRACKET DE 8</span>
        </span>
      </div>

      {/* dica de interação */}
      <div className="mb-2 text-center font-mono text-[9px] uppercase tracking-[2px] text-dim">toque num confronto pra ver as lines</div>

      {/* bracket borboleta (placar da série ao vivo + bot×bot paralelas em tempo real) */}
      <Butterfly bracket={bracket} byId={byId} myId={myId} liveId={live?.matchId ?? currentMatchId} live={live} sideMatches={sideMatches} onInspect={setInspectId} />

      {/* painel da série atual — sempre as DUAS lines + centro (feed/placar/botão) */}
      <div className="mx-auto mt-7 max-w-[1040px]">
        {currentMatch && (
          <SeriesPanel
            match={currentMatch}
            live={live}
            byId={byId}
            myId={myId}
            secs={secs}
            iAmIn={iAmIn}
            showRatings={showRatings}
            onStart={startSeriesNow}
            onAdvance={advanceAfterSeries}
          />
        )}
        {/* histórico das séries (barras de resultado + penta + mvp), como no solo */}
        {history.length > 0 && <SeriesHistory history={history} />}
      </div>

      {/* popover de inspeção: as lines do confronto clicado */}
      {inspectId && (() => {
        const m = [...bracket.qf, ...bracket.sf, bracket.gf].find((x) => x.id === inspectId);
        if (!m) return null;
        // placar a exibir no centro: ao vivo (minha série / bot×bot) ou o do bracket.
        const sm = sideMatches.find((s) => s.matchId === m.id);
        const score = live && live.matchId === m.id
          ? { a: live.scoreA, b: live.scoreB, done: live.finished }
          : sm
            ? { a: sm.scoreA, b: sm.scoreB, done: sm.revealed >= sm.games.length }
            : { a: m.scoreA, b: m.scoreB, done: m.done };
        return <InspectOverlay match={m} byId={byId} myId={myId} showRatings={showRatings} score={score} onClose={() => setInspectId(null)} />;
      })()}
    </div>
  );
}

// ============================================================
// Popover de inspeção: mostra as 2 lines de um confronto clicado no bracket.
// ============================================================
function InspectOverlay({ match, byId, myId, showRatings, score, onClose }: { match: BracketMatch; byId: Map<string, Competitor>; myId: string; showRatings: boolean; score: { a: number; b: number; done: boolean }; onClose: () => void }) {
  const a = (match.a ? byId.get(match.a) : null) ?? null;
  const b = (match.b ? byId.get(match.b) : null) ?? null;
  // fecha no ESC.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // VS antes de começar; placar (parcial/final) depois.
  const started = score.a > 0 || score.b > 0 || score.done;
  const aWon = score.done && score.a > score.b;
  const bWon = score.done && score.b > score.a;

  const overlay = (
    <div className="anim-fade-fast fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8" style={{ background: "rgba(10,11,15,0.78)", backdropFilter: "blur(5px)" }} onClick={onClose}>
      <div className="w-full max-w-[860px]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-display text-[13px] font-bold uppercase tracking-[2px] text-gold-bright">{STAGE_LABEL[match.stage]}</span>
          <button onClick={onClose} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-1.5 font-display text-[12px] font-semibold uppercase tracking-[1px]">✕ Fechar</button>
        </div>
        <div className="grid items-stretch gap-3 [grid-template-columns:1fr] sm:[grid-template-columns:1fr_auto_1fr]">
          <InspectLine c={a} mine={match.a === myId} showRatings={showRatings} />
          {/* centro: VS → vira o placar quando a série começa/termina */}
          <div className="flex items-center justify-center sm:px-1">
            {!started ? (
              <span className="font-display text-[28px] font-black tracking-[2px] text-gold-bright">VS</span>
            ) : (
              <span className="font-mono text-[34px] font-black tabular-nums">
                <span className={aWon ? "text-win" : score.a === 0 ? "text-dim" : "text-muted"}>{score.a}</span>
                <span className="px-1 text-dim">–</span>
                <span className={bWon ? "text-win" : score.b === 0 ? "text-dim" : "text-muted"}>{score.b}</span>
              </span>
            )}
          </div>
          <InspectLine c={b} mine={match.b === myId} showRatings={showRatings} />
        </div>
      </div>
    </div>
  );
  // portal no body: escapa do container com transform (anim-fade) que prenderia o fixed.
  return createPortal(overlay, document.body);
}

function InspectLine({ c, mine, showRatings }: { c: Competitor | null; mine: boolean; showRatings: boolean }) {
  if (!c) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-gold/20" style={{ background: "rgba(26,27,31,0.6)" }}>
        <span className="font-mono text-[12px] text-dim">a definir</span>
      </div>
    );
  }
  const avg = showRatings ? c.avg : null;
  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: mine ? "rgba(201,162,75,0.4)" : "rgba(201,162,75,0.2)", background: "linear-gradient(180deg,rgba(40,41,44,0.92),rgba(28,29,31,0.94))" }}>
      <div className="flex items-center justify-between gap-2 border-b border-gold/20 px-4 py-3">
        <div className="min-w-0">
          <div className={`truncate font-display text-[16px] font-bold ${mine ? "text-gold-bright" : "text-cream"}`}>{competitorLabel(c)}{mine ? " (você)" : ""}</div>
          <div className="truncate font-mono text-[10px] text-dim">{competitorSubtitle(c)}</div>
        </div>
        {avg != null && <span className="shrink-0 font-mono text-[20px] font-black text-gold-bright">{avg}</span>}
      </div>
      <div className="flex flex-col gap-1 p-2">
        {c.line.map((p) => {
          const skin = rarityFor(p.rating);
          return (
            <div key={p.role} className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2" style={{ background: "linear-gradient(100deg,rgba(42,44,48,0.62),rgba(30,31,34,0.5))", border: "1px solid rgba(201,162,75,0.12)" }}>
              <RoleBadge role={p.role as Role} variant={mine ? "gold" : "neutral"} size="sm" />
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <Flag cc={p.country} size={13} />
                <span className="truncate font-display text-[15px] font-semibold text-cream">{p.name}</span>
                <span className="ml-auto shrink-0 font-mono text-[9px] text-dim">{p.short} '{String(p.year).slice(2)}</span>
              </span>
              {showRatings && (
                <span className="inline-flex min-w-[32px] items-center justify-center rounded-[7px] px-[6px] py-[4px] font-mono text-[16px] font-black leading-none tabular-nums"
                  style={{ color: skin.ratingColor, background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`, border: `1px solid color-mix(in srgb, ${skin.ratingColor} 38%, transparent)` }}>
                  {p.rating}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Bracket BORBOLETA: quartas nas pontas, semis pro meio, final no centro.
// ============================================================
function Butterfly({ bracket, byId, myId, liveId, live, sideMatches, onInspect }: { bracket: Tournament["state"]["bracket"]; byId: Map<string, Competitor>; myId: string; liveId: string | null; live: LiveSeries | null; sideMatches: SideMatch[]; onInspect: (id: string) => void }) {
  if (!bracket) return null;
  const sideById = new Map(sideMatches.map((s) => [s.matchId, s]));
  // placar AO VIVO: minha série OU uma bot×bot paralela (sobrescreve o placar do bracket).
  const liveScore = (m: BracketMatch): { a: number; b: number } | null => {
    if (live && live.matchId === m.id) return { a: live.scoreA, b: live.scoreB };
    const s = sideById.get(m.id);
    return s ? { a: s.scoreA, b: s.scoreB } : null;
  };
  // bot×bot ainda revelando jogos → mostra "ao vivo".
  const sideLive = (m: BracketMatch) => {
    const s = sideById.get(m.id);
    return !!s && s.revealed < s.games.length;
  };
  const cell = (m: BracketMatch, align: "left" | "right") => (
    <MatchCard key={m.id} m={m} byId={byId} myId={myId} live={m.id === liveId || sideLive(m)} liveScore={liveScore(m)} align={align} onInspect={onInspect} />
  );
  return (
    <div className="grid items-center gap-2 [grid-template-columns:1fr] sm:gap-3 sm:[grid-template-columns:1fr_1fr_1.25fr_1fr_1fr]">
      {/* quartas esquerda */}
      <div className="flex flex-col gap-3">
        <ColLabel>Quartas</ColLabel>
        {cell(bracket.qf[0], "left")}
        {cell(bracket.qf[1], "left")}
      </div>
      {/* semi esquerda */}
      <div className="flex flex-col gap-3">
        <ColLabel>Semi</ColLabel>
        {cell(bracket.sf[0], "left")}
      </div>
      {/* final — card estica na largura toda da coluna (não fica fininho) */}
      <div className="flex flex-col items-stretch gap-2">
        <ColLabel>Final</ColLabel>
        <MatchCard m={bracket.gf} byId={byId} myId={myId} live={bracket.gf.id === liveId || sideLive(bracket.gf)} liveScore={liveScore(bracket.gf)} align="center" final onInspect={onInspect} />
      </div>
      {/* semi direita */}
      <div className="flex flex-col gap-3">
        <ColLabel>Semi</ColLabel>
        {cell(bracket.sf[1], "right")}
      </div>
      {/* quartas direita */}
      <div className="flex flex-col gap-3">
        <ColLabel>Quartas</ColLabel>
        {cell(bracket.qf[2], "right")}
        {cell(bracket.qf[3], "right")}
      </div>
    </div>
  );
}

function ColLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-center font-mono text-[9px] uppercase tracking-[2px] text-muted">{children}</div>;
}

/** Card de um confronto: dois competidores, placar, estado (aguardando/ao vivo/✓). */
function MatchCard({ m, byId, myId, live, liveScore, align, final, onInspect }: { m: BracketMatch; byId: Map<string, Competitor>; myId: string; live: boolean; liveScore?: { a: number; b: number } | null; align: "left" | "right" | "center"; final?: boolean; onInspect?: (id: string) => void }) {
  const a = (m.a ? byId.get(m.a) : null) ?? null;
  const b = (m.b ? byId.get(m.b) : null) ?? null;
  const state: "wait" | "live" | "done" = m.done ? "done" : live ? "live" : "wait";
  // placar exibido: ao vivo usa o do live (atualiza em tempo real); senão o do bracket.
  const scoreA = liveScore ? liveScore.a : m.scoreA;
  const scoreB = liveScore ? liveScore.b : m.scoreB;
  // clicável só quando há ao menos uma line definida (pra inspecionar).
  const clickable = !!onInspect && (!!a || !!b);

  // sem verde: ao vivo dourado forte; concluído/aguardando em dourado suave.
  const border = state === "live" ? "rgba(232,206,134,0.85)" : state === "done" ? "rgba(201,162,75,0.3)" : "rgba(201,162,75,0.22)";
  const glow = state === "live" ? "0 0 22px -4px rgba(201,162,75,0.6)" : final ? "0 0 26px -8px rgba(201,162,75,0.45)" : undefined;

  return (
    <div
      onClick={clickable ? () => onInspect!(m.id) : undefined}
      className={`overflow-hidden rounded-[12px] border transition-transform ${clickable ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
      style={{
        borderColor: border,
        boxShadow: glow,
        background: final
          ? "linear-gradient(165deg,rgba(40,32,12,0.92),rgba(20,16,8,0.94))"
          : "linear-gradient(165deg,rgba(34,36,42,0.85),rgba(22,23,28,0.9))",
      }}
    >
      {final ? (
        <>
          <div className="border-b border-gold/25 py-1 text-center font-display text-[11px] font-bold uppercase tracking-[2px] text-gold-bright">
            🏆 Grande Final
          </div>
          {/* VS horizontal: competidor à ESQUERDA · placar no MEIO · à DIREITA */}
          <FinalVs
            a={a} b={b}
            scoreA={scoreA} scoreB={scoreB}
            winA={m.winner === m.a && m.done} winB={m.winner === m.b && m.done}
            mineA={m.a === myId} mineB={m.b === myId}
          />
        </>
      ) : (
        <>
          <Slot c={a} mine={m.a === myId} score={scoreA} winner={m.winner === m.a && m.done} eliminated={m.done && !!m.a && m.winner !== m.a} align={align} />
          <div className="h-px" style={{ background: "rgba(201,162,75,0.15)" }} />
          <Slot c={b} mine={m.b === myId} score={scoreB} winner={m.winner === m.b && m.done} eliminated={m.done && !!m.b && m.winner !== m.b} align={align} />
        </>
      )}
      {state === "live" && (
        <div className="bg-[rgba(201,162,75,0.12)] py-0.5 text-center font-mono text-[8px] font-bold uppercase tracking-[2px] text-gold-bright">⚔ ao vivo</div>
      )}
    </div>
  );
}

/** Layout da FINAL: um competidor de cada lado e o placar no centro. */
function FinalVs({ a, b, scoreA, scoreB, winA, winB, mineA, mineB }: {
  a: Competitor | null; b: Competitor | null;
  scoreA: number; scoreB: number; winA: boolean; winB: boolean; mineA: boolean; mineB: boolean;
}) {
  const Side = ({ c, mine, side }: { c: Competitor | null; mine: boolean; side: "l" | "r" }) => (
    <div className={`flex min-w-0 flex-1 flex-col ${side === "l" ? "items-start text-left" : "items-end text-right"}`}>
      {c ? (
        <>
          {/* lado direito espelhado: 🤖 vai DEPOIS do nome. */}
          <span className={`flex max-w-full items-center gap-1 ${side === "r" ? "flex-row-reverse" : ""}`}>
            {c.isBot && <span className="shrink-0 text-[12px] leading-none">🤖</span>}
            <span className={`min-w-0 truncate font-display text-[13px] font-bold ${mine ? "text-gold-bright" : "text-cream"}`}>
              {c.name}
            </span>
          </span>
          <span className="max-w-full truncate font-mono text-[9px] text-dim">{competitorSubtitle(c)} · {c.avg}</span>
        </>
      ) : (
        <span className="font-mono text-[11px] text-dim">a definir</span>
      )}
    </div>
  );
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <Side c={a} mine={mineA} side="l" />
      <span className="shrink-0 font-mono text-[18px] font-black tabular-nums">
        <span className={winA && scoreA > 0 ? "text-win" : "text-muted"}>{scoreA}</span>
        <span className="px-1 text-dim">–</span>
        <span className={winB && scoreB > 0 ? "text-win" : "text-muted"}>{scoreB}</span>
      </span>
      <Side c={b} mine={mineB} side="r" />
    </div>
  );
}

function Slot({ c, mine, score, winner, eliminated, align }: { c: Competitor | null; mine: boolean; score: number; winner: boolean; eliminated?: boolean; align: "left" | "right" | "center" }) {
  const reversed = align === "right";
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2 transition-opacity ${reversed ? "flex-row-reverse text-right" : ""} ${eliminated ? "opacity-45" : ""}`}
      style={
        eliminated
          ? { background: "rgba(8,9,11,0.55)" } // eliminado: fundo mais escuro + conteúdo apagado
          : mine && !winner
            ? { background: "rgba(201,162,75,0.08)" }
            : undefined
      }
    >
      <span className={`min-w-0 flex-1 ${reversed ? "text-right" : ""}`}>
        {c ? (
          <>
            {/* nome + ícone de bot: no lado direito o 🤖 vai DEPOIS do nome (espelhado). */}
            <span className={`flex items-center gap-1 ${reversed ? "flex-row-reverse" : ""}`}>
              {c.isBot && <span className="shrink-0 text-[12px] leading-none">🤖</span>}
              <span className={`min-w-0 truncate font-display text-[13px] font-bold ${mine ? "text-gold-bright" : "text-cream"}`}>
                {c.name}
              </span>
            </span>
            <span className="block truncate font-mono text-[9px] text-dim">{competitorSubtitle(c)} · {c.avg}</span>
          </>
        ) : (
          <span className="font-mono text-[11px] text-dim">a definir</span>
        )}
      </span>
      <span className={`font-mono text-[16px] font-black tabular-nums ${winner && score > 0 ? "text-win" : "text-muted"}`}>{c ? score : ""}</span>
    </div>
  );
}

// ============================================================
// Painel da SÉRIE: SEMPRE as 2 lines + centro. Antes de começar mostra o botão
// "Jogar série" + countdown; rolando mostra o feed; ao terminar, o resultado.
// ============================================================
function SeriesPanel({ match, live, byId, myId, secs, iAmIn, showRatings, onStart, onAdvance }: {
  match: BracketMatch; live: LiveSeries | null; byId: Map<string, Competitor>; myId: string;
  secs: number; iAmIn: boolean; showRatings: boolean; onStart: () => void; onAdvance: () => void;
}) {
  const a = (match.a ? byId.get(match.a) : null) ?? null;
  const b = (match.b ? byId.get(match.b) : null) ?? null;
  if (!a || !b) return null;

  const tl = live?.timelines[live.gameIndex];
  const events = tl ? tl.events.slice(0, live.eventIndex + 1) : [];
  const scoreA = live?.scoreA ?? 0;
  const scoreB = live?.scoreB ?? 0;
  const finished = !!live?.finished;
  const aWonSeries = !!live && live.finalA > live.finalB;

  return (
    // items-start: as lines têm altura PRÓPRIA (não esticam junto com o feed do centro).
    <div className="anim-fade-fast grid items-start gap-3 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.1fr_1fr]">
      {/* line A */}
      <LineColumn c={a} mine={a.id === myId} side="left" showRatings={showRatings} />

      {/* centro — altura FIXA pra não empurrar as lines; o feed rola por dentro. */}
      <div className="flex h-full min-h-[330px] flex-col items-center justify-center rounded-2xl border border-gold/25 px-3 py-5 text-center" style={{ background: "rgba(22,23,28,0.7)" }}>
        {!live ? (
          // AGUARDANDO o início: placar 0–0 + botão + countdown.
          <>
            <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">{STAGE_LABEL[match.stage]}</div>
            <div className="my-2 font-mono text-[40px] leading-none font-bold tracking-[2px] text-dim">0<span className="px-1">–</span>0</div>
            {iAmIn ? (
              <button onClick={onStart} className="btn-gold cursor-pointer rounded-[10px] border-none px-7 py-3 font-display text-[15px] font-semibold uppercase tracking-[2px]">
                ▶ Jogar série
              </button>
            ) : (
              <button onClick={onStart} className="btn-soft-gold cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
                ▶ Assistir agora
              </button>
            )}
            <span className="mt-3 font-mono text-[12px] text-muted">começa em <b className="text-gold-bright">{secs}s</b></span>
          </>
        ) : finished ? (
          // TERMINOU: placar final + quem avança + continuar.
          <div className="anim-pop flex flex-col items-center">
            <div className="font-mono text-[44px] leading-none font-bold tracking-[2px]">
              <span className={live.finalA === 0 ? "text-dim" : aWonSeries ? "text-win" : "text-red"}>{live.finalA}</span>
              <span className="text-dim">–</span>
              <span className={live.finalB === 0 ? "text-dim" : aWonSeries ? "text-red" : "text-win"}>{live.finalB}</span>
            </div>
            <div className="mt-3 font-display text-[16px] font-bold uppercase tracking-[2px] text-gold-bright">
              {competitorLabel(aWonSeries ? a : b)} avança!
            </div>
            <button onClick={onAdvance} className="btn-gold mt-5 cursor-pointer rounded-[10px] border-none px-7 py-3 font-display text-[15px] font-semibold uppercase tracking-[2px]">
              Continuar →
            </button>
          </div>
        ) : (
          // EM ANDAMENTO: placar ao vivo + feed de eventos.
          <>
            <div className="font-mono text-[40px] leading-none font-bold tracking-[2px]">
              <span className={scoreA === 0 ? "text-dim" : "text-win"}>{scoreA}</span>
              <span className="text-dim">–</span>
              <span className={scoreB === 0 ? "text-dim" : "text-red-soft"}>{scoreB}</span>
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[2px] text-muted">
              {live.timelines.length ? `Jogo ${live.gameIndex + 1} · ${minute(events)}'` : "Em jogo…"}
            </div>
            <div className="mt-3 flex w-full max-w-[340px] flex-col gap-1.5">
              {events.slice(-6).map((e, i) => (
                <div key={`${live.gameIndex}-${live.eventIndex}-${i}`}
                  className={`flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 ${i === events.slice(-6).length - 1 ? "anim-pop" : ""}`}
                  style={{
                    background: e.side === "a" ? "rgba(201,162,75,0.1)" : e.side === "b" ? "rgba(210,122,104,0.1)" : "rgba(255,255,255,0.03)",
                    border: e.big ? "1px solid rgba(232,206,134,0.4)" : "1px solid transparent",
                  }}>
                  <span className="font-mono text-[9px] text-dim tabular-nums">{e.minute}'</span>
                  <span className="text-[13px]">{e.icon}</span>
                  <span className={`min-w-0 flex-1 truncate font-mono text-[11px] ${e.big ? "font-bold text-cream" : "text-[#C9C7BD]"}`}>{e.text}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* line B */}
      <LineColumn c={b} mine={b.id === myId} side="right" showRatings={showRatings} />
    </div>
  );
}

function minute(events: { minute: number }[]): number {
  return events.length ? events[events.length - 1].minute : 0;
}

/** Card de line no MESMO estilo do solo: nome no topo, pill de overall colorido
 *  por raridade, média no rodapé. Altura própria (não cresce com o feed). */
function LineColumn({ c, mine, side, showRatings }: { c: Competitor; mine: boolean; side: "left" | "right"; showRatings: boolean }) {
  const accent = mine ? "#e8ce86" : "#cfd3cb";
  const eff = (p: TournamentPick) => p.rating + (c.form[p.role] ?? 0);
  const avg = lineAvg(c.line.map((p) => ({ ...p, rating: eff(p) })));
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border" style={{ borderColor: mine ? "rgba(201,162,75,0.4)" : "rgba(201,162,75,0.2)", background: "linear-gradient(180deg,rgba(40,41,44,0.82),rgba(28,29,31,0.84))" }}>
      {/* cabeçalho: nome (sem placar — o placar fica no centro e no bracket) */}
      <div className={`flex items-center border-b border-gold/20 px-4 py-3 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
        <div className="min-w-0">
          <div className="truncate font-display text-[16px] font-bold leading-tight" style={{ color: accent }}>{competitorLabel(c)}</div>
          <div className="truncate font-mono text-[10px] text-dim">{competitorSubtitle(c)}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-1.5 sm:gap-1.5 sm:p-2">
        {c.line.map((p) => {
          const r = eff(p);
          const skin = rarityFor(r);
          const form = c.form[p.role] ?? 0;
          // pill de overall tingida pela raridade (igual ao solo).
          const pill = showRatings && (
            <span className="relative inline-flex min-w-[32px] items-center justify-center rounded-[7px] px-[6px] py-[4px] font-mono text-[16px] font-black leading-none tabular-nums"
              style={{ color: skin.ratingColor, background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`, border: `1px solid ${form !== 0 ? (form > 0 ? "rgba(127,209,138,0.7)" : "rgba(120,180,255,0.7)") : `color-mix(in srgb, ${skin.ratingColor} 38%, transparent)`}` }}>
              {r}
            </span>
          );
          const ident = (
            <span className={`flex min-w-0 flex-1 items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
              <Flag cc={p.country} size={13} />
              <span className="truncate font-display text-[15px] font-semibold text-cream">{p.name}</span>
              {form !== 0 && <span title={form > 0 ? "Em chamas (+)" : "Gelado (−)"} className="shrink-0 text-[12px]">{form > 0 ? "🔥" : "🧊"}</span>}
            </span>
          );
          return (
            <div key={p.role} className={`flex items-center gap-2 rounded-[10px] px-2 py-1.5 sm:px-2.5 sm:py-2 ${side === "right" ? "flex-row-reverse" : ""}`}
              style={{ background: "linear-gradient(100deg,rgba(42,44,48,0.62),rgba(30,31,34,0.5))", border: "1px solid rgba(201,162,75,0.14)" }}>
              <RoleBadge role={p.role as Role} variant={mine ? "gold" : "neutral"} size="sm" />
              {ident}
              {pill}
            </div>
          );
        })}
      </div>
      {showRatings && (
        <div className={`flex items-center justify-between border-t border-gold/15 px-3.5 py-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
          <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">Média</span>
          <span className="font-mono text-[18px] font-bold" style={{ color: accent }}>{avg}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Histórico das séries do torneio (barras de resultado + penta + mvp), como no solo.
// ============================================================
function LaneIcon({ role }: { role: Role }) {
  return <span aria-hidden className="inline-block h-[11px] w-[11px] shrink-0 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: ROLE_SVG[role] }} />;
}
function HlName({ hl }: { hl: TourHl }) {
  const color = hl.side === "you" ? "text-gold-bright" : "text-red-soft";
  return (
    <span className="flex items-center gap-1">
      <span className={color}><LaneIcon role={hl.role} /></span>
      <Flag cc={hl.country} size={10} />
      <span className={`font-display text-[12px] font-bold ${color}`}>{hl.name}</span>
    </span>
  );
}

function SeriesHistory({ history }: { history: TourSeries[] }) {
  return (
    <div className="anim-fade-fast mx-auto mt-7 max-w-[880px]">
      <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[3px] text-muted">Histórico de partidas</div>
      <div className="flex flex-col gap-5">
        {history.slice().reverse().map((s, si) => (
          <div key={si}>
            {/* cabeçalho do bloco da série */}
            <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 px-1">
              <span className="font-display text-[13px] font-bold uppercase tracking-[1.5px] text-gold-bright">{s.stageLabel}</span>
              <span className="font-mono text-[10px] uppercase tracking-[1px] text-dim">vs {s.oppLabel}{s.oppSub ? ` · ${s.oppSub}` : ""}</span>
              {s.mvp && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                  style={s.mvp.side === "you" ? { background: "rgba(201,162,75,0.14)", border: "1px solid rgba(232,206,134,0.45)" } : { background: "rgba(210,122,104,0.13)", border: "1px solid rgba(224,154,135,0.4)" }}>
                  <span className="text-[11px]">🏅</span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[1px] text-muted">MVP</span>
                  <HlName hl={s.mvp} />
                </span>
              )}
              <span className="h-px flex-1" style={{ background: "rgba(201,162,75,0.18)" }} />
              <span className={`font-mono text-[13px] font-bold tracking-[1px] ${s.won ? "text-win" : "text-red"}`}>{s.yourGames}–{s.oppGames}</span>
            </div>
            {/* jogos da série */}
            <div className="flex flex-col gap-1.5">
              {s.games.slice().reverse().map((g, gi) => (
                <div key={gi} className="flex items-center gap-3 rounded-[11px] border px-3.5 py-2.5"
                  style={{ background: g.youWon ? "rgba(30,40,33,0.55)" : "rgba(44,32,33,0.5)", borderColor: g.youWon ? "rgba(126,208,143,0.24)" : "rgba(210,122,104,0.26)" }}>
                  <span className={`w-[78px] flex-none rounded-[6px] px-2 py-1 text-center font-mono text-[10px] font-bold uppercase tracking-[1px] ${g.youWon ? "text-win" : "text-red-soft"}`}
                    style={{ background: g.youWon ? "rgba(126,208,143,0.14)" : "rgba(210,122,104,0.14)", border: `1px solid ${g.youWon ? "rgba(126,208,143,0.4)" : "rgba(210,122,104,0.4)"}` }}>
                    {g.youWon ? "Vitória" : "Derrota"}
                  </span>
                  <span className="w-[52px] flex-none font-mono text-[11px] font-bold tracking-[1px] text-muted">Jogo {gi + 1}</span>
                  <span className="flex min-w-0 flex-1 items-center gap-1.5">
                    {g.mvp && (<><span className="text-[12px]">⭐</span><HlName hl={g.mvp} /></>)}
                  </span>
                  {g.pentas.length > 0 && (
                    <span className="flex flex-wrap items-center justify-end gap-1.5">
                      {g.pentas.map((k, ki) => (
                        <span key={ki} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.5px] ${k.side === "you" ? "text-gold-bright" : "text-red-soft"}`}
                          style={k.side === "you" ? { background: "rgba(201,162,75,0.14)", border: "1px solid rgba(201,162,75,0.3)" } : { background: "rgba(210,122,104,0.13)", border: "1px solid rgba(210,122,104,0.3)" }}>
                          ⚔ <LaneIcon role={k.role} /> {k.name}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
