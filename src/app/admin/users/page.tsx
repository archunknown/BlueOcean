import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/roles'
import UsersClient from '@/components/admin/UsersClient'

export default async function UsersPage() {
    // 1. Check Role
    const role = await getUserRole()
    if (role !== 'admin') {
        redirect('/admin')
    }

    // 2. Fetch Users
    const supabase = await createClient()
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true }) // Admin first ('a' < 'w')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        return <div>Error al cargar usuarios</div>
    }

    // 3. Get Current User for UI Logic
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="space-y-8 p-6 sm:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Usuarios</h1>
                <p className="text-sm text-gray-500">Gestiona el acceso y los roles del equipo.</p>
            </div>

            {/* @ts-ignore */}
            <UsersClient initialUsers={profiles || []} currentUserId={user?.id} />
        </div>
    )
}
