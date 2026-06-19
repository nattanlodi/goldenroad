/**
 * Fundo CERIMONIAL da classificação final do Duelo online.
 *
 * Diferente do VictoryBackdrop (que grita "VOCÊ venceu" com dourado claro +
 * confete), este é NEUTRO e sóbrio: vale igual pro campeão e pra quem caiu na
 * primeira série. Cor de "encerramento de torneio" — escuro profundo, dourado
 * contido, raios lentos e uma poeira discreta. Sem festa, com cerimônia.
 *
 * Usa `absolute` (não `fixed`) pelo mesmo motivo do AppBackground: position:fixed
 * cobrindo a viewport trava o auto-hide da barra de endereço no Safari iOS.
 * Respeita prefers-reduced-motion (classes .finale-* têm guard no CSS).
 */
export function FinaleBackdrop() {
  return (
    <div aria-hidden className="finale-bg pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="finale-rays" />
      <div className="finale-glow" />
      <div className="finale-dust" />
      <div className="finale-vignette" />
    </div>
  );
}
