import { useEffect } from "react";
import { useTournament, type TournamentSounds } from "../../game/useTournament";
import type { TournamentPhase } from "../../game/tournamentReducer";
import { LobbyScreen } from "./LobbyScreen";
import { TournamentDraftScreen } from "./TournamentDraftScreen";
import { BracketScreen } from "./BracketScreen";
import { TournamentResultScreen } from "./TournamentResultScreen";

/** Container do modo "Worlds ao Vivo" — despacha por fase do torneio. */
export function TournamentScreen({ active, onExit, sounds, onPhaseChange }: { active: boolean; onExit: () => void; sounds: TournamentSounds; onPhaseChange?: (phase: TournamentPhase) => void }) {
  const t = useTournament(active, sounds);
  const { phase } = t.state;

  // reporta a fase atual do torneio ao App (pra ele saber quando é "tela de jogando").
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  return (
    <>
      {phase === "lobby" && <LobbyScreen t={t} onExit={onExit} />}
      {(phase === "draft" || phase === "drafted") && <TournamentDraftScreen t={t} />}
      {phase === "bracket" && <BracketScreen t={t} />}
      {phase === "result" && <TournamentResultScreen t={t} />}
    </>
  );
}
