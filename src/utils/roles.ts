import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export const getUserRole = cache(async () => {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    // Failsafe for super admin
    if (user.email === 'admin@blueocean.com') {
        return 'admin'
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // @ts-ignore
    return profile?.role as 'admin' | 'worker' | null
})
