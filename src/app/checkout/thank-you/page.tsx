import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import DownloadVoucherButton from '@/components/checkout/DownloadVoucherButton';
import { CheckCircleIcon, CalendarIcon, ClockIcon, UserGroupIcon, HashtagIcon } from '@heroicons/react/24/outline'; // Outline for clean look, solid for main icon

export default async function ThankYouPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const bookingId = params.booking_id as string;

    if (!bookingId) {
        redirect('/');
    }

    const supabase = await createClient();
    const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

    if (error || !booking) {
        console.error("Booking not found:", error);
        redirect('/');
    }

    // Formato de Moneda
    const formattedTotal = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(Number(booking.total_price));

    // WhatsApp Link para Soporte
    const whatsappMessage = `Hola, tengo una consulta sobre mi reserva ${booking.booking_code}.`;
    const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header Verde */}
                <div className="bg-green-500 p-8 text-center text-white">
                    <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <CheckCircleIcon className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">¡Reserva Confirmada!</h1>
                    <p className="text-green-50 font-medium">
                        Tu pago se procesó correctamente. Hemos enviado los detalles a tu correo.
                    </p>
                </div>

                {/* Tarjeta de Resumen */}
                <div className="p-8 space-y-6">

                    <div className="text-center pb-6 border-b border-gray-100">
                        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">CÓDIGO DE RESERVA</p>
                        <p className="text-4xl font-black text-gray-800 tracking-wider font-mono">{booking.booking_code}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{booking.tour_title}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-4 h-4" /> {booking.tour_date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="w-4 h-4" /> {booking.tour_time}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <UserGroupIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Pasajeros</p>
                                    <p className="font-semibold text-gray-800">{booking.pax}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase">Total Pagado</p>
                                <p className="font-black text-green-600 text-lg">{formattedTotal}</p>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="space-y-3 pt-6">
                        <DownloadVoucherButton booking={booking} />

                        <Link
                            href="/"
                            className="block w-full py-4 bg-white text-gray-700 font-bold rounded-xl text-center border-2 border-gray-100 hover:border-gray-300 hover:text-gray-900 transition-all active:scale-[0.98]"
                        >
                            Volver al Inicio
                        </Link>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center text-gray-400 hover:text-green-600 font-medium text-sm transition-colors flex items-center justify-center gap-2 pt-2"
                        >
                            <span>¿Tienes dudas?</span>
                            <span className="underline decoration-green-600/30 hover:decoration-green-600">Contáctanos por WhatsApp</span>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
