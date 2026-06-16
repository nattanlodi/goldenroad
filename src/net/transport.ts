// ============================================================
// CAMADA DE REDE — interface TRANSPORT (o "mensageiro")
// ============================================================
// Degrau 1: isola TODA a rede atrás de uma interface genérica de pub/sub +
// presence. Quem usa (RoomClient) não sabe se está rodando em memória (teste em
// duas abas) ou no Supabase Realtime (online de verdade) — só conhece este
// contrato. Trocar o adapter NÃO mexe na máquina de estados do jogo.
//
//   Transport  ── interface (este arquivo)
//   ├─ LocalTransport     → BroadcastChannel (testa 1v1 em 2 abas, sem internet)
//   └─ SupabaseTransport  → Supabase Realtime (online; plugado com credenciais)
//
// O modelo é o do design (§3): canal por sala, eventos broadcast e Presence
// pra saber quem está online. O host-autoritativo vive UMA camada acima (RoomClient).

/** Identidade de quem está conectado num canal (vai no Presence). */
export interface PresenceMeta {
  /** id estável da pessoa (do ticket no localStorage) — sobrevive a reload. */
  playerId: string;
  /** nick exibido (3–14 chars). */
  nick: string;
  /** quem criou a sala é o host (autoritativo). */
  isHost: boolean;
  /** ms desde epoch em que entrou (desempate de host na eleição). */
  joinedAt: number;
}

/** Um evento broadcast no canal da sala. `type` roteia; `payload` é livre (JSON). */
export interface RoomEvent {
  type: string;
  /** id de quem mandou (pra ignorar o próprio eco, se preciso). */
  from: string;
  payload: unknown;
}

/** Estado da conexão do transporte (pra UI mostrar "reconectando…"). */
export type ConnState = "idle" | "connecting" | "joined" | "reconnecting" | "closed" | "error";

/** Callbacks que o RoomClient registra no transporte. */
export interface TransportHandlers {
  /** chegou um evento broadcast de alguém no canal. */
  onEvent(ev: RoomEvent): void;
  /** o conjunto de presentes mudou (entrou/saiu alguém). Lista COMPLETA atual. */
  onPresence(members: PresenceMeta[]): void;
  /** a conexão mudou de estado (connecting → joined → reconnecting…). */
  onConn(state: ConnState): void;
}

/**
 * Contrato do "mensageiro". Uma instância = uma conexão a UM canal de sala.
 * Implementações: LocalTransport (memória/abas), SupabaseTransport (rede).
 */
export interface Transport {
  /** Conecta ao canal `room` anunciando `me` no Presence. Resolve quando "joined". */
  join(room: string, me: PresenceMeta, handlers: TransportHandlers): Promise<void>;
  /** Envia um evento broadcast pra todos no canal (inclusive, às vezes, pra si). */
  send(type: string, payload: unknown): void;
  /** Atualiza o próprio Presence (ex.: virou host após eleição). */
  updateMeta(patch: Partial<PresenceMeta>): void;
  /** Sai do canal e libera recursos. */
  leave(): Promise<void>;
  /** Estado atual da conexão (síncrono, pra leitura rápida). */
  state(): ConnState;
}
