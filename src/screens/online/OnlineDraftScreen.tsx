// ============================================================
// OnlineDraftScreen — DRAFT sincronizado do Duelo online
// ============================================================
// Reusa a língua visual do draft offline (card de média + card do time rolável +
// mapa do Rift), com a mecânica ONLINE do design:
//   • RODADA é GLOBAL, travada pelo timer do HOST (todos no mesmo countdown);
//   • ROLAR time é LOCAL/privado (não vai pra rede) — RNG por jogador, picks podem
//     repetir; só o PICK final vira intenção (draftPick) pro host;
//   • ao escolher, fico "pronto" e espero a rodada virar (todos pickaram → avanço
//     antecipado; ou o timer zera → auto-pick aleatório pra quem não escolheu).
//
// O adversário aparece como STATUS (quantas lanes já pickou + se já escolheu a
// rodada), sem revelar QUEM — o suspense de revelar as lines fica pra série.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { UseOnlineRoom } from "../../game/online/useOnlineRoom";
import type { TournamentSounds } from "../../game/useTournament";
import { ROLES, SEMIFINAL_IDS } from "../../data/teams";
import { rarityFor, tierFor } from "../../game/helpers";
import { picksToLineup, lineAvg, type Competitor, type TournamentPick } from "../../game/tournament";
import { playerRng, rollTeam, rollSameTeam, hasSameTeamOtherYear, type RolledTeam } from "../../game/online/draftPool";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";
import { Logo6x0 } from "../../components/Logo6x0";
import { RiftMap } from "../../components/RiftMap";
import { LiveRostersColumn } from "../tournament/LiveRostersColumn";

const rerollEnabled: CSSProperties = { border: "1px solid rgba(201,162,75,0.3)", background: "rgba(42,51,65,0.75)", color: "#F2ECDE" };
const rerollDisabled: CSSProperties = { ...rerollEnabled, opacity: 0.35, cursor: "not-allowed", pointerEvents: "none" };

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


