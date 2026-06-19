import { useEffect, useState } from "react";
import { DRAFT_TEAMS } from "./data/teams";
import { useGame } from "./game/useGame";
import { AppBackground } from "./components/AppBackground";
import { VictoryBackdrop } from "./components/VictoryBackdrop";
import { FinaleBackdrop } from "./components/FinaleBackdrop";
import { MuteButton } from "./components/MuteButton";
import { StartScreen } from "./screens/StartScreen";
import { DraftScreen } from "./screens/DraftScreen";
import { SeriesScreen } from "./screens/SeriesScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { CodexScreen } from "./screens/CodexScreen";
import { NetTestScreen } from "./screens/net/NetTestScreen";
import { OnlineScreen } from "./screens/online/OnlineScreen";

export function App() {
  const game = useGame();
  const { phase } = game.state;
  // diagnóstico da camada de rede (Degrau 1) — abre com ?nettest, fora do fluxo normal.
  const [netTest, setNetTest] = useState(() => new URLSearchParams(location.search).has("nettest"));
  // duelo ONLINE — link direto ?sala=GOLD-XXXX entra como convidado.
  const initialRoom = (() => { try { return new URLSearchParams(location.search).get("sala") || undefined; } catch { return undefined; } })();
  const [online, setOnline] = useState(() => !!initialRoom);
  // fase interna do duelo online (reportada pelo OnlineScreen).
  const [onlinePhase, setOnlinePhase] = useState<string>("lobby");

  // fundo "game" (escuro/dourado): jogo solo em série E a série/bracket do duelo
  // online — demais telas no fundo padrão.
  const isGame = phase === "series" || (online && (onlinePhase === "series" || onlinePhase === "bracket"));
  // tela de VITÓRIA lendária: campeão do mundo na tela de resultado (modo solo).
  const isVictory = phase === "result" && game.state.finished === "champion";
  // classificação final do Duelo online: fundo CERIMONIAL neutro (vale pro campeão
  // E pro eliminado — não é "você venceu", é "fim do torneio").
  const isOnlineResult = online && onlinePhase === "result";

  // Sincroniza a cor de fundo do <html>/<body> com a tela atual, só pro
  // overscroll (rubber-band do iOS) casar com o fundo. A barra de status em si é
  // pintada pelo theme-color FIXO do index.html (o iOS ignora troca dinâmica).
  useEffect(() => {
    // finale (classificação online): tons escuros/dourados pra casar o overscroll.
    document.documentElement.style.background = isOnlineResult ? "#16140f" : isGame ? "#0c0d10" : "#222834";
    document.body.style.background = isOnlineResult ? "#0c0b08" : isGame ? "#08090b" : "#1a1f28";
  }, [isGame, isOnlineResult]);
  return (
    <div
      className={`bg-app${isGame ? " bg-app-game" : ""} flex min-h-[100dvh] w-full flex-col items-center p-[clamp(18px,4vw,40px)] font-body text-cream`}
    >
      {isVictory ? (
        <VictoryBackdrop />
      ) : isOnlineResult ? (
        <FinaleBackdrop />
      ) : (
        <AppBackground variant={isGame ? "game" : undefined} />
      )}
      <MuteButton muted={game.muted} onToggle={game.toggleMute} />

      {netTest ? (
        <NetTestScreen onExit={() => setNetTest(false)} />
      ) : online ? (
        <OnlineScreen initialCode={initialRoom} onExit={() => setOnline(false)} sounds={game.sounds} onPhaseChange={setOnlinePhase} />
      ) : (
        <>
      {phase === "start" && (
        <StartScreen
          poolCount={DRAFT_TEAMS.length}
          onBegin={(mode) => game.begin(mode)}
          onCodex={game.openCodex}
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
