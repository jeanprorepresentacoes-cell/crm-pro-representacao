import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

// Inicializa o cliente Supabase para uso no lado do servidor (Node.js)
// Ele usará a Anon Key para acesso público e a Service Role Key (se necessário)
// para operações de servidor que ignoram RLS (Row Level Security).
// Por enquanto, usaremos apenas a URL e a Anon Key.

if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
  console.error(
    "[Supabase] ERROR: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not configured!"
  );
}

export const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseAnonKey
);

// O cliente Supabase para o lado do cliente (frontend) será inicializado
// usando as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
// que são expostas pelo Vite.
