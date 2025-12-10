import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/roles'
import { getGlobalSettings } from '../actions'
import SettingsClient from '@/components/admin/settings/SettingsClient'
import { Settings as SettingsIcon } from 'lucide-react'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const role = await getUserRole()
    const settings = await getGlobalSettings()

    return (
        <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                    <SettingsIcon className="h-8 w-8 text-gray-700" />
                    Configuración
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                    Administra los datos de la empresa y opciones de tu cuenta.
                </p>
            </div>

            <SettingsClient
                initialSettings={settings}
                userRole={role || 'worker'} // fallback
                userEmail={user?.email}
            />
        </div>
    )
}
