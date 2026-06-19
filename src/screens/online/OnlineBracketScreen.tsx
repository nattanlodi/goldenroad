// ============================================================
// OnlineBracketScreen — bracket persistente de 8 ONLINE (Degrau 2)
// ============================================================
// Topo: o bracket borboleta (quartas nas pontas → semis → final no centro), com
// placar de cada confronto vindo do estado oficial. Embaixo: a série atual
// (LineColumn dos dois + placar/feed), narrada LOCALMENTE em cada cliente.
//
// O host orquestra (resolve bot×bot, abre séries com humano, propaga); os
// clientes só renderizam o snapshot + narram a série corrente em sincronia.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  withTimelines,
  type UseOnlineRoom,
} from "../../game/online/useOnlineRoom";
import type { TournamentSounds } from "../../game/useTournament";
import { useSeriesNarration } from "../../game/online/useSeriesNarration";
import { scoreAtElapsed } from "../../game/online/seriesNarration";
import type { SeriesState, SideMatch } from "../../game/online/roomState";
import { ROLES } from "../../data/teams";
import { isTournamentOver, competitorLabel, type Bracket, type BracketMatch, type Competitor, type TournamentPick } from "../../game/tournament";
import { Logo6x0 } from "../../components/Logo6x0";
import { LineColumn } from "../tournament/LineColumn";
import { InspectOverlay } from "../tournament/InspectOverlay";
import { useSeriesSounds } from "./useSeriesSounds";
import { OnlineCardOverlay } from "./OnlineCardOverlay";

/** No modo paralelo, revela o placar das OUTRAS séries com humano no bracket
 * usando o MESMO timing da narração (cada jogo só conta quando, no relógio real,
 * aquele jogo terminaria) — não uma estimativa adiantada. */
function useParallelHumanScores(series: SeriesState[], myId: string | null, byId: Map<string, Competitor>, code: string, imersivo: boolean): Map<string, { a: number; b: number; done: boolean }> {
  const [, force] = useState(0);
  useEffect(() => {
    if (!series.length) return;
    const id = setInterval(() => force((n) => n + 1), 500);
    return () => clearInterval(id);
  }, [series]);
  const now = Date.now();
  const out = new Map<string, { a: number; b: number; done: boolean }>();
  for (const s of series) {
    if (s.aId === myId || s.bId === myId) continue; // a minha eu narro de verdade
    if (s.games.length === 0) { out.set(`${s.aId}|${s.bId}`, { a: 0, b: 0, done: false }); continue; } // ainda em cartas/sem sim
    const start = s.startDeadline ?? now;
    const elapsed = now - start; // negativo durante o countdown → placar 0-0
    const hydrated = withTimelines(s, byId, code, imersivo);
    const sc = elapsed <= 0 ? { a: 0, b: 0, done: false } : scoreAtElapsed(hydrated, imersivo, elapsed);
    out.set(`${s.aId}|${s.bId}`, sc);
  }
  return out;
}

/** Placar parcial das bot×bot revelado pelo SCHEDULE (cada cliente, pelo relógio). */
function useSideScores(sideMatches: SideMatch[]): Map<string, { a: number; b: number; done: boolean }> {
  const [, force] = useState(0);
  useEffect(() => {
    if (!sideMatches.length) return;
    const id = setInterval(() => force((n) => n + 1), 400);
    return () => clearInterval(id);
  }, [sideMatches]);
  const now = Date.now();
  const out = new Map<string, { a: number; b: number; done: boolean }>();
  for (const sm of sideMatches) {
    let a = 0, b = 0, revealed = 0;
    for (let k = 0; k < sm.games.length; k++) {
      if (sm.schedule[k] <= now) { revealed++; if (sm.games[k]) a++; else b++; }
    }
    out.set(sm.matchId, { a, b, done: revealed >= sm.games.length });
  }
  return out;
}

// ============================================================
// MODO ESPECTADOR LOCAL (jogador eliminado)
// ============================================================
// Quando um humano perde a sua série, ele NÃO depende mais dos snapshots do host
// (que se perdem no Realtime best-effort). Como tudo é determinístico por seed, o
// eliminado deriva e narra LOCALMENTE as séries restantes do torneio, fase a fase,
// até a grande final acabar — e só então vai pro pódio.

