import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('❌ Supabase params missing. Check .env.local')
    }

    return createClient<Database>(
        supabaseUrl!,
        supabaseServiceRoleKey!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