export function OnlineDraft({ r, myId, sounds, onExit }: { r: UseOnlineRoom; myId: string | null; sounds: TournamentSounds; onExit: () => void }) {
  const st = r.state;
  const me = st?.players.find((p) => p.playerId === myId) ?? null;
  const others = (st?.players ?? []).filter((p) => p.playerId !== myId);

  const showRatings = !(st?.config.hideRatings ?? false);
  const timed = (st?.config.pickSeconds ?? 0) > 0;
  const secs = useCountdown(st?.roundDeadline ?? null);
  const urgent = secs <= 5;

  const round = st?.draftRound ?? 1;
  const myPicks = me?.picks ?? {};
  const pickedThisRound = me?.pickedThisRound ?? false;
  // humanos (fora eu) que ainda não escolheram nesta rodada.
  const waitingHumans = others.filter((p) => !p.isBot && !p.pickedThisRound).length;
  const filledCount = ROLES.filter((rr) => myPicks[rr]).length;
  const myLine = ROLES.map((rr) => myPicks[rr]).filter((p): p is TournamentPick => !!p);
  const avg = lineAvg(myLine);
  const tier = tierFor(avg);
  const lineup = picksToLineup(myPicks);

  // os OUTROS competidores (humanos + bots) no formato Competitor — MESMO card
  // "ao vivo" do offline 1×7. Os BOTS revelam 1 lane por rodada acompanhando o
  // SEU ritmo (filledCount), igual ao offline — suspense de ir aparecendo. Os
  // humanos mostram o que já pickaram de fato (privado pra eles, público aqui).
  const otherCompetitors: Competitor[] = others.map((p) => {
    const full = ROLES.map((rr) => p.picks[rr]).filter((x): x is TournamentPick => !!x);
    // bot: corta a line pelas lanes "reveladas até agora" = quantas EU já fechei.
    const line = p.isBot ? full.slice(0, filledCount) : full;
    return { id: p.playerId, name: p.nick, isBot: p.isBot, line, avg: lineAvg(line), form: {} };
  });

  // ── rolagem LOCAL (privada): MESMA mecânica do solo (3 resorteios, outro
  // time / outro ano). Só o PICK final vira intenção pro host. ──
  const code = st?.code ?? "";
  const [rollSalt, setRollSalt] = useState(0); // varia o RNG a cada resorteio
  const [rolled, setRolled] = useState<RolledTeam | null>(null);
  const [rolling, setRolling] = useState(false);
  const [spinTeam, setSpinTeam] = useState<string>("");
  const [rerolls, setRerolls] = useState(3); // como no solo: 3 por draft inteiro
  // trava ANTI-DUPLO-ROLL: ao pickar, espero o host confirmar `pickedThisRound`
  // antes de qualquer novo auto-roll (senão a roleta gira de novo e "engole" o pick).
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);
  const spinRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rng = useMemo(() => playerRng(code, myId ?? "", round * 1000 + rollSalt), [code, myId, round, rollSalt]);

  // o host confirmou meu pick (pickedThisRound virou true) → libera a trava.
  useEffect(() => {
    if (pickedThisRound) setAwaitingConfirm(false);
  }, [pickedThisRound]);

  // ao trocar de rodada: limpa o time rolado, zera a trava (nova rodada, novo pick).
  useEffect(() => {
    setRolled(null);
    setRollSalt(0);
    setAwaitingConfirm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // auto-roll: rola sozinho se não há time, não estou rolando, não escolhi a
  // rodada E não há pick pendente de confirmação do host.
  useEffect(() => {
    if (rolled || rolling || pickedThisRound || awaitingConfirm) return;
    doRoll(rng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolled, rolling, pickedThisRound, awaitingConfirm, round, rollSalt]);

  const doRoll = (useRng: typeof rng, excludeId?: string, sameTeam?: string) => {
    if (rolling) return;
    setRolling(true);
    // MESMA curva do solo: 15 passos com aceleração-desaceleração (acelera e
    // freia), em vez de ticks fixos — o giro dura o mesmo tempo do solo.
    let i = 0;
    const total = 15;
    const tickShown = () => setSpinTeam(rollTeam(playerRng(code, myId ?? "", round * 7919 + i + 1)).team.team);
    tickShown();
    const step = () => {
      i++;
      if (i >= total) {
        sounds.sndReveal(); // trava o time (mesmo som do solo)
        const final = sameTeam
          ? rollSameTeam(useRng, sameTeam, excludeId ?? "") ?? rollTeam(useRng, excludeId)
          : rollTeam(useRng, excludeId);
        setRolled(final);
        setRolling(false);
        return;
      }
      sounds.sndTick();
      tickShown();
      const delay = 45 + Math.pow(i / total, 2.5) * 230;
      spinRef.current = setTimeout(step, delay);
    };
    spinRef.current = setTimeout(step, 60);
  };

  useEffect(() => () => { if (spinRef.current) clearTimeout(spinRef.current); }, []);

  // resorteios (gastam 1 dos 3) — só fora da roleta e com resorteio disponível.
  const canReroll = rerolls > 0 && !rolling && !pickedThisRound;
  const canSame = !!rolled && hasSameTeamOtherYear(rolled.team.team, rolled.team.id);

  const rerollOther = () => {
    if (!canReroll) return;
    setRerolls((n) => n - 1);
    const nextSalt = rollSalt + 1;
    setRollSalt(nextSalt);
    setRolled(null);
    doRoll(playerRng(code, myId ?? "", round * 1000 + nextSalt), rolled?.team.id);
  };

  const rerollSame = () => {
    if (!canReroll || !canSame || !rolled) return;
    setRerolls((n) => n - 1);
    const nextSalt = rollSalt + 1;
    setRollSalt(nextSalt);
    setRolled(null);
    doRoll(playerRng(code, myId ?? "", round * 1000 + nextSalt), rolled.team.id, rolled.team.team);
  };

  const pick = (role: Role, p: TournamentPick) => {
    if (pickedThisRound || myPicks[role] || awaitingConfirm) return;
    sounds.sndPick(); // escolha do jogador (mesmo som do solo)
    setAwaitingConfirm(true); // segura a roleta até o host confirmar
    setRolled(null);
    r.draftPick(role, p);
  };

  if (!st) return null;

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1440px]">
      {/* top bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4 sm:mb-[22px]">
        <div className="flex items-center gap-[13px]">
          <div onClick={onExit} title="Sair do duelo" className="-m-1 cursor-pointer rounded-lg p-1 transition-opacity hover:opacity-70">
            <Logo6x0 className="h-auto w-[180px]" />
          </div>
          <span className="font-display text-[12px] font-bold uppercase tracking-[2px] text-gold-bright">🔴 Draft ao Vivo</span>
        </div>
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center gap-[7px]">
            <span className="font-mono text-[12px] tracking-[1px] text-muted">RODADA</span>
            <span className="font-display text-[20px] font-semibold text-cream">{round}<span className="text-[15px] text-dim">/5</span></span>
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

      <div className="flex flex-col items-stretch gap-3 wide:flex-row wide:gap-[26px]">
        {/* esquerda: média + card do time / estado pós-pick */}
        <div className="w-full wide:w-[312px] wide:flex-none">
          {showRatings && (
            <div className="anim-fade-fast mb-3 overflow-hidden rounded-2xl border border-gold/30 sm:mb-[18px]"
              style={{ background: "linear-gradient(150deg,rgba(58,48,22,0.5),rgba(30,37,49,0.7))" }}>
              <div className="flex items-center justify-between px-[18px] pt-2.5 sm:pt-3.5">
                <div className="font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">★ Média do elenco</div>
                <div className="flex gap-[5px]">
                  {ROLES.map((rr) => (
                    <span key={rr} className="inline-block h-[9px] w-[9px] rotate-45 rounded-[2px]"
                      style={myPicks[rr] ? { background: "#e8ce86", boxShadow: "0 0 6px rgba(232,206,134,0.5)" } : { border: "1px solid rgba(201,162,75,0.4)" }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 px-[18px] pb-2.5 pt-1.5 sm:pb-3.5">
                <span className="font-mono text-[34px] font-bold leading-none text-gold-bright sm:text-[44px]">{myLine.length > 0 ? avg : "–"}</span>
                <span className="font-display text-[17px] font-bold uppercase tracking-[1px] text-cream sm:text-[19px]">{myLine.length > 0 ? tier.tier : "Sua line"}</span>
              </div>
            </div>
          )}

          {/* já escolhi nesta rodada (ou enviando) → aguardando os dois / o relógio */}
          {pickedThisRound || awaitingConfirm ? (
            <div className="panel-raised rounded-2xl border border-gold/30 px-[18px] py-8 text-center">
              <div className="font-display text-[20px] font-semibold uppercase tracking-[1px] text-gold-bright">
                {pickedThisRound ? "✓ Escolha feita" : "Enviando escolha…"}
              </div>
              <div className="mt-2 font-mono text-[12px] leading-relaxed text-muted">
                {!pickedThisRound
                  ? "confirmando com o host…"
                  : waitingHumans > 0
                    ? `Aguardando ${waitingHumans} jogador${waitingHumans === 1 ? "" : "es"}…`
                    : "Todos escolheram — avançando…"}
              </div>
            </div>
          ) : rolling ? (
            <div className="panel-raised overflow-hidden rounded-2xl border border-gold/25">
              <div className="flex items-center justify-between border-b border-gold/20 px-[18px] py-4">
                <div className="font-display text-[20px] font-semibold text-cream">{spinTeam || "…"}</div>
                <div className="font-mono text-[11px] tracking-[1px] text-gold-bright">🎲 SORTEANDO…</div>
              </div>
              <div className="px-[18px] py-10 text-center font-mono text-[12px] text-muted">sorteando um time…</div>
            </div>
          ) : rolled ? (
            <>
              <div className="panel-raised overflow-hidden rounded-2xl border border-gold/25">
                <div className="flex items-center justify-between gap-2.5 border-b border-gold/20 px-[18px] py-2.5 sm:py-4">
                  <div>
                    <div className="font-display text-[19px] font-semibold leading-[1.1] text-cream sm:text-[21px]">{rolled.team.team}</div>
                    <div className="mt-[3px] font-mono text-[11px] tracking-[1px] text-muted">{rolled.team.league}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[1px]"
                        style={{ background: "rgba(201,162,75,0.14)", border: "1px solid rgba(201,162,75,0.3)", color: "#c9a24b" }}>
                        {rolled.team.tournament === "msi" ? "MSI" : "Worlds"}
                      </span>
                      <div className="font-display text-[24px] leading-none font-bold text-gold-bright">{rolled.team.year}</div>
                    </div>
                    {rolled.team.champion ? (
                      <div className="mt-2.5 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] font-bold tracking-[1px] text-gold-bright"
                        style={{ background: "rgba(18,22,29,0.55)", border: "1px solid rgba(232,206,134,0.55)" }}>★ CAMPEÃO</div>
                    ) : rolled.team.finalist ? (
                      <div className="mt-2.5 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] font-bold tracking-[1px]"
                        style={{ background: "rgba(18,22,29,0.55)", border: "1px solid rgba(196,201,210,0.55)", color: "#c4c9d2" }}>🥈 VICE</div>
                    ) : SEMIFINAL_IDS.has(rolled.team.id) ? (
                      <div className="mt-2.5 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] font-bold tracking-[1px]"
                        style={{ background: "rgba(18,22,29,0.55)", border: "1px solid rgba(205,139,90,0.55)", color: "#cd8b5a" }}>🥉 SEMIFINALISTA</div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-3">
                  {rolled.line.map((p, i) => {
                    const taken = !!myPicks[p.role];
                    const skin = rarityFor(p.rating);
                    const surface = taken ? "panel-raised" : showRatings ? skin.cls : "panel-raised";
                    return (
                      <button
                        key={p.role}
                        onClick={() => pick(p.role, p)}
                        disabled={taken}
                        style={taken ? { opacity: 0.26, filter: "grayscale(1)" } : ({ "--i": i } as CSSProperties)}
                        className={`player-row ${taken ? "" : "row-in"} ${surface} flex w-full items-center gap-2.5 rounded-[12px] border border-gold/20 px-3 py-2.5 text-left text-cream sm:gap-3 sm:px-3.5 sm:py-[21px] ${taken ? "cursor-not-allowed border-dashed" : "cursor-pointer"}`}
                      >
                        <RoleBadge role={p.role} variant="neutral" />
                        <span className="flex min-w-0 flex-1 items-center gap-1.5">
                          <Flag cc={p.country} size={10} />
                          <span className="truncate font-display text-[16px] font-semibold text-cream sm:text-[17px]">{p.name}</span>
                        </span>
                        {showRatings && <span className="mr-1.5 font-mono text-[24px] font-bold leading-none sm:text-[29px]" style={{ color: skin.ratingColor }}>{p.rating}</span>}
                      </button>
                    );
                  })}
                </div>
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
          ) : (
            <div className="panel-raised rounded-2xl border border-gold/25 px-[18px] py-7 text-center">
              <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[12px] text-gold-bright">
                <span className="animate-pulse">🎲</span> sorteando um time…
              </div>
            </div>
          )}
        </div>

        {/* centro: mapa do Rift */}
        <div className="min-w-0 flex-1">
          <RiftMap lineup={lineup} showRatings={showRatings} filledCount={filledCount} />
        </div>

        {/* direita: lines dos OUTROS competidores ao vivo — MESMO card do 1×7.
            revealed acompanha o SEU ritmo (filledCount) → bots vão aparecendo 1
            lane por rodada, com o "pop" no slot recém-revelado, igual ao offline. */}
        <div className="w-full wide:w-[336px] wide:flex-none">
          <LiveRostersColumn others={otherCompetitors} revealed={filledCount} showRatings={showRatings} title="Outros times" />
        </div>
      </div>
    </div>
  );
}

// tipo Role local (evita import extra do types).
type Role = (typeof ROLES)[number];
