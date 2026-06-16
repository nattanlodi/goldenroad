// ============================================================
// OnlineEntryScreen — porta de entrada do duelo 1v1 ONLINE
// ============================================================
// Antes de cair no lobby, o jogador: (1) escolhe CRIAR uma sala ou ENTRAR por
// código, e (2) digita o nick. Reusa o último nick do localStorage. Se a URL já
// trouxer ?sala=GOLD-XXXX (link direto), começa direto no modo "entrar" com o
// código preenchido.
//
// O CÓDIGO da sala é a chave de tudo: o host gera um aleatório; o convidado cola
// o mesmo. Dele deriva a seed (seedFromCode) → os dois recriam o mesmo torneio.

import { useState } from "react";
import { Logo6x0 } from "../../components/Logo6x0";
import { lastNick } from "../../net/ticket";

/** Gera um código de sala curto tipo GOLD-4F2A (local, não precisa ser determinístico). */
function newRoomCode(): string {
  const hex = "0123456789ABCDEF";
  let s = "";
  const bytes = new Uint8Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 4; i++) bytes[i] = Math.floor(Math.random() * 256);
  for (let i = 0; i < 4; i++) s += hex[bytes[i] % 16];
  return `GOLD-${s}`;
}

/** Normaliza o que o usuário digita pro formato GOLD-XXXX. */
function normalizeCode(raw: string): string {
  const up = raw.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const body = up.startsWith("GOLD") ? up.slice(4) : up;
  return `GOLD-${body.slice(0, 4)}`;
}

export function OnlineEntryScreen({
  initialCode,
  onEnter,
  onExit,
}: {
  /** código vindo do link (?sala=...) — se houver, entra no modo "entrar". */
  initialCode?: string;
  /** entrou: (código, sou host?, nick). */
  onEnter: (room: string, isHost: boolean, nick: string) => void;
  onExit: () => void;
}) {
  const [tab, setTab] = useState<"create" | "join">(initialCode ? "join" : "create");
  const [nick, setNick] = useState(() => lastNick());
  const [code, setCode] = useState(initialCode ? normalizeCode(initialCode) : "");
  const [createdCode] = useState(() => newRoomCode());

  const validNick = nick.trim().length >= 1;
  const joinReady = validNick && /^GOLD-[0-9A-F]{4}$/.test(code);

  const go = () => {
    const n = nick.trim() || "Você";
    if (tab === "create") onEnter(createdCode, true, n);
    else if (joinReady) onEnter(code, false, n);
  };

  return (
    <div className="anim-fade mx-auto flex w-full max-w-[560px] flex-col items-center">
      <div className="mb-6 flex w-full items-center justify-between gap-3">
        <div onClick={onExit} className="-m-1 flex cursor-pointer items-center rounded-lg p-1 transition-opacity hover:opacity-70">
          <Logo6x0 className="h-auto w-[190px]" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[12px] font-bold uppercase tracking-[2px]"
          style={{ color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)" }}>
          🔴 Duelo 1v1
        </span>
      </div>

      {/* abas criar / entrar */}
      <div className="mb-4 flex w-full gap-2 rounded-[12px] border border-gold/20 p-1.5" style={{ background: "rgba(30,30,33,0.55)" }}>
        <TabBtn on={tab === "create"} onClick={() => setTab("create")}>Criar sala</TabBtn>
        <TabBtn on={tab === "join"} onClick={() => setTab("join")}>Entrar por código</TabBtn>
      </div>

      {/* nick */}
      <div className="w-full">
        <div className="mb-1.5 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">Seu nick</div>
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value.slice(0, 14))}
          placeholder="como você aparece no duelo"
          className="w-full rounded-[12px] border border-gold/25 bg-[rgba(12,13,16,0.8)] px-4 py-3 font-display text-[16px] text-cream outline-none placeholder:text-dim focus:border-gold/55"
        />
      </div>

      {tab === "create" ? (
        <div className="mt-4 w-full rounded-2xl border border-gold/25 px-5 py-5 text-center" style={{ background: "rgba(30,30,33,0.55)" }}>
          <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">Sua sala</div>
          <div className="mt-1.5 font-mono text-[30px] font-black tracking-[4px] text-gold-bright">{createdCode}</div>
          <div className="mt-2 font-mono text-[10.5px] leading-relaxed text-dim">
            Você será o host. No próximo passo dá pra copiar o código/link e ajustar as configs.
          </div>
        </div>
      ) : (
        <div className="mt-4 w-full">
          <div className="mb-1.5 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">Código da sala</div>
          <input
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            placeholder="GOLD-XXXX"
            className="w-full rounded-[12px] border border-gold/25 bg-[rgba(12,13,16,0.8)] px-4 py-3 text-center font-mono text-[22px] font-bold tracking-[4px] text-cream outline-none placeholder:text-dim focus:border-gold/55"
          />
        </div>
      )}

      <button
        onClick={go}
        disabled={tab === "join" ? !joinReady : !validNick}
        className="btn-gold mt-5 w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[18px] font-semibold uppercase tracking-[2px] disabled:cursor-default disabled:opacity-45"
      >
        {tab === "create" ? "▶ Criar e abrir lobby" : "▶ Entrar na sala"}
      </button>
      <button onClick={onExit} className="btn-ghost mt-3 cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
        ← Voltar
      </button>
    </div>
  );
}

function TabBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 cursor-pointer rounded-[9px] px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[1px] transition-all ${on ? "text-cream" : "text-dim"}`}
      style={on ? { background: "rgba(201,162,75,0.16)", border: "1px solid rgba(232,206,134,0.45)" } : { border: "1px solid transparent" }}
    >
      {children}
    </button>
  );
}
