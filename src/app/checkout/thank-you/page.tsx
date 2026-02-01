import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircleIcon, QrCodeIcon, HomeIcon } from '@heroicons/react/24/outline'
import { redirect } from 'next/navigation'

interface ThankYouPageProps {
    searchParams: Promise<{
        code: string
    }>
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
    const { code } = await searchParams

    if (!code) {
        redirect('/')
    }

    const supabase = await createClient()

    // 1. Fetch Booking Details (Optional, for verification)
    const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_code', code)
        .single()

    // 2. Fetch Settings for QR/WhatsApp
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .single()

    const companyPhone = settings?.whatsapp_primary || '51999999999'

    // Construct WhatsApp Message
    const message = booking ? `Hola, ya realicé mi reserva:
*Código:* ${booking.booking_code}
*Tour:* ${booking.tour_title}
*Total:* ${booking.total_price}

Adjunto mi constancia de pago.` : `Hola, vengo de la web con el código de reserva: ${code}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodedMessage}`

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-green-50 p-8 text-center border-b border-green-100">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircleIcon className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Pre-confirmada!</h1>
                    <p className="text-gray-600">Tu código de reserva es:</p>
                    <div className="mt-4 inline-block bg-white px-6 py-3 rounded-xl border-2 border-green-200 border-dashed">
                        <span className="text-3xl font-mono font-black text-blue-900 tracking-wider select-all">
                            {code}
                        </span>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Instructions */}
                    <div className="text-center space-y-2">
                        <h2 className="font-bold text-gray-900">Siguiente Paso: Realizar Pago</h2>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Para confirmar tu cupo, realiza el pago usando el QR y envía la constancia por WhatsApp.
                        </p>
                    </div>

                    {/* QR Section */}
                    <div className="flex justify-center">
                        <div className="w-64 h-64 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
                            {settings?.yape_qr_url ? (
                                <Image
                                    src={settings.yape_qr_url}
                                    alt="Yape QR"
                                    fill
                                    className="object-contain p-2"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                    <QrCodeIcon className="h-12 w-12" />
                                    <span className="text-xs">QR no disponible</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-xl hover:brightness-105 transition-all shadow-md active:scale-[0.98]"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            Enviar Constancia
                        </a>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full py-4 text-gray-500 font-medium hover:text-gray-800 transition-colors"
                        >
                            <HomeIcon className="w-5 h-5" />
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
