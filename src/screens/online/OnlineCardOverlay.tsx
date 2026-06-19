// ============================================================
// OnlineCardOverlay — escolha de carta na série ONLINE (PvP simétrico)
// ============================================================
// Mostra MEU trio (3 cartas do nível sorteado) + timer de 15s. Escolho 1; se a
// carta precisa de alvo (nerf no rival, troca, curinga…), abre a etapa de alvo.
// Ao zerar o timer, o host faz auto-pick aleatório (não chamamos nada aqui).
// Reusa a skin `.event-card` do solo (mesma língua visual, §1.5 do design).

import { useEffect, useMemo, useState } from "react";
import type { CardRarity, EventCard, Role } from "../../types";
import { FINALIST_TEAMS, type Competitor } from "../../game/tournament";
import { rarityFor, yy } from "../../game/helpers";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";
import type { CardChoice } from "../../game/online/roomState";
import type { OnlineCardTarget } from "../../game/online/cardEngine";

const RARITY: Record<CardRarity, { label: string; accent: string; glow: string }> = {
  comum: { label: "Comum", accent: "#9aa3b0", glow: "rgba(154,163,176,0.25)" },
  rara: { label: "Rara", accent: "#5a9eff", glow: "rgba(90,158,255,0.4)" },
  lendaria: { label: "Lendária", accent: "#e8b53a", glow: "rgba(232,181,58,0.55)" },
};
const HOSTILE_TONE: Record<CardRarity, { label: string }> = {
  comum: { label: "Leve" }, rara: { label: "Grave" }, lendaria: { label: "Severo" },
};
const HOSTILE_ACCENT = "#e0584a";
const HOSTILE_GLOW = "rgba(224,88,74,0.5)";
const ROLE_LABEL: Record<Role, string> = { TOP: "TOP", JNG: "JNG", MID: "MID", BOT: "ADC", SUP: "SUP" };

