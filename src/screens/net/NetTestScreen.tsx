// ============================================================
// NetTestScreen — diagnóstico da CAMADA DE REDE (Degrau 1)
// ============================================================
// Tela de teste isolada (abre com ?nettest na URL). NÃO faz parte do jogo: serve
// só pra provar que a rede funciona end-to-end antes de plugar draft+série:
//   • conectar a uma sala de teste e ver o estado da conexão;
//   • PRESENCE: abrir 2 abas e ver o outro aparecer/sair;
//   • HOST-AUTORITATIVO: clicar "Pronto" vira intenção → o host aplica → snapshot
//     volta pros dois (o "pronto" aparece em AMBAS as abas);
//   • RECONNECT por ticket: fechar a aba e reabrir o link mantém sua identidade.
//
// Como testar 1v1 sem internet: abra esta URL em DUAS abas. Uma marca "sou host".
// O LocalTransport (BroadcastChannel) conecta as abas; tudo flui como no online.

import { useCallback, useMemo, useState } from "react";
import { useRoom } from "../../net/useRoom";
import { availableTransport } from "../../net/index";
import type { ReduceCtx } from "../../net/roomClient";
import { Logo6x0 } from "../../components/Logo6x0";

// ── estado mínimo sincronizado + intenções (substitui o jogo de verdade) ──
interface TestState {
  /** playerIds que clicaram "pronto" (o host registra). */
  readyIds: string[];
  /** contador compartilhado, pra ver broadcast ao vivo. */
  bumps: number;
}
type TestIntent = { kind: "ready" } | { kind: "bump" } | { kind: "reset" };

const INITIAL: TestState = { readyIds: [], bumps: 0 };

function reduceTest(state: TestState, intent: TestIntent, ctx: ReduceCtx): TestState {
  switch (intent.kind) {
    case "ready":
      return state.readyIds.includes(ctx.from)
        ? state
        : { ...state, readyIds: [...state.readyIds, ctx.from] };
    case "bump":
      return { ...state, bumps: state.bumps + 1 };
    case "reset":
      return INITIAL;
  }
}

const ROOM = "GOLD-NETTEST";

