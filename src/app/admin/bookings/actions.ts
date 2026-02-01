'use server'

import { createClient } from '@/utils/supabase/server'
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
