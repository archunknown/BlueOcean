import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/roles'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const role = await getUserRole()

    // STRICT RBAC GUARD
    if (role !== 'admin') {
        // You can add 'superadmin' here if you have that role definition: role !== 'admin' && role !== 'superadmin'
        // For now, based on strict instructions and typical setup:
        redirect('/')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar user={user} role={role} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <AdminHeader user={user} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
