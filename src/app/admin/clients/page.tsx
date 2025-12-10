import { getClients } from '../actions'
import ClientsClient from '@/components/admin/clients/ClientsClient'
import { Users } from 'lucide-react'

export default async function ClientsPage() {
    const clients = await getClients()

    return (
        <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    Clientes (CRM)
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                    Gestiona tu base de datos de clientes. Registra leads rápidos, consulta información de contacto y mantén un historial organizado.
                </p>
            </div>

            <ClientsClient initialClients={clients || []} />
        </div>
    )
}
