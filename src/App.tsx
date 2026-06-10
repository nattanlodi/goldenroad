import { TEAMS } from "./data/teams";
import { useGame } from "./game/useGame";
import { MuteButton } from "./components/MuteButton";
import { StartScreen } from "./screens/StartScreen";
import { DraftScreen } from "./screens/DraftScreen";

export function App() {
  const game = useGame();
  const { phase } = game.state;

  return (
    <div
      className="bg-app flex min-h-screen w-full flex-col items-center font-body text-cream"
      style={{ padding: "clamp(18px,4vw,40px)" }}
    >
      <MuteButton muted={game.muted} onToggle={game.toggleMute} />

      {phase === "start" && <StartScreen poolCount={TEAMS.length} onBegin={game.begin} />}
      {phase === "play" && <DraftScreen game={game} />}

      {/* Fase 2: Playoffs + Campeão (em construção) */}
      {(phase === "series" || phase === "result") && (
        <div className="anim-fade m-auto max-w-[640px] text-center">
          <div className="mb-3 font-mono text-[12px] uppercase tracking-[3px] text-gold-bright">
            {phase === "series" ? "Playoffs · rumo ao 6–0" : "★ Campeões do Mundo · 6–0 ★"}
          </div>
          <h2 className="mb-3 font-display text-[clamp(24px,5vw,40px)] font-semibold uppercase tracking-[1px] text-cream">
            Próxima fase em construção
          </h2>
          <p className="mb-8 text-[15px] leading-[1.55] text-[#BFC4CD]">
            A sua line ficou pronta — as telas de <b className="text-cream">Playoffs</b> e{" "}
            <b className="text-cream">Campeão</b> chegam na Fase 2. Por enquanto, volte e teste o draft à vontade.
          </p>
          <button
            onClick={game.restart}
            className="btn-gold cursor-pointer rounded-[11px] border-none px-[40px] py-4 font-display text-[16px] font-semibold uppercase tracking-[2px]"
          >
            Voltar ao início
          </button>
        </div>
      )}
    </div>
  );
}
