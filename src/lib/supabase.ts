import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Verificamos si las variables de entorno están definidas para evitar errores en build time
// aunque en runtime deberían estar.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    // Solo warn en desarrollo, pero esto es necesario para el cliente
    // console.warn('⚠️ Supabase credentials not found in environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
