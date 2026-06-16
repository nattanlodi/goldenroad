// ============================================================
// OnlineResultScreen — resultado do duelo 1v1 (Degrau 1)
// ============================================================
// Tela final: quem venceu o duelo + placar + as duas lines. Reusa o LineColumn.
// "Jogar de novo" volta pro início do online (nova sala).

import type { UseOnlineRoom } from "../../game/online/useOnlineRoom";
import { ROLES } from "../../data/teams";
import { type Competitor, type TournamentPick } from "../../game/tournament";
import { Logo6x0 } from "../../components/Logo6x0";
import { LineColumn } from "../tournament/LineColumn";
import { TournamentPodium } from "../tournament/TournamentResultScreen";

export function OnlineResult({ r, myId, overrideBracket = null, onExit }: { r: UseOnlineRoom; myId: string | null; overrideBracket?: import("../../game/tournament").Bracket | null; onExit: () => void }) {
  const st = r.state;
  const s = st?.series ?? null;
  const showRatings = !(st?.config.hideRatings ?? false);

  const comp = (pid: string | undefined): Competitor => {
    const p = st?.players.find((pp) => pp.playerId === pid);
    const line = p ? ROLES.map((rr) => p.picks[rr]).filter((x): x is TournamentPick => !!x) : [];
    const avg = line.length ? Math.round(line.reduce((a, x) => a + x.rating, 0) / line.length) : 0;
    return { id: pid ?? "?", name: p?.nick ?? "—", isBot: p?.isBot ?? false, line, avg, form: {} };
  };

  // ── TORNEIO de 8: pódio idêntico ao offline (1×7) ──
  // `overrideBracket` = bracket completado LOCALMENTE pelo convidado eliminado
  // (quando o host não confirmou o fim via rede). Senão usa o do estado.
  const bracket = overrideBracket ?? st?.bracket ?? null;
  if (bracket) {
    const competitors = (st?.players ?? []).map((p) => comp(p.playerId));
    const championId = bracket.gf.winner ?? st?.winnerId ?? null;
    return (
      <div className="anim-fade mx-auto w-full">
        <TournamentPodium bracket={bracket} competitors={competitors} championId={championId} myId={myId ?? ""} onReset={onExit} />
      </div>
    );
  }
  // VISÃO EGOCÊNTRICA: minha line à esquerda, adversário à direita.
  const iAmA = s?.aId === myId;
  const meC = comp(iAmA ? s?.aId : s?.bId);
  const oppC = comp(iAmA ? s?.bId : s?.aId);

  // vencedor DERIVADO da série pré-simulada (não depende do winnerId, que o
  // convidado pode não ter recebido se o snapshot final se perdeu).
  const myFinal = s ? (iAmA ? s.finalA : s.finalB) : 0;
  const oppFinal = s ? (iAmA ? s.finalB : s.finalA) : 0;
  const iWon = myFinal > oppFinal;
  const winnerName = iWon ? meC.name : oppC.name;

  return (
    <div className="anim-fade mx-auto flex w-full max-w-[1000px] flex-col items-center">
      <Logo6x0 className="mb-4 h-auto w-[200px]" />

      <div className="mb-5 w-full rounded-2xl border border-gold/35 px-6 py-6 text-center" style={{ background: "linear-gradient(150deg,rgba(58,48,22,0.5),rgba(30,37,49,0.7))" }}>
        <div className="font-mono text-[11px] uppercase tracking-[2px] text-muted">Fim do duelo</div>
        <div className="mt-2 font-display text-[30px] font-black uppercase tracking-[1px] text-gold-bright" style={{ filter: "drop-shadow(0 0 16px rgba(201,162,75,0.4))" }}>
          {iWon ? "🏆 Você venceu!" : `${winnerName} venceu`}
        </div>
        <div className="mt-2 font-mono text-[28px] font-bold tracking-[2px]">
          <span className={iWon ? "text-win" : "text-red"}>{myFinal}</span>
          <span className="px-1 text-dim">–</span>
          <span className={iWon ? "text-red" : "text-win"}>{oppFinal}</span>
        </div>
      </div>

      <div className="grid w-full gap-3 wide:[grid-template-columns:1fr_1fr]">
        <LineColumn c={meC} mine side="left" showRatings={showRatings} subtitle="" />
        <LineColumn c={oppC} mine={false} side="right" showRatings={showRatings} subtitle="" />
      </div>

      <button onClick={onExit} className="btn-gold mt-6 cursor-pointer rounded-[12px] border-none px-8 py-3.5 font-display text-[16px] font-semibold uppercase tracking-[2px]">
        ↺ Novo duelo
      </button>
    </div>
  );
}
