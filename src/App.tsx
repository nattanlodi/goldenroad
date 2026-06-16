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
import { NetTestScreen } from "./screens/net/NetTestScreen";
import { OnlineScreen } from "./screens/online/OnlineScreen";
import type { TournamentPhase } from "./game/tournamentReducer";

export function App() {
  const game = useGame();
  const { phase } = game.state;
  // diagnóstico da camada de rede (Degrau 1) — abre com ?nettest, fora do fluxo normal.
  const [netTest, setNetTest] = useState(() => new URLSearchParams(location.search).has("nettest"));
  // duelo 1v1 ONLINE — link direto ?sala=GOLD-XXXX entra como convidado.
  const initialRoom = (() => { try { return new URLSearchParams(location.search).get("sala") || undefined; } catch { return undefined; } })();
  const [online, setOnline] = useState(() => !!initialRoom);
  // fase interna do duelo 1v1 online (reportada pelo OnlineScreen).
  const [onlinePhase, setOnlinePhase] = useState<string>("lobby");
  // modo "Worlds ao Vivo" — estado isolado do jogo solo, sobreposto à tela inicial.
  const [tournament, setTournament] = useState(false);
  // fase interna do torneio (reportada pelo TournamentScreen).
  const [tournamentPhase, setTournamentPhase] = useState<TournamentPhase>("lobby");

  // fundo "game" (escuro/dourado): jogo solo em série, a TELA DE JOGANDO do
  // torneio (bracket) E a série do 1v1 online — demais telas no fundo padrão.
  const isGame = phase === "series" || (tournament && tournamentPhase === "bracket") || (online && (onlinePhase === "series" || onlinePhase === "bracket"));
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

      {netTest ? (
        <NetTestScreen onExit={() => setNetTest(false)} />
      ) : online ? (
        <OnlineScreen initialCode={initialRoom} onExit={() => setOnline(false)} sounds={game.sounds} onPhaseChange={setOnlinePhase} />
      ) : tournament ? (
        <TournamentScreen active={tournament} onExit={() => setTournament(false)} sounds={game.sounds} onPhaseChange={setTournamentPhase} />
      ) : (
        <>
      {phase === "start" && (
        <StartScreen
          poolCount={DRAFT_TEAMS.length}
          onBegin={(mode) => game.begin(mode)}
          onCodex={game.openCodex}
          onTournament={() => setTournament(true)}
          onOnline={() => setOnline(true)}
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
