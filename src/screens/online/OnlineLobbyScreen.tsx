// ============================================================
// OnlineLobbyScreen — LOBBY do Duelo online
// ============================================================
// Reusa a língua visual do LobbyScreen offline (§1.5): mesmo card de código,
// botões de copiar, configs em pills. A diferença é a REDE: o código é real, os
// demais jogadores (2-8) entram por ele, e todos se veem conectados (presence)
// antes do host iniciar. Com 2 humanos é um confronto direto; com 3+ vira um
// torneio de 8 (o host completa com bots).
//
// Dois papéis na mesma tela:
//   • HOST  — vê código + copiar + edita configs + botão "Iniciar torneio".
//   • CONVIDADO — vê todos conectados, só marca "pronto" (não edita config).

import { useState, type CSSProperties } from "react";
import type { UseOnlineRoom } from "../../game/online/useOnlineRoom";
import { canStart, BRACKET_SIZE } from "../../game/online/roomState";
import type { RoomConfig } from "../../game/tournamentReducer";
import type { Tournament } from "../../types";
import { Logo6x0 } from "../../components/Logo6x0";
import { BotIcon } from "../../components/BotIcon";

/** Campeonatos selecionáveis no pool de draft (extensível a novos torneios). */
const CAMPAIGNS: { id: Tournament; label: string }[] = [
  { id: "worlds", label: "Worlds" },
  { id: "msi", label: "MSI" },
];

/** Resumo legível das configs (pro guest ver em chips read-only). */
function summarizeConfig(cfg: RoomConfig): { label: string; value: string }[] {
  const camps = (cfg.campaigns ?? ["worlds", "msi"])
    .map((c) => CAMPAIGNS.find((x) => x.id === c)?.label ?? c)
    .join(" + ");
  return [
    { label: "Tempo", value: cfg.pickSeconds === 0 ? "Sem limite" : `${cfg.pickSeconds}s` },
    { label: "Visual", value: cfg.hideRatings ? "Especialista" : "Normal" },
    { label: "Ritmo", value: cfg.pace === "rapido" ? "Rápido" : "Imersivo" },
    { label: "Cartas", value: cfg.cardsOn ? "Ligadas" : "Desligadas" },
    { label: "Pool", value: camps },
  ];
}

const segOn: CSSProperties = { border: "1.5px solid #E8CE86", background: "rgba(201,162,75,0.14)", color: "#F2ECDE", boxShadow: "0 0 0 3px rgba(201,162,75,0.08)" };
const segOff: CSSProperties = { border: "1px solid rgba(201,162,75,0.22)", background: "rgba(42,51,65,0.5)", color: "#C9C7BD" };

