

import { createAdminClient } from '@/utils/supabase/admin';
import { notFound } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon, UserIcon, CalendarIcon, MapIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Database } from '@/types/database';

interface VerifyPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Custom type for the query result
type BookingWithPartialClient = Database['public']['Tables']['bookings']['Row'] & {
    clients: {
        first_name: string;
        paternal_surname: string;
    } | null;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch Booking with Admin Client (Bypasses RLS)
    const { data, error } = await supabase
        .from('bookings')
        .select('*, clients(first_name, paternal_surname)')
        .eq('id', id)
        .single();

    // Explicit cast to satisfy TS requirement
    const booking = data as unknown as BookingWithPartialClient;

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6 text-white text-center">
                <XCircleIcon className="w-32 h-32 mb-6 animate-pulse" />
                <h1 className="text-4xl font-black uppercase tracking-wider mb-2">CÓDIGO INVÁLIDO</h1>
                <p className="text-red-100 text-lg">No se encontró ninguna reserva con este identificador.</p>
                <p className="mt-8 text-sm opacity-50 font-mono">{id}</p>
            </div>
        );
    }

    // Determine Status Logic
    // Valid: 'confirmed' OR 'pending_payment' (as per user instruction)
    // Invalid: 'cancelled'
    const isCancelled = booking.status === 'cancelled';
    const isValid = !isCancelled && (booking.status === 'confirmed' || booking.status === 'pending_payment' || booking.status === 'pending');

    const statusColor = isValid ? 'bg-green-500' : 'bg-red-600';
    const statusIcon = isValid ? <CheckCircleIcon className="w-24 h-24 text-white" /> : <XCircleIcon className="w-24 h-24 text-white" />;
    const statusText = isValid ? 'VÁLIDO' : 'CANCELADO';
    const statusMessage = isValid ? 'Reserva confirmada o pendiente de pago' : 'Esta reserva ha sido cancelada';

    // Format Date/Time
    const tourDate = new Date(booking.tour_date).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <div className={`min-h-screen ${statusColor} text-white p-6 flex flex-col items-center`}>

            {/* Status Header */}
            <div className="flex flex-col items-center justify-center py-10">
                {statusIcon}
                <h1 className="text-5xl font-black uppercase tracking-tight mt-4">{statusText}</h1>
                <p className="text-white/80 font-medium text-center mt-2 max-w-xs">{statusMessage}</p>
            </div>

            {/* Ticket Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl text-gray-800 overflow-hidden">
                <div className="p-8 space-y-6">

                    {/* Pasajero */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-2xl">
                            <UserIcon className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pasajero Principal</p>
                            <p className="text-2xl font-bold leading-tight text-gray-900 line-clamp-2">
                                {booking.client_name || booking.client_first_name + ' ' + booking.client_paternal_surname}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{booking.client_email}</p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* Detalle Tour */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <MapIcon className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold">{booking.tour_title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{tourDate} • {booking.tour_time}</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase">Pax</p>
                            <p className="text-3xl font-black text-gray-800">{booking.pax}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase">Estado Pago</p>
                            <p className={`text-xl font-bold ${booking.payment_status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>
                                {booking.payment_status === 'approved' ? 'PAGADO' : 'PENDIENTE'}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer Code */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <p className="text-xs font-mono text-gray-400">ID: {booking.id}</p>
                </div>
            </div>

        </div>
    );
}
