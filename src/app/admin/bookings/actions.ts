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
