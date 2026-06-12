import { DRAFT_TEAMS } from "./data/teams";
import { useGame } from "./game/useGame";
import { AppBackground } from "./components/AppBackground";
import { MuteButton } from "./components/MuteButton";
import { StartScreen } from "./screens/StartScreen";
import { DraftScreen } from "./screens/DraftScreen";
import { SeriesScreen } from "./screens/SeriesScreen";
import { ResultScreen } from "./screens/ResultScreen";

export function App() {
  const game = useGame();
  const { phase } = game.state;

  return (
    <div
      className="bg-app flex min-h-screen w-full flex-col items-center font-body text-cream"
      style={{ padding: "clamp(18px,4vw,40px)" }}
    >
      <AppBackground dim={phase === "play"} />
      <MuteButton muted={game.muted} onToggle={game.toggleMute} />

      {phase === "start" && <StartScreen poolCount={DRAFT_TEAMS.length} onBegin={(mode) => game.begin(mode)} />}
      {phase === "play" && <DraftScreen game={game} />}
      {phase === "series" && <SeriesScreen game={game} />}
      {phase === "result" && <ResultScreen game={game} />}
    </div>
  );
}
