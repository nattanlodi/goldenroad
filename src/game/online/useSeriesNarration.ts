// ============================================================
// useSeriesNarration — narração LOCAL de uma série (host + clientes)
// ============================================================
// A série chega pré-simulada UMA vez; cada cliente narra (placar/feed subindo)
// localmente, em sincronia (timing determinístico), sem reenviar snapshot por
// evento. Começa sozinho quando o relógio passa do startDeadline (timestamp
// absoluto), independente do host. Avisa quando a narração local termina.
//
// Compartilhado entre o duelo 1v1 (OnlineSeries) e o bracket de 8.
//
// ROBUSTEZ (lição cara): este hook é dirigido por UM ÚNICO interval fixo + o
// relógio absoluto (startDeadline), NÃO por timers que precisam sobreviver aos
// re-renders. O `official` muda de IDENTIDADE a cada heartbeat (snapshot novo do
// host), então qualquer lógica que dependa de um setTimeout cancelado/re-armado
// pelo ciclo do efeito quebra (o timer ou nunca dispara, ou dispara cedo demais).
// Aqui, a cada tick recalculamos tudo a partir de (série atual, relógio) — então
// re-renders são inofensivos.

import { useEffect, useRef, useState } from "react";
import type { SeriesState } from "./roomState";
import { advanceSeries, stepDelayMs } from "./seriesNarration";

export interface NarrationView {
  /** estado a renderizar (oficial durante o countdown; local depois). */
  s: SeriesState | null;
  /** segundos restantes do countdown de início (0 quando já começou). */
  secs: number;
}

const TICK_MS = 200;

export function useSeriesNarration(official: SeriesState | null, imersivo: boolean, onFinish?: () => void): NarrationView {
  // estado local da narração (placar/feed subindo). Reiniciado quando a série troca.
  const localRef = useRef<SeriesState | null>(null);
  // identidade da série que estou narrando (seedSalt+startDeadline). Troca = reset.
  const keyRef = useRef<string>("");
  // momento do PRÓXIMO passo de narração (relógio absoluto), p/ respeitar o ritmo.
  const nextStepAtRef = useRef<number>(0);
  // já avisei o onFinish desta série?
  const finishedNotifiedRef = useRef<boolean>(false);
  const [, force] = useState(0);

  const keyOf = (o: SeriesState) => `${o.seedSalt}:${o.startDeadline ?? "x"}`;

  // UM interval fixo dirige tudo: re-render do countdown + avanço da narração.
  // Como ele sempre existe (não é re-armado por mudança de `official`), nunca
  // "some" no meio de uma transição.
  useEffect(() => {
    const id = setInterval(() => force((n) => (n + 1) % 1_000_000), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // ── deriva o estado a renderizar A CADA RENDER, a partir do relógio ──
  let s: SeriesState | null = null;
  let secs = 0;

  if (!official) {
    // sem série → limpa tudo (não exibe a anterior).
    localRef.current = null;
    keyRef.current = "";
    nextStepAtRef.current = 0;
    finishedNotifiedRef.current = false;
  } else {
    const key = keyOf(official);
    // série NOVA (ou trocou) → reseta o estado local da narração na hora.
    if (keyRef.current !== key) {
      keyRef.current = key;
      localRef.current = null;
      nextStepAtRef.current = 0;
      finishedNotifiedRef.current = false;
    }

    const now = Date.now();
    const startAt = official.startDeadline ?? 0; // 0/passado = já pode começar
    const countingDown = official.startDeadline != null && now < official.startDeadline;

    if (countingDown) {
      // ainda no countdown → mostra a série oficial (placar 0-0) + segundos.
      s = official;
      secs = Math.max(0, Math.ceil((official.startDeadline! - now) / 1000));
    } else {
      // já começou (ou sem countdown): garante o estado local inicial.
      if (!localRef.current) {
        localRef.current = { ...official, startDeadline: null, scoreA: 0, scoreB: 0, gameIndex: 0, eventIndex: 0, finished: false };
        nextStepAtRef.current = Math.max(now, startAt);
      }
      // avança quantos passos couberem até agora (respeitando o ritmo determinístico).
      let cur = localRef.current;
      let guard = 0;
      while (!cur.finished && now >= nextStepAtRef.current && guard < 200) {
        const next = advanceSeries(cur, imersivo);
        nextStepAtRef.current += stepDelayMs(cur, imersivo);
        cur = next;
        guard++;
      }
      localRef.current = cur;
      s = cur;
    }
  }

  // terminou → avisa o onFinish UMA vez (após um respiro pra ver o placar final).
  useEffect(() => {
    if (s?.finished && onFinish && !finishedNotifiedRef.current) {
      finishedNotifiedRef.current = true;
      const id = setTimeout(onFinish, 2400);
      return () => clearTimeout(id);
    }
  });

  return { s, secs };
}
