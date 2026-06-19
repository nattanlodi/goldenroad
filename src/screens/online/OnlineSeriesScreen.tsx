// ============================================================
// OnlineSeriesScreen — a Bo5 do confronto direto, assistida pelos DOIS (legado)
// ============================================================
// Reusa o painel de série do bracket (LineColumn dos dois lados + centro com
// placar/feed). O host narra (avança o estado via seriesTick); os dois clientes
// só renderizam o snapshot — então veem o MESMO placar/feed no mesmo instante.
//
// Sons: tocados localmente em cada cliente reagindo às mudanças do estado
// sincronizado (placar sobe → win/lose; evento de penta → sndPenta) — mesma
// instância de áudio do solo.

import { useEffect, useRef, useState } from "react";
import type { UseOnlineRoom } from "../../game/online/useOnlineRoom";
import type { TournamentSounds } from "../../game/useTournament";
import { ROLES } from "../../data/teams";
import { type Competitor, type TournamentPick } from "../../game/tournament";
import type { SeriesState } from "../../game/online/roomState";
import { advanceSeries, stepDelayMs } from "../../game/online/seriesNarration";
import { Logo6x0 } from "../../components/Logo6x0";
import { LineColumn } from "../tournament/LineColumn";

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

export function OnlineSeries({ r, myId, sounds, onExit, onLocalFinish }: { r: UseOnlineRoom; myId: string | null; sounds: TournamentSounds; onExit: () => void; onLocalFinish: () => void }) {
  const st = r.state;
  const official = st?.series ?? null;
  const imersivo = !(st?.config.pace === "rapido");
  const showRatings = !(st?.config.hideRatings ?? false);

  // ── NARRAÇÃO LOCAL ──
  // A série pré-simulada chega UMA vez; cada cliente narra (placar/feed subindo)
  // localmente, em sincronia (timing determinístico). CADA cliente inicia a
  // narração SOZINHO assim que o relógio passa do startDeadline (timestamp
  // absoluto que ele já conhece) — NÃO depende do host transmitir nada, senão o
  // convidado fica preso no "começa em 0s" (era esse o bug).
  const [local, setLocal] = useState<SeriesState | null>(null);
  const [started, setStarted] = useState(false);
  const startedKey = useRef("");

  // arma o início local no momento exato do startDeadline (ou já, se passou).
  useEffect(() => {
    if (!official) { setLocal(null); setStarted(false); startedKey.current = ""; return; }
    const key = `${official.aId}:${official.bId}`;
    if (startedKey.current === key) return; // já tratei esta série
    const begin = () => {
      startedKey.current = key;
      setStarted(true);
      setLocal({ ...official, startDeadline: null, scoreA: 0, scoreB: 0, gameIndex: 0, eventIndex: 0, finished: false });
    };
    const wait = official.startDeadline != null ? official.startDeadline - Date.now() : 0;
    if (wait <= 0) { begin(); return; }
    const id = setTimeout(begin, wait);
    return () => clearTimeout(id);
  }, [official]);

  // avança a narração local no ritmo determinístico.
  useEffect(() => {
    if (!local || local.finished) return;
    const id = setTimeout(() => setLocal((cur) => (cur ? advanceSeries(cur, imersivo) : cur)), stepDelayMs(local, imersivo));
    return () => clearTimeout(id);
  }, [local, imersivo]);

  // narração local terminou → após um respiro, avança pro resultado (não espera
  // o snapshot do host, que pode se perder).
  useEffect(() => {
    if (!local?.finished) return;
    const id = setTimeout(onLocalFinish, 2600);
    return () => clearTimeout(id);
  }, [local?.finished, onLocalFinish]);

  // estado exibido: antes de começar mostra o oficial (countdown); depois, o local.
  const s = started ? (local ?? official) : official;

  // monta os dois Competitor a partir das lines oficiais.
  const playerCompetitor = (pid: string | undefined): Competitor => {
    const p = st?.players.find((pp) => pp.playerId === pid);
    const line = p ? ROLES.map((rr) => p.picks[rr]).filter((x): x is TournamentPick => !!x) : [];
    const avg = line.length ? Math.round(line.reduce((a, x) => a + x.rating, 0) / line.length) : 0;
    return { id: pid ?? "?", name: p?.nick ?? "—", isBot: false, line, avg, form: {} };
  };

  // VISÃO EGOCÊNTRICA: cada jogador vê a PRÓPRIA line à esquerda. "mySide" é o
  // lado (a/b) que sou eu na simulação; mapeio placar/eventos pra esquerda=eu.
  const iAmA = s?.aId === myId;
  const meId = iAmA ? s?.aId : s?.bId;
  const oppId = iAmA ? s?.bId : s?.aId;
  const meC = playerCompetitor(meId);   // esquerda (sempre eu)
  const oppC = playerCompetitor(oppId); // direita (adversário)
  const mySide: "a" | "b" = iAmA ? "a" : "b";

  const secs = useCountdown(s?.startDeadline ?? null);

  // ── sons reagindo ao estado sincronizado ──
  const prevScore = useRef("0-0");
  const prevPenta = useRef("");
  useEffect(() => {
    if (!s) return;
    // placar mudou → som de jogo ganho/perdido (do meu ponto de vista).
    const key = `${s.scoreA}-${s.scoreB}`;
    if (key !== prevScore.current) {
      prevScore.current = key;
      const iAmA = s.aId === myId;
      const myScore = iAmA ? s.scoreA : s.scoreB;
      const oppScore = iAmA ? s.scoreB : s.scoreA;
      if (myScore + oppScore > 0) {
        if (s.finished) (myScore > oppScore ? sounds.sndWin : sounds.sndLose)();
        else sounds.sndReveal();
      }
    }
    // evento de penta no feed → som de penta.
    const tl = s.timelines[s.gameIndex];
    const ev = tl?.events[s.eventIndex - 1];
    if (ev && ev.icon === "⚔") {
      const pk = `${s.gameIndex}-${s.eventIndex}`;
      if (pk !== prevPenta.current) { prevPenta.current = pk; sounds.sndPenta(); }
    }
  }, [s, myId, sounds]);

  if (!st || !s) return null;

  const tl = s.timelines[s.gameIndex];
  const events = tl ? tl.events.slice(0, s.eventIndex + 1) : [];
  const minute = events.length ? events[events.length - 1].minute : 0;
  // placar e final do MEU ponto de vista (meu número à esquerda).
  const myScore = iAmA ? s.scoreA : s.scoreB;
  const oppScore = iAmA ? s.scoreB : s.scoreA;
  const myFinal = iAmA ? s.finalA : s.finalB;
  const oppFinal = iAmA ? s.finalB : s.finalA;
  const iWon = myFinal > oppFinal;

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1180px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-[13px]">
          <div onClick={onExit} title="Sair" className="-m-1 cursor-pointer rounded-lg p-1 transition-opacity hover:opacity-70">
            <Logo6x0 className="h-auto w-[170px]" />
          </div>
          <span className="font-display text-[12px] font-bold uppercase tracking-[2px] text-gold-bright">🔴 Série ao Vivo · Bo5</span>
        </div>
      </div>

      <div className="grid items-start gap-3 [grid-template-columns:1fr] wide:[grid-template-columns:1fr_1.1fr_1fr]">
        {/* esquerda = SEMPRE eu (visão egocêntrica) */}
        <LineColumn c={meC} mine side="left" showRatings={showRatings} subtitle="" />

        {/* centro: countdown → feed ao vivo → resultado */}
        <div className="flex h-full min-h-[330px] flex-col items-center justify-center rounded-2xl border border-gold/25 px-3 py-5 text-center" style={{ background: "rgba(22,23,28,0.7)" }}>
          {s.startDeadline != null ? (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">Grande duelo</div>
              <div className="my-2 font-mono text-[40px] leading-none font-bold tracking-[2px] text-dim">0<span className="px-1">–</span>0</div>
              <div className="mt-1 font-display text-[15px] font-bold uppercase tracking-[1px] text-cream">{meC.name} <span className="text-dim">vs</span> {oppC.name}</div>
              <span className="mt-3 font-mono text-[12px] text-muted">começa em <b className="text-gold-bright">{secs}s</b></span>
            </>
          ) : s.finished ? (
            <div className="anim-pop flex flex-col items-center">
              <div className="font-mono text-[44px] leading-none font-bold tracking-[2px]">
                <span className={iWon ? "text-win" : "text-red"}>{myFinal}</span>
                <span className="text-dim">–</span>
                <span className={iWon ? "text-red" : "text-win"}>{oppFinal}</span>
              </div>
              <div className="mt-3 font-display text-[18px] font-bold uppercase tracking-[2px] text-gold-bright">
                {iWon ? "Você venceu! 🏆" : "Você perdeu"}
              </div>
              <div className="mt-1 font-mono text-[11px] text-muted">{(iWon ? meC.name : oppC.name)} leva o duelo</div>
            </div>
          ) : (
            <>
              {/* placar EGOCÊNTRICO: meu número à esquerda */}
              <div className="font-mono text-[40px] leading-none font-bold tracking-[2px]">
                <span className={myScore === 0 ? "text-dim" : "text-win"}>{myScore}</span>
                <span className="text-dim">–</span>
                <span className={oppScore === 0 ? "text-dim" : "text-red-soft"}>{oppScore}</span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[2px] text-muted">
                {s.timelines.length ? `Jogo ${s.gameIndex + 1} · ${minute}'` : "Em jogo…"}
              </div>
              <div className="mt-3 flex w-full max-w-[340px] flex-col gap-1.5">
                {events.slice(-6).map((e, i, arr) => {
                  // evento do MEU lado = dourado (esquerda); do adversário = vermelho.
                  const mine = e.side === mySide;
                  const neutral = e.side === "neutral";
                  return (
                    <div key={`${s.gameIndex}-${s.eventIndex}-${i}`}
                      className={`flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 ${i === arr.length - 1 ? "anim-pop" : ""}`}
                      style={{
                        background: neutral ? "rgba(255,255,255,0.03)" : mine ? "rgba(201,162,75,0.1)" : "rgba(210,122,104,0.1)",
                        border: e.big ? "1px solid rgba(232,206,134,0.4)" : "1px solid transparent",
                      }}>
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

        {/* direita = SEMPRE o adversário */}
        <LineColumn c={oppC} mine={false} side="right" showRatings={showRatings} subtitle="" />
      </div>
    </div>
  );
}
