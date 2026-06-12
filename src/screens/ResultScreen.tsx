import type { Game } from "../game/useGame";
import { lineupPicks, tierFor, yy } from "../game/helpers";
import { Flag } from "../components/Flag";
import { RoleBadge } from "../components/RoleBadge";
import { Logo6x0 } from "../components/Logo6x0";
import { teamColor } from "../data/teamColors";
import type { CampaignEnd, CareerStage, PlayedSeries, Role } from "../types";

const ROLE_LABEL: Record<Role, string> = { TOP: "TOP", JNG: "JNG", MID: "MID", BOT: "ADC", SUP: "SUP" };

const CHAMP_META: Record<CareerStage, { label: string; icon: string }> = {
  msi: { label: "MSI", icon: "⚔" },
  worlds: { label: "Worlds", icon: "🏆" },
};

interface ChampGroup {
  key: CareerStage;
  series: PlayedSeries[];
  wins: number;
  losses: number;
  outcome: "champion" | "eliminated";
}

/** Agrupa o histórico por campeonato, na ordem em que foram disputados. O último
 *  grupo herda o desfecho da campanha (finished); os anteriores foram vencidos
 *  (você só avança de campeonato sendo campeão). */
function groupByChampionship(history: PlayedSeries[], finished: CampaignEnd | null): ChampGroup[] {
  const order: CareerStage[] = [];
  const map = new Map<CareerStage, PlayedSeries[]>();
  for (const h of history) {
    if (!map.has(h.championship)) {
      map.set(h.championship, []);
      order.push(h.championship);
    }
    map.get(h.championship)!.push(h);
  }
  return order.map((key, idx) => {
    const series = map.get(key)!;
    const wins = series.filter((s) => s.won).length;
    const isLast = idx === order.length - 1;
    return {
      key,
      series,
      wins,
      losses: series.length - wins,
      outcome: isLast ? (finished === "champion" ? "champion" : "eliminated") : "champion",
    };
  });
}

type ResultKind = "title" | "vice" | "out";
function champResult(g: ChampGroup): { text: string; kind: ResultKind } {
  if (g.outcome === "champion") {
    return { text: g.key === "worlds" ? "Campeão do Mundo" : "Campeão do MSI", kind: "title" };
  }
  const last = g.series[g.series.length - 1];
  if (g.key === "worlds") {
    switch (last?.stageKey) {
      case "final":
        return { text: "Vice-campeão", kind: "vice" };
      case "semi":
        return { text: "Eliminado · Semifinal", kind: "out" };
      case "quarter":
        return { text: "Eliminado · Quartas", kind: "out" };
      default:
        return { text: "Eliminado · Fase Suíça", kind: "out" };
    }
  }
  return { text: `Eliminado · ${last?.stageLabel ?? "MSI"}`, kind: "out" };
}

const RESULT_STYLE: Record<ResultKind, { color: string; bg: string; border: string }> = {
  title: { color: "#e8ce86", bg: "rgba(201,162,75,0.16)", border: "rgba(232,206,134,0.6)" },
  vice: { color: "#cdd3da", bg: "rgba(180,190,200,0.12)", border: "rgba(180,190,200,0.45)" },
  out: { color: "#e08a78", bg: "rgba(210,122,104,0.13)", border: "rgba(224,154,135,0.45)" },
};

