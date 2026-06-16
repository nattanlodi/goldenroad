// ============================================================
// Ponto de entrada da camada de rede — escolhe o TRANSPORT
// ============================================================
// Quem usa a rede importa daqui e NÃO decide o adapter: se há credenciais do
// Supabase, usa o online de verdade; senão, o LocalTransport (abas do mesmo
// navegador) — que é exatamente o que dá pra testar 1v1 hoje, sem conta.

import { LocalTransport } from "./localTransport";
import { SupabaseTransport } from "./supabaseTransport";
import { hasSupabase } from "./env";
import type { Transport } from "./transport";

export type TransportKind = "supabase" | "local";

/** Qual transporte está disponível agora (online se há credenciais).
 * `?local` na URL FORÇA o LocalTransport (BroadcastChannel) — útil pra testar a
 * LÓGICA com 2 abas NORMAIS do mesmo navegador, isolando bugs de rede do Supabase. */
export function availableTransport(): TransportKind {
  if (typeof location !== "undefined" && new URLSearchParams(location.search).has("local")) return "local";
  return hasSupabase() ? "supabase" : "local";
}

/** Cria uma instância nova do transporte adequado (uma por conexão de sala). */
export function createTransport(kind: TransportKind = availableTransport()): Transport {
  return kind === "supabase" ? new SupabaseTransport() : new LocalTransport();
}

export * from "./transport";
export { RoomClient } from "./roomClient";
export type { RoomView, ReduceCtx, RoomCallbacks, RoomClientOpts } from "./roomClient";
export * from "./ticket";
export { hasSupabase } from "./env";
