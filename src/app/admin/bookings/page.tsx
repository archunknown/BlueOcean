import { createClient } from '@/utils/supabase/server'
import BookingsClient from '@/components/admin/bookings/BookingsClient'

export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
    const supabase = await createClient()

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching bookings:', error)
        return <div className="p-8 text-red-500">Error cargando reservas</div>
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Gestiona las reservas de tours y su estado.
                </p>
            </div>

            <BookingsClient initialBookings={bookings || []} />
        </div>
    )
}
