import { createClient } from '@/utils/supabase/server'
import BookingsClient from '@/components/admin/bookings/BookingsClient'
import type { BookingWithClient } from '@/types/booking-types'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getUserRole } from '@/utils/roles'

export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
    const role = await getUserRole()
    const supabase = await createClient()

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*, clients(*)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching bookings:', error)
        return <div className="p-8 text-red-500">Error cargando reservas</div>
    }

    const canCreateBooking = role === 'admin' || role === 'worker'

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Gestiona las reservas de tours y su estado.
                    </p>
                </div>
                {canCreateBooking && (
                    <Link
                        href="/admin/bookings/new"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors shrink-0"
                    >
                        <Plus className="h-5 w-5" />
                        Reserva Inmediata
                    </Link>
                )}
            </div>

            <BookingsClient initialBookings={(bookings as unknown as BookingWithClient[]) || []} />
        </div>
    )
}
