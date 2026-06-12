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
  return (
    <div
      className={`bg-app${isGame ? " bg-app-game" : ""} flex min-h-screen w-full flex-col items-center font-body text-cream`}
      style={{ padding: "clamp(18px,4vw,40px)" }}
    >
      {isVictory ? (
        <VictoryBackdrop />
      ) : (
        <AppBackground dim={phase === "play"} variant={isGame ? "game" : undefined} />
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
