// ============================================================
// Narração da SÉRIE — timing compartilhado (host + clientes)
// ============================================================
// A série é pré-simulada e enviada UMA vez. A narração visual (placar/feed
// subindo) roda LOCALMENTE em cada cliente a partir desse estado determinístico
// — nada é reenviado por evento (o payload das timelines estouraria o Realtime).
//
// Pra os dois clientes verem o MESMO ritmo e o host saber quando a narração
// termina (pra finalizar a série), o timing vive aqui, num lugar só.

import type { SeriesState } from "./roomState";

/** Delay (ms) até o PRÓXIMO passo, dado o estado atual da narração. */
export function stepDelayMs(s: SeriesState, imersivo: boolean): number {
  const tl = s.timelines[s.gameIndex];
  if (imersivo && tl && s.eventIndex < tl.events.length) {
    const ev = tl.events[s.eventIndex];
    return ev.big ? 1400 : 850;
  }
  // fecha o jogo atual (sobe placar) — pausa maior no imersivo.
  return imersivo ? 1200 : 600;
}

/** Avança UM passo da narração (evento da timeline ou fecha o jogo atual). */
export function advanceSeries(s: SeriesState, imersivo: boolean): SeriesState {
  const tl = s.timelines[s.gameIndex];
  if (imersivo && tl && s.eventIndex < tl.events.length) {
    return { ...s, eventIndex: s.eventIndex + 1 };
  }
  const aWonGame = s.games[s.gameIndex];
  const scoreA = s.scoreA + (aWonGame ? 1 : 0);
  const scoreB = s.scoreB + (aWonGame ? 0 : 1);
  const nextGame = s.gameIndex + 1;
  const done = nextGame >= s.games.length;
  return {
    ...s,
    scoreA,
    scoreB,
    gameIndex: done ? s.gameIndex : nextGame,
    eventIndex: 0,
    finished: done,
  };
}

/** Duração TOTAL (ms) da narração do início ao fim — o host usa pra finalizar. */
export function seriesNarrationMs(s: SeriesState, imersivo: boolean): number {
  let cur: SeriesState = { ...s, startDeadline: null, scoreA: 0, scoreB: 0, gameIndex: 0, eventIndex: 0, finished: false };
  let total = 0;
  // simula a sequência de passos somando os delays até terminar (limite de
  // segurança pra nunca travar).
  for (let i = 0; i < 5000 && !cur.finished; i++) {
    total += stepDelayMs(cur, imersivo);
    cur = advanceSeries(cur, imersivo);
  }
  return total + 600; // respiro final
}

/** Placar de uma série após `elapsedMs` de narração — usando o MESMO timing
 * determinístico da narração local. Pro bracket mostrar o placar das OUTRAS
 * séries paralelas no instante EXATO em que cada jogo acaba (nem antes). */
export function scoreAtElapsed(s: SeriesState, imersivo: boolean, elapsedMs: number): { a: number; b: number; done: boolean } {
  let cur: SeriesState = { ...s, startDeadline: null, scoreA: 0, scoreB: 0, gameIndex: 0, eventIndex: 0, finished: false };
  let t = 0;
  for (let i = 0; i < 5000 && !cur.finished; i++) {
    t += stepDelayMs(cur, imersivo);
    if (t > elapsedMs) break; // ainda não chegou o próximo passo
    cur = advanceSeries(cur, imersivo);
  }
  return { a: cur.scoreA, b: cur.scoreB, done: cur.finished };
}
