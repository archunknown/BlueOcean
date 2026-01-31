'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface CreateBookingState {
    success?: boolean
    message?: string
    bookingCode?: string
    totalPrice?: string
    whatsappUrl?: string
    errors?: {
        [key: string]: string[]
    }
}

export async function createBooking(prevState: any, formData: FormData): Promise<CreateBookingState> {
    const supabase = await createClient()

    // 1. Extract and Validate Data
    const tourId = formData.get('tourId') as string
    const tourTitle = formData.get('tourTitle') as string
    const clientName = formData.get('clientName') as string
    const clientEmail = formData.get('clientEmail') as string
    const clientPhone = formData.get('clientPhone') as string
    const tourDate = formData.get('tourDate') as string
    const pax = parseInt(formData.get('pax') as string || '1')

    if (!tourId || !clientName || !clientEmail || !clientPhone || !tourDate) {
        return { success: false, message: 'Todos los campos son requeridos' }
    }

    try {
        // 2. Fetch Tour Data for Price Safety
        // (Don't trust client-side price)
        const { data: tour, error: tourError } = await supabase
            .from('tours')
            .select('price')
            .eq('id', tourId)
            .single()

        if (tourError || !tour) {
            return { success: false, message: 'Tour no encontrado' }
        }

        // 3. Calculate Total Price
        // Valid formats: "S/ 150.00", "S/150", "150", "$150"
        // We strip non-numeric chars except dot
        const cleanPrice = tour.price.replace(/[^0-9.]/g, '')
        const priceValue = parseFloat(cleanPrice)
        const totalValue = priceValue * pax

        // Format back to original currency style (assuming S/)
        const totalPrice = `S/ ${totalValue.toFixed(2)}`

        // 4. Generate Booking Code
        // Format: BO-XXXX (4 random digits)
        const randomDigits = Math.floor(1000 + Math.random() * 9000)
        const bookingCode = `BO-${randomDigits}`

        // 5. Insert into Database (Strict Schema Compliance)
        const { error: insertError } = await supabase
            .from('bookings')
            .insert({
                booking_code: bookingCode,
                tour_id: tourId,
                tour_title: tourTitle,
                tour_date: tourDate,
                pax: pax,
                client_name: clientName, // STRICT: client_name
                client_email: clientEmail,
                client_phone: clientPhone,
                total_price: totalPrice,
                status: 'pending_payment'
            })

        if (insertError) {
            console.error('Booking Error:', insertError)
            return { success: false, message: 'Error al guardar la reserva. Intente nuevamente.' }
        }

        // 6. Generate WhatsApp Link
        const message = `Hola, quiero confirmar mi reserva:
*Código:* ${bookingCode}
*Tour:* ${tourTitle}
*Fecha:* ${tourDate}
*Pax:* ${pax} personas
*Total:* ${totalPrice}
*Nombre:* ${clientName}

Quedo a la espera de los datos de pago.`

        const encodedMessage = encodeURIComponent(message)
        // User's phone number or default company number?
        // Ideally should be in settings, but I'll use a placeholder or check if settings exist
        // For now, let's look for a settings fetch or use a hardcoded one if needed.
        // Actually, fetching settings is safer.

        const { data: settings } = await supabase.from('settings').select('whatsapp_primary').single()
        const companyPhone = settings?.whatsapp_primary || '51999999999' // Fallback

        const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodedMessage}`

        return {
            success: true,
            bookingCode,
            totalPrice,
            whatsappUrl
        }

    } catch (error) {
        console.error('Server Action Error:', error)
        return { success: false, message: 'Error interno del servidor' }
    }
}
