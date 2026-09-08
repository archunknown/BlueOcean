'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { getUserRole } from '@/utils/roles'
import { revalidatePath } from 'next/cache'

interface RegisterCustodyInput {
    tipo: 'locker' | 'mascota'
    codigoQr: string
    reservaId: string | null
}

export interface CustodyActionState {
    success: boolean
    message: string
}

export interface CustodyItem {
    id: string
    reserva_id: string | null
    tipo: 'locker' | 'mascota'
    codigo_qr: string
    estado: 'ingresado' | 'retirado'
    created_at: string
    bookings: { booking_code: string; client_name: string; tour_title: string } | null
}

export async function getActiveCustodyItems(): Promise<CustodyItem[]> {
    const role = await getUserRole()
    if (role !== 'admin' && role !== 'worker') {
        return []
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('custodia')
        .select('*, bookings:reserva_id(booking_code, client_name, tour_title)')
        .eq('estado', 'ingresado')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[CUSTODIA] Error al listar custodia activa:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        })
        return []
    }

    return (data ?? []) as unknown as CustodyItem[]
}

export async function registerCustody(input: RegisterCustodyInput): Promise<CustodyActionState> {
    // Autorización: mismo criterio que el resto del panel (admin y worker pueden operar custodia)
    const role = await getUserRole()
    if (role !== 'admin' && role !== 'worker') {
        return { success: false, message: 'No tienes permisos para registrar custodia.' }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('custodia')
        .insert({
            reserva_id: input.reservaId,
            tipo: input.tipo,
            codigo_qr: input.codigoQr,
            estado: 'ingresado'
        })

    if (error) {
        // Log completo y legible — nada de console.error(err) crudo, que en el overlay
        // de Next.js puede mostrarse como "{}" y ocultar el mensaje real.
        console.error('[CUSTODIA] Error al registrar ingreso:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        })
        return {
            success: false,
            message: error.message || 'Error al registrar el ingreso de custodia.'
        }
    }

    revalidatePath('/admin/custodia')
    return { success: true, message: 'Registro de custodia completado con éxito.' }
}

export async function checkOutCustody(id: string): Promise<CustodyActionState> {
    const role = await getUserRole()
    if (role !== 'admin' && role !== 'worker') {
        return { success: false, message: 'No tienes permisos para procesar retiros.' }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('custodia')
        .update({ estado: 'retirado' })
        .eq('id', id)

    if (error) {
        console.error('[CUSTODIA] Error al procesar retiro:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        })
        return {
            success: false,
            message: error.message || 'No se pudo procesar el retiro del equipaje.'
        }
    }

    revalidatePath('/admin/custodia')
    return { success: true, message: 'Retiro procesado correctamente.' }
}
