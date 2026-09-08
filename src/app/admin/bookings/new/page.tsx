import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/roles'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import NewManualBookingForm, { type TourOption } from '@/components/admin/bookings/NewManualBookingForm'

export const dynamic = 'force-dynamic'

export default async function NewManualBookingPage() {
    // ── Guardia de rol (server-side) ─────────────────────────────────────────
    const role = await getUserRole()
    if (!role || !['admin', 'worker'].includes(role)) {
        redirect('/admin')
    }

    // ── Fetch de tours activos ────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: tours, error } = await supabase
        .from('tours')
        .select('id, title, price, time_slots, is_flexible_schedule')
        .eq('is_active', true)
        .order('title', { ascending: true })

    if (error) {
        console.error('[new-booking-page] Error fetching tours:', error)
    }

    const tourOptions: TourOption[] = (tours ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        price: t.price,
        time_slots: t.time_slots ?? null,
        is_flexible_schedule: t.is_flexible_schedule,
    }))

    return (
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Volver a Reservas
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Reserva Inmediata</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Registra una reserva presencial confirmada al instante, sin pasar por la pasarela de pago.
                </p>
            </div>

            {tourOptions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                    <p className="text-gray-500 font-medium">No hay tours activos disponibles.</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Activa al menos un tour desde{' '}
                        <Link href="/admin/tours" className="text-blue-600 hover:underline">
                            Gestión de Tours
                        </Link>{' '}
                        para registrar reservas presenciales.
                    </p>
                </div>
            ) : (
                <NewManualBookingForm tours={tourOptions} />
            )}
        </div>
    )
}