/** Estou ELIMINADO? (já joguei uma série concluída e não estou em nenhum match
 * ainda por jogar). Calculado sobre o bracket dado (o do host). */
function isEliminated(bracket: Bracket, myId: string | null): boolean {
  if (!myId) return false;
  const all = [...bracket.qf, ...bracket.sf, bracket.gf];
  const playedDone = all.some((m) => m.done && (m.a === myId || m.b === myId));
  if (!playedDone) return false; // ainda nem joguei
  const stillIn = all.some((m) => !m.done && (m.a === myId || m.b === myId));
  return !stillIn; // joguei e não estou em nenhum confronto pendente → eliminado
}

/** Motor do espectador (eliminado): ESPELHA o ritmo do HOST. Em vez de rodar o
 * torneio sozinho (corria na frente), assiste UMA série da fase que o host disparou
 * (`hostSeries` = st.parallelSeries) — prioriza um confronto com humano que não seja
 * o meu. Quando o host avança a fase (parallelSeries muda), passa pra próxima. O
 * pódio vem do host (phase "result"), então NÃO derivamos o fim localmente.
 *
 * Sempre roda (hooks incondicionais); só "liga" quando `active`. */
function useSpectatorEngine(
  active: boolean,
  hostSeries: SeriesState[],
  myId: string | null,
  byId: Map<string, Competitor>,
  code: string,
  imersivo: boolean,
): { series: SeriesState | null } {
  // a série a assistir: a 1ª com humano que NÃO seja a minha; senão a 1ª qualquer.
  // (segue o host — só existe enquanto o host mantém essa fase em parallelSeries.)
  const series = useMemo(() => {
    if (!active || !hostSeries.length) return null;
    const human = hostSeries.find((s) => {
      const aBot = byId.get(s.aId)?.isBot ?? true;
      const bBot = byId.get(s.bId)?.isBot ?? true;
      return (!aBot || !bBot) && s.aId !== myId && s.bId !== myId;
    });
    const chosen = human ?? hostSeries[0];
    if (!chosen) return null;
    // reidrata as timelines (não trafegam) pra narrar localmente, no mesmo ritmo.
    return withTimelines(chosen, byId, code, imersivo);
  }, [active, hostSeries, myId, byId, code, imersivo]);

  return { series };
}

