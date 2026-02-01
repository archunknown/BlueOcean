import { createClient } from '@/utils/supabase/server'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

interface CheckoutPageProps {
    searchParams: Promise<{
        tourId: string
        title: string
        price: string
        date: string
        pax: string
    }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const supabase = await createClient()
    const resolvedParams = await searchParams

    // Fetch settings for QR and WhatsApp
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .single() // Returns simple object, not array

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Simple Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/tours" className="flex items-center text-gray-500 hover:text-blue-900 transition-colors">
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        <span className="font-medium">Volver</span>
                    </Link>
                    <div className="mx-auto font-bold text-xl text-blue-900 pr-20">
                        Finalizar Reserva
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                <CheckoutForm searchParams={resolvedParams} settings={settings} />
            </div>
        </div>
    )
}
