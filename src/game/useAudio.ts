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

  const sndTick = useCallback(() => tone(720, 0.035, "square", 0.05), [tone]);
  const sndPick = useCallback(() => {
    tone(523, 0.09, "triangle", 0.15);
    tone(784, 0.13, "triangle", 0.11, 0.05);
  }, [tone]);
  const sndWin = useCallback(() => {
    tone(659, 0.1, "triangle", 0.13);
    tone(988, 0.16, "triangle", 0.1, 0.05);
  }, [tone]);
  const sndTrophy = useCallback(() => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.34, "triangle", 0.13, i * 0.11));
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

  return { muted, toggleMute, ensureAudio, sndTick, sndPick, sndWin, sndTrophy };
}

export type AudioApi = ReturnType<typeof useAudio>;