export function OnlineBracket({ r, myId, sounds, onExit }: { r: UseOnlineRoom; myId: string | null; sounds: TournamentSounds; onExit: () => void }) {
  const st = r.state;
  const showRatings = !(st?.config.hideRatings ?? false);
  const imersivo = !(st?.config.pace === "rapido");

  // competidores por id (humanos + bots) a partir dos players.
  const byId = useMemo(() => {
    const m = new Map<string, Competitor>();
    for (const p of st?.players ?? []) {
      const line = ROLES.map((rr) => p.picks[rr]).filter((x): x is TournamentPick => !!x);
      const avg = line.length ? Math.round(line.reduce((a, x) => a + x.rating, 0) / line.length) : 0;
      m.set(p.playerId, { id: p.playerId, name: p.nick, isBot: p.isBot, line, avg, form: {} });
    }
    return m;
  }, [st?.players]);

  // a série que EU assisto: a MINHA de `parallelSeries` (onde sou um dos lados).
  // Cada jogador vê só a sua série (modo único = paralelo).
  const mySeries = (st?.parallelSeries ?? []).find((s) => s.aId === myId || s.bId === myId) ?? null;

  // som do CAMPEÃO: dispara UMA vez quando o torneio é decidido (tournamentOver
  // vira true) — vale pra todos (host e espectadores), no momento em que o painel
  // de campeão aparece na tela de bracket.
  const championSoundedRef = useRef(false);
  useEffect(() => {
    if (st?.tournamentOver && !championSoundedRef.current) {
      championSoundedRef.current = true;
      sounds.sndChampion();
    }
  }, [st?.tournamentOver, sounds]);

  // tick local pra abrir o overlay de cartas quando o countdown da minha série
  // acaba (a janela de escolha começa só depois do "começa em Xs").
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 300);
    return () => clearInterval(id);
  }, []);
  // séries cujo MEU pick eu JÁ ENVIEI (por seedSalt). Como o cliente é otimista
  // (a intent vai pro host e só volta no snapshot), marco localmente pra FECHAR o
  // overlay na hora — senão o convidado ficaria preso em "aguardando" até o
  // snapshot do host voltar (e se o pick chega tarde, ele nunca volta). Assim o
  // convidado segue o snapshot do host (que avança a fase) sem travar no overlay.
  const pickedSeriesRef = useRef<Set<string>>(new Set());
  const markPicked = (salt: string) => { pickedSeriesRef.current.add(salt); forceTick((n) => n + 1); };
  // devo escolher uma carta AGORA? (minha série tem cartas pendentes, o countdown
  // já passou, e eu ainda não pickei). myId é um dos lados → A ou B.
  const cardPhase = (() => {
    const s = mySeries;
    if (!s?.cards || !myId) return null;
    const iAmA = s.aId === myId;
    const iAmB = s.bId === myId;
    if (!iAmA && !iAmB) return null; // espectador não escolhe
    const myPick = iAmA ? s.cards.pickA : s.cards.pickB;
    if (myPick) return null; // já escolhi (confirmado pelo host)
    if (pickedSeriesRef.current.has(s.seedSalt)) return null; // já enviei (otimista)
    const countdownOver = s.startDeadline == null || Date.now() >= s.startDeadline;
    if (!countdownOver) return null;
    const myComp = byId.get(myId);
    const oppComp = byId.get(iAmA ? s.bId : s.aId);
    if (!myComp || !oppComp) return null;
    return { salt: s.seedSalt, trio: iAmA ? s.cards.trioA : s.cards.trioB, hostile: s.cards.hostile, deadline: s.cards.deadline, myComp, oppComp };
  })();
  // série ainda na subfase de CARTAS (sem jogos simulados)? não narra ainda — o
  // overlay cuida da escolha; a narração só começa quando os games chegam.
  const cardsPending = !!mySeries?.cards && mySeries.games.length === 0;
  // reidrata as timelines da série (não trafegam na rede; regeneradas por seed).
  const hydratedSeries = useMemo(
    () => (mySeries && !cardsPending ? withTimelines(mySeries, byId, st!.code, imersivo) : null),
    [mySeries, cardsPending, byId, st?.code, imersivo]
  );

  // ── MODO ESPECTADOR (eliminado) ──
  // Estou eliminado e o torneio ainda não acabou? Viro espectador: assisto UMA
  // série da fase que o HOST disparou (seguindo o ritmo dele, sem correr na frente).
  const eliminated = !!st?.bracket && isEliminated(st.bracket, myId) && !isTournamentOver(st.bracket);
  const spectator = useSpectatorEngine(eliminated, st?.parallelSeries ?? [], myId, byId, st?.code ?? "", imersivo);

  // narração local da série atual. Ativo: a MINHA série. Espectador: a do host que
  // escolhi assistir. (As duas vêm do estado do host; cada cliente narra local.)
  const narrationInput = eliminated ? spectator.series : hydratedSeries;
  const { s, secs } = useSeriesNarration(narrationInput, imersivo);
  useSeriesSounds(s, myId, sounds);
  // placar parcial das bot×bot revelado pelo schedule (local). No paralelo, também
  // revela as OUTRAS séries com humano (que eu não estou assistindo) no bracket.
  const sideScores = useSideScores(st?.sideMatches ?? []);
  const otherHumanScores = useParallelHumanScores(st?.parallelSeries ?? [], myId, byId, st?.code ?? "", imersivo);
  // confronto inspecionado (clique num card → modal das 2 lines, igual offline).
  const [inspectId, setInspectId] = useState<string | null>(null);

  if (!st?.bracket) return null;
  // bracket EXIBIDO: sempre o do host (o espectador segue o ritmo dele).
  const bracket = st.bracket;
  const liveId = s?.aId && s?.bId ? matchIdOf(bracket, s.aId, s.bId) : null;
  // a fase a iniciar tem algum confronto com humano? (senão é uma rodada só de
  // bots — o texto do botão "Iniciar" muda pra deixar claro.)
  const pendingWithHuman = [...bracket.qf, ...bracket.sf, bracket.gf].some(
    (m) => !m.done && m.a && m.b && (!byId.get(m.a)?.isBot || !byId.get(m.b)?.isBot)
  );

  // placares "ao vivo" no bracket = bot×bot (schedule) + outras séries humanas (paralelo).
  const liveScores = new Map(sideScores);
  for (const [pair, sc] of otherHumanScores) {
    const [x, y] = pair.split("|");
    const mid = matchIdOf(bracket, x, y);
    if (mid) liveScores.set(mid, sc);
  }

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1360px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-[13px]">
          <div onClick={onExit} title="Sair" className="-m-1 cursor-pointer rounded-lg p-1 transition-opacity hover:opacity-70">
            <Logo6x0 className="h-auto w-[170px]" />
          </div>
          <span className="font-display text-[14px] font-bold uppercase tracking-[2px] text-gold-bright">🏆 Duelo online · Bracket de 8</span>
          {eliminated && (
            <span className="rounded-full border border-gold/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[2px] text-muted">👁 modo espectador</span>
          )}
        </div>
      </div>

      <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[2px] text-dim">toque num confronto pra ver as lines</div>

      {/* bracket borboleta */}
      <Butterfly bracket={bracket} byId={byId} myId={myId} liveId={liveId} liveScore={s ? { a: s.scoreA, b: s.scoreB, aId: s.aId } : null} sideScores={liveScores} onInspect={setInspectId} />

      {/* painel da série */}
      <div className="mt-10 pt-7">
        {st.tournamentOver ? (
          // grande final acabou: o resultado fica AQUI (no bracket) até o host clicar
          // "Ver classificação final" — não pula direto pro pódio.
          <TournamentOverPanel champion={st.winnerId ? byId.get(st.winnerId) ?? null : null} showButton={r.isHost} onShow={r.showFinalResult} />
        ) : s ? (
          <SeriesPanel s={s} secs={secs} byId={byId} myId={myId} showRatings={showRatings} />
        ) : cardsPending && mySeries ? (
          // subfase de cartas: o overlay (se for minha vez) fica por cima; aqui
          // mostro o confronto + "evento em andamento".
          <CardsPhasePanel s={mySeries} byId={byId} myId={myId} showRatings={showRatings} iSent={pickedSeriesRef.current.has(mySeries.seedSalt)} />
        ) : st.parallelPending ? (
          // o HOST sempre comanda o início da rodada — mesmo eliminado e mesmo numa
          // fase só de bots (organizador do evento). Os demais aguardam o clique.
          <ParallelStartPanel showButton={r.isHost} hasHuman={pendingWithHuman} onStart={r.startBracketSeries} />
        ) : st.parallelSeries.length ? (
          // séries rolando mas a MINHA já acabou (ou não estou em nenhuma) → aguarda a fase.
          <div className="rounded-2xl border border-gold/20 px-4 py-10 text-center font-mono text-[13px] text-muted" style={{ background: "rgba(22,23,28,0.6)" }}>
            ⏳ Sua série terminou — aguardando as outras da fase…
          </div>
        ) : st.sideMatches.length ? (
          // fase SÓ de bots (todos os humanos eliminados): as partidas rolam no
          // bracket acima (placar ao vivo). O campeonato continua até a final.
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gold/20 px-4 py-10 text-center" style={{ background: "rgba(22,23,28,0.6)" }}>
            <div className="text-[26px]">🤖</div>
            <div className="mt-2 font-display text-[15px] font-bold uppercase tracking-[1px] text-cream">Partidas dos bots em andamento</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[2px] text-muted">acompanhe os placares no bracket acima ↑</div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gold/20 px-4 py-8 text-center font-mono text-[12px] text-muted" style={{ background: "rgba(22,23,28,0.6)" }}>
            resolvendo confrontos…
          </div>
        )}
      </div>

      {/* modal de inspeção (mesmo do 1×7) */}
      {inspectId && (() => {
        const m = [...bracket.qf, ...bracket.sf, bracket.gf].find((x) => x.id === inspectId);
        if (!m) return null;
        // placar a exibir: ao vivo (minha série), parcial (bot×bot/outras) ou final.
        const side = liveScores.get(m.id);
        const score = liveId === m.id && s
          ? { a: m.a === s.aId ? s.scoreA : s.scoreB, b: m.a === s.aId ? s.scoreB : s.scoreA, done: s.finished }
          : side && !m.done
            ? { a: side.a, b: side.b, done: side.done }
            : { a: m.scoreA, b: m.scoreB, done: m.done };
        return <InspectOverlay match={m} byId={byId} myId={myId ?? ""} showRatings={showRatings} score={score} onClose={() => setInspectId(null)} />;
      })()}

      {/* overlay de escolha de carta (PvP simétrico) — só quando é a MINHA vez.
          key por seedSalt reseta o estado interno a cada série nova. Ao escolher,
          marco a série localmente (markPicked) pra fechar o overlay na hora. */}
      {cardPhase && (
        <OnlineCardOverlay
          key={cardPhase.salt}
          trio={cardPhase.trio}
          hostile={cardPhase.hostile}
          deadline={cardPhase.deadline}
          myLine={cardPhase.myComp}
          oppLine={cardPhase.oppComp}
          onPick={(choice) => { r.pickCard(choice); markPicked(cardPhase.salt); }}
        />
      )}
    </div>
  );
}

