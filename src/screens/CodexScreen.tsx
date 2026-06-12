import type { CSSProperties } from "react";
import type { Game } from "../game/useGame";
import type { Team, Tournament } from "../types";
import { DRAFT_TEAMS, QUARTERFINAL_IDS, SEMIFINAL_IDS } from "../data/teams";
import { rarityFor, teamAvg } from "../game/helpers";
import { Flag } from "../components/Flag";
import { RoleBadge } from "../components/RoleBadge";

// agrupa os times de playoff por (torneio, ano). Ordem: ano desc; no mesmo ano,
// Worlds (fim do ano) antes do MSI (meio do ano).
const TOURN_LABEL: Record<Tournament, string> = { worlds: "Worlds", msi: "MSI" };
const TOURN_ORDER: Record<Tournament, number> = { worlds: 0, msi: 1 };
interface CodexGroup { key: string; year: number; tournament: Tournament; teams: Team[] }
const BY_GROUP: CodexGroup[] = (() => {
  const map = new Map<string, CodexGroup>();
  for (const t of DRAFT_TEAMS) {
    const tournament = t.tournament ?? "worlds";
    const key = `${tournament}-${t.year}`;
    if (!map.has(key)) map.set(key, { key, year: t.year, tournament, teams: [] });
    map.get(key)!.teams.push(t);
  }
  return [...map.values()].sort(
    (a, b) => b.year - a.year || TOURN_ORDER[a.tournament] - TOURN_ORDER[b.tournament],
  );
})();
const EDITION_COUNT = BY_GROUP.length;

/** Selo da colocação do time naquele Worlds. */
function placement(t: Team): { label: string; color: string; border: string; bg: string } {
  if (t.champion) return { label: "★ CAMPEÃO", color: "#E8CE86", border: "rgba(232,206,134,0.55)", bg: "rgba(201,162,75,0.14)" };
  if (t.finalist) return { label: "🥈 VICE", color: "#c4c9d2", border: "rgba(196,201,210,0.5)", bg: "rgba(150,160,175,0.12)" };
  if (SEMIFINAL_IDS.has(t.id)) return { label: "🥉 SEMI", color: "#cd8b5a", border: "rgba(205,139,90,0.5)", bg: "rgba(205,139,90,0.12)" };
  if (QUARTERFINAL_IDS.has(t.id)) return { label: "QUARTAS", color: "#9097a1", border: "rgba(144,151,161,0.4)", bg: "rgba(144,151,161,0.1)" };
  return { label: "PLAYOFF", color: "#9097a1", border: "rgba(144,151,161,0.4)", bg: "rgba(144,151,161,0.1)" };
}

function TeamCard({ team }: { team: Team }) {
  const avg = teamAvg(team.players);
  const p = placement(team);
  return (
    <div className="panel-raised overflow-hidden rounded-2xl border border-gold/20">
      <div className="flex items-center justify-between gap-2 border-b border-gold/15 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-display text-[16px] font-semibold leading-tight text-cream">{team.team}</span>
          <span className="font-mono text-[10px] text-muted">{team.league}</span>
        </div>
        <span
          className="rounded-[5px] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[1px]"
          style={{ color: p.color, border: `1px solid ${p.border}`, background: p.bg }}
        >
          {p.label}
        </span>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {team.players.map((pl) => {
          const skin = rarityFor(pl[2]);
          return (
            <div
              key={pl[0]}
              className="flex items-center gap-2 rounded-[8px] px-2 py-1.5"
              style={{ background: "rgba(28,34,45,0.5)" }}
            >
              <RoleBadge role={pl[0]} variant="neutral" size="sm" />
              <span className="flex min-w-0 flex-1 items-center gap-1.5">
                <Flag cc={pl[3]} size={11} />
                <span className="truncate font-display text-[14px] font-semibold text-cream">{pl[1]}</span>
              </span>
              <span className="font-mono text-[16px] font-bold leading-none" style={{ color: skin.ratingColor }}>
                {pl[2]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-gold/15 px-3.5 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">Média</span>
        <span className="font-mono text-[18px] font-bold text-gold-bright">{avg}</span>
      </div>
    </div>
  );
}

export function CodexScreen({ game }: { game: Game }) {
  const sticky: CSSProperties = { position: "sticky", top: 0, zIndex: 10 };
  return (
    <div className="anim-fade mx-auto w-full max-w-[1180px]">
      {/* topo */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[clamp(24px,4vw,38px)] font-bold uppercase tracking-[1px] text-gold-fill">
            Almanaque
          </h1>
          <p className="mt-1 font-mono text-[12px] uppercase tracking-[2px] text-muted">
            Os times de playoff de cada torneio · {EDITION_COUNT} edições
          </p>
        </div>
        <button
          onClick={game.restart}
          className="btn-ghost cursor-pointer rounded-[11px] px-5 py-3 font-display text-[14px] font-semibold uppercase tracking-[1px]"
        >
          ← Voltar
        </button>
      </div>

      {/* blocos por edição */}
      <div className="flex flex-col gap-9">
        {BY_GROUP.map(({ key, year, tournament, teams }) => (
          <section key={key}>
            <div
              className="mb-3 flex items-center gap-3 bg-app py-1"
              style={sticky}
            >
              <span className="font-display text-[26px] font-bold leading-none text-gold-bright">
                {year}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-muted">{TOURN_LABEL[tournament]} {year}</span>
              <span className="h-px flex-1" style={{ background: "rgba(201,162,75,0.22)" }} />
              <span className="font-mono text-[11px] text-dim">{teams.length} times</span>
            </div>
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
              {teams.map((t) => (
                <TeamCard key={t.id} team={t} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
