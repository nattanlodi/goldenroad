import { useEffect } from "react";
import { DRAFT_TEAMS } from "./data/teams";
import { useGame } from "./game/useGame";
import { AppBackground } from "./components/AppBackground";
import { VictoryBackdrop } from "./components/VictoryBackdrop";
import { MuteButton } from "./components/MuteButton";
import { StartScreen } from "./screens/StartScreen";
import { DraftScreen } from "./screens/DraftScreen";
import { SeriesScreen } from "./screens/SeriesScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { CodexScreen } from "./screens/CodexScreen";

export function App() {
  const game = useGame();
  const { phase } = game.state;

  const isGame = phase === "series";
  // tela de VITÓRIA lendária: campeão do mundo na tela de resultado.
  const isVictory = phase === "result" && game.state.finished === "champion";

  // Sincroniza a cor do <html>, do <body> e do theme-color (barra de status do
  // iOS) com a tela atual. A barra de status do Safari é pintada pelo
  // theme-color — se ele bater com a cor logo ABAIXO da barra, a divisão some
  // (igual aos sites onde "não tem barra"). Importante: o iOS às vezes ignora
  // setAttribute no theme-color, então recriamos o <meta> pra forçar a releitura.
  useEffect(() => {
    // cor EFETIVA logo abaixo da barra de status (gradiente do topo + glow dourado
    // do AppBackground já embutido no tom). Tela inicial é mais clara; jogo é quase preto.
    const top = isGame ? "#0d1014" : "#252b37";
    const bottom = isGame ? "#08090b" : "#1a1f28";
    document.documentElement.style.background = top;
    document.body.style.background = bottom;

    // recria o <meta name="theme-color"> pra o iOS reamostrar a cor da barra
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = top;
    document.head.appendChild(meta);
  }, [isGame]);
  return (
    <div
      className={`bg-app${isGame ? " bg-app-game" : ""} flex min-h-[100dvh] w-full flex-col items-center font-body text-cream`}
      style={{
        // edge-to-edge: o fundo vai até as bordas (viewport-fit=cover), mas o
        // conteúdo soma o safe-area-inset ao padding pra não ficar sob o notch/home bar.
        paddingTop: "calc(clamp(18px,4vw,40px) + env(safe-area-inset-top))",
        paddingBottom: "calc(clamp(18px,4vw,40px) + env(safe-area-inset-bottom))",
        paddingLeft: "calc(clamp(18px,4vw,40px) + env(safe-area-inset-left))",
        paddingRight: "calc(clamp(18px,4vw,40px) + env(safe-area-inset-right))",
      }}
    >
      {isVictory ? (
        <VictoryBackdrop />
      ) : (
        <AppBackground variant={isGame ? "game" : undefined} />
      )}
      <MuteButton muted={game.muted} onToggle={game.toggleMute} />

      {phase === "start" && (
        <StartScreen poolCount={DRAFT_TEAMS.length} onBegin={(mode) => game.begin(mode)} onCodex={game.openCodex} />
      )}
      {phase === "play" && <DraftScreen game={game} />}
      {phase === "series" && <SeriesScreen game={game} />}
      {phase === "result" && <ResultScreen game={game} />}
      {phase === "codex" && <CodexScreen game={game} />}
    </div>
  );
}