/** Bloco de um campeonato: cabeçalho com resultado + lista das séries. */
function ChampionshipBlock({ group, bg }: { group: ChampGroup; bg: string }) {
  const meta = CHAMP_META[group.key];
  const res = champResult(group);
  const st = RESULT_STYLE[res.kind];
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border" style={{ borderColor: st.border, background: bg }}>
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3.5" style={{ borderColor: st.border }}>
        <div className="flex items-center gap-2">
          <span className="text-[18px]">{meta.icon}</span>
          <span className="font-display text-[18px] font-bold uppercase tracking-[1.5px] text-cream">{meta.label}</span>
          <span className="font-mono text-[11px] tracking-[1px] text-dim">{group.wins}–{group.losses}</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[12px] font-bold uppercase tracking-[1px]"
          style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
        >
          {res.kind === "title" ? "🏆" : res.kind === "vice" ? "🥈" : "✖"} {res.text}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        {group.series.slice().reverse().map((h, i) => {
          const accent = teamColor(h.opp.short).accent;
          // grande final = última série do bloco (i===0 após o reverse) com label de
          // "Grande Final" ou a final do Worlds — ganha destaque dourado.
          const isGF = i === 0 && (h.stageLabel.includes("Grande Final") || (group.key === "worlds" && h.stageKey === "final"));
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-[10px] px-3 ${isGF ? "border-2 py-2.5" : "border py-2"}`}
              style={
                isGF
                  ? {
                      background: "linear-gradient(100deg,rgba(201,162,75,0.2),rgba(120,80,24,0.1))",
                      borderColor: "rgba(232,206,134,0.7)",
                      boxShadow: "0 0 22px -6px rgba(201,162,75,0.5)",
                    }
                  : {
                      background: h.won ? "rgba(30,40,33,0.5)" : "rgba(44,32,33,0.5)",
                      borderColor: h.won ? "rgba(126,208,143,0.22)" : "rgba(210,122,104,0.24)",
                    }
              }
            >
              {isGF && <span className="text-[15px] leading-none">🏆</span>}
              <span className="min-w-0 flex-1">
                <span className={`block font-mono text-[9px] uppercase tracking-[1px] ${isGF ? "font-bold text-gold-bright" : "text-muted"}`}>
                  {h.stageLabel} · {h.format}
                </span>
                <span className="mt-px flex items-center gap-1.5">
                  <span className={`font-display font-semibold ${isGF ? "text-[16px] text-cream" : "text-[15px] text-cream"}`}>vs {h.opp.team}</span>
                  <span className="font-mono text-[11px]" style={{ color: accent }}>'{yy(h.opp.year)}</span>
                </span>
              </span>
              <span className={`font-mono font-bold tracking-[1px] ${isGF ? "text-[18px]" : "text-[16px]"} ${h.won ? "text-win" : "text-red"}`}>
                {h.yourGames}–{h.oppGames}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ResultScreen({ game }: { game: Game }) {
  const { lineup, history, record, isNewRecord, copied, finished, finalsMvp } = game.state;
  // overall ORIGINAL (baseRating) — nota real do jogador, sem buffs de carta.
  const picks = lineupPicks(lineup).map((p) => ({ ...p, rating: p.baseRating }));
  const avg = picks.length ? Math.round(picks.reduce((a, p) => a + p.rating, 0) / picks.length) : 0;
  const champs = picks.filter((p) => p.champion).length;
  const { tier, desc: tierDesc } = tierFor(avg);

  const wins = history.filter((h) => h.won).length;
  const losses = history.filter((h) => !h.won).length;
  const isChampion = finished === "champion";

  const groups = groupByChampionship(history, finished);
  const hasMsi = groups.some((g) => g.key === "msi");
  const worldsG = groups.find((g) => g.key === "worlds");
  const msiG = groups.find((g) => g.key === "msi");
  const worldChampion = worldsG?.outcome === "champion";
  const msiChampion = msiG?.outcome === "champion";
  const perfect = isChampion && losses === 0;

  // headline adaptável: mostra o MAIOR título conquistado + o desfecho da campanha.
  let topLabel: string;
  let bigTitle: string;
  let bigGradient: boolean;
  let desc: string;
  if (worldChampion) {
    topLabel = perfect ? (hasMsi ? "★ CAMPANHA INVICTA ★" : "★ 6–0 PERFEITO ★") : `★ Campeão do mundo · ${wins}–${losses} ★`;
    bigTitle = tier;
    bigGradient = true;
    desc = tierDesc;
  } else if (msiChampion) {
    // venceu o MSI mas caiu no Worlds
    topLabel = `Campanha encerrada · ${wins}–${losses}`;
    bigTitle = "CAMPEÃO DO MSI";
    bigGradient = true;
    desc = worldsG ? `${champResult(worldsG).text} no Worlds — o título do MSI fica de consolo.` : "Conquistou o MSI.";
  } else {
    // eliminado sem título (cai no MSI, ou modo Worlds avulso)
    const lastG = groups[groups.length - 1];
    const r = lastG ? champResult(lastG) : { text: "Eliminado", kind: "out" as ResultKind };
    topLabel = `Campanha encerrada · ${wins}–${losses}`;
    bigTitle = r.kind === "vice" ? "VICE-CAMPEÃO" : "ELIMINADO";
    bigGradient = r.kind === "vice";
    desc = lastG?.key === "msi" ? `Parou no MSI — ${r.text.replace("Eliminado · ", "")}.` : r.text;
  }

  // na tela de vitória o fundo é DOURADO → cards precisam de fundo escuro SÓLIDO
  // pra assentar (senão o dourado vaza e fica "lavado").
  const cardBg = isChampion ? "rgba(18,15,10,0.92)" : "rgba(40,49,63,0.65)";
  const panelBg = isChampion
    ? "linear-gradient(180deg,rgba(22,18,12,0.95),rgba(14,11,7,0.96))"
    : "linear-gradient(180deg,rgba(34,35,39,0.85),rgba(24,25,28,0.9))";
  // títulos de seção ("A campanha", "Sua line"): escuro na vitória (lê sobre o dourado).
  const sectionTitleCls = "mb-3 text-center font-display text-[16px] font-semibold uppercase tracking-[2px]";
  const sectionTitleStyle = isChampion ? { color: "#241a08" } : undefined;

  return (
    <div className="anim-fade mx-auto w-full max-w-[1400px]">
      {/* header */}
      <div className="mb-[26px] text-center">
        {worldChampion ? (
          // campeão do mundo: tudo em TOM ESCURO (lê sobre o fundo dourado).
          <div className="flex flex-col items-center">
            <div className="font-display text-[clamp(18px,3vw,28px)] font-bold uppercase tracking-[3px]" style={{ color: "#241a08" }}>
              Você conquistou a
            </div>
            <Logo6x0 layout="inline" fill="#1c1406" className="mt-1 h-[clamp(46px,8vw,78px)] w-auto" />
          </div>
        ) : (
          <>
            <div className={`mb-2.5 font-mono text-[12px] uppercase tracking-[3px] ${msiChampion ? "text-gold-bright" : "text-red-soft"}`}>
              {topLabel}
            </div>
            <div className={`font-display text-[clamp(40px,8vw,72px)] font-bold leading-[0.95] tracking-[-1px] ${bigGradient ? "text-gold-fill" : "text-cream"}`}>
              {bigTitle}
            </div>
            <p className="mt-2.5 text-[16px] text-[#BFC4CD]">{desc}</p>
          </>
        )}
      </div>

      {/* MVP das Finais + stats — tudo na MESMA linha (economiza vertical) */}
      <div className="mb-[26px] flex flex-wrap items-stretch justify-center gap-4">
        {isChampion && finalsMvp && (
          <div
            className="anim-pop inline-flex items-center gap-3.5 rounded-[14px] px-5 py-3.5"
            style={{
              background: "linear-gradient(135deg,rgba(38,28,12,0.95),rgba(20,15,8,0.96))",
              border: "1.5px solid rgba(232,206,134,0.75)",
              boxShadow: "0 0 30px rgba(201,162,75,0.4)",
            }}
          >
            <span className="text-[28px]">🏆</span>
            <span className="flex flex-col items-start leading-tight">
              <span className="font-display text-[11px] font-bold uppercase tracking-[2px] text-gold-bright">MVP das Finais</span>
              <span className="mt-1 flex items-center gap-2">
                <Flag cc={finalsMvp.country} size={15} />
                <span className="font-display text-[22px] font-bold text-cream">{finalsMvp.name}</span>
                <span className="font-mono text-[12px] text-muted">{ROLE_LABEL[finalsMvp.role]}</span>
                <span className="font-mono text-[17px] font-bold text-gold-bright">{finalsMvp.rating}</span>
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center rounded-[14px] border border-gold/30 px-[26px] py-3 text-center" style={{ background: cardBg }}>
          <div>
            <div className="font-mono text-[38px] leading-none font-bold text-gold-bright">{avg}</div>
            <div className="mt-[5px] font-mono text-[11px] tracking-[1px] text-muted">NOTA DA LINE</div>
          </div>
        </div>
        <div className="flex items-center rounded-[14px] border border-gold/30 px-[26px] py-3 text-center" style={{ background: cardBg }}>
          <div>
            <div className="font-mono text-[38px] leading-none font-bold text-cream">
              {wins}
              <span className="text-[22px] text-dim">–{losses}</span>
            </div>
            <div className="mt-[5px] font-mono text-[11px] tracking-[1px] text-muted">SÉRIES</div>
          </div>
        </div>
        <div className="flex items-center rounded-[14px] border border-gold/30 px-[26px] py-3 text-center" style={{ background: cardBg }}>
          <div>
            <div className="font-mono text-[38px] leading-none font-bold text-cream">
              {champs}
              <span className="text-[22px] text-dim">/5</span>
            </div>
            <div className="mt-[5px] font-mono text-[11px] tracking-[1px] text-muted">CAMPEÕES MUNDIAIS</div>
          </div>
        </div>
      </div>

      {/* campeonatos da campanha (MSI, Worlds, futuros) */}
      <div className="mb-[26px]">
        <div className={`${sectionTitleCls} ${isChampion ? "" : "text-muted"}`} style={sectionTitleStyle}>A campanha</div>
        <div className={`grid items-start gap-6 [grid-template-columns:1fr] ${groups.length > 1 ? "wide:[grid-template-columns:1fr_1fr]" : "mx-auto max-w-[680px]"}`}>
          {groups.map((g) => (
            <ChampionshipBlock key={g.key} group={g} bg={panelBg} />
          ))}
        </div>
      </div>

      {/* sua line */}
      <div className="mb-[26px]">
        <div className={`${sectionTitleCls} ${isChampion ? "" : "text-muted"}`} style={sectionTitleStyle}>Sua line</div>
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {picks.map((p) => (
            <div key={p.role} className="flex items-center gap-3 rounded-[12px] border border-gold/25 px-3.5 py-3" style={{ background: cardBg }}>
              <RoleBadge role={p.role} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <Flag cc={p.country} size={12} />
                  <span className="truncate font-display text-[16px] font-semibold text-cream">{p.name}</span>
                </span>
                <span className="block font-mono text-[11px] text-muted">{p.short} '{yy(p.year)}</span>
              </span>
              <span className="font-mono text-[18px] font-bold text-gold-bright">{p.rating}</span>
            </div>
          ))}
        </div>
      </div>

      {/* compartilhar */}
      <div className="rounded-2xl border border-gold/20 p-[22px] text-center" style={{ background: cardBg }}>
        {isNewRecord && (
          <div className="mb-1.5 font-display text-[18px] font-bold uppercase tracking-[2px] text-win-bright">★ Novo recorde!</div>
        )}
        <div className="mb-4 font-mono text-[12px] tracking-[1px] text-muted">
          {record > 0 ? (
            <>
              Seu recorde de nota (como campeão): <b className="text-gold-bright">{record}</b>
            </>
          ) : (
            <>Ainda sem recorde — vença o mundial pra cravar o seu.</>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-[11px]">
          <button onClick={game.copyResult} className="btn-ghost cursor-pointer rounded-[11px] px-6 py-[13px] font-display text-[15px] font-semibold uppercase tracking-[1px]">
            {copied ? "✓ Copiado!" : "⧉ Copiar resultado"}
          </button>
          <button onClick={game.downloadCard} className="btn-gold cursor-pointer rounded-[11px] border-none px-6 py-[13px] font-display text-[15px] font-semibold uppercase tracking-[1px]">
            ⬇ Baixar imagem
          </button>
          <button onClick={game.restart} className="btn-ghost cursor-pointer rounded-[11px] px-6 py-[13px] font-display text-[15px] font-semibold uppercase tracking-[1px]">
            Jogar de novo
          </button>
        </div>
      </div>
    </div>
  );
}
