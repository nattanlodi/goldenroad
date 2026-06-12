/**
 * Fundo animado global do app (todas as telas). Camadas combinadas, fixas na
 * viewport e atrás do conteúdo (z-0, pointer-events:none):
 *   1. auroras — manchas de luz dourada/azul que derivam e respiram
 *   2. feixes — raios de luz diagonais que pulsam devagar
 *   3. partículas — poeira luminosa subindo
 *   4. vinheta — escurece as bordas pra dar foco ao centro
 * Tudo em CSS (GPU via transform/opacity) e respeita prefers-reduced-motion.
 */
export function AppBackground({ dim = false, variant }: { dim?: boolean; variant?: "game" }) {
  const cls = ["app-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"];
  if (dim) cls.push("app-bg-dim");
  if (variant === "game") cls.push("app-bg-game");
  return (
    <div aria-hidden className={cls.join(" ")}>
      <div className="app-bg-aurora" />
      <div className="app-bg-beams" />
      <div className="app-bg-particles" />
      <div className="app-bg-vignette" />
    </div>
  );
}
