// ============================================================
// LocalTransport — TRANSPORT em memória via BroadcastChannel
// ============================================================
// Adapter que conecta ABAS DO MESMO NAVEGADOR sem internet. Serve pra testar o
// 1v1 de verdade (abre 2 abas → 2 jogadores) com presence e reconnect reais,
// enquanto a conta do Supabase não está plugada. Mesmo contrato do online: a
// máquina de estados (RoomClient) não percebe a diferença.
//
// BroadcastChannel dá só pub/sub entre abas; presence eu implemento por cima:
//   - cada aba manda HEARTBEAT a cada HEARTBEAT_MS anunciando seu meta;
//   - quem não bate ponto há > PRESENCE_TTL_MS é considerado fora;
//   - ao sair "limpo", manda um GONE.
// É deliberadamente parecido com o Presence do Supabase pra o adapter real
// trocar sem mexer no RoomClient.

import type {
  ConnState,
  PresenceMeta,
  RoomEvent,
  Transport,
  TransportHandlers,
} from "./transport";

const HEARTBEAT_MS = 1500;
const PRESENCE_TTL_MS = 4000; // sem heartbeat por mais que isso = saiu

// Envelopes internos que trafegam no BroadcastChannel.
type Wire =
  | { kind: "hb"; meta: PresenceMeta; t: number } // heartbeat (anuncia presença)
  | { kind: "gone"; playerId: string } // saída limpa
  | { kind: "ev"; ev: RoomEvent }; // evento broadcast do jogo

export class LocalTransport implements Transport {
  private ch: BroadcastChannel | null = null;
  private me!: PresenceMeta;
  private handlers!: TransportHandlers;
  private conn: ConnState = "idle";
  /** presentes vistos: playerId → { meta, lastSeen }. */
  private seen = new Map<string, { meta: PresenceMeta; last: number }>();
  private hbTimer: ReturnType<typeof setInterval> | null = null;
  private gcTimer: ReturnType<typeof setInterval> | null = null;

  async join(room: string, me: PresenceMeta, handlers: TransportHandlers): Promise<void> {
    this.me = { ...me };
    this.handlers = handlers;
    this.setConn("connecting");

    this.ch = new BroadcastChannel(`goldenroad:${room}`);
    this.ch.onmessage = (e: MessageEvent<Wire>) => this.onWire(e.data);

    // Anuncia-se já e marca a si mesmo como presente.
    this.touch(this.me);
    this.beat();
    this.hbTimer = setInterval(() => this.beat(), HEARTBEAT_MS);
    this.gcTimer = setInterval(() => this.gc(), HEARTBEAT_MS);

    this.setConn("joined");
    this.emitPresence();
  }

  send(type: string, payload: unknown): void {
    if (!this.ch) return;
    const ev: RoomEvent = { type, from: this.me.playerId, payload };
    this.post({ kind: "ev", ev });
    // BroadcastChannel NÃO ecoa pra própria aba → entrega local na mão,
    // pra o host (que também é jogador) processar o próprio evento.
    this.handlers.onEvent(ev);
  }

  updateMeta(patch: Partial<PresenceMeta>): void {
    this.me = { ...this.me, ...patch };
    this.touch(this.me);
    this.beat();
    this.emitPresence();
  }

  async leave(): Promise<void> {
    if (this.hbTimer) clearInterval(this.hbTimer);
    if (this.gcTimer) clearInterval(this.gcTimer);
    this.hbTimer = this.gcTimer = null;
    if (this.ch) {
      this.post({ kind: "gone", playerId: this.me.playerId });
      this.ch.close();
      this.ch = null;
    }
    this.seen.clear();
    this.setConn("closed");
  }

  state(): ConnState {
    return this.conn;
  }

  // ── internos ──

  private post(w: Wire) {
    this.ch?.postMessage(w);
  }

  private onWire(w: Wire) {
    switch (w.kind) {
      case "hb":
        if (w.meta.playerId === this.me.playerId) return; // meu próprio eco (não ocorre, mas guard)
        this.touch(w.meta);
        this.emitPresence();
        break;
      case "gone":
        if (this.seen.delete(w.playerId)) this.emitPresence();
        break;
      case "ev":
        if (w.ev.from === this.me.playerId) return; // já entreguei local no send()
        this.handlers.onEvent(w.ev);
        break;
    }
  }

  private beat() {
    this.post({ kind: "hb", meta: this.me, t: this.now() });
  }

  private touch(meta: PresenceMeta) {
    this.seen.set(meta.playerId, { meta, last: this.now() });
  }

  private gc() {
    const cutoff = this.now() - PRESENCE_TTL_MS;
    let changed = false;
    for (const [id, rec] of this.seen) {
      if (id === this.me.playerId) continue; // eu nunca expiro localmente
      if (rec.last < cutoff) {
        this.seen.delete(id);
        changed = true;
      }
    }
    if (changed) this.emitPresence();
  }

  private emitPresence() {
    const members = [...this.seen.values()]
      .map((r) => r.meta)
      .sort((a, b) => a.joinedAt - b.joinedAt);
    this.handlers.onPresence(members);
  }

  private setConn(s: ConnState) {
    if (this.conn === s) return;
    this.conn = s;
    this.handlers?.onConn(s);
  }

  // Date.now() encapsulado (um ponto só, fácil de trocar/testar).
  private now(): number {
    return Date.now();
  }
}
