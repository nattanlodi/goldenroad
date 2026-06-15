import type { Tournament } from "../../game/useTournament";
import type { Role } from "../../types";
import { competitorLabel, competitorSubtitle, placements, type Competitor } from "../../game/tournament";
import { Flag } from "../../components/Flag";
import { RoleBadge } from "../../components/RoleBadge";

/** Cor/rótulo por colocação. */
function placeStyle(place: number): { label: string; color: string; medal: string } {
  if (place === 1) return { label: "Campeão", color: "#e8ce86", medal: "🥇" };
  if (place === 2) return { label: "Vice", color: "#c4c9d2", medal: "🥈" };
  if (place === 3) return { label: "Semifinal", color: "#cd8b5a", medal: "🥉" };
  return { label: "Quartas", color: "#8a8f98", medal: "" };
}

export function TournamentResultScreen({ t }: { t: Tournament }) {
  const { state, reset } = t;
  const { bracket, competitors, championId, myId } = state;
  if (!bracket) return null;
  const byId = new Map(competitors.map((c) => [c.id, c]));
  const places = placements(bracket);
  const champion = championId ? byId.get(championId) : null;
  const iWon = championId === myId;

  // classificação: por colocação (asc), score desempata DENTRO do nível (aqui: por avg da line).
  const ranked = competitors
    .map((c) => ({ c, place: places.get(c.id) ?? 9 }))
    .sort((x, y) => x.place - y.place || y.c.avg - x.c.avg);

  // top-3 pro pódio (semis empatam em 3º — pega os dois).
  const first = ranked.find((r) => r.place === 1)?.c ?? null;
  const second = ranked.find((r) => r.place === 2)?.c ?? null;
  const thirds = ranked.filter((r) => r.place === 3).map((r) => r.c);

  return (
    <div className="anim-fade mx-auto w-full max-w-[860px]">
      {/* manchete */}
      <div className="mb-7 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[3px] text-muted">Worlds ao Vivo</div>
        <div className="mt-2 font-display text-[clamp(26px,5vw,44px)] font-black uppercase tracking-[1px]">
          {champion ? (
            <span className="text-gold-fill">
              {iWon ? "Você é o campeão do mundo!" : `${competitorLabel(champion)} venceu!`}
            </span>
          ) : (
            "Torneio encerrado"
          )}
        </div>
        {champion && (
          <div className="mt-1.5 font-mono text-[12px] tracking-[1px] text-dim">
            {competitorSubtitle(champion)} · line média {champion.avg}
          </div>
        )}
      </div>

      {/* pódio de 3 degraus */}
      <div className="mb-8 flex items-end justify-center gap-3">
        <PodiumStep c={second} place={2} height={92} />
        <PodiumStep c={first} place={1} height={128} big mine={first?.id === myId} />
        <PodiumStep c={thirds[0] ?? null} place={3} height={70} second={thirds[1] ?? null} />
      </div>

      {/* classificação dos 8 */}
      <div className="overflow-hidden rounded-2xl border border-gold/25" style={{ background: "rgba(26,27,31,0.6)" }}>
        <div className="border-b border-gold/20 px-4 py-2.5 font-display text-[13px] font-bold uppercase tracking-[1px] text-gold-bright">
          Classificação final
        </div>
        <div className="flex flex-col">
          {ranked.map(({ c, place }, i) => {
            const st = placeStyle(place);
            const mine = c.id === myId;
            return (
              <div key={c.id} className="flex items-center gap-3 border-b border-gold/10 px-4 py-2.5 last:border-b-0"
                style={mine ? { background: "rgba(201,162,75,0.09)" } : undefined}>
                <span className="w-[28px] text-center font-mono text-[15px] font-black" style={{ color: st.color }}>
                  {st.medal || i + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={`truncate font-display text-[15px] font-bold ${mine ? "text-gold-bright" : "text-cream"}`}>
                    {competitorLabel(c)}{mine ? " (você)" : ""}
                  </span>
                  <span className="truncate font-mono text-[9.5px] text-dim">{competitorSubtitle(c)}</span>
                </span>
                <span className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[1px]"
                  style={{ color: st.color, background: `color-mix(in srgb, ${st.color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${st.color} 35%, transparent)` }}>
                  {st.label}
                </span>
                <span className="w-[34px] text-right font-mono text-[14px] font-bold text-muted">{c.avg}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* caminho do campeão (lines) */}
      {champion && (
        <div className="mt-6">
          <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[2px] text-muted">A line campeã</div>
          <ChampionLine c={champion} />
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="btn-gold cursor-pointer rounded-[12px] border-none px-8 py-3.5 font-display text-[16px] font-semibold uppercase tracking-[2px]">
          🔁 Novo torneio
        </button>
      </div>
    </div>
  );
}

function PodiumStep({ c, place, height, big, mine, second }: { c: Competitor | null; place: number; height: number; big?: boolean; mine?: boolean; second?: Competitor | null }) {
  const st = placeStyle(place);
  return (
    <div className="flex w-[120px] flex-col items-center sm:w-[160px]">
      <div className="mb-2 flex flex-col items-center text-center">
        <span className="text-[22px]">{st.medal}</span>
        <span className={`mt-1 font-display text-[14px] font-bold leading-tight ${big ? "text-gold-bright" : "text-cream"}`}>
          {c ? competitorLabel(c) : "—"}{mine ? " (você)" : ""}
        </span>
        {second && (
          <span className="font-display text-[12px] font-semibold text-cream">{competitorLabel(second)}</span>
        )}
        {c && <span className="font-mono text-[9px] text-dim">média {c.avg}</span>}
      </div>
      <div
        className="w-full rounded-t-[10px] border-x border-t"
        style={{
          height,
          borderColor: `color-mix(in srgb, ${st.color} 40%, transparent)`,
          background: big
            ? "linear-gradient(180deg,rgba(201,162,75,0.3),rgba(201,162,75,0.06))"
            : `linear-gradient(180deg, color-mix(in srgb, ${st.color} 22%, transparent), transparent)`,
        }}
      >
        <div className="pt-2 text-center font-display text-[22px] font-black" style={{ color: st.color }}>{place === 3 && second ? "3-4" : place}</div>
      </div>
    </div>
  );
}

function ChampionLine({ c }: { c: Competitor }) {
  return (
    <div className="mx-auto flex max-w-[560px] flex-wrap items-center justify-center gap-2">
      {c.line.map((p) => (
        <div key={p.role} className="flex items-center gap-2 rounded-[10px] border border-gold/25 px-3 py-2" style={{ background: "rgba(30,30,33,0.6)" }}>
          <RoleBadge role={p.role as Role} variant="gold" size="sm" />
          <Flag cc={p.country} size={11} />
          <span className="font-display text-[14px] font-semibold text-cream">{p.name}</span>
          <span className="font-mono text-[13px] font-bold text-gold-bright">{p.rating}</span>
        </div>
      ))}
    </div>
  );
}
