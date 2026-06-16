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
import { OnlineBracket } from "./OnlineBracketScreen";
import { OnlineResult } from "./OnlineResultScreen";
import { OnlineErrorBoundary } from "./OnlineErrorBoundary";

interface Session {
  room: string;
  isHost: boolean;
  nick: string;
}

export function OnlineScreen({ initialCode, onExit, sounds, onPhaseChange }: { initialCode?: string; onExit: () => void; sounds: TournamentSounds; onPhaseChange?: (phase: string) => void }) {
  const [session, setSession] = useState<Session | null>(null);

  // reporta "entry" pro App num EFEITO (nunca durante o render — chamar onPhaseChange
  // no corpo fazia um setState no App durante o render do OnlineScreen, o que o React
  // proíbe e podia INTERROMPER a propagação de snapshots no convidado → travava).
  useEffect(() => { if (!session) onPhaseChange?.("entry"); }, [session, onPhaseChange]);

  if (!session) {
    return (
      <OnlineEntryScreen
        initialCode={initialCode}
        onExit={onExit}
        onEnter={(room, isHost, nick) => setSession({ room, isHost, nick })}
      />
    );
  }

  return (
    <OnlineErrorBoundary>
      <OnlineRoom session={session} sounds={sounds} onExit={() => setSession(null)} onExitAll={onExit} onPhaseChange={onPhaseChange} />
    </OnlineErrorBoundary>
  );
}

/** Já com sessão definida: conecta e roteia por fase. */
function OnlineRoom({ session, sounds, onExit, onExitAll, onPhaseChange }: { session: Session; sounds: TournamentSounds; onExit: () => void; onExitAll: () => void; onPhaseChange?: (phase: string) => void }) {
  const r = useOnlineRoom(session);
  const st = r.state;
  const phase = st?.phase ?? "lobby";
  // o convidado avança pro resultado quando SUA narração termina (não espera o
  // snapshot final do host, que pode se perder no Realtime). Só vale pro 1v1 legado.
  const [localFinished, setLocalFinished] = useState(false);

  // fase efetiva (pro fundo "game" do App): série/bracket usam fundo escuro/dourado.
  const effPhase = phase === "series" && localFinished ? "result" : phase;
  useEffect(() => { onPhaseChange?.(effPhase); }, [effPhase, onPhaseChange]);

  const back = () => { r.leave(); onExit(); };
  const finishAll = () => { r.leave(); onExitAll(); };

  if (phase === "lobby") return <OnlineLobby r={r} isHost={session.isHost} onExit={back} />;
  if (phase === "draft") return <OnlineDraft r={r} myId={r.myId} sounds={sounds} onExit={back} />;
  if (phase === "result") return <OnlineResult r={r} myId={r.myId} onExit={finishAll} />;
  if (phase === "bracket") return <OnlineBracket r={r} myId={r.myId} sounds={sounds} onExit={back} />;
  if (phase === "series") {
    // duelo 1v1 puro (Degrau 1) — não ocorre no fluxo de 8, mantido por compat.
    if (localFinished) return <OnlineResult r={r} myId={r.myId} onExit={finishAll} />;
    return <OnlineSeries r={r} myId={r.myId} sounds={sounds} onExit={back} onLocalFinish={() => setLocalFinished(true)} />;
  }
  return null;
}
