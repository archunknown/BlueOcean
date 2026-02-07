'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { bookingSchema } from '@/lib/schemas/booking'
import { createPreference } from '@/lib/mercadopago'

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
        tourTime: formData.get('tourTime'),
        pax: formData.get('pax'),
        clientFirstName: formData.get('clientFirstName'),
        clientPaternalSurname: formData.get('clientPaternalSurname'),
        clientMaternalSurname: formData.get('clientMaternalSurname'),
        clientCountry: formData.get('clientCountry'),
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

    const {
        tourId,
        tourDate,
        tourTime,
        pax,
        clientFirstName,
        clientPaternalSurname,
        clientMaternalSurname,
        clientCountry,
        clientDocumentType,
        clientDocumentNumber,
        clientPhone,
        clientEmail
    } = validation.data

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
        // Price is now a number from DB
        const totalValue = tour.price * pax

        // Format for display/message
        const formattedTotalPrice = `S/ ${totalValue.toFixed(2)}`

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
                // Update client info to ensure names are clean and contact info is fresh
                await supabase
                    .from('clients')
                    .update({
                        first_name: clientFirstName,
                        paternal_surname: clientPaternalSurname,
                        maternal_surname: clientMaternalSurname,
                        email: clientEmail,
                        phone: clientPhone,
                        country: clientCountry || null // Update country if provided
                    })
                    .eq('id', clientId)
            } else {
                // B. Create new client
                const { data: newClient, error: createError } = await supabase
                    .from('clients')
                    .insert({
                        first_name: clientFirstName,
                        paternal_surname: clientPaternalSurname,
                        maternal_surname: clientMaternalSurname,
                        document_type: clientDocumentType,
                        document_number: clientDocumentNumber,
                        email: clientEmail,
                        phone: clientPhone,
                        country: clientCountry || null,
                        source: 'web'
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

        // Construct full name for backward compatibility
        const fullClientName = `${clientFirstName} ${clientPaternalSurname} ${clientMaternalSurname}`

        // 7. Insert into Database (Strict Schema Compliance)
        // Ensure that clientId is essentially required now, but we handle null just in case of tough server errors
        if (!clientId) {
            throw new Error("No se pudo registrar la identidad del cliente.")
        }

        const { data: bookingData, error: insertError } = await supabase
            .from('bookings')
            .insert({
                booking_code: bookingCode,
                tour_id: tourId,
                tour_title: tour.title,
                tour_date: tourDate,
                tour_time: tourTime,
                pax: pax,
                client_id: clientId,
                client_name: fullClientName, // Backward compatibility
                client_first_name: clientFirstName,
                client_paternal_surname: clientPaternalSurname,
                client_maternal_surname: clientMaternalSurname,
                client_email: clientEmail,
                client_phone: clientPhone,
                total_price: totalValue, // Number
                status: 'pending_payment',
                payment_status: 'pending',
                payment_id: null
            })
            .select()
            .single()

        if (insertError || !bookingData) {
            console.error('Booking Error:', insertError)
            return { success: false, message: 'Error al procesar la reserva. Intente nuevamente.' }
        }

        // 8. Create Mercado Pago Preference
        const bookingForPayment = {
            ...bookingData,
            client_document_type: clientDocumentType,
            client_document_number: clientDocumentNumber
        }

        const preference = await createPreference(bookingForPayment, tour.title)

        if (preference.init_point) {
            redirect(preference.init_point)
        } else {
            return { success: false, message: 'Error al conectar con la pasarela de pago.' }
        }

    } catch (error) {
        if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Server Action Error:', error)
        return { success: false, message: 'Error interno del servidor' }
    }
}
