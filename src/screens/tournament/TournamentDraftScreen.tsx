import { useEffect, useState, type CSSProperties } from "react";
import type { Tournament } from "../../game/useTournament";
import { DRAFT_TEAMS, ROLES, SEMIFINAL_IDS } from "../../data/teams";
import { rarityFor, tierFor } from "../../game/helpers";
import { lineAvg, picksToLineup } from "../../game/tournament";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";
import { Logo6x0 } from "../../components/Logo6x0";
import { RiftMap } from "../../components/RiftMap";
import { LiveRostersColumn } from "./LiveRostersColumn";

const rerollEnabled: CSSProperties = {
  border: "1px solid rgba(201,162,75,0.3)",
  background: "rgba(42,51,65,0.75)",
  color: "#F2ECDE",
};
const rerollDisabled: CSSProperties = { ...rerollEnabled, opacity: 0.35, cursor: "not-allowed", pointerEvents: "none" };

/** Conta regressiva sincronizada com o deadline do controller. */
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

/**
 * Draft do torneio — MESMO layout do draft solo (card de média + card do time +
 * mapa do Rift), com o acréscimo do TIMER global da rodada. A dificuldade vem do
 * lobby (não há passo de escolha aqui).
 */
export function TournamentDraftScreen({ t }: { t: Tournament }) {
  const { state, rerollOther, rerollSame, pickPlayer, confirmReady } = t;
  const { phase, config, myPicks, currentRollId, rolling, rollDisplayId, rerolls, draftDeadline, competitors, myId, readyIds, draftedDeadline } = state;
  const secs = useCountdown(draftDeadline);
  const showRatings = !config.hideRatings;
  const timed = config.pickSeconds > 0; // false = "Sem limite" (sem relógio)
  const drafted = phase === "drafted"; // lines completas → aguardando "ir pros playoffs"
  const playoffSecs = useCountdown(draftedDeadline);
  const iAmReady = readyIds.includes(myId);
  const humanCount = competitors.filter((c) => !c.isBot).length;

  const lineup = picksToLineup(myPicks);
  const filledCount = ROLES.filter((r) => myPicks[r]).length;
  const complete = filledCount === 5;
  const myLine = ROLES.map((r) => myPicks[r]).filter((p): p is NonNullable<typeof p> => !!p);
  const avg = lineAvg(myLine);
  const tier = tierFor(avg);
  const roundNum = Math.min(filledCount + 1, 5);

  const current = currentRollId ? DRAFT_TEAMS.find((tm) => tm.id === currentRollId) ?? null : null;
  // durante a roleta, o card embaralha o nome de times aleatórios (rollDisplayId).
  const display = rolling && rollDisplayId ? DRAFT_TEAMS.find((tm) => tm.id === rollDisplayId) ?? null : current;
  const hasTeam = !!current;
  const showCard = (hasTeam || rolling) && !complete;
  // entre rodadas, antes do auto-roll disparar (time rola sozinho — sem botão).
  const waiting = !hasTeam && !rolling && !complete;

  const canReroll = rerolls > 0 && !rolling;
  const canSame = !!current && !rolling && DRAFT_TEAMS.some((tm) => tm.team === current.team && tm.id !== current.id);
  const urgent = secs <= 5;

  // outros competidores do torneio (no offline: os 7 bots) — só os que já têm line.
  const others = competitors.filter((c) => c.id !== myId && c.line.length > 0);

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1440px]">
      {/* top bar — logo + título + RODADA + timer + resorteios */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4 sm:mb-[22px]">
        <div className="flex items-center gap-[13px]">
          <Logo6x0 className="h-auto w-[180px]" />
          <span className="font-display text-[12px] font-bold uppercase tracking-[2px] text-gold-bright">🔴 Draft ao Vivo</span>
        </div>
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center gap-[7px]">
            <span className="font-mono text-[12px] tracking-[1px] text-muted">RODADA</span>
            <span className="font-display text-[20px] font-semibold text-cream">{roundNum}<span className="text-[15px] text-dim">/5</span></span>
          </div>
          {timed ? (
            <div className="flex items-center gap-2 rounded-full border px-[13px] py-1.5"
              style={urgent ? { borderColor: "rgba(224,88,74,0.6)", background: "rgba(224,88,74,0.1)" } : { borderColor: "rgba(201,162,75,0.4)", background: "rgba(201,162,75,0.06)" }}>
              <span className="text-[13px]">⏱</span>
              <span className={`font-mono text-[18px] font-bold tabular-nums ${urgent ? "text-red-soft" : "text-gold-bright"}`}>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-gold/25 px-[13px] py-1.5">
              <span className="text-[13px]">⏱</span>
              <span className="font-mono text-[12px] tracking-[1px] text-muted">sem limite</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-full border border-gold/30 px-[13px] py-1.5">
            <span className="text-[14px] text-gold-bright">↻</span>
            <span className="font-mono text-[13px] text-[#D7D4CB]">{rerolls} resorteio{rerolls === 1 ? "" : "s"}</span>
          </div>
        </div>
      </div>

      {/* 2 colunas — esquerda (controles) + direita (mapa) */}
      <div className="flex flex-col items-stretch gap-3 wide:flex-row wide:gap-[26px]">
        <div className="w-full wide:w-[344px] wide:flex-none">
          {/* card MÉDIA DO ELENCO */}
          {showRatings && (
            <div className="anim-fade-fast mb-3 overflow-hidden rounded-2xl border border-gold/30 sm:mb-[18px]"
              style={{ background: "linear-gradient(150deg,rgba(58,48,22,0.5),rgba(30,37,49,0.7))" }}>
              <div className="flex items-center justify-between px-[18px] pt-2.5 sm:pt-3.5">
                <div className="font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">★ Média do elenco</div>
                <div className="flex gap-[5px]">
                  {ROLES.map((r) => (
                    <span key={r} className="inline-block h-[9px] w-[9px] rotate-45 rounded-[2px]"
                      style={myPicks[r] ? { background: "#e8ce86", boxShadow: "0 0 6px rgba(232,206,134,0.5)" } : { border: "1px solid rgba(201,162,75,0.4)" }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 px-[18px] pb-2.5 pt-1.5 sm:pb-3.5">
                <span className="font-mono text-[34px] font-bold leading-none text-gold-bright sm:text-[44px]">{myLine.length > 0 ? avg : "–"}</span>
                <span className="font-display text-[17px] font-bold uppercase tracking-[1px] text-cream sm:text-[19px]">{myLine.length > 0 ? tier.tier : "Sua line"}</span>
              </div>
            </div>
          )}

          {/* (a)/(d) entre rodadas: o time ROLA SOZINHO (sem botão). Placeholder
              breve até a roleta disparar automaticamente. */}
          {waiting && (
            <div className="panel-raised rounded-2xl border border-gold/25 px-[18px] py-7 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">
                {filledCount === 0 ? "Rodada 1 de 5" : `${filledCount}/5 lanes preenchidas`}
              </div>
              <div className="mt-[7px] font-display text-[20px] font-semibold uppercase tracking-[1px] text-cream">
                {filledCount === 0 ? "Monte sua line" : "Próxima rodada"}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[12px] text-gold-bright">
                <span className="animate-pulse">🎲</span> sorteando um time…
              </div>
            </div>
          )}

          {/* (b)/(c) card do time (sorteando ou já travado) */}
          {showCard && display && (
            <>
              <div className="panel-raised overflow-hidden rounded-2xl border border-gold/25">
                <div className="flex items-center justify-between gap-2.5 border-b border-gold/20 px-[18px] py-2.5 sm:py-4">
                  <div>
                    <div className="font-display text-[19px] font-semibold leading-[1.1] text-cream sm:text-[21px]">{display.team}</div>
                    <div className="mt-[3px] font-mono text-[11px] tracking-[1px] text-muted">{display.league}</div>
                  </div>
                  <div className="text-right">
                    {rolling ? (
                      <div className="font-mono text-[11px] tracking-[1px] whitespace-nowrap text-gold-bright">🎲 SORTEANDO…</div>
                    ) : (
                      <>
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[1px]"
                            style={{ background: "rgba(201,162,75,0.14)", border: "1px solid rgba(201,162,75,0.3)", color: "#c9a24b" }}>
                            {display.tournament === "msi" ? "MSI" : "Worlds"}
                          </span>
                          <div className="font-display text-[24px] leading-none font-bold text-gold-bright">{display.year}</div>
                        </div>
                        {display.champion ? (
                          <div className="mt-2.5 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] font-bold tracking-[1px] text-gold-bright"
                            style={{ background: "rgba(18,22,29,0.55)", border: "1px solid rgba(232,206,134,0.55)" }}>★ CAMPEÃO</div>
                        ) : display.finalist ? (
                          <div className="mt-2.5 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] font-bold tracking-[1px]"
                            style={{ background: "rgba(18,22,29,0.55)", border: "1px solid rgba(196,201,210,0.55)", color: "#c4c9d2" }}>🥈 VICE</div>
                        ) : SEMIFINAL_IDS.has(display.id) ? (
                          <div className="mt-2.5 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] font-bold tracking-[1px]"
                            style={{ background: "rgba(18,22,29,0.55)", border: "1px solid rgba(205,139,90,0.55)", color: "#cd8b5a" }}>🥉 SEMIFINALISTA</div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
                {/* a lista de jogadores só aparece com o time JÁ travado — durante a
                    roleta, quem "embaralha" é só o cabeçalho (nome do time). */}
                {!rolling && current && (
                  <div className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-3">
                    {current.players.map((p, i) => {
                      const role = p[0];
                      const taken = !!myPicks[role];
                      const skin = rarityFor(p[2]);
                      const surface = taken ? "panel-raised" : showRatings ? skin.cls : "panel-raised";
                      return (
                        <button
                          key={role}
                          onClick={() => pickPlayer(role)}
                          disabled={taken}
                          style={taken ? { opacity: 0.26, filter: "grayscale(1)" } : ({ "--i": i } as CSSProperties)}
                          className={`player-row ${taken ? "" : "row-in"} ${surface} flex w-full items-center gap-2.5 rounded-[12px] border border-gold/20 px-3 py-2.5 text-left text-cream sm:gap-3 sm:px-3.5 sm:py-[21px] ${taken ? "cursor-not-allowed border-dashed" : "cursor-pointer"}`}
                        >
                          <RoleBadge role={role} variant="neutral" />
                          <span className="flex min-w-0 flex-1 items-center gap-1.5">
                            <Flag cc={p[3]} size={10} />
                            <span className="truncate font-display text-[16px] font-semibold text-cream sm:text-[17px]">{p[1]}</span>
                          </span>
                          {showRatings && (
                            <span className="mr-1.5 font-mono text-[24px] font-bold leading-none sm:text-[29px]" style={{ color: skin.ratingColor }}>{p[2]}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-3.5 flex gap-2.5">
                <button onClick={rerollOther} disabled={!canReroll}
                  className="btn-reroll flex flex-1 cursor-pointer flex-col items-start rounded-[12px] px-[15px] py-[13px] text-left"
                  style={canReroll ? rerollEnabled : rerollDisabled}>
                  <div className="font-display text-[14px] font-semibold uppercase tracking-[1px]">↻ Outro time</div>
                  <div className="mt-0.5 text-[11px] text-muted">time diferente</div>
                </button>
                <button onClick={rerollSame} disabled={!(canReroll && canSame)}
                  className="btn-reroll flex flex-1 cursor-pointer flex-col items-start rounded-[12px] px-[15px] py-[13px] text-left"
                  style={canReroll && canSame ? rerollEnabled : rerollDisabled}>
                  <div className="font-display text-[14px] font-semibold uppercase tracking-[1px]">↻ Outro ano</div>
                  <div className="mt-0.5 text-[11px] text-muted">{canSame ? "mesmo time, outro ano" : "sem outra campanha"}</div>
                </button>
              </div>
            </>
          )}

          {/* (e) line completa — montando o bracket (breve, antes da fase "drafted") */}
          {complete && !drafted && (
            <div className="overflow-hidden rounded-2xl border border-gold/40" style={{ background: "linear-gradient(180deg,rgba(46,55,70,0.96),rgba(30,37,49,0.96))" }}>
              <div className="border-b border-gold/20 px-[18px] py-4">
                <div className="font-display text-[20px] font-bold uppercase tracking-[1px] text-gold-bright">Line completa!</div>
                <div className="mt-[3px] font-mono text-[11px] text-muted">Montando o bracket dos 8…</div>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-6 font-mono text-[12px] text-muted">
                <span className="animate-pulse">⚙</span> sorteando os confrontos…
              </div>
            </div>
          )}

          {/* (f) DRAFT PRONTO — botão "ir pros playoffs" + auto-avanço em 30s */}
          {drafted && (
            <div className="overflow-hidden rounded-2xl border border-gold/40" style={{ background: "linear-gradient(180deg,rgba(46,55,70,0.96),rgba(30,37,49,0.96))" }}>
              <div className="border-b border-gold/20 px-[18px] py-4 text-center">
                <div className="font-display text-[20px] font-bold uppercase tracking-[1px] text-gold-bright">Todas as lines prontas!</div>
                <div className="mt-[3px] font-mono text-[11px] text-muted">8 times montados — bora pro chaveamento</div>
              </div>
              <div className="flex flex-col items-center px-4 py-5">
                <button
                  onClick={confirmReady}
                  disabled={iAmReady}
                  className="btn-gold w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[17px] font-semibold uppercase tracking-[2px] disabled:cursor-default disabled:opacity-60"
                >
                  {iAmReady ? "✓ Pronto — aguardando…" : "🏆 Ir pros playoffs"}
                </button>
                <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted">
                  {humanCount > 1 && (
                    <span>{readyIds.length}/{humanCount} prontos · </span>
                  )}
                  <span>começa sozinho em <b className="text-gold-bright">{playoffSecs}s</b></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* centro: mapa do Rift (reusa o componente do solo) */}
        <div className="min-w-0 flex-1">
          <RiftMap lineup={lineup} showRatings={showRatings} filledCount={filledCount} />
        </div>

        {/* direita: elencos dos OUTROS times ao vivo — linhas compactas que cabem
            na altura do mapa, sem gerar scroll na página. */}
        {others.length > 0 && (
          <div className="w-full wide:w-[388px] wide:flex-none">
            <LiveRostersColumn others={others} revealed={filledCount} showRatings={showRatings} />
          </div>
        )}
      </div>
    </div>
  );
}
