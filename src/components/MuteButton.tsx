interface Props {
  muted: boolean;
  onToggle: () => void;
}

/** Botão de mudo fixo no canto superior direito. */
export function MuteButton({ muted, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title="Som"
      className="fixed top-3.5 right-3.5 z-[60] flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-gold/30 bg-[rgba(18,22,29,0.7)] text-[17px] text-gold-bright transition-colors hover:border-gold-bright hover:bg-[rgba(201,162,75,0.14)]"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
