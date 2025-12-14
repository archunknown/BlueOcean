import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    // Fail fast in production if keys are missing
    // We use console.error instead of throw in some setups to avoid build crashes,
    // but critique requested fail fast.
    if (process.env.NODE_ENV === 'production') {
        throw new Error('❌ CRITICAL: Supabase keys are missing.');
    } else {
        console.error('❌ CRITICAL: Supabase keys are missing. Check your .env.local file.');
    }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
