import { useCallback, useRef, useState } from "react";

const STORAGE_KEY = "w60_muted";

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Áudio sintetizado via Web Audio (sem arquivos), portado do protótipo.
 * O AudioContext é criado/retomado no 1º gesto. `muted` é persistido em localStorage.
 */
export function useAudio() {
  const [muted, setMuted] = useState<boolean>(readMuted);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const acRef = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback((): AudioContext | null => {
    if (mutedRef.current) return null;
    if (!acRef.current) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        acRef.current = new Ctor();
      } catch {
        return null;
      }
    }
    if (acRef.current.state === "suspended") void acRef.current.resume();
    return acRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = "sine", gain = 0.12, when = 0) => {
      const ac = ensureAudio();
      if (!ac) return;
      const t = ac.currentTime + when;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + dur + 0.03);
    },
    [ensureAudio],
  );

  // tick do sorteio: onda senoidal curta e suave (clean), em vez da square áspera.
  const sndTick = useCallback(() => tone(640, 0.045, "sine", 0.045), [tone]);
  const sndPick = useCallback(() => {
    // pick de jogador: confirmação suave (senoidal, volume contido, intervalo macio).
    tone(523, 0.11, "sine", 0.08);
    tone(698, 0.16, "sine", 0.06, 0.05);
  }, [tone]);
  // fim do sorteio da roleta: revelação clean e grave — duas senoidais macias,
  // frequências baixas pra soar "redondo" em vez de beep agudo.
  const sndReveal = useCallback(() => {
    tone(330, 0.2, "sine", 0.08);
    tone(440, 0.28, "sine", 0.06, 0.08);
  }, [tone]);
  const sndWin = useCallback(() => {
    tone(659, 0.1, "triangle", 0.13);
    tone(988, 0.16, "triangle", 0.1, 0.05);
  }, [tone]);
  const sndLose = useCallback(() => {
    tone(330, 0.12, "sine", 0.1);
    tone(247, 0.18, "sine", 0.08, 0.06);
  }, [tone]);
  const sndTrophy = useCallback(() => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.34, "triangle", 0.13, i * 0.11));
  }, [tone]);
  const sndDefeat = useCallback(() => {
    [440, 349, 262].forEach((f, i) => tone(f, 0.4, "sine", 0.12, i * 0.16));
  }, [tone]);
  // pentakill: arpejo ascendente suave (senoidal, clean — no estilo do draft),
  // 4 notas macias subindo + um remate redondo. Sem aspereza de "beep".
  const sndPenta = useCallback(() => {
    [392, 523, 659, 784].forEach((f, i) => tone(f, 0.16, "sine", 0.07, i * 0.08));
    tone(880, 0.34, "sine", 0.06, 0.34);
  }, [tone]);
  // mvp: pequena resolução nobre e macia — duas senoidais graves->médias.
  const sndMvp = useCallback(() => {
    tone(523, 0.2, "sine", 0.07);
    tone(659, 0.3, "sine", 0.055, 0.11);
  }, [tone]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      if (!next) {
        // retoma o contexto neste gesto
        mutedRef.current = false;
        ensureAudio();
      }
      return next;
    });
  }, [ensureAudio]);

  return { muted, toggleMute, ensureAudio, sndTick, sndPick, sndReveal, sndWin, sndLose, sndTrophy, sndDefeat, sndPenta, sndMvp };
}

export type AudioApi = ReturnType<typeof useAudio>;
