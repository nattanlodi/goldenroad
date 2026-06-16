// ============================================================
// OnlineLobbyScreen — LOBBY do duelo 1v1 ONLINE (Degrau 1)
// ============================================================
// Reusa a língua visual do LobbyScreen offline (§1.5): mesmo card de código,
// botões de copiar, configs em pills. A diferença é a REDE: o código é real, o
// 2º jogador entra por ele, e os dois se veem conectados (presence) antes do
// host iniciar.
//
// Dois papéis na mesma tela:
//   • HOST  — vê código + copiar + edita configs + botão "Iniciar duelo".
//   • CONVIDADO — vê os dois conectados, só marca "pronto" (não edita config).

import { useState, type CSSProperties } from "react";
import type { UseOnlineRoom } from "../../game/online/useOnlineRoom";
import { canStart } from "../../game/online/roomState";
import type { RoomConfig } from "../../game/tournamentReducer";
import { Logo6x0 } from "../../components/Logo6x0";

const segOn: CSSProperties = { border: "1.5px solid #E8CE86", background: "rgba(201,162,75,0.14)", color: "#F2ECDE", boxShadow: "0 0 0 3px rgba(201,162,75,0.08)" };
const segOff: CSSProperties = { border: "1px solid rgba(201,162,75,0.22)", background: "rgba(42,51,65,0.5)", color: "#C9C7BD" };

function Seg({ on, onClick, disabled, children }: { on: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex-1 cursor-pointer rounded-[10px] px-3 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px] transition-all disabled:cursor-default disabled:opacity-60"
      style={on ? segOn : segOff}>
      {children}
    </button>
  );
}

