import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase configurado vía variables de entorno de Vite.
 * Requiere:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

if (!supabaseUrl || !supabaseAnonKey) {
  // Lanzamos un error explícito para evitar fallas silenciosas en runtime.
  throw new Error(
    'Faltan variables de entorno de Supabase. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
