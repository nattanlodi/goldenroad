import { Logo6x0 } from "../components/Logo6x0";

interface Props {
  poolCount: number;
  onBegin: () => void;
}

const RULES = [
  { label: "01 — SORTEIO", text: "A cada rodada surge a line completa de um time do Worlds." },
  { label: "02 — ESCOLHA", text: "Pegue 1 jogador. Ele ocupa a lane natural dele — sem repetir lane." },
  { label: "03 — 3 RESORTEIOS", text: "Não curtiu? Troque por outro time ou outro Worlds do mesmo time." },
];

export function StartScreen({ poolCount, onBegin }: Props) {
  return (
    <div className="anim-fade m-auto w-full max-w-[780px] text-center">
      <div className="mb-[30px] inline-flex items-center gap-2.5 rounded-full border border-gold/40 px-4 py-[7px] font-mono text-[12px] uppercase tracking-[2px] text-gold-bright">
        ★ Desafio Worlds
      </div>

      <Logo6x0
        className="mx-auto mt-1.5 block h-auto"
        style={{ width: "clamp(240px,62vw,460px)", filter: "drop-shadow(0 6px 30px rgba(201,162,75,0.32))" }}
      />

      <h1 className="mt-[18px] mb-2 font-display text-[clamp(22px,4.5vw,38px)] font-semibold uppercase tracking-[1px] text-cream">
        Monte a line invencível
      </h1>
      <p className="mx-auto mb-[38px] max-w-[520px] text-[clamp(15px,2.2vw,18px)] leading-[1.55] text-[#BFC4CD]">
        Você recebe lines reais de times lendários do Worlds. Escolha{" "}
        <b className="text-cream">um jogador por rodada</b> e preencha as 5 lanes. Depois, vença as 6 séries dos
        playoffs <b className="text-cream">uma a uma</b> e erga a taça com um 6–0 perfeito.
      </p>

      <div className="mb-[38px] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5 text-left">
        {RULES.map((r) => (
          <div
            key={r.label}
            className="rounded-[14px] border border-gold/25 p-[18px]"
            style={{ background: "linear-gradient(180deg,rgba(46,55,70,0.75),rgba(32,39,51,0.75))" }}
          >
            <div className="mb-2 font-mono text-[13px] text-gold-bright">{r.label}</div>
            <div className="text-[14px] leading-[1.45] text-[#D7D4CB]">{r.text}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onBegin}
        className="btn-gold cursor-pointer rounded-[11px] border-none px-[46px] py-4 font-display text-[18px] font-semibold uppercase tracking-[2px]"
      >
        Começar campanha
      </button>
      <div className="mt-[18px] font-mono text-[13px] text-dim-2">
        {poolCount} campanhas no pool · LCK · LPL · LEC · LMS
      </div>
    </div>
  );
}
