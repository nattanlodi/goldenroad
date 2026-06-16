// ============================================================
// useSeriesSounds — sons da série reagindo ao estado narrado
// ============================================================
// Toca win/lose ao fim, reveal a cada jogo, penta quando aparece o evento ⚔.
// Do PONTO DE VISTA de myId (se eu estou no confronto). Compartilhado entre o
// duelo 1v1 e o bracket de 8.

import { useEffect, useRef } from "react";
import type { SeriesState } from "../../game/online/roomState";
import type { TournamentSounds } from "../../game/useTournament";

export function useSeriesSounds(s: SeriesState | null, myId: string | null, sounds: TournamentSounds) {
  const prevScore = useRef("");
  const prevPenta = useRef("");
  useEffect(() => {
    if (!s) { prevScore.current = ""; prevPenta.current = ""; return; }
    const key = `${s.aId}:${s.scoreA}-${s.scoreB}`;
    if (key !== prevScore.current) {
      prevScore.current = key;
      const iAmA = s.aId === myId;
      const iAmIn = s.aId === myId || s.bId === myId;
      const myScore = iAmA ? s.scoreA : s.scoreB;
      const oppScore = iAmA ? s.scoreB : s.scoreA;
      if (s.scoreA + s.scoreB > 0) {
        if (s.finished) {
          // só toca win/lose se EU estou no confronto; espectador ouve só reveal.
          if (iAmIn) (myScore > oppScore ? sounds.sndWin : sounds.sndLose)();
          else sounds.sndReveal();
        } else {
          sounds.sndReveal();
        }
      }
    }
    const tl = s.timelines[s.gameIndex];
    const ev = tl?.events[s.eventIndex - 1];
    if (ev && ev.icon === "⚔") {
      const pk = `${s.aId}:${s.gameIndex}-${s.eventIndex}`;
      if (pk !== prevPenta.current) { prevPenta.current = pk; sounds.sndPenta(); }
    }
  }, [s, myId, sounds]);
}