function Seg({ on, onClick, disabled, children }: { on: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex-1 cursor-pointer rounded-[9px] px-2.5 py-2 font-display text-[12.5px] font-semibold uppercase tracking-[1px] transition-all disabled:cursor-default disabled:opacity-60"
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
  const humans = (st?.players ?? []).filter((p) => !p.isBot);
  const me = humans.find((p) => p.playerId === r.myId) ?? null;
  const meReady = me?.ready ?? false;
  const botCount = Math.max(0, BRACKET_SIZE - humans.length); // bots que vão completar

  const copy = (kind: "code" | "link") => {
    // preserva o ?local (modo de teste LocalTransport) no link, senão o convidado
    // cairia no Supabase enquanto o host está no LocalTransport (não se enxergam).
    const localFlag = new URLSearchParams(location.search).has("local") ? "&local" : "";
    const txt = kind === "code" ? room : `${location.origin}/?sala=${room}${localFlag}`;
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
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3">
        <div onClick={onExit} title="Voltar ao início" className="-m-1 flex cursor-pointer items-center rounded-lg p-1 transition-opacity hover:opacity-70">
          <Logo6x0 className="h-auto w-[200px]" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[2px]"
          style={{ color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)", boxShadow: "0 0 18px rgba(201,162,75,0.45)" }}>
          🔴 Duelo online <span className="font-mono text-[10px] font-bold tracking-[1px] opacity-80">TORNEIO DE 8</span>
        </span>
      </div>

      {/* sala encerrada (host saiu) */}
      {r.ended && (
        <div className="mb-4 w-full rounded-2xl border border-red/40 px-5 py-4 font-mono text-[13px] text-red" style={{ background: "rgba(120,30,30,0.18)" }}>
          ⚠ O host saiu — sala encerrada. <button onClick={onExit} className="ml-2 underline">voltar</button>
        </div>
      )}

      {/* código da sala + copiar — layout horizontal (código à esquerda, botões à
          direita) pra economizar altura; empilha no mobile estreito. */}
      <div className="w-full overflow-hidden rounded-2xl border border-gold/30" style={{ background: "linear-gradient(150deg,rgba(58,48,22,0.45),rgba(30,37,49,0.7))" }}>
        <div className="flex flex-col items-center gap-3 px-5 py-3.5 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center sm:items-start">
            <div className="font-mono text-[9px] uppercase tracking-[2px] text-muted">Código da sala</div>
            <div className="font-mono text-[30px] font-black leading-tight tracking-[4px] text-gold-bright" style={{ filter: "drop-shadow(0 0 14px rgba(201,162,75,0.35))" }}>
              {room}
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => copy("code")} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
              {copied === "code" ? "✓ Copiado!" : "⧉ Código"}
            </button>
            <button onClick={() => copy("link")} className="btn-ghost cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
              {copied === "link" ? "✓ Copiado!" : "⧉ Link"}
            </button>
          </div>
        </div>
        <div className="border-t border-gold/15 px-5 py-2 text-center font-mono text-[10px] leading-relaxed text-dim">
          {isHost ? (
            <span className="inline-flex flex-wrap items-center justify-center gap-x-1">
              Mande o código pros amigos. 2 a 8 jogam; os vazios viram BOTS
              <BotIcon size={11} className="-mt-px" />.
            </span>
          ) : (
            "Você entrou. Marque que está pronto e aguarde o host iniciar."
          )}
        </div>
      </div>

      {/* jogadores: humanos presentes + bots completando até 8 */}
      <div className="mt-3 w-full rounded-2xl border border-gold/25 px-4 py-3" style={{ background: "rgba(30,30,33,0.55)" }}>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">
            Competidores ({humans.length} humano{humans.length === 1 ? "" : "s"}{botCount > 0 ? ` · ${botCount} bot${botCount === 1 ? "" : "s"}` : ""})
          </span>
          <ConnPill state={r.conn} />
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {Array.from({ length: BRACKET_SIZE }).map((_, i) => {
            const h = humans[i];
            if (h) return <PlayerSlot key={h.playerId} player={{ nick: h.nick, isHost: h.isHost, ready: h.ready }} mine={h.playerId === r.myId} />;
            // slots restantes = bots (preenchidos ao iniciar).
            const botIndex = i - humans.length;
            return <BotSlot key={`bot-${i}`} active={botIndex < botCount} />;
          })}
        </div>
      </div>

      {/* configs — SÓ o host vê/edita (o guest nem vê o bloco) */}
      {cfg && isHost && (
        <div className="mt-3 w-full rounded-2xl border border-gold/25 px-4 py-3" style={{ background: "rgba(30,30,33,0.55)" }}>
          <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">
            ⚙ Configurações da sala
          </div>
          <div className="flex flex-col gap-2.5">
            <ConfigRow label="Tempo por escolha">
              {[15, 30, 45, 60].map((s) => (
                <Seg key={s} on={cfg.pickSeconds === s} disabled={!isHost} onClick={() => set({ pickSeconds: s })}>{s}s</Seg>
              ))}
              <Seg on={cfg.pickSeconds === 0} disabled={!isHost} onClick={() => set({ pickSeconds: 0 })}>Sem limite</Seg>
            </ConfigRow>
            <ConfigRow label="Visualização">
              <Seg on={!cfg.hideRatings} disabled={!isHost} onClick={() => set({ hideRatings: false })}>Normal</Seg>
              <Seg on={cfg.hideRatings} disabled={!isHost} onClick={() => set({ hideRatings: true })}>Especialista</Seg>
            </ConfigRow>
            <ConfigRow label="Ritmo da partida">
              <Seg on={cfg.pace === "imersivo"} disabled={!isHost} onClick={() => set({ pace: "imersivo" })}>Imersivo</Seg>
              <Seg on={cfg.pace === "rapido"} disabled={!isHost} onClick={() => set({ pace: "rapido" })}>Rápido</Seg>
            </ConfigRow>
            <ConfigRow label="Cartas de evento">
              <Seg on={!!cfg.cardsOn} disabled={!isHost} onClick={() => set({ cardsOn: true })}>Ligadas</Seg>
              <Seg on={!cfg.cardsOn} disabled={!isHost} onClick={() => set({ cardsOn: false })}>Desligadas</Seg>
            </ConfigRow>
            <ConfigRow label="Campeonatos no pool">
              {CAMPAIGNS.map((c) => {
                const cur = cfg.campaigns ?? ["worlds", "msi"];
                const on = cur.includes(c.id);
                return (
                  <Seg key={c.id} on={on} disabled={!isHost}
                    onClick={() => {
                      // toggle mantendo SEMPRE pelo menos 1 selecionado.
                      const next = on ? cur.filter((x) => x !== c.id) : [...cur, c.id];
                      if (next.length === 0) return; // não deixa zerar
                      set({ campaigns: next });
                    }}>
                    {c.label}
                  </Seg>
                );
              })}
            </ConfigRow>
          </div>
        </div>
      )}

      {/* configs pro GUEST: resumo READ-ONLY (sem botões), visual simples em chips */}
      {cfg && !isHost && (
        <div className="mt-3 w-full rounded-2xl border border-gold/20 px-4 py-3" style={{ background: "rgba(30,30,33,0.4)" }}>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-muted">
            Configurações (definidas pelo host)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summarizeConfig(cfg).map((s) => (
              <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 px-2.5 py-1 font-mono text-[11px]"
                style={{ background: "rgba(201,162,75,0.06)" }}>
                <span className="text-dim">{s.label}</span>
                <span className="font-semibold text-cream">{s.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ações: pronto + (host) iniciar */}
      <div className="mt-3 flex w-full flex-col gap-2.5">
        <button
          onClick={() => r.setReady(!meReady)}
          className={`w-full cursor-pointer rounded-[12px] px-4 py-3 font-display text-[15px] font-semibold uppercase tracking-[2px] transition-all ${meReady ? "btn-ghost" : "btn-soft-gold"}`}
        >
          {meReady ? "✓ Você está pronto (clique pra cancelar)" : "Estou pronto"}
        </button>
        {isHost && (
          <button
            onClick={r.start}
            disabled={!ready}
            className="btn-gold w-full cursor-pointer rounded-[12px] border-none px-4 py-3.5 font-display text-[17px] font-semibold uppercase tracking-[2px] disabled:cursor-default disabled:opacity-45"
          >
            {humans.length < 2 ? "▶ Aguardando jogadores (mín. 2)…" : ready ? "▶ Iniciar torneio" : "▶ Aguardando todos prontos…"}
          </button>
        )}
      </div>

      <button onClick={onExit} className="btn-ghost mt-2.5 cursor-pointer rounded-[10px] px-6 py-2 font-display text-[13px] font-semibold uppercase tracking-[1px]">
        ← Sair
      </button>
    </div>
  );
}

function PlayerSlot({ player, mine }: { player: { nick: string; isHost: boolean; ready: boolean }; mine: boolean }) {
  return (
    <div className={`anim-pop flex flex-col items-center rounded-[12px] border px-3 py-2.5 ${mine ? "border-gold/45" : "border-gold/18"}`}
      style={{ background: "rgba(12,13,16,0.55)" }}>
      <div className="mb-0.5 font-mono text-[8px] uppercase tracking-[1.5px] text-dim">{mine ? "Você" : "Jogador"}</div>
      <div className="truncate font-display text-[15px] font-semibold text-cream">{player.nick} {player.isHost ? "👑" : ""}</div>
      <div className={`mt-0.5 font-mono text-[9px] uppercase tracking-[1px] ${player.ready ? "text-win" : "text-dim"}`}>
        {player.ready ? "✓ pronto" : "— aguardando"}
      </div>
    </div>
  );
}

/** Slot de bot: "ativo" = vai virar bot ao iniciar; "vago" = pode entrar humano. */
function BotSlot({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-[12px] border border-dashed border-gold/15 px-3 py-2.5"
      style={{ background: "rgba(12,13,16,0.28)" }}>
      <div className="mb-0.5 font-mono text-[8px] uppercase tracking-[1.5px] text-dim">{active ? "Bot" : "Vago"}</div>
      <div className="flex h-[20px] items-center font-display text-[15px] font-semibold text-dim">{active ? <BotIcon size={18} /> : "—"}</div>
      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[1px] text-dim">{active ? "completa" : "aberto"}</div>
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
  // label à ESQUERDA e segmentos à DIREITA na mesma linha (telas largas) — empilha
  // só no mobile estreito. Mantém a tela inteira sem scroll no desktop.
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <div className="shrink-0 px-0.5 font-mono text-[10px] uppercase tracking-[1.5px] text-muted sm:w-[150px]">{label}</div>
      <div className="flex flex-1 gap-2">{children}</div>
    </div>
  );
}
