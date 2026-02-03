'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { Settings } from '@/types/database'

// --- Clients Actions ---
// ... (previous client functions unedited) ...



// --- Clients Actions ---

export async function getClients() {
    const supabase = await createSupabaseClient()

    // Most recent first
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching clients:', error)
        return []
    }

    return data
}

export async function createClient(formData: FormData) {
    const supabase = await createSupabaseClient()

    const rawData = {
        first_name: formData.get('first_name') as string,
        paternal_surname: formData.get('paternal_surname') as string,
        maternal_surname: formData.get('maternal_surname') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || null,
        document_number: (formData.get('document_number') as string) || null,
        document_type: (formData.get('document_type') as string) || null,
        country: (formData.get('country') as string) || null,
        notes: (formData.get('notes') as string) || null,
        source: 'manual'
    }

    const { error } = await supabase
        .from('clients')
        .insert(rawData)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/clients')
    return { success: true }
}

export async function updateClient(id: string, formData: FormData) {
    const supabase = await createSupabaseClient()

    const rawData = {
        first_name: formData.get('first_name') as string,
        paternal_surname: formData.get('paternal_surname') as string,
        maternal_surname: formData.get('maternal_surname') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || null,
        document_number: (formData.get('document_number') as string) || null,
        document_type: (formData.get('document_type') as string) || null,
        country: (formData.get('country') as string) || null,
        notes: (formData.get('notes') as string) || null,
    }

    const { error } = await supabase
        .from('clients')
        .update(rawData)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/clients')
    return { success: true }
}

export async function deleteClient(id: string) {
    const supabase = await createSupabaseClient()

    // 1. Security Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'No autorizado' }
    }

    const adminSupabase = createAdminClient()

    const { data, error } = await adminSupabase
        .from('clients')
        .delete()
        .eq('id', id)
        .select()

    if (error) {
        // Handle Foreign Key Constraint Violation (Error 23503)
        if (error.code === '23503') {
            return { error: 'No se puede eliminar el cliente porque tiene reservas asociadas.' }
        }
        return { error: error.message }
    }

    if (!data || data.length === 0) {
        return { error: 'No se pudo eliminar el cliente. Verifique si ya fue eliminado.' }
    }

    revalidatePath('/admin/clients')
    return { success: true }
}

// --- Settings Actions ---

export async function getGlobalSettings(): Promise<Settings | null> {
    const supabase = await createSupabaseClient()

    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single()

    if (error) {
        console.error('Error fetching settings:', error)
        return null
    }

    return data as Settings
}

export async function updateGlobalSettings(formData: FormData) {
    const supabase = await createSupabaseClient() as any

    const updateData: any = {}

    // 1. General Settings
    if (formData.has('whatsapp_primary')) {
        updateData.whatsapp_primary = formData.get('whatsapp_primary') as string
    }
    if (formData.has('contact_email')) {
        updateData.contact_email = formData.get('contact_email') as string
    }

    // 2. Payments Settings
    if (formData.has('yape_number')) {
        updateData.yape_number = formData.get('yape_number') as string
    }

    // Yape QR Handling
    let yape_qr_url = formData.get('yape_qr_url') as string | undefined
    if (yape_qr_url) {
        updateData.yape_qr_url = yape_qr_url
        // GC Logic for Yape QR
        try {
            const { data: oldSettings } = await supabase
                .from('settings')
                .select('yape_qr_url')
                .eq('id', 1)
                .single()

            if (oldSettings?.yape_qr_url && oldSettings.yape_qr_url !== yape_qr_url) {
                const urlObj = new URL(oldSettings.yape_qr_url)
                const pathParts = urlObj.pathname.split('/settings/')
                if (pathParts.length > 1) {
                    const relativePath = decodeURIComponent(pathParts[1])
                    await supabase.storage.from('settings').remove([relativePath])
                    console.log('GC: Removed old QR', relativePath)
                }
            }
        } catch (e) {
            console.error('GC Error:', e)
        }
    }

    // 3. Multimedia Handling
    const hero_video = formData.get('hero_video') as File | null
    let hero_video_url = formData.get('hero_video_url') as string | undefined

    // Existing Video Logic (Fallback for server-side upload if needed, though mostly client-side now)
    if (!hero_video_url && hero_video && hero_video.size > 0) {
        const MAX_SIZE = 5 * 1024 * 1024
        if (hero_video.size > MAX_SIZE) return { error: 'La imagen excede el límite de 5MB' }
        if (!hero_video.type.startsWith('image/')) return { error: 'Formato inválido' }

        const fileExt = hero_video.name.split('.').pop() || 'jpg'
        const fileName = `hero_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('assets').upload(fileName, hero_video, { upsert: false })

        if (uploadError) return { error: 'Error al subir imagen: ' + uploadError.message }
        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)
        hero_video_url = publicUrl
    }

    if (hero_video_url) {
        updateData.hero_video_url = hero_video_url
        // Cleanup Old Video
        try {
            const { data: oldSettings } = await supabase.from('settings').select('hero_video_url').eq('id', 1).single()
            if (oldSettings?.hero_video_url && oldSettings.hero_video_url !== hero_video_url) {
                const oldUrl = oldSettings.hero_video_url
                const oldFileName = oldUrl.substring(oldUrl.lastIndexOf('/') + 1)
                if (oldFileName) await supabase.storage.from('assets').remove([oldFileName])
            }
        } catch (cleanupError) { console.error('Cleanup Warning:', cleanupError) }
    }

    // Verify there is something to update
    if (Object.keys(updateData).length === 0) {
        return { success: true } // Nothing to update
    }

    const { error } = await supabase
        .from('settings')
        .update(updateData)
        .eq('id', 1)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

// --- External API Actions ---

export async function fetchDniData(dni: string) {
    const token = process.env.DNI_API_TOKEN
    const apiUrl = process.env.DNI_API_URL || 'https://api.apis.net.pe/v1/dni'

    if (!token) {
        console.error('DNI_API_TOKEN not found')
        return { error: 'Configuración de API faltante' }
    }

    try {
        const response = await fetch(`${apiUrl}?numero=${dni}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            return { error: 'DNI no encontrado o servicio no disponible' }
        }

        const data = await response.json()

        // Debugging API response
        console.log('API Response for DNI:', dni, data)

        // Robust Mapping for various Peruvian APIs
        const firstName = data.nombres || data.nombre
        const patSurname = data.ape_paterno || data.apellido_paterno || data.apellidoPaterno || data.paterno
        const matSurname = data.ape_materno || data.apellido_materno || data.apellidoMaterno || data.materno

        if (firstName || patSurname) {
            return {
                success: true,
                data: {
                    first_name: firstName || '',
                    paternal_surname: patSurname || '',
                    maternal_surname: matSurname || ''
                }
            }
        }

        return { error: 'Datos no encontrados en el padrón' }
    } catch (error) {
        console.error('DNI Lookup Error:', error)
        return { error: 'Error al conectar con RENIEC' }
    }
}
