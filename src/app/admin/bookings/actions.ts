'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function confirmBooking(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', id)

        if (error) {
            console.error('Error confirming booking:', error)
            return { success: false, message: 'Error al confirmar reserva' }
        }

        revalidatePath('/admin/bookings')
        return { success: true, message: 'Reserva confirmada' }
    } catch (error) {
        console.error('Server error:', error)
        return { success: false, message: 'Error interno del servidor' }
    }
}

export async function approvePayment(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('bookings')
            .update({
                payment_status: 'approved',
            })
            .eq('id', id)

        if (error) {
            console.error('Error approving payment:', error)
            return { success: false, message: 'Error al registrar pago' }
        }

        revalidatePath('/admin/bookings')
        return { success: true, message: 'Pago registrado exitosamente' }
    } catch (error) {
        console.error('Server error:', error)
        return { success: false, message: 'Error interno del servidor' }
    }
}

export async function deleteBooking(id: string) {
    const supabase = await createClient() // Standard client for Auth check

    // 1. Security Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, message: 'No autorizado' }
    }

    const adminSupabase = createAdminClient() // Admin client for DB operation

    try {
        const { data, error } = await adminSupabase
            .from('bookings')
            .delete()
            .eq('id', id)
            .select()

        if (error) {
            console.error('Error deleting booking:', error)
            return { success: false, message: 'Error al eliminar reserva (Base de Datos)' }
        }

        // Check if a row was actually deleted
        if (!data || data.length === 0) {
            return { success: false, message: 'No se pudo eliminar. Verifique si ya fue eliminada.' }
        }

        revalidatePath('/admin/bookings')
        return { success: true, message: 'Reserva eliminada' }
    } catch (error) {
        console.error('Server error:', error)
        return { success: false, message: 'Error interno del servidor' }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reserva Presencial / Manual (Walk-in)
// Solo para roles: admin | worker
// No toca el flujo de MercadoPago ni el createBooking público.
// ─────────────────────────────────────────────────────────────────────────────

import { bookingSchema } from '@/lib/schemas/booking'
import { getUserRole } from '@/utils/roles'
import { sendBookingConfirmation } from '@/lib/email'

export interface ManualBookingState {
    success: boolean
    message: string
    bookingCode?: string
    bookingId?: string
    errors?: Record<string, string[]>
}

const initialManualBookingState: ManualBookingState = {
    success: false,
    message: '',
}

export async function createManualBooking(
    prevState: ManualBookingState,
    formData: FormData
): Promise<ManualBookingState> {
    // ── 1. Guardia de rol ─────────────────────────────────────────────────────
    const role = await getUserRole()
    if (!role || !['admin', 'worker'].includes(role)) {
        return { success: false, message: 'No autorizado. Se requiere rol admin o worker.' }
    }

    // ── 2. Extracción y validación con bookingSchema ───────────────────────────
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

    const validation = bookingSchema.safeParse(rawData)
    if (!validation.success) {
        return {
            success: false,
            message: 'Revisa los campos del formulario.',
            errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
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
        clientEmail,
    } = validation.data

    const supabase = await createClient()

    try {
        // ── 3. Precio autoritativo desde DB ──────────────────────────────────
        const { data: tour, error: tourError } = await supabase
            .from('tours')
            .select('id, title, price')
            .eq('id', tourId)
            .eq('is_active', true)
            .single()

        if (tourError || !tour) {
            return { success: false, message: 'Tour no encontrado o inactivo.' }
        }

        // Sin comisión de MercadoPago — precio limpio
        const totalPrice = tour.price * pax

        // ── 4. Código de reserva ──────────────────────────────────────────────
        const bookingCode = `BO-${Math.floor(1000 + Math.random() * 9000)}`

        // ── 5. Upsert de cliente (mismo patrón que createBooking) ─────────────
        let clientId: string

        const { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('document_type', clientDocumentType)
            .eq('document_number', clientDocumentNumber)
            .maybeSingle()

        if (existingClient) {
            clientId = existingClient.id
            await supabase
                .from('clients')
                .update({
                    first_name: clientFirstName,
                    paternal_surname: clientPaternalSurname,
                    maternal_surname: clientMaternalSurname,
                    email: clientEmail,
                    phone: clientPhone,
                    country: clientCountry || null,
                })
                .eq('id', clientId)
        } else {
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
                    source: 'walk-in',
                })
                .select('id')
                .single()

            if (createError || !newClient) {
                console.error('[manual-booking] Error creando cliente:', createError)
                return { success: false, message: 'Error al registrar el cliente.' }
            }
            clientId = newClient.id
        }

        // ── 6. Inserción con status=confirmed, payment_provider='manual' ──────
        const fullClientName = `${clientFirstName} ${clientPaternalSurname} ${clientMaternalSurname}`

        const { data: booking, error: insertError } = await supabase
            .from('bookings')
            .insert({
                booking_code: bookingCode,
                tour_id: tourId,
                tour_title: tour.title,
                tour_date: tourDate,
                tour_time: tourTime,
                pax,
                client_id: clientId,
                client_name: fullClientName,
                client_first_name: clientFirstName,
                client_paternal_surname: clientPaternalSurname,
                client_maternal_surname: clientMaternalSurname,
                client_email: clientEmail,
                client_phone: clientPhone,
                total_price: totalPrice,
                status: 'confirmed',
                payment_status: 'approved',
                payment_id: null,
                payment_provider: 'manual',
            })
            .select()
            .single()

        if (insertError || !booking) {
            console.error('[manual-booking] Error insertando reserva:', insertError)
            return { success: false, message: 'Error al registrar la reserva. Intente nuevamente.' }
        }

        // ── 7. Email de confirmación (fire-and-forget — no bloquea la respuesta) ──
        // Si el email falla, la reserva YA está guardada. No revertimos.
        const voucherLink = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/thank-you?bookingId=${booking.id}`
        const clientForEmail = { first_name: clientFirstName, email: clientEmail }

        sendBookingConfirmation(booking, tour, clientForEmail, voucherLink).catch((emailError) => {
            console.error('[manual-booking] Fallo al enviar email de confirmación:', emailError)
        })

        // ── 8. Revalidar y retornar éxito ─────────────────────────────────────
        revalidatePath('/admin/bookings')

        return {
            success: true,
            message: `Reserva ${bookingCode} registrada y confirmada.`,
            bookingCode: booking.booking_code,
            bookingId: booking.id,
        }
    } catch (error) {
        console.error('[manual-booking] Error inesperado:', error)
        return { success: false, message: 'Error interno del servidor.' }
    }
}