/** Acha o matchId de um confronto pelos dois competidores. */
function matchIdOf(bracket: { qf: BracketMatch[]; sf: BracketMatch[]; gf: BracketMatch }, x: string, y: string): string | null {
  const all = [...bracket.qf, ...bracket.sf, bracket.gf];
  const m = all.find((mm) => (mm.a === x && mm.b === y) || (mm.a === y && mm.b === x));
  return m?.id ?? null;
}

// ── painel "fim do torneio" — a final acabou; o host decide quando ir ao pódio ──
function TournamentOverPanel({ champion, showButton, onShow }: { champion: Competitor | null; showButton: boolean; onShow: () => void }) {
  return (
    <div className="anim-pop flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-gold/45 px-4 py-10 text-center"
      style={{ background: "linear-gradient(160deg,rgba(58,48,22,0.5),rgba(22,23,28,0.85))" }}>
      <div className="text-[40px]">🏆</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[3px] text-muted">Grande final encerrada</div>
      <div className="mt-2 font-display text-[24px] font-black uppercase tracking-[1px]">
        {champion ? (
          <>
            {champion.isBot && <span className="text-cream">🤖 </span>}
            <span className="text-gold-fill">{champion.name} é campeão!</span>
          </>
        ) : (
          <span className="text-gold-fill">Torneio encerrado</span>
        )}
      </div>
      {showButton ? (
        <button onClick={onShow} className="btn-gold mt-6 cursor-pointer rounded-[12px] border-none px-8 py-3.5 font-display text-[16px] font-semibold uppercase tracking-[2px]">
          🏅 Ver classificação final
        </button>
      ) : (
        <span className="mt-5 font-mono text-[12px] text-muted">aguardando o host abrir a classificação final…</span>
      )}
    </div>
  );
}

