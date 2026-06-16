// Error boundary TEMPORÁRIO de diagnóstico: captura o throw REAL de um filho
// (em vez do erro secundário "Should have a queue" que o React reporta sem
// boundary) e mostra a mensagem + stack na tela e no console.
import { Component, type ReactNode } from "react";

export class OnlineErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("[ONLINE CRASH]", error.message, "\n", error.stack, "\nCOMPONENT STACK:", info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-[760px] rounded-2xl border border-red/50 p-5 font-mono text-[12px] text-red" style={{ background: "rgba(40,12,12,0.6)" }}>
          <div className="mb-2 font-display text-[16px] font-bold uppercase tracking-[1px]">⚠ Erro na tela online (diagnóstico)</div>
          <div className="mb-2 whitespace-pre-wrap break-words text-cream">{this.state.error.message}</div>
          <pre className="max-h-[40vh] overflow-auto whitespace-pre-wrap break-words text-[10px] text-muted">{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
