import { useEffect, useState } from "react";
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
import { TournamentScreen } from "./screens/tournament/TournamentScreen";
import type { TournamentPhase } from "./game/tournamentReducer";

export function App() {
  const game = useGame();
  const { phase } = game.state;
  // modo "Worlds ao Vivo" — estado isolado do jogo solo, sobreposto à tela inicial.
  const [tournament, setTournament] = useState(false);
  // fase interna do torneio (reportada pelo TournamentScreen).
  const [tournamentPhase, setTournamentPhase] = useState<TournamentPhase>("lobby");

  // fundo "game" (escuro/dourado): jogo solo em série E só a TELA DE JOGANDO do
  // torneio (bracket) — lobby/draft/resultado ficam no fundo padrão.
  const isGame = phase === "series" || (tournament && tournamentPhase === "bracket");
  // tela de VITÓRIA lendária: campeão do mundo na tela de resultado.
  const isVictory = phase === "result" && game.state.finished === "champion";

  // Sincroniza a cor de fundo do <html>/<body> com a tela atual, só pro
  // overscroll (rubber-band do iOS) casar com o fundo. A barra de status em si é
  // pintada pelo theme-color FIXO do index.html (o iOS ignora troca dinâmica).
  useEffect(() => {
    document.documentElement.style.background = isGame ? "#0c0d10" : "#222834";
    document.body.style.background = isGame ? "#08090b" : "#1a1f28";
  }, [isGame]);
  return (
    <div
      className={`bg-app${isGame ? " bg-app-game" : ""} flex min-h-[100dvh] w-full flex-col items-center p-[clamp(18px,4vw,40px)] font-body text-cream`}
    >
      {isVictory ? (
        <VictoryBackdrop />
      ) : (
        <AppBackground variant={isGame ? "game" : undefined} />
      )}
      <MuteButton muted={game.muted} onToggle={game.toggleMute} />

      {tournament ? (
        <TournamentScreen active={tournament} onExit={() => setTournament(false)} sounds={game.sounds} onPhaseChange={setTournamentPhase} />
      ) : (
        <>
      {phase === "start" && (
        <StartScreen
          poolCount={DRAFT_TEAMS.length}
          onBegin={(mode) => game.begin(mode)}
          onCodex={game.openCodex}
          onTournament={() => setTournament(true)}
        />
      )}
      {phase === "play" && <DraftScreen game={game} />}
      {phase === "series" && <SeriesScreen game={game} />}
      {phase === "result" && <ResultScreen game={game} />}
      {phase === "codex" && <CodexScreen game={game} />}
        </>
      )}
    </div>
  );
}