export function NetTestScreen({ onExit }: { onExit: () => void }) {
  // o host é escolhido por um toggle (default true). Em 2 abas, deixe UMA como host.
  const [isHost, setIsHost] = useState(() => {
    const p = new URLSearchParams(location.search);
    return p.get("client") === null; // ?client => entra como cliente
  });
  const [nick, setNick] = useState(() => (isHost ? "Host" : "Convidado"));
  const [connected, setConnected] = useState(false);

  const reduce = useCallback(reduceTest, []);
  const { view, dispatch, leave } = useRoom<TestState, TestIntent>({
    room: connected ? ROOM : null,
    isHost,
    nick,
    initialState: INITIAL,
    reduce,
  });

  const kind = useMemo(() => availableTransport(), []);
  const st = view?.state;
  const meReady = view ? st?.readyIds.includes(view.me.playerId) : false;

  return (
    <div className="anim-fade mx-auto flex w-full max-w-[680px] flex-col items-center">
      <div className="mb-6 flex w-full items-center justify-between gap-3">
        <div onClick={onExit} className="-m-1 flex cursor-pointer items-center rounded-lg p-1 transition-opacity hover:opacity-70">
          <Logo6x0 className="h-auto w-[180px]" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[2px]" style={{ color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)" }}>
          🔌 Teste de rede
        </span>
      </div>

      {/* transporte ativo */}
      <div className="w-full rounded-2xl border border-gold/25 px-5 py-4" style={{ background: "rgba(30,30,33,0.55)" }}>
        <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-muted">
          Transporte: <b className="text-gold-bright">{kind === "supabase" ? "Supabase Realtime (online)" : "Local / BroadcastChannel (abas)"}</b>
        </div>
        {kind === "local" && (
          <div className="mt-1.5 font-mono text-[10.5px] leading-relaxed text-dim">
            Sem credenciais Supabase → modo local. Abra esta página em <b className="text-muted">2 abas</b> (uma com
            <code className="px-1 text-gold">?nettest</code>, outra com <code className="px-1 text-gold">?nettest&amp;client</code>) pra simular 2 jogadores.
          </div>
        )}
      </div>

      {!connected ? (
        <div className="mt-4 w-full rounded-2xl border border-gold/25 p-4" style={{ background: "rgba(30,30,33,0.55)" }}>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">Entrar na sala de teste ({ROOM})</div>
          <div className="mb-3">
            <div className="mb-1.5 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">Nick</div>
            <input value={nick} onChange={(e) => setNick(e.target.value.slice(0, 14))} className="w-full rounded-[12px] border border-gold/25 bg-[rgba(12,13,16,0.8)] px-4 py-3 font-display text-[16px] text-cream outline-none focus:border-gold/55" />
          </div>
          <label className="mb-4 flex cursor-pointer items-center gap-2.5 font-mono text-[12px] text-cream">
            <input type="checkbox" checked={isHost} onChange={(e) => setIsHost(e.target.checked)} className="h-4 w-4 accent-[#c9a24b]" />
            Sou o HOST (autoritativo) — deixe marcado em só UMA aba
          </label>
          <button onClick={() => setConnected(true)} className="btn-gold w-full cursor-pointer rounded-[12px] border-none px-4 py-3.5 font-display text-[16px] font-semibold uppercase tracking-[2px]">
            ▶ Conectar
          </button>
        </div>
      ) : (
        <div className="mt-4 w-full rounded-2xl border border-gold/25 p-4" style={{ background: "rgba(30,30,33,0.55)" }}>
          {/* conexão + identidade */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 pb-3">
            <ConnPill state={view?.conn ?? "idle"} />
            <div className="font-mono text-[11px] text-muted">
              eu: <b className="text-cream">{view?.me.nick}</b> {view?.isHost ? "👑" : ""}
              <span className="ml-2 text-dim">rev {view?.rev ?? 0}</span>
            </div>
          </div>

          {view?.ended && (
            <div className="mt-3 rounded-[10px] border border-red/40 bg-red-soft/20 px-3 py-2 font-mono text-[12px] text-red">
              ⚠ Sala encerrada — o host saiu.
            </div>
          )}

          {/* presentes (presence) */}
          <div className="mt-3">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">Presentes ({view?.members.length ?? 0})</div>
            <div className="flex flex-col gap-1.5">
              {view?.members.map((m) => {
                const ready = st?.readyIds.includes(m.playerId);
                return (
                  <div key={m.playerId} className="flex items-center justify-between rounded-[10px] border border-gold/15 bg-[rgba(12,13,16,0.5)] px-3 py-2">
                    <span className="font-display text-[14px] text-cream">{m.nick} {m.isHost ? "👑" : ""}</span>
                    <span className={`font-mono text-[11px] uppercase tracking-[1px] ${ready ? "text-win" : "text-dim"}`}>{ready ? "✓ pronto" : "— aguardando"}</span>
                  </div>
                );
              })}
              {!view?.members.length && <div className="font-mono text-[11px] text-dim">conectando…</div>}
            </div>
          </div>

          {/* estado compartilhado + ações (host-autoritativo) */}
          <div className="mt-4 rounded-[12px] border border-gold/15 bg-[rgba(12,13,16,0.5)] px-4 py-3">
            <div className="font-mono text-[12px] text-muted">
              bumps (contador compartilhado): <b className="text-gold-bright">{st?.bumps ?? 0}</b>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => dispatch({ kind: "ready" })} disabled={meReady} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px] disabled:cursor-default disabled:opacity-50">
                {meReady ? "✓ você está pronto" : "Ficar pronto"}
              </button>
              <button onClick={() => dispatch({ kind: "bump" })} className="btn-ghost cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
                + bump
              </button>
              {view?.isHost && (
                <button onClick={() => dispatch({ kind: "reset" })} className="btn-ghost cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
                  ↺ reset (host)
                </button>
              )}
            </div>
          </div>

          <button onClick={() => { leave(); setConnected(false); }} className="btn-ghost mt-4 w-full cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
            ⏏ Sair da sala
          </button>
          <div className="mt-3 font-mono text-[10px] leading-relaxed text-dim">
            Teste de reconnect: feche esta aba e reabra o mesmo link — sua identidade (nick/playerId) volta pelo ticket no localStorage,
            e o host reenvia o estado atual.
          </div>
        </div>
      )}

      <button onClick={onExit} className="btn-ghost mt-5 cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
        ← Voltar ao início
      </button>
    </div>
  );
}

function ConnPill({ state }: { state: string }) {
  const map: Record<string, { t: string; c: string }> = {
    idle: { t: "ocioso", c: "text-dim" },
    connecting: { t: "conectando…", c: "text-gold-bright" },
    joined: { t: "● conectado", c: "text-win" },
    reconnecting: { t: "reconectando…", c: "text-gold-bright" },
    closed: { t: "desconectado", c: "text-dim" },
    error: { t: "erro", c: "text-red" },
  };
  const s = map[state] ?? map.idle;
  return <span className={`font-mono text-[12px] uppercase tracking-[1px] ${s.c}`}>{s.t}</span>;
}