// ── painel "iniciar rodada" do modo paralelo (o host comanda, sempre) ──
function ParallelStartPanel({ showButton, hasHuman, onStart }: { showButton: boolean; hasHuman: boolean; onStart: () => void }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-gold/25 px-4 py-10 text-center" style={{ background: "rgba(22,23,28,0.7)" }}>
      <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">Fase pronta</div>
      <div className="mt-2 mb-5 font-display text-[18px] font-bold uppercase tracking-[1px] text-cream">
        {hasHuman
          ? "Todas as séries com humano rodam juntas — cada um vê a sua"
          : "Rodada só de bots — acompanhe os placares no bracket acima"}
      </div>
      {showButton ? (
        <button onClick={onStart} className="btn-gold cursor-pointer rounded-[12px] border-none px-8 py-3.5 font-display text-[16px] font-semibold uppercase tracking-[2px]">
          ▶ Iniciar rodada
        </button>
      ) : (
        <span className="font-mono text-[12px] text-muted">aguardando o host iniciar a rodada…</span>
      )}
    </div>
  );
}

// ── painel da subfase de cartas (egocêntrico: eu à esquerda) ──
function CardsPhasePanel({ s, byId, myId, showRatings, iSent }: { s: SeriesState; byId: Map<string, Competitor>; myId: string | null; showRatings: boolean; iSent: boolean }) {
  const iAmA = s.aId === myId;
  const leftId = iAmA || s.bId !== myId ? s.aId : s.bId;
  const rightId = leftId === s.aId ? s.bId : s.aId;
  const left = byId.get(leftId);
  const right = byId.get(rightId);
  if (!left || !right) return null;
  const hostile = s.cards?.hostile;
  // já escolhi: confirmado pelo host (pickA/pickB) OU enviado localmente (iSent).
  const iPicked = iSent || (iAmA ? s.cards?.pickA : s.cards?.pickB) != null;
  const spectator = !iAmA && s.bId !== myId;
  return (
    <div className="grid items-start gap-3 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.1fr_1fr]">
      <LineColumn c={left} mine={left.id === myId} side="left" showRatings={showRatings} subtitle="" />
      <div className="flex h-full min-h-[330px] flex-col items-center justify-center rounded-2xl border px-3 py-5 text-center" style={{ background: "rgba(22,23,28,0.7)", borderColor: hostile ? "rgba(224,88,74,0.4)" : "rgba(201,162,75,0.3)" }}>
        <div className="text-[34px]">{hostile ? "⚠️" : "⚡"}</div>
        <div className="mt-2 font-display text-[17px] font-bold uppercase tracking-[1px]" style={{ color: hostile ? "#f0867a" : "#e8ce86" }}>
          {hostile ? "Evento de azar" : "Evento de cartas"}
        </div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[2px] text-muted">
          {spectator ? "os dois estão escolhendo…" : iPicked ? "aguardando o rival escolher…" : "escolha a sua carta acima"}
        </div>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[2px] text-dim">mesmo nível pros dois lados</div>
      </div>
      <LineColumn c={right} mine={right.id === myId} side="right" showRatings={showRatings} subtitle="" />
    </div>
  );
}

