import { createClient } from '@/utils/supabase/server'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { redirect, notFound } from 'next/navigation'

interface CheckoutPageProps {
    searchParams: Promise<{
        tourId: string
        date: string
        pax: string
        // We ignore other params as they are insecure
    }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const supabase = await createClient()
    const { tourId, date, pax } = await searchParams

    if (!tourId || !date) {
        redirect('/tours')
    }

    // 1. Fetch Secure Tour Data
    const { data: tour, error } = await supabase
        .from('tours')
        .select('title, price')
        .eq('id', tourId)
        .single()

    if (error || !tour) {
        console.error('Checkout Error: Tour not found', error)
        notFound()
    }

    // 2. Fetch Settings
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .single()

    // 3. Construct Secure Params for Client Component
    // We clean the price to be numeric for the frontend calculation
    const priceClean = tour.price.replace(/[^0-9.]/g, '')
    const priceNumeric = parseFloat(priceClean)

    const secureParams = {
        tourId,
        date,
        pax: pax || '1',
        tour: {
            title: tour.title,
            price: isNaN(priceNumeric) ? 0 : priceNumeric
        }
    }

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
                <CheckoutForm secureParams={secureParams} settings={settings} />
            </div>
        </div>
    )
}
