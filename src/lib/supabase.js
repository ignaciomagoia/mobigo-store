import { createClient } from '@supabase/supabase-js';

let client;

// Inicialización diferida: permite compilar y mostrar un error recuperable
// en el catálogo cuando todavía no se configuró el proyecto.
export function getSupabase() {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error('Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY.');
  }

  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
