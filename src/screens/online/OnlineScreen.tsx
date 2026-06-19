// ============================================================
// OnlineScreen — container do Duelo online (torneio de 8 / confronto direto)
// ============================================================
// Segura UMA conexão (useOnlineRoom) durante toda a sessão e renderiza a tela
// conforme a FASE oficial da sala (lobby → draft → série → resultado). Manter a
// conexão aqui (e não em cada tela) evita reconectar a cada transição — o que
// recriaria a sala e perderia o estado.
//
// Antes de conectar, a entrada (criar/entrar) define quem somos.

import { useEffect, useState } from "react";
import { useOnlineRoom } from "../../game/online/useOnlineRoom";
import { ConfirmModal } from "../../components/ConfirmModal";
import type { TournamentSounds } from "../../game/useTournament";
import { OnlineEntryScreen } from "./OnlineEntryScreen";
import { OnlineLobby } from "./OnlineLobbyScreen";
import { OnlineDraft } from "./OnlineDraftScreen";
import { OnlineSeries } from "./OnlineSeriesScreen";
import { OnlineBracket, isEliminated } from "./OnlineBracketScreen";
import { OnlineResult } from "./OnlineResultScreen";
import { OnlineErrorBoundary } from "./OnlineErrorBoundary";
import { isTournamentOver } from "../../game/tournament";

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
  // snapshot final do host, que pode se perder no Realtime). Só vale pro confronto direto legado.
  const [localFinished, setLocalFinished] = useState(false);

  // estou ELIMINADO no bracket? (virei espectador) — pro App pintar o fundo CINZA
  // (em vez do dourado), reforçando que saí do torneio.
  const spectator = phase === "bracket" && !!st?.bracket && isEliminated(st.bracket, r.myId) && !isTournamentOver(st.bracket);
  // fase efetiva (pro fundo "game" do App): série/bracket usam fundo escuro/dourado;
  // "bracket-spectator" = eliminado → fundo cinza atenuado.
  const effPhase = phase === "series" && localFinished ? "result" : spectator ? "bracket-spectator" : phase;
  useEffect(() => { onPhaseChange?.(effPhase); }, [effPhase, onPhaseChange]);

  const back = () => { r.leave(); onExit(); };
  const finishAll = () => { r.leave(); onExitAll(); };

  // confirmação ao sair NO MEIO da run (draft/série/bracket) — evita saída acidental.
  // No lobby/resultado sair é esperado, então vai direto. O host, ao sair, ENCERRA a
  // sala pra todos (RoomClient manda "bye"); por isso o aviso é mais forte pra ele.
  const [confirmExit, setConfirmExit] = useState(false);
  const requestExit = () => setConfirmExit(true);
  const confirmModal = confirmExit && (
    <ConfirmModal
      icon="🚪"
      title="Sair da partida?"
      message={session.isHost
        ? "Você está no meio da run. Como host, sair ENCERRA a sala pra todos os jogadores."
        : "Você está no meio da run. Se sair agora, perde o progresso desta partida."}
      cancelLabel="Continuar jogando"
      confirmLabel="Sair"
      onCancel={() => setConfirmExit(false)}
      onConfirm={() => { setConfirmExit(false); back(); }}
    />
  );

  if (phase === "lobby") return <OnlineLobby r={r} isHost={session.isHost} onExit={back} />;
  if (phase === "draft") return <><OnlineDraft r={r} myId={r.myId} sounds={sounds} onExit={requestExit} />{confirmModal}</>;
  if (phase === "result") return <OnlineResult r={r} myId={r.myId} onExit={finishAll} />;
  if (phase === "bracket") return <><OnlineBracket r={r} myId={r.myId} sounds={sounds} onExit={requestExit} />{confirmModal}</>;
  if (phase === "series") {
    // confronto direto (série única, legado) — não ocorre no fluxo de 8, mantido por compat.
    if (localFinished) return <OnlineResult r={r} myId={r.myId} onExit={finishAll} />;
    return <><OnlineSeries r={r} myId={r.myId} sounds={sounds} onExit={requestExit} onLocalFinish={() => setLocalFinished(true)} />{confirmModal}</>;
  }
  return null;
}