// ── painel da série corrente (egocêntrico: eu à esquerda) ──
function SeriesPanel({ s, secs, byId, myId, showRatings }: { s: NonNullable<ReturnType<typeof useSeriesNarration>>["s"]; secs: number; byId: Map<string, Competitor>; myId: string | null; showRatings: boolean }) {
  if (!s) return null;
  const iAmA = s.aId === myId;
  // se eu não estou no confronto, mostro A à esquerda (espectador).
  const leftId = iAmA || s.bId !== myId ? s.aId : s.bId;
  const rightId = leftId === s.aId ? s.bId : s.aId;
  const left = byId.get(leftId);
  const right = byId.get(rightId);
  if (!left || !right) return null;
  const leftSide: "a" | "b" = leftId === s.aId ? "a" : "b";
  const leftScore = leftSide === "a" ? s.scoreA : s.scoreB;
  const rightScore = leftSide === "a" ? s.scoreB : s.scoreA;
  const leftFinal = leftSide === "a" ? s.finalA : s.finalB;
  const rightFinal = leftSide === "a" ? s.finalB : s.finalA;
  const tl = s.timelines[s.gameIndex];
  const events = tl ? tl.events.slice(0, s.eventIndex + 1) : [];
  const minute = events.length ? events[events.length - 1].minute : 0;

  return (
    <div className="grid items-start gap-3 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.1fr_1fr]">
      <LineColumn c={left} mine={left.id === myId} side="left" showRatings={showRatings} subtitle="" />
      <div className="flex h-full min-h-[330px] flex-col items-center justify-center rounded-2xl border border-gold/25 px-3 py-5 text-center" style={{ background: "rgba(22,23,28,0.7)" }}>
        {s.startDeadline != null ? (
          <>
            <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">Próxima série</div>
            <div className="my-2 font-mono text-[40px] leading-none font-bold tracking-[2px] text-dim">0<span className="px-1">–</span>0</div>
            <div className="mt-1 font-display text-[15px] font-bold uppercase tracking-[1px] text-cream">{competitorLabel(left)} <span className="text-dim">vs</span> {competitorLabel(right)}</div>
            <span className="mt-3 font-mono text-[12px] text-muted">começa em <b className="text-gold-bright">{secs}s</b></span>
          </>
        ) : s.finished ? (
          <div className="anim-pop flex flex-col items-center">
            <div className="font-mono text-[44px] leading-none font-bold tracking-[2px]">
              <span className={leftFinal > rightFinal ? "text-win" : "text-red"}>{leftFinal}</span>
              <span className="text-dim">–</span>
              <span className={rightFinal > leftFinal ? "text-win" : "text-red"}>{rightFinal}</span>
            </div>
            <div className="mt-3 font-display text-[16px] font-bold uppercase tracking-[2px] text-gold-bright">
              {competitorLabel(leftFinal > rightFinal ? left : right)} avança!
            </div>
          </div>
        ) : (
          <>
            <div className="font-mono text-[40px] leading-none font-bold tracking-[2px]">
              <span className={leftScore === 0 ? "text-dim" : "text-win"}>{leftScore}</span>
              <span className="text-dim">–</span>
              <span className={rightScore === 0 ? "text-dim" : "text-red-soft"}>{rightScore}</span>
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[2px] text-muted">
              {s.timelines.length ? `Jogo ${s.gameIndex + 1} · ${minute}'` : "Em jogo…"}
            </div>
            <div className="mt-3 flex w-full max-w-[340px] flex-col gap-1.5">
              {events.slice(-6).map((e, i, arr) => {
                const mineSide = e.side === leftSide;
                const neutral = e.side === "neutral";
                return (
                  <div key={`${s.gameIndex}-${s.eventIndex}-${i}`}
                    className={`flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 ${i === arr.length - 1 ? "anim-pop" : ""}`}
                    style={{ background: neutral ? "rgba(255,255,255,0.03)" : mineSide ? "rgba(201,162,75,0.1)" : "rgba(210,122,104,0.1)", border: e.big ? "1px solid rgba(232,206,134,0.4)" : "1px solid transparent" }}>
                    <span className="font-mono text-[9px] text-dim tabular-nums">{e.minute}'</span>
                    <span className="text-[13px]">{e.icon}</span>
                    <span className={`min-w-0 flex-1 truncate font-mono text-[11px] ${e.big ? "font-bold text-cream" : "text-[#C9C7BD]"}`}>{e.text}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <LineColumn c={right} mine={right.id === myId} side="right" showRatings={showRatings} subtitle="" />
    </div>
  );
}

// ── bracket borboleta ──
function Butterfly({ bracket, byId, myId, liveId, liveScore, sideScores, onInspect }: {
  bracket: { qf: BracketMatch[]; sf: BracketMatch[]; gf: BracketMatch };
  byId: Map<string, Competitor>; myId: string | null; liveId: string | null;
  liveScore: { a: number; b: number; aId: string } | null;
  sideScores: Map<string, { a: number; b: number; done: boolean }>;
  onInspect: (id: string) => void;
}) {
  const left = { qf: bracket.qf.filter((m) => m.side === "left"), sf: bracket.sf.filter((m) => m.side === "left") };
  const right = { qf: bracket.qf.filter((m) => m.side === "right"), sf: bracket.sf.filter((m) => m.side === "right") };
  const scoreOf = (m: BracketMatch) => {
    if (liveId === m.id && liveScore) {
      // o placar ao vivo vem do lado da série (aId); mapeia pro lado do match.
      const aIsLiveA = m.a === liveScore.aId;
      return { a: aIsLiveA ? liveScore.a : liveScore.b, b: aIsLiveA ? liveScore.b : liveScore.a, live: true, done: m.done };
    }
    // bot×bot revelando em paralelo → placar parcial pelo schedule.
    const side = sideScores.get(m.id);
    if (side && !m.done) return { a: side.a, b: side.b, live: true, done: side.done };
    return { a: m.scoreA, b: m.scoreB, live: false, done: m.done };
  };

  return (
    <div className="grid items-center gap-3 [grid-template-columns:1fr_1fr_minmax(180px,1.25fr)_1fr_1fr]">
      {/* quartas esq */}
      <Column>{left.qf.map((m) => <MatchCard key={m.id} m={m} byId={byId} myId={myId} live={liveId === m.id} score={scoreOf(m)} onInspect={onInspect} stage="Quartas" />)}</Column>
      {/* semis esq */}
      <Column>{left.sf.map((m) => <MatchCard key={m.id} m={m} byId={byId} myId={myId} live={liveId === m.id} score={scoreOf(m)} onInspect={onInspect} stage="Semifinal" />)}</Column>
      {/* final */}
      <Column><MatchCard m={bracket.gf} byId={byId} myId={myId} live={liveId === bracket.gf.id} score={scoreOf(bracket.gf)} onInspect={onInspect} final /></Column>
      {/* semis dir */}
      <Column>{right.sf.map((m) => <MatchCard key={m.id} m={m} byId={byId} myId={myId} live={liveId === m.id} score={scoreOf(m)} onInspect={onInspect} stage="Semifinal" />)}</Column>
      {/* quartas dir */}
      <Column>{right.qf.map((m) => <MatchCard key={m.id} m={m} byId={byId} myId={myId} live={liveId === m.id} score={scoreOf(m)} onInspect={onInspect} stage="Quartas" />)}</Column>
    </div>
  );
}

function Column({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col justify-center gap-4">{children}</div>;
}

function MatchCard({ m, byId, myId, live, score, final, stage, onInspect }: {
  m: BracketMatch; byId: Map<string, Competitor>; myId: string | null;
  live: boolean; score: { a: number; b: number; live: boolean; done: boolean }; final?: boolean;
  stage?: string;
  onInspect: (id: string) => void;
}) {
  const a = m.a ? byId.get(m.a) : null;
  const b = m.b ? byId.get(m.b) : null;
  const started = score.a > 0 || score.b > 0 || score.done;
  const canInspect = !!a && !!b;
  return (
    <div onClick={canInspect ? () => onInspect(m.id) : undefined}
      className={`overflow-hidden rounded-[14px] border transition-shadow ${live ? "border-gold/70" : final ? "border-gold/45" : "border-gold/20"} ${canInspect ? "cursor-pointer hover:border-gold/55" : ""}`}
      style={{ background: final ? "linear-gradient(160deg,rgba(74,60,26,0.6),rgba(36,29,12,0.88))" : "rgba(26,27,31,0.7)", boxShadow: live ? "0 0 18px -4px rgba(201,162,75,0.6)" : undefined }}>
      {final ? (
        <div className="border-b border-gold/25 py-1.5 text-center font-mono text-[9.5px] uppercase tracking-[2px] text-gold-bright">🏆 Grande Final</div>
      ) : stage ? (
        <div className="border-b border-gold/10 py-1 text-center font-mono text-[8.5px] uppercase tracking-[2px] text-muted">{stage}</div>
      ) : null}
      <Slot c={a} mine={m.a === myId} score={started ? score.a : null} win={score.done && score.a > score.b} eliminated={score.done && score.a < score.b} />
      <div className="h-px bg-gold/15" />
      <Slot c={b} mine={m.b === myId} score={started ? score.b : null} win={score.done && score.b > score.a} eliminated={score.done && score.b < score.a} />
    </div>
  );
}

function Slot({ c, mine, score, win, eliminated }: { c: Competitor | null | undefined; mine: boolean; score: number | null; win: boolean; eliminated: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-2.5 ${eliminated ? "opacity-45" : ""}`} style={{ background: eliminated ? "rgba(0,0,0,0.55)" : undefined }}>
      <span className={`min-w-0 flex-1 truncate font-display text-[14px] font-semibold ${mine ? "text-gold-bright" : win ? "text-cream" : "text-muted"}`}>
        {c ? competitorLabel(c) : <span className="text-dim">a definir</span>}
      </span>
      <span className={`shrink-0 font-mono text-[16px] font-bold tabular-nums ${score === null || score === 0 ? "text-dim" : win ? "text-win" : "text-muted"}`}>
        {score ?? "–"}
      </span>
    </div>
  );
}
