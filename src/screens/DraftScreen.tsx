import type { CSSProperties } from "react";
import type { Game } from "../game/useGame";
import { DRAFT_TEAMS, ROLES, ROLE_LABELS } from "../data/teams";
import { yy } from "../game/helpers";
import { Flag } from "../components/Flag";
import { Logo6x0 } from "../components/Logo6x0";
import { RiftMap } from "../components/RiftMap";

const diffSelected: CSSProperties = {
  border: "1.5px solid #E8CE86",
  background: "rgba(201,162,75,0.13)",
  color: "#F2ECDE",
  boxShadow: "0 0 0 3px rgba(201,162,75,0.1)",
};
const diffUnselected: CSSProperties = {
  border: "1px solid rgba(201,162,75,0.22)",
  background: "rgba(42,51,65,0.5)",
  color: "#C9C7BD",
};

const rerollEnabled: CSSProperties = {
  border: "1px solid rgba(201,162,75,0.3)",
  background: "rgba(42,51,65,0.75)",
  color: "#F2ECDE",
};
const rerollDisabled: CSSProperties = { ...rerollEnabled, opacity: 0.35, cursor: "not-allowed", pointerEvents: "none" };

export function DraftScreen({ game }: { game: Game }) {
  const { state } = game;
  const { difficulty, lineup, current, rolling, rollDisplay, rerolls } = state;

  const filledCount = ROLES.filter((r) => lineup[r]).length;
  const complete = filledCount === 5;
  const hasTeam = !!current;
  const predraftFirst = !hasTeam && !rolling && filledCount === 0;
  const readyRoll = !hasTeam && !rolling && filledCount > 0 && !complete;
  const c = rolling ? rollDisplay : current;
  const showCard = (hasTeam || rolling) && !complete;
  const showRatings = difficulty !== "especialista";
  const isClassico = difficulty === "classico";
  const roundNum = Math.min(filledCount + 1, 5);

  const canReroll = rerolls > 0 && !rolling;
  const canSame = !!current && !rolling && DRAFT_TEAMS.some((t) => t.team === current.team && t.id !== current.id);

  return (
    <div className="anim-fade-fast mx-auto w-full max-w-[1180px]">
      {/* top bar */}
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-[13px]">
          <div
            onClick={game.restart}
            title="Voltar ao início"
            className="-m-1 flex cursor-pointer items-center rounded-lg p-1 transition-opacity hover:opacity-70"
          >
            <Logo6x0 className="h-auto w-[78px]" strokeWidth={11} dotR={6} />
          </div>
          <span className="font-mono text-[12px] uppercase tracking-[2px] text-muted">Draft · monte sua line</span>
        </div>
        <div className="flex items-center gap-[18px]">
          <div className="flex items-center gap-[7px]">
            <span className="font-mono text-[12px] tracking-[1px] text-muted">RODADA</span>
            <span className="font-display text-[20px] font-semibold text-cream">
              {roundNum}
              <span className="text-[15px] text-dim">/5</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gold/30 px-[13px] py-1.5">
            <span className="text-[14px] text-gold-bright">↻</span>
            <span className="font-mono text-[13px] text-[#D7D4CB]">
              {rerolls} resorteio{rerolls === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* 2 colunas */}
      <div className="flex flex-col items-stretch gap-[18px] wide:flex-row wide:gap-[26px]">
        {/* esquerda */}
        <div className="w-full wide:w-[344px] wide:flex-none">
          {/* (a) pré-draft */}
          {predraftFirst && (
            <>
              <div className="panel-raised overflow-hidden rounded-2xl border border-gold/25">
                <div className="border-b border-gold/20 px-[18px] py-4">
                  <div className="font-display text-[18px] font-semibold uppercase tracking-[1px] text-gold-bright">
                    Antes de começar
                  </div>
                  <div className="mt-[3px] font-mono text-[11px] text-muted">Escolha a dificuldade e role o 1º time</div>
                </div>
                <div className="p-3.5">
                  <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[2px] text-muted">Dificuldade</div>
                  <div className="flex flex-col gap-[9px]">
                    <button
                      onClick={game.pickClassico}
                      className="w-full cursor-pointer rounded-[12px] px-[15px] py-[13px] text-left transition-all"
                      style={isClassico ? diffSelected : diffUnselected}
                    >
                      <div className="flex items-center gap-[7px]">
                        <span className="font-display text-[15px] font-semibold uppercase tracking-[1px]">Clássico</span>
                        {isClassico && <span className="text-[13px] text-gold-bright">✓</span>}
                      </div>
                      <div className="mt-[3px] text-[11.5px] text-muted">mostra o overall dos jogadores</div>
                    </button>
                    <button
                      onClick={game.pickEspecialista}
                      className="w-full cursor-pointer rounded-[12px] px-[15px] py-[13px] text-left transition-all"
                      style={!isClassico ? diffSelected : diffUnselected}
                    >
                      <div className="flex items-center gap-[7px]">
                        <span className="font-display text-[15px] font-semibold uppercase tracking-[1px]">
                          Especialista
                        </span>
                        {!isClassico && <span className="text-[13px] text-gold-bright">✓</span>}
                      </div>
                      <div className="mt-[3px] text-[11.5px] text-muted">esconde o overall — escolha no olho</div>
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={game.rollStart}
                className="btn-gold mt-3.5 w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
              >
                🎲 Iniciar · rolar 1º time
              </button>
            </>
          )}

          {/* (d) pronto pra rolar */}
          {readyRoll && (
            <>
              <div className="panel-raised rounded-2xl border border-gold/25 px-[18px] py-7 text-center">
                <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">
                  {filledCount}/5 lanes preenchidas
                </div>
                <div className="mt-[7px] font-display text-[20px] font-semibold uppercase tracking-[1px] text-cream">
                  Bora pro próximo
                </div>
              </div>
              <button
                onClick={game.rollStart}
                className="btn-gold mt-3.5 w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
              >
                🎲 Rolar próximo time
              </button>
            </>
          )}

          {/* (b)/(c) card do time (sorteando ou sorteado) */}
          {showCard && c && (
            <>
              <div className="panel-raised overflow-hidden rounded-2xl border border-gold/25">
                <div className="flex items-center justify-between gap-2.5 border-b border-gold/20 px-[18px] py-4">
                  <div>
                    <div className="font-display text-[21px] font-semibold leading-[1.1] text-cream">{c.team}</div>
                    <div className="mt-[3px] font-mono text-[11px] tracking-[1px] text-muted">{c.league}</div>
                  </div>
                  <div className="text-right">
                    {rolling ? (
                      <div className="font-mono text-[11px] tracking-[1px] whitespace-nowrap text-gold-bright">
                        🎲 SORTEANDO…
                      </div>
                    ) : (
                      <>
                        <div className="font-display text-[24px] leading-none font-bold text-gold-bright">'{c.year}</div>
                        {c.champion ? (
                          <div className="mt-1 inline-block rounded-[4px] bg-gold-bright px-[7px] py-0.5 font-mono text-[10px] tracking-[1px] text-ink">
                            ★ CAMPEÃO
                          </div>
                        ) : c.finalist ? (
                          <div
                            className="mt-1 inline-block rounded-[4px] px-[7px] py-0.5 font-mono text-[10px] tracking-[1px] text-ink"
                            style={{ background: "#c4c9d2" }}
                          >
                            🥈 VICE
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  {c.players.map((p) => {
                    const role = p[0];
                    const taken = !!lineup[role];
                    return (
                      <button
                        key={role}
                        onClick={() => game.pick(role)}
                        disabled={taken || rolling}
                        className={`player-row panel-raised flex w-full items-center gap-3 rounded-[12px] border border-gold/20 px-3.5 py-3 text-left text-cream ${
                          taken
                            ? "cursor-not-allowed border-dashed opacity-[0.34] [filter:grayscale(0.7)]"
                            : rolling
                              ? "cursor-default"
                              : "cursor-pointer"
                        }`}
                      >
                        <span className="min-w-[42px] rounded-[5px] bg-gold-bright px-[7px] py-1 text-center font-mono text-[10px] tracking-[1px] text-ink">
                          {role}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-px">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Flag cc={p[3]} />
                            <span className="truncate font-display text-[17px] font-semibold text-cream">{p[1]}</span>
                          </span>
                          <span className="text-[11px] text-muted">{ROLE_LABELS[role]}</span>
                        </span>
                        {showRatings && <span className="font-mono text-[18px] font-bold text-gold-bright">{p[2]}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3.5 flex gap-2.5">
                <button
                  onClick={game.rerollOther}
                  disabled={!canReroll}
                  className="btn-reroll flex flex-1 cursor-pointer flex-col items-start rounded-[12px] px-[15px] py-[13px] text-left"
                  style={canReroll ? rerollEnabled : rerollDisabled}
                >
                  <div className="font-display text-[14px] font-semibold uppercase tracking-[1px]">↻ Outro time</div>
                  <div className="mt-0.5 text-[11px] text-muted">time diferente</div>
                </button>
                <button
                  onClick={game.rerollSame}
                  disabled={!(canReroll && canSame)}
                  className="btn-reroll flex flex-1 cursor-pointer flex-col items-start rounded-[12px] px-[15px] py-[13px] text-left"
                  style={canReroll && canSame ? rerollEnabled : rerollDisabled}
                >
                  <div className="font-display text-[14px] font-semibold uppercase tracking-[1px]">↻ Outro Worlds</div>
                  <div className="mt-0.5 text-[11px] text-muted">
                    {canSame ? "mesmo time, outro ano" : "sem outra campanha"}
                  </div>
                </button>
              </div>
            </>
          )}

          {/* (e) line completa */}
          {complete && (
            <>
              <div
                className="overflow-hidden rounded-2xl border border-gold/40"
                style={{ background: "linear-gradient(180deg,rgba(46,55,70,0.96),rgba(30,37,49,0.96))" }}
              >
                <div className="border-b border-gold/20 px-[18px] py-4">
                  <div className="font-display text-[20px] font-bold uppercase tracking-[1px] text-gold-bright">
                    Line completa!
                  </div>
                  <div className="mt-[3px] font-mono text-[11px] text-muted">As 5 lanes estão preenchidas</div>
                </div>
                <div className="flex flex-col gap-1.5 p-3">
                  {ROLES.map((r) => {
                    const p = lineup[r]!;
                    return (
                      <div
                        key={r}
                        className="flex items-center gap-2.5 rounded-[10px] px-[11px] py-2"
                        style={{ background: "rgba(28,34,45,0.6)" }}
                      >
                        <span className="min-w-[40px] rounded-[5px] bg-gold-bright px-1.5 py-[3px] text-center font-mono text-[10px] tracking-[1px] text-ink">
                          {p.role}
                        </span>
                        <span className="flex min-w-0 flex-1 items-center gap-1.5">
                          <Flag cc={p.country} size={12} />
                          <span className="truncate font-display text-[16px] font-semibold text-cream">{p.name}</span>
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          {p.short} '{yy(p.year)}
                        </span>
                        {showRatings && <span className="font-mono text-[15px] font-bold text-gold-bright">{p.rating}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={game.startSeries}
                className="btn-gold mt-3.5 w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
              >
                ▶ Jogar os playoffs
              </button>
            </>
          )}
        </div>

        {/* direita: mapa do Rift */}
        <div className="min-w-0 flex-1">
          <RiftMap lineup={lineup} showRatings={showRatings} filledCount={filledCount} />
        </div>
      </div>
    </div>
  );
}