export function OnlineLobby({
  r,
  isHost,
  onExit,
}: {
  r: UseOnlineRoom;
  isHost: boolean;
  onExit: () => void;
}) {
  const [copied, setCopied] = useState<"" | "code" | "link">("");

  const st = r.state;
  const room = st?.code ?? "";
  const me = st?.players.find((p) => p.playerId === r.myId) ?? null;
  const other = st?.players.find((p) => p.playerId !== r.myId) ?? null;
  const meReady = me?.ready ?? false;

  const copy = (kind: "code" | "link") => {
    const txt = kind === "code" ? room : `${location.origin}/?sala=${room}`;
    const done = () => { setCopied(kind); setTimeout(() => setCopied(""), 1600); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(done, done);
    else done();
  };

  const set = (patch: Partial<RoomConfig>) => r.setConfig(patch);
  const cfg = st?.config;
  const ready = canStart(st ?? ({ phase: "lobby", players: [] } as never));

  return (
    <div className="anim-fade mx-auto flex w-full max-w-[680px] flex-col items-center">
      {/* topo */}
      <div className="mb-6 flex w-full flex-wrap items-center justify-between gap-3">
        <div onClick={onExit} title="Voltar ao início" className="-m-1 flex cursor-pointer items-center rounded-lg p-1 transition-opacity hover:opacity-70">
          <Logo6x0 className="h-auto w-[200px]" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[2px]"
          style={{ color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)", boxShadow: "0 0 18px rgba(201,162,75,0.45)" }}>
          🔴 Worlds ao Vivo <span className="font-mono text-[10px] font-bold tracking-[1px] opacity-80">DUELO 1v1</span>
        </span>
      </div>

      {/* sala encerrada (host saiu) */}
      {r.ended && (
        <div className="mb-4 w-full rounded-2xl border border-red/40 px-5 py-4 font-mono text-[13px] text-red" style={{ background: "rgba(120,30,30,0.18)" }}>
          ⚠ O host saiu — sala encerrada. <button onClick={onExit} className="ml-2 underline">voltar</button>
        </div>
      )}

      {/* código da sala + copiar */}
      <div className="w-full overflow-hidden rounded-2xl border border-gold/30" style={{ background: "linear-gradient(150deg,rgba(58,48,22,0.45),rgba(30,37,49,0.7))" }}>
        <div className="flex flex-col items-center px-5 py-5">
          <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">Código da sala</div>
          <div className="mt-1.5 font-mono text-[34px] font-black tracking-[4px] text-gold-bright" style={{ filter: "drop-shadow(0 0 14px rgba(201,162,75,0.35))" }}>
            {room}
          </div>
          <div className="mt-3.5 flex gap-2.5">
            <button onClick={() => copy("code")} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
              {copied === "code" ? "✓ Copiado!" : "⧉ Copiar código"}
            </button>
            <button onClick={() => copy("link")} className="btn-ghost cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
              {copied === "link" ? "✓ Copiado!" : "⧉ Copiar link"}
            </button>
          </div>
          <div className="mt-3 max-w-[440px] text-center font-mono text-[10.5px] leading-relaxed text-dim">
            {isHost
              ? "Mande o código (ou link) pro seu adversário. Quando os dois estiverem prontos, você inicia o duelo."
              : "Você entrou na sala. Marque que está pronto e aguarde o host iniciar."}
          </div>
        </div>
      </div>

      {/* jogadores conectados (presence) */}
      <div className="mt-4 w-full rounded-2xl border border-gold/25 p-4" style={{ background: "rgba(30,30,33,0.55)" }}>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">Jogadores ({st?.players.length ?? 0}/2)</span>
          <ConnPill state={r.conn} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PlayerSlot label="Você" player={me} highlight />
          <PlayerSlot label="Adversário" player={other} />
        </div>
      </div>

      {/* configs — só host edita */}
      {cfg && (
        <div className="mt-4 w-full rounded-2xl border border-gold/25 p-4" style={{ background: "rgba(30,30,33,0.55)" }}>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">
            ⚙ Configurações {isHost ? "da sala" : "(definidas pelo host)"}
          </div>
          <div className="flex flex-col gap-3.5">
            <ConfigRow label="⏱️ Tempo por escolha">
              {[15, 30, 45, 60].map((s) => (
                <Seg key={s} on={cfg.pickSeconds === s} disabled={!isHost} onClick={() => set({ pickSeconds: s })}>{s}s</Seg>
              ))}
              <Seg on={cfg.pickSeconds === 0} disabled={!isHost} onClick={() => set({ pickSeconds: 0 })}>Sem limite</Seg>
            </ConfigRow>
            <ConfigRow label="👁️ Visualização">
              <Seg on={!cfg.hideRatings} disabled={!isHost} onClick={() => set({ hideRatings: false })}>Normal</Seg>
              <Seg on={cfg.hideRatings} disabled={!isHost} onClick={() => set({ hideRatings: true })}>Especialista</Seg>
            </ConfigRow>
            <ConfigRow label="🎬 Ritmo da partida">
              <Seg on={cfg.pace === "imersivo"} disabled={!isHost} onClick={() => set({ pace: "imersivo" })}>Imersivo</Seg>
              <Seg on={cfg.pace === "rapido"} disabled={!isHost} onClick={() => set({ pace: "rapido" })}>Rápido</Seg>
            </ConfigRow>
          </div>
        </div>
      )}

      {/* ações: pronto + (host) iniciar */}
      <div className="mt-5 flex w-full flex-col gap-3">
        <button
          onClick={() => r.setReady(!meReady)}
          className={`w-full cursor-pointer rounded-[12px] px-4 py-3.5 font-display text-[16px] font-semibold uppercase tracking-[2px] transition-all ${meReady ? "btn-ghost" : "btn-soft-gold"}`}
        >
          {meReady ? "✓ Você está pronto (clique pra cancelar)" : "Estou pronto"}
        </button>
        {isHost && (
          <button
            onClick={r.start}
            disabled={!ready}
            className="btn-gold w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[18px] font-semibold uppercase tracking-[2px] disabled:cursor-default disabled:opacity-45"
          >
            {st && st.players.length < 2 ? "▶ Aguardando adversário…" : ready ? "▶ Iniciar duelo" : "▶ Aguardando ambos prontos…"}
          </button>
        )}
      </div>

      <button onClick={onExit} className="btn-ghost mt-3 cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
        ← Sair
      </button>
    </div>
  );
}

function PlayerSlot({ label, player, highlight }: { label: string; player: { nick: string; isHost: boolean; ready: boolean } | null; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-[12px] border px-3 py-4 ${highlight ? "border-gold/40" : "border-gold/15"}`}
      style={{ background: player ? "rgba(12,13,16,0.55)" : "rgba(12,13,16,0.3)" }}>
      <div className="mb-1 font-mono text-[9px] uppercase tracking-[2px] text-dim">{label}</div>
      {player ? (
        <>
          <div className="font-display text-[18px] font-semibold text-cream">{player.nick} {player.isHost ? "👑" : ""}</div>
          <div className={`mt-1.5 font-mono text-[11px] uppercase tracking-[1px] ${player.ready ? "text-win" : "text-dim"}`}>
            {player.ready ? "✓ pronto" : "— aguardando"}
          </div>
        </>
      ) : (
        <div className="anim-fade font-display text-[15px] text-dim">conectando…</div>
      )}
    </div>
  );
}

function ConnPill({ state }: { state: string }) {
  const map: Record<string, { t: string; c: string }> = {
    joined: { t: "● conectado", c: "text-win" },
    connecting: { t: "conectando…", c: "text-gold-bright" },
    reconnecting: { t: "reconectando…", c: "text-gold-bright" },
    closed: { t: "desconectado", c: "text-dim" },
    error: { t: "erro de conexão", c: "text-red" },
    idle: { t: "…", c: "text-dim" },
  };
  const s = map[state] ?? map.idle;
  return <span className={`font-mono text-[11px] uppercase tracking-[1px] ${s.c}`}>{s.t}</span>;
}

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 px-0.5 font-mono text-[10px] uppercase tracking-[1.5px] text-muted">{label}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