export function OnlineCardOverlay({
  trio, hostile, deadline, myLine, oppLine, onPick, serverNow = () => Date.now(),
}: {
  trio: EventCard[];
  hostile: boolean;
  deadline: number | null;
  myLine: Competitor;
  oppLine: Competitor;
  onPick: (choice: CardChoice) => void;
  /** "agora" no relógio do host (corrige clock skew do cliente). */
  serverNow?: () => number;
}) {
  const [sel, setSel] = useState<EventCard | null>(null);
  const [swapRole, setSwapRole] = useState<Role | null>(null);
  const [query, setQuery] = useState("");
  const [done, setDone] = useState(false); // já enviei minha escolha
  const [secs, setSecs] = useState(15);

  // countdown visual até o deadline (o host faz o auto-pick ao zerar). Usa o
  // relógio do HOST (serverNow) pra não mostrar tempo errado num cliente com
  // relógio dessincronizado.
  useEffect(() => {
    if (deadline == null) return;
    const tick = () => setSecs(Math.max(0, Math.ceil((deadline - serverNow()) / 1000)));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [deadline, serverNow]);

  // trava scroll da página enquanto o overlay está aberto.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const send = (card: EventCard, target: OnlineCardTarget | null) => {
    if (done) return;
    setDone(true);
    onPick({ cardId: card.id, target });
  };

  const choose = (card: EventCard) => {
    if (done) return;
    if (!card.needsTarget) { send(card, null); return; }
    setSel(card); setSwapRole(null); setQuery("");
  };

  // todos os finalistas de uma role (pro Curinga), ordenados por overall + busca.
  const rolePlayers = useMemo(() => {
    if (!swapRole) return [];
    const q = query.trim().toLowerCase();
    const list = FINALIST_TEAMS.flatMap((t) => {
      const e = t.players.find((p) => p[0] === swapRole);
      if (!e) return [];
      return [{ teamId: t.team, team: t.team, short: t.short, year: t.year, name: e[1], rating: e[2], country: e[3] }];
    });
    const filtered = q
      ? list.filter((p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.short.toLowerCase().includes(q))
      : list;
    return filtered.sort((a, b) => b.rating - a.rating);
  }, [swapRole, query]);

  // já escolhi: o componente PAI fecha o overlay na hora (markPicked) e mostra o
  // painel "aguardando o rival". Aqui só evitamos um flash renderizando nada.
  if (done) return null;

  const ratingPill = (rating: number) => {
    const skin = rarityFor(rating);
    return (
      <span className="inline-flex min-w-[34px] items-center justify-center rounded-[7px] px-[7px] py-[3px] text-center font-mono text-[15px] font-black leading-none tabular-nums"
        style={{ color: skin.ratingColor, background: `color-mix(in srgb, ${skin.ratingColor} 16%, rgba(8,9,11,0.85))`, border: `1px solid color-mix(in srgb, ${skin.ratingColor} 38%, transparent)` }}>
        {rating}
      </span>
    );
  };

  const myPicks = myLine.line;

  return (
    <div className="anim-fade-fast fixed inset-0 z-50 flex flex-col overflow-y-auto px-4 py-10" style={{ background: "rgba(12,13,17,0.65)", backdropFilter: "blur(5px)" }}>
      {/* título + timer */}
      <div className="shrink-0 text-center">
        <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[3px]"
          style={hostile
            ? { color: "#1a0606", background: "linear-gradient(180deg,#f07a6c,#c0392b)", boxShadow: "0 0 22px rgba(224,88,74,0.55)" }
            : { color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)", boxShadow: "0 0 22px rgba(201,162,75,0.5)" }}>
          {hostile ? "⚠️ Evento de Azar" : "⚡ Evento"}
        </div>
        <div className="font-display text-[26px] font-bold uppercase tracking-[2px]" style={{ color: hostile ? "#f0867a" : "#e8ce86" }}>
          {!sel ? (hostile ? "Escolha o mal menor" : "Escolha uma carta") : sel.name}
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[2px] text-muted">
          {sel ? targetHint(sel, swapRole) : "os dois lados receberam evento do mesmo nível"}
        </div>
        <div className="mt-3 flex items-center justify-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 font-mono text-[15px] font-bold uppercase tracking-[1.5px] tabular-nums transition-colors"
            style={secs <= 3
              ? { color: "#f0867a", borderColor: "rgba(224,88,74,0.55)", background: "rgba(224,88,74,0.12)" }
              : { color: "#e8ce86", borderColor: "rgba(201,162,75,0.4)", background: "rgba(201,162,75,0.08)" }}
          >
            ⏱ {secs}s{secs === 0 ? " · escolhendo por você…" : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center py-4 sm:py-8">
        <div className="w-full max-w-[1000px]">
          {/* fase 1: as 3 cartas */}
          {!sel && (
            <div className="grid gap-4 [grid-template-columns:1fr] sm:gap-12 sm:[grid-template-columns:repeat(3,1fr)]">
              {trio.map((card, i) => {
                const r = hostile
                  ? { label: HOSTILE_TONE[card.rarity].label, accent: HOSTILE_ACCENT, glow: HOSTILE_GLOW }
                  : RARITY[card.rarity];
                const legendary = !hostile && card.rarity === "lendaria";
                return (
                  <button key={`${card.id}-${i}`} onClick={() => choose(card)}
                    className={`event-card anim-pop group relative flex min-h-[168px] flex-col items-center overflow-hidden rounded-[20px] border px-4 pb-4 pt-6 text-center transition-all duration-300 sm:min-h-[440px] sm:px-6 sm:pb-8 sm:pt-11 ${legendary ? "event-card--legendary" : ""} cursor-pointer hover:-translate-y-2.5`}
                    style={{
                      background: `linear-gradient(180deg, color-mix(in srgb, ${r.accent} 13%, rgba(28,29,33,0.96)), rgba(16,17,20,0.97))`,
                      borderColor: `color-mix(in srgb, ${r.accent} 45%, transparent)`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${r.accent} 22%, transparent), 0 26px 60px -22px rgba(0,0,0,0.85), 0 0 34px -14px ${r.glow}`,
                      ["--rar" as string]: r.accent,
                    }}>
                    <span aria-hidden className="event-card__sheen" />
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[55%]" style={{ background: `radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, ${r.accent} 26%, transparent), transparent 70%)` }} />
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${r.accent}, transparent)` }} />
                    <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[1.5px] sm:relative sm:right-auto sm:top-auto sm:mb-6 sm:px-3 sm:py-1 sm:text-[9px] sm:tracking-[2px]"
                      style={{ color: r.accent, background: `color-mix(in srgb, ${r.accent} 16%, rgba(16,17,20,0.9))`, border: `1px solid color-mix(in srgb, ${r.accent} 45%, transparent)`, boxShadow: `0 0 14px -4px ${r.glow}` }}>
                      {hostile ? "⚠ " : legendary ? "✦ " : ""}{r.label}{card.permanent && " · perm"}
                    </span>
                    <span className="event-card__medal relative my-1 flex h-[60px] w-[60px] items-center justify-center rounded-full text-[32px] leading-none transition-transform duration-300 group-hover:scale-110 sm:my-2 sm:h-[100px] sm:w-[100px] sm:text-[52px]"
                      style={{
                        background: `radial-gradient(circle at 50% 38%, color-mix(in srgb, ${r.accent} 22%, rgba(20,21,24,0.9)), rgba(14,15,18,0.95))`,
                        border: `1.5px solid color-mix(in srgb, ${r.accent} 60%, transparent)`,
                        boxShadow: `0 0 26px -6px ${r.glow}, inset 0 0 18px -8px color-mix(in srgb, ${r.accent} 80%, transparent)`,
                      }}>
                      <span className="event-card__icon drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{card.icon}</span>
                    </span>
                    <span className="relative mt-2 font-display text-[21px] font-extrabold uppercase tracking-[1px] sm:mt-5 sm:text-[22px]" style={{ color: "#f3ecd8", textShadow: `0 0 18px color-mix(in srgb, ${r.accent} 55%, transparent)` }}>
                      {card.name}
                    </span>
                    <span className="relative mt-3.5 text-[12.5px] leading-snug text-[#C7CCD4] sm:mt-5 sm:text-[13.5px] sm:leading-relaxed">{card.desc}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* fase 2: alvo */}
          {sel && (
            <div className="anim-fade-fast">
              {/* nerf no rival OU troca com rival: lista os 5 do rival */}
              {(sel.kind === "nerfOpp" || sel.kind === "swapWithOpp") && (
                <div className="mx-auto max-w-[560px] rounded-2xl border border-red/30 p-3" style={{ background: "rgba(28,24,26,0.7)" }}>
                  <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">{oppLine.name}</div>
                  <div className="flex flex-col gap-1.5">
                    {oppLine.line.map((p) => {
                      const mine = myPicks.find((x) => x.role === p.role);
                      return (
                        <button key={p.role} onClick={() => send(sel, { role: p.role })}
                          className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-transparent px-3 py-2 text-left transition-all hover:border-red/40 hover:bg-[rgba(210,122,104,0.12)]">
                          <RoleBadge role={p.role} variant="red" size="sm" />
                          <Flag cc={p.country} size={16} />
                          <span className="flex-1 truncate font-display text-[16px] font-semibold text-[#E7E0D6]">{p.name}</span>
                          {sel.kind === "swapWithOpp" && mine && <span className="font-mono text-[10px] uppercase tracking-[1px] text-dim">troca c/ {mine.name}</span>}
                          {ratingPill(p.rating)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* lane SUA */}
              {(sel.kind === "roleBuffChoose" || sel.kind === "captainChoose" || sel.kind === "igniteChoose" || sel.kind === "injureChoose" || sel.kind === "permNerfChoose") && (() => {
                const bad = sel.kind === "injureChoose" || sel.kind === "permNerfChoose";
                const prompt =
                  sel.kind === "captainChoose" ? "Quem será o capitão (+6)?"
                  : sel.kind === "igniteChoose" ? "Quem entra em chamas? 🔥"
                  : sel.kind === "injureChoose" ? `Quem vai aguentar o -${sel.value}?`
                  : sel.kind === "permNerfChoose" ? `Qual lane leva o -${sel.value} PERMANENTE?`
                  : `Qual lane recebe o +${sel.value}?`;
                return (
                  <div className={`mx-auto max-w-[560px] rounded-2xl border p-3 ${bad ? "border-red/40" : "border-gold/30"}`} style={{ background: bad ? "rgba(30,22,22,0.72)" : "rgba(30,30,33,0.7)" }}>
                    <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">{prompt}</div>
                    <div className="flex flex-col gap-1.5">
                      {myPicks.map((p) => (
                        <button key={p.role} onClick={() => send(sel, { role: p.role })}
                          className={`flex cursor-pointer items-center gap-3 rounded-[10px] border border-transparent px-3 py-2 text-left transition-all ${bad ? "hover:border-red/40 hover:bg-[rgba(224,88,74,0.12)]" : "hover:border-gold/40 hover:bg-[rgba(201,162,75,0.1)]"}`}>
                          <RoleBadge role={p.role} variant={bad ? "red" : "gold"} size="sm" />
                          <Flag cc={p.country} size={16} />
                          <span className="flex-1 truncate font-display text-[16px] font-semibold text-cream">{p.name}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[1px] text-dim">{p.short} '{yy(p.year)}</span>
                          {ratingPill(p.rating)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* curinga: lane a trocar → tabela */}
              {sel.kind === "swapOwnRole" && !swapRole && (
                <div className="mx-auto max-w-[560px] rounded-2xl border border-gold/30 p-3" style={{ background: "rgba(30,30,33,0.7)" }}>
                  <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">Qual jogador trocar?</div>
                  <div className="flex flex-col gap-1.5">
                    {myPicks.map((p) => (
                      <button key={p.role} onClick={() => setSwapRole(p.role)}
                        className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-transparent px-3 py-2 text-left transition-all hover:border-gold/40 hover:bg-[rgba(201,162,75,0.1)]">
                        <RoleBadge role={p.role} variant="gold" size="sm" />
                        <Flag cc={p.country} size={16} />
                        <span className="flex-1 truncate font-display text-[16px] font-semibold text-cream">{p.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[1px] text-dim">{p.short} '{yy(p.year)}</span>
                        {ratingPill(p.rating)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sel.kind === "swapOwnRole" && swapRole && (
                <div className="mx-auto max-w-[620px] rounded-2xl border border-gold/30 p-3" style={{ background: "rgba(30,30,33,0.7)" }}>
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <span className="font-mono text-[10px] uppercase tracking-[2px] text-muted">{ROLE_LABEL[swapRole]} · finalistas</span>
                    <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="buscar jogador ou time…"
                      className="ml-auto w-[220px] rounded-[8px] border border-gold/25 bg-[rgba(12,13,16,0.8)] px-3 py-1.5 font-mono text-[12px] text-cream outline-none placeholder:text-dim focus:border-gold/50" />
                  </div>
                  <div className="flex max-h-[46vh] flex-col gap-1.5 overflow-y-auto pr-1">
                    {rolePlayers.map((p) => (
                      <button key={`${p.teamId}-${p.year}-${p.name}`} onClick={() => send(sel, { role: swapRole, swapTeamId: p.team, swapName: p.name })}
                        className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-transparent px-3 py-2 text-left transition-all hover:border-gold/40 hover:bg-[rgba(201,162,75,0.1)]">
                        <Flag cc={p.country} size={16} />
                        <span className="flex-1 truncate font-display text-[16px] font-semibold text-cream">{p.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[1px] text-dim">{p.short} '{yy(p.year)}</span>
                        {ratingPill(p.rating)}
                      </button>
                    ))}
                    {!rolePlayers.length && <div className="px-2 py-4 text-center font-mono text-[12px] text-dim">nada encontrado</div>}
                  </div>
                </div>
              )}

              <div className="mt-5 text-center">
                <button onClick={swapRole ? () => setSwapRole(null) : () => { setSel(null); setSwapRole(null); setQuery(""); }}
                  className="btn-soft-gold cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
                  ← Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function targetHint(card: EventCard, swapRole: Role | null): string {
  if (card.kind === "nerfOpp") return "escolha quem do rival vai levar o nerf";
  if (card.kind === "swapWithOpp") return "escolha quem roubar do rival (troca pela sua lane)";
  if (card.kind === "swapOwnRole") return swapRole ? "escolha o substituto" : "escolha quem sai da sua line";
  if (card.kind === "roleBuffChoose") return "escolha a lane que vai receber o buff";
  if (card.kind === "captainChoose") return "escolha o capitão (+6 nele, -1 nos outros)";
  if (card.kind === "igniteChoose") return "escolha quem vai entrar em chamas";
  if (card.kind === "injureChoose") return "escolha quem da sua line vai levar o nerf";
  if (card.kind === "permNerfChoose") return "escolha onde aplicar o dano PERMANENTE";
  return "";
}
