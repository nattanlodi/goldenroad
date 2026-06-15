import { useState, type CSSProperties } from "react";
import type { Tournament } from "../../game/useTournament";
import type { RoomConfig } from "../../game/tournamentReducer";
import { Logo6x0 } from "../../components/Logo6x0";

const NICK_KEY = "w60_tourney_nick";

const segOn: CSSProperties = { border: "1.5px solid #E8CE86", background: "rgba(201,162,75,0.14)", color: "#F2ECDE", boxShadow: "0 0 0 3px rgba(201,162,75,0.08)" };
const segOff: CSSProperties = { border: "1px solid rgba(201,162,75,0.22)", background: "rgba(42,51,65,0.5)", color: "#C9C7BD" };

/** Botão de um segmento de config (pill selecionável). */
function Seg({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 cursor-pointer rounded-[10px] px-3 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px] transition-all"
      style={on ? segOn : segOff}
    >
      {children}
    </button>
  );
}

export function LobbyScreen({ t, onExit }: { t: Tournament; onExit: () => void }) {
  const { state, code, setConfig, startTournament } = t;
  const cfg = state.config;
  const [nick, setNick] = useState(() => {
    try { return localStorage.getItem(NICK_KEY) || ""; } catch { return ""; }
  });
  const [copied, setCopied] = useState<"" | "code" | "link">("");

  const copy = (kind: "code" | "link") => {
    const txt = kind === "code" ? code : `${location.origin}/sala/${code}`;
    const done = () => {
      setCopied(kind);
      setTimeout(() => setCopied(""), 1600);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(done, done);
    else done();
  };

  const begin = () => {
    const n = nick.trim() || "Você";
    try { localStorage.setItem(NICK_KEY, n); } catch { /* ignora */ }
    startTournament(n);
  };

  const set = (patch: Partial<RoomConfig>) => setConfig(patch);

  return (
    <div className="anim-fade mx-auto flex w-full max-w-[680px] flex-col items-center">
      {/* topo: logo à ESQUERDA · selo do modo à DIREITA */}
      <div className="mb-6 flex w-full flex-wrap items-center justify-between gap-3">
        <div
          onClick={onExit}
          title="Voltar ao início"
          className="-m-1 flex cursor-pointer items-center rounded-lg p-1 transition-opacity hover:opacity-70"
        >
          <Logo6x0 className="h-auto w-[200px]" />
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[13px] font-bold uppercase tracking-[2px]"
          style={{ color: "#1a1206", background: "linear-gradient(180deg,#e8ce86,#c9a24b)", boxShadow: "0 0 18px rgba(201,162,75,0.45)" }}
        >
          🔴 Worlds ao Vivo <span className="font-mono text-[10px] font-bold tracking-[1px] opacity-80">TORNEIO DE 8</span>
        </span>
      </div>

      {/* código da sala + copiar */}
      <div className="w-full overflow-hidden rounded-2xl border border-gold/30" style={{ background: "linear-gradient(150deg,rgba(58,48,22,0.45),rgba(30,37,49,0.7))" }}>
        <div className="flex flex-col items-center px-5 py-5">
          <div className="font-mono text-[10px] uppercase tracking-[2px] text-muted">Código da sala</div>
          <div className="mt-1.5 font-mono text-[34px] font-black tracking-[4px] text-gold-bright" style={{ filter: "drop-shadow(0 0 14px rgba(201,162,75,0.35))" }}>
            {code}
          </div>
          <div className="mt-3.5 flex gap-2.5">
            <button onClick={() => copy("code")} className="btn-soft-gold cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
              {copied === "code" ? "✓ Copiado!" : "⧉ Copiar código"}
            </button>
            <button onClick={() => copy("link")} className="btn-ghost cursor-pointer rounded-[10px] px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[1px]">
              {copied === "link" ? "✓ Copiado!" : "⧉ Copiar link"}
            </button>
          </div>
          <div className="mt-3 max-w-[420px] text-center font-mono text-[10.5px] leading-relaxed text-dim">
            Modo offline: você joga contra <b className="text-muted">7 bots</b> num bracket real de 8.
            O online (jogar com amigos) chega numa próxima etapa.
          </div>
        </div>
      </div>

      {/* nick */}
      <div className="mt-4 w-full">
        <div className="mb-1.5 px-1 font-mono text-[10px] uppercase tracking-[2px] text-muted">Seu nick</div>
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value.slice(0, 14))}
          placeholder="como você aparece no bracket"
          className="w-full rounded-[12px] border border-gold/25 bg-[rgba(12,13,16,0.8)] px-4 py-3 font-display text-[16px] text-cream outline-none placeholder:text-dim focus:border-gold/55"
        />
      </div>

      {/* configs da sala */}
      <div className="mt-4 w-full rounded-2xl border border-gold/25 p-4" style={{ background: "rgba(30,30,33,0.55)" }}>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-gold-bright">⚙ Configurações da sala</div>

        <div className="flex flex-col gap-3.5">
          <ConfigRow label="⏱️ Tempo por escolha">
            <Seg on={cfg.pickSeconds === 15} onClick={() => set({ pickSeconds: 15 })}>15s</Seg>
            <Seg on={cfg.pickSeconds === 30} onClick={() => set({ pickSeconds: 30 })}>30s</Seg>
            <Seg on={cfg.pickSeconds === 45} onClick={() => set({ pickSeconds: 45 })}>45s</Seg>
            <Seg on={cfg.pickSeconds === 60} onClick={() => set({ pickSeconds: 60 })}>60s</Seg>
            <Seg on={cfg.pickSeconds === 0} onClick={() => set({ pickSeconds: 0 })}>Sem limite</Seg>
          </ConfigRow>

          <ConfigRow label="👁️ Visualização">
            <Seg on={!cfg.hideRatings} onClick={() => set({ hideRatings: false })}>Normal</Seg>
            <Seg on={cfg.hideRatings} onClick={() => set({ hideRatings: true })}>Especialista</Seg>
          </ConfigRow>

          <ConfigRow label="🎬 Ritmo da partida">
            <Seg on={cfg.pace === "imersivo"} onClick={() => set({ pace: "imersivo" })}>Imersivo</Seg>
            <Seg on={cfg.pace === "rapido"} onClick={() => set({ pace: "rapido" })}>Rápido</Seg>
          </ConfigRow>
        </div>
        <div className="mt-3 px-0.5 font-mono text-[10px] leading-relaxed text-dim">
          {cfg.pickSeconds === 0 ? "Sem limite: a rodada só avança quando todos escolhem (sem relógio, sem auto-pick). " : ""}
          {cfg.hideRatings ? "Especialista: overalls escondidos no draft — escolha no olho. " : ""}
          {cfg.pace === "imersivo" ? "Imersivo: cada jogo vira uma timeline narrada do confronto." : "Rápido: o placar das séries aparece direto."}
        </div>
      </div>

      {/* começar */}
      <button
        onClick={begin}
        className="btn-gold mt-5 w-full cursor-pointer rounded-[12px] border-none px-4 py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
      >
        ▶ Começar torneio
      </button>
      <button onClick={onExit} className="btn-ghost mt-3 cursor-pointer rounded-[10px] px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
        ← Voltar
      </button>
    </div>
  );
}

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 px-0.5 font-mono text-[10px] uppercase tracking-[1.5px] text-muted">{label}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
