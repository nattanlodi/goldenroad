// ============================================================
// OnlineScreen — container do modo 1v1 ONLINE (Degrau 1)
// ============================================================
// Segura UMA conexão (useOnlineRoom) durante toda a sessão e renderiza a tela
// conforme a FASE oficial da sala (lobby → draft → série → resultado). Manter a
// conexão aqui (e não em cada tela) evita reconectar a cada transição — o que
// recriaria a sala e perderia o estado.
//
// Antes de conectar, a entrada (criar/entrar) define quem somos.

import { useEffect, useState } from "react";
import { useOnlineRoom } from "../../game/online/useOnlineRoom";
import type { TournamentSounds } from "../../game/useTournament";
import { OnlineEntryScreen } from "./OnlineEntryScreen";
import { OnlineLobby } from "./OnlineLobbyScreen";
import { OnlineDraft } from "./OnlineDraftScreen";
import { OnlineSeries } from "./OnlineSeriesScreen";
import { OnlineResult } from "./OnlineResultScreen";

interface Session {
  room: string;
  isHost: boolean;
  nick: string;
}

export function OnlineScreen({ initialCode, onExit, sounds, onPhaseChange }: { initialCode?: string; onExit: () => void; sounds: TournamentSounds; onPhaseChange?: (phase: string) => void }) {
  const [session, setSession] = useState<Session | null>(null);

  if (!session) {
    onPhaseChange?.("entry");
    return (
      <OnlineEntryScreen
        initialCode={initialCode}
        onExit={onExit}
        onEnter={(room, isHost, nick) => setSession({ room, isHost, nick })}
      />
    );
  }

  return <OnlineRoom session={session} sounds={sounds} onExit={() => setSession(null)} onExitAll={onExit} onPhaseChange={onPhaseChange} />;
}

/** Já com sessão definida: conecta e roteia por fase. */
function OnlineRoom({ session, sounds, onExit, onExitAll, onPhaseChange }: { session: Session; sounds: TournamentSounds; onExit: () => void; onExitAll: () => void; onPhaseChange?: (phase: string) => void }) {
  const r = useOnlineRoom(session);
  const phase = r.state?.phase ?? "lobby";
  // o convidado avança pro resultado quando SUA narração termina (não espera o
  // snapshot final do host, que pode se perder no Realtime).
  const [localFinished, setLocalFinished] = useState(false);

  // fase efetiva (pro fundo "game" do App): só a SÉRIE usa fundo escuro/dourado.
  const effPhase = phase === "series" && localFinished ? "result" : phase;
  useEffect(() => { onPhaseChange?.(effPhase); }, [effPhase, onPhaseChange]);

  const back = () => { r.leave(); onExit(); };
  const finishAll = () => { r.leave(); onExitAll(); };

  if (phase === "lobby") return <OnlineLobby r={r} isHost={session.isHost} onExit={back} />;
  if (phase === "draft") return <OnlineDraft r={r} myId={r.myId} sounds={sounds} onExit={back} />;
  if (phase === "result") return <OnlineResult r={r} myId={r.myId} onExit={finishAll} />;
  if (phase === "series") {
    // narração local terminou → mostra o resultado já, mesmo que o host ainda
    // não tenha transmitido a transição de fase.
    if (localFinished) return <OnlineResult r={r} myId={r.myId} onExit={finishAll} />;
    return <OnlineSeries r={r} myId={r.myId} sounds={sounds} onExit={back} onLocalFinish={() => setLocalFinished(true)} />;
  }
  return null;
}
