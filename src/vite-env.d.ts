/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do projeto Supabase (online "Worlds ao Vivo"). Vazio = offline/local. */
  readonly VITE_SUPABASE_URL?: string;
  /** anon public key do Supabase (pública, pode ir no bundle). */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
