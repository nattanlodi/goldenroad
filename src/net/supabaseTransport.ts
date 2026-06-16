// ============================================================
// SupabaseTransport — TRANSPORT real (Supabase Realtime)
// ============================================================
// Adapter de produção. Mesmo contrato do LocalTransport, mas conecta navegadores
// pela internet via Supabase Realtime (§2/§3 do design):
//   • um CANAL por sala (`room:GOLD-XXXX`);
//   • BROADCAST pros eventos do jogo (mesmos do RoomClient);
//   • PRESENCE pra saber quem está online (entrar/sair/reconectar).
//
// Credenciais (públicas — anon key pode ir no bundle, a segurança vem das RLS,
// e aqui nem usamos tabelas): vêm de variáveis de ambiente Vite:
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  (ver .env.example / src/net/env.ts)
//
// Sem credenciais, `hasSupabase()` é false e o app cai no LocalTransport — o
// build e o modo offline seguem funcionando. Plugar online = só preencher o .env.

import {
  createClient,
  type RealtimeChannel,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabase } from "./env";
import type {
  ConnState,
  PresenceMeta,
  RoomEvent,
  Transport,
  TransportHandlers,
} from "./transport";

let client: SupabaseClient | null = null;

/** Cliente Supabase singleton (ou null se sem credenciais). */
function getClient(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: { params: { eventsPerSecond: 20 } },
    });
  }
  return client;
}

export class SupabaseTransport implements Transport {
  private channel: RealtimeChannel | null = null;
  private me!: PresenceMeta;
  private handlers!: TransportHandlers;
  private conn: ConnState = "idle";

  async join(room: string, me: PresenceMeta, handlers: TransportHandlers): Promise<void> {
    const sb = getClient();
    if (!sb) throw new Error("Supabase não configurado (falta VITE_SUPABASE_URL/ANON_KEY).");
    this.me = { ...me };
    this.handlers = handlers;
    this.setConn("connecting");

    const channel = sb.channel(`room:${room.toUpperCase()}`, {
      config: { broadcast: { self: true }, presence: { key: me.playerId } },
    });
    this.channel = channel;

    // Eventos do jogo (broadcast).
    channel.on("broadcast", { event: "room" }, (msg) => {
      const ev = msg.payload as RoomEvent;
      this.handlers.onEvent(ev);
    });

    // Presence: sempre que o conjunto muda, recalcula a lista completa.
    const pushPresence = () => {
      const stateMap = channel.presenceState<PresenceMeta>();
      const members: PresenceMeta[] = [];
      for (const key of Object.keys(stateMap)) {
        const metas = stateMap[key];
        if (metas && metas[0]) members.push(metas[0]);
      }
      members.sort((a, b) => a.joinedAt - b.joinedAt);
      this.handlers.onPresence(members);
    };
    channel.on("presence", { event: "sync" }, pushPresence);
    channel.on("presence", { event: "join" }, pushPresence);
    channel.on("presence", { event: "leave" }, pushPresence);

    await new Promise<void>((resolve, reject) => {
      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track(this.me);
          this.setConn("joined");
          pushPresence();
          resolve();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          this.setConn("error");
          reject(new Error(`Realtime: ${status}`));
        } else if (status === "CLOSED") {
          this.setConn("closed");
        }
      });
    });
  }

  send(type: string, payload: unknown): void {
    const ev: RoomEvent = { type, from: this.me.playerId, payload };
    this.channel?.send({ type: "broadcast", event: "room", payload: ev });
  }

  updateMeta(patch: Partial<PresenceMeta>): void {
    this.me = { ...this.me, ...patch };
    this.channel?.track(this.me);
  }

  async leave(): Promise<void> {
    if (this.channel) {
      await this.channel.unsubscribe();
      const sb = getClient();
      if (sb) sb.removeChannel(this.channel);
      this.channel = null;
    }
    this.setConn("closed");
  }

  state(): ConnState {
    return this.conn;
  }

  private setConn(s: ConnState) {
    if (this.conn === s) return;
    this.conn = s;
    this.handlers?.onConn(s);
  }
}
