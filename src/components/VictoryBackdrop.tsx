import { useEffect, useRef } from "react";

// ============================================================
// Fundo LENDÁRIO da tela de vitória (campeão do mundo / GOLDENROAD).
// Camadas: base dourada quente + raios radiantes girando + halo pulsante
// (CSS, classe .bg-victory) e confetes BRANCOS caindo (canvas, aqui).
// Respeita prefers-reduced-motion (sem confete animado).
// ============================================================

interface Confetto {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  vr: number; // velocidade de rotação
  vy: number; // queda
  vx: number; // deriva lateral
  sway: number; // amplitude do balanço
  swayPhase: number;
  alpha: number;
}

export function VictoryBackdrop() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // confetes brancos/marfim (tons levemente variados pra dar profundidade)
    const COUNT = Math.round(Math.min(160, Math.max(70, w / 9)));
    const tints = ["#e8ce86", "#d8b45a", "#f0dca0", "#c9a24b"];
    const make = (initial: boolean): Confetto => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20 - Math.random() * h * 0.5,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 9,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.08,
      vy: 0.22 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      sway: 0.6 + Math.random() * 1.6,
      swayPhase: Math.random() * Math.PI * 2,
      alpha: 0.28 + Math.random() * 0.28,
    });
    const pieces: Confetto[] = Array.from({ length: COUNT }, () => make(true));
    const colorOf = (i: number) => tints[i % tints.length];

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(t * p.sway + p.swayPhase) * 0.7;
        p.rot += p.vr;
        if (p.y > h + 30) Object.assign(p, make(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = colorOf(i);
        // retângulos finos girando = confete de papel
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="bg-victory pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="victory-rays" />
      <div className="victory-halo" />
      <div className="victory-dust" />
      <div className="victory-vignette" />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}
