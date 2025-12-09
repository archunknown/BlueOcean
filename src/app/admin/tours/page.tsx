import { createClient } from '@/utils/supabase/server'
import ToursListClient from './ToursListClient'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ToursPage() {
    const supabase = await createClient()

    const { data: tours, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tours:', error)
        return (
            <div className="p-8 text-center text-red-500">
                Error al cargar los tours. Por favor intente más tarde.
            </div>
        )
    }

    return (
        <div className="space-y-8 p-6 sm:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestión de Tours</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Administra el catálogo de experiencias y alquileres
                    </p>
                </div>
            </div>

            <ToursListClient initialTours={tours || []} />
        </div>
    )
}
