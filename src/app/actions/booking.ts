'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { bookingSchema } from '@/lib/schemas/booking'

export interface CreateBookingState {
    success: boolean
    message: string
    bookingCode?: string
    totalPrice?: string
    whatsappUrl?: string
    errors?: Record<string, string[]>
}

export async function createBooking(prevState: any, formData: FormData): Promise<CreateBookingState> {
    const supabase = await createClient()

    // 1. Extract Data for Validation
    const rawData = {
        tourId: formData.get('tourId'),
        tourDate: formData.get('tourDate'),
        pax: formData.get('pax'),
        clientName: formData.get('clientName'),
        clientDocumentType: formData.get('clientDocumentType'),
        clientDocumentNumber: formData.get('clientDocumentNumber'),
        clientPhone: formData.get('clientPhone'),
        clientEmail: formData.get('clientEmail'),
    }

    // 2. Validate with Zod
    const validation = bookingSchema.safeParse(rawData)

    if (!validation.success) {
        return {
            success: false,
            message: 'Datos inválidos',
            errors: validation.error.flatten().fieldErrors
        }
    }

    const { tourId, tourDate, pax, clientName, clientDocumentType, clientDocumentNumber, clientPhone, clientEmail } = validation.data

    try {
        // 3. Fetch Tour Data (Price & Title) from Server
        // We select title AND price to ensure we don't trust the client for either.
        const { data: tour, error: tourError } = await supabase
            .from('tours')
            .select('title, price')
            .eq('id', tourId)
            .single()

        if (tourError || !tour) {
            return { success: false, message: 'Tour no encontrado o no disponible.' }
        }

        // 4. Calculate Total Price
        // Valid formats: "S/ 150.00", "S/150", "150", "$150"
        const cleanPrice = tour.price.replace(/[^0-9.]/g, '')
        const priceValue = parseFloat(cleanPrice)
        const totalValue = priceValue * pax

        // Format back to original currency style (assuming S/)
        const totalPrice = `S/ ${totalValue.toFixed(2)}`

        // 5. Generate Booking Code
        const randomDigits = Math.floor(1000 + Math.random() * 9000)
        const bookingCode = `BO-${randomDigits}`

        // 6. Find or Create Client (Upsert Logic)
        let clientId: string | null = null

        try {
            // A. Search for existing client
            const { data: existingClient } = await supabase
                .from('clients')
                .select('id')
                .eq('document_type', clientDocumentType)
                .eq('document_number', clientDocumentNumber)
                .single()

            if (existingClient) {
                clientId = existingClient.id
                // Optional: Update contact info (email/phone) to keep it fresh
                // We use 'await' but wrap in a separate try/catch or just ignore errors to not block booking
                await supabase
                    .from('clients')
                    .update({
                        email: clientEmail,
                        phone: clientPhone,
                        full_name: clientName // Update name just in case they fixed a typo
                    })
                    .eq('id', clientId)
            } else {
                // B. Create new client
                const { data: newClient, error: createError } = await supabase
                    .from('clients')
                    .insert({
                        full_name: clientName,
                        document_type: clientDocumentType,
                        document_number: clientDocumentNumber,
                        email: clientEmail,
                        phone: clientPhone
                    })
                    .select('id')
                    .single()

                if (newClient) {
                    clientId = newClient.id
                } else if (createError) {
                    console.error('Error creating client:', createError)
                    // Fallback: If creation fails (e.g. race condition), try to find again or proceed with null
                }
            }
        } catch (clientError) {
            console.error('Client Logic Error:', clientError)
            // Do not fail the booking if client logic fails
        }

        // 7. Insert into Database (Strict Schema Compliance)
        const { error: insertError } = await supabase
            .from('bookings')
            .insert({
                booking_code: bookingCode,
                tour_id: tourId,
                tour_title: tour.title, // Trusted source
                tour_date: tourDate,
                pax: pax,
                client_id: clientId, // Link to client
                client_name: clientName,
                client_document_type: clientDocumentType, // New Field
                client_document_number: clientDocumentNumber, // New Field
                client_email: clientEmail,
                client_phone: clientPhone,
                total_price: totalPrice,
                status: 'pending_payment'
            })

        if (insertError) {
            console.error('Booking Error:', insertError)
            return { success: false, message: 'Error al procesar la reserva. Intente nuevamente.' }
        }

        // 7. Generate WhatsApp Link
        const message = `Hola, quiero confirmar mi reserva:
*Código:* ${bookingCode}
*Tour:* ${tour.title}
*Fecha:* ${tourDate}
*Pax:* ${pax} personas
*Total:* ${totalPrice}
*Cliente:* ${clientName}
${clientDocumentType}: ${clientDocumentNumber}

Quedo a la espera de los datos de pago.`

        const encodedMessage = encodeURIComponent(message)

        // Fetch Settings
        const { data: settings } = await supabase.from('settings').select('whatsapp_primary').single()
        const companyPhone = settings?.whatsapp_primary || '51999999999'

        const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodedMessage}`

        return {
            success: true,
            message: 'Reserva pre-confirmada. Redirigiendo...',
            bookingCode,
            totalPrice,
            whatsappUrl
        }

    } catch (error) {
        console.error('Server Action Error:', error)
        return { success: false, message: 'Error interno del servidor' }
    }
}
