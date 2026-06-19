import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  /** emoji/ícone no topo (opcional). */
  icon?: string;
  /** título em destaque. */
  title: string;
  /** texto explicativo (1-2 linhas). */
  message?: string;
  /** rótulo do botão que CANCELA (default "Cancelar"). */
  cancelLabel?: string;
  /** rótulo do botão que CONFIRMA (default "Confirmar"). */
  confirmLabel?: string;
  /** confirmar é uma ação destrutiva? (pinta o botão de vermelho). default true. */
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Modal de confirmação GENÉRICO e compartilhado (online + solo). Portal no body
 * (escapa de containers com transform), fecha no ESC / clique fora. O visual mora
 * AQUI — mudar aqui reflete em todos os usos.
 */
export function ConfirmModal({
  icon,
  title,
  message,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  danger = true,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const modal = (
    <div className="anim-fade-fast fixed inset-0 z-[120] flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(10,11,15,0.8)", backdropFilter: "blur(5px)" }} onClick={onCancel}>
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-gold/30 text-center"
        style={{ background: "linear-gradient(160deg,rgba(40,34,18,0.6),rgba(22,23,28,0.92))" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-7 pb-5">
          {icon && <div className="text-[34px]">{icon}</div>}
          <div className="mt-2 font-display text-[19px] font-black uppercase tracking-[1px] text-cream">{title}</div>
          {message && <div className="mt-2 font-mono text-[12px] leading-relaxed text-muted">{message}</div>}
        </div>
        <div className="flex gap-2.5 border-t border-gold/15 px-4 py-3">
          <button onClick={onCancel}
            className="btn-soft-gold flex-1 cursor-pointer rounded-[10px] px-4 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px]">
            {cancelLabel}
          </button>
          <button onClick={onConfirm}
            className={`flex-1 cursor-pointer rounded-[10px] border px-4 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[1px] transition-colors ${danger ? "text-red-soft hover:bg-[rgba(224,88,74,0.12)]" : "btn-gold border-none"}`}
            style={danger ? { borderColor: "rgba(224,88,74,0.5)", background: "rgba(224,88,74,0.06)" } : undefined}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
