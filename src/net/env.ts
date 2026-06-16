// ============================================================
// Credenciais do Supabase (variáveis de ambiente Vite)
// ============================================================
// As chaves são PÚBLICAS por design (§2): a anon key pode ir no bundle. Sem elas,
// o app funciona offline (modo torneio local) e o online cai no LocalTransport.
//
// Pra ativar o online: crie um arquivo `.env.local` na raiz (NÃO comitar) com:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
// e reinicie o `npm run dev`. Ver `.env.example`.

export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

/** true se as credenciais do Supabase estão presentes (online disponível). */
export function hasSupabase(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
