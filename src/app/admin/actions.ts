'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Settings } from '@/types/database'

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
        phone: formData.get('phone') as string,
        document_number: formData.get('document_number') as string,
        document_type: formData.get('document_type') as string,
        country: formData.get('country') as string,
        notes: formData.get('notes') as string,
        source: 'manual'
    }

    const { error } = await supabase
        .from('clients')
        .insert(rawData as any)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/clients')
    return { success: true }
}

export async function updateClient(id: string, formData: FormData) {
    const supabase = await createSupabaseClient() as any

    const rawData = {
        first_name: formData.get('first_name') as string,
        paternal_surname: formData.get('paternal_surname') as string,
        maternal_surname: formData.get('maternal_surname') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        document_number: formData.get('document_number') as string,
        document_type: formData.get('document_type') as string,
        country: formData.get('country') as string,
        notes: formData.get('notes') as string,
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

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
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

    const whatsapp_primary = formData.get('whatsapp_primary') as string
    const contact_email = formData.get('contact_email') as string
    const hero_video = formData.get('hero_video') as File | null
    // New: Accept URL directly from client upload
    let hero_video_url = formData.get('hero_video_url') as string | undefined

    // Handle Server-Side Video Upload (Fallback)
    if (!hero_video_url && hero_video && hero_video.size > 0) {
        // 1. Validation
        const MAX_SIZE = 5 * 1024 * 1024 // 5MB
        if (hero_video.size > MAX_SIZE) {
            return { error: 'La imagen excede el límite de 5MB' }
        }
        if (!hero_video.type.startsWith('image/')) {
            return { error: 'Formato inválido. Solo se permiten Imágenes (JPG, PNG, WEBP)' }
        }

        // 2. Upload New Image
        const fileExt = hero_video.name.split('.').pop() || 'jpg'
        const fileName = `hero_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(fileName, hero_video, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return { error: 'Error al subir la imagen: ' + uploadError.message }
        }

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(fileName)

        hero_video_url = publicUrl
    }

    // Cleanup Old Video if a new one is set
    if (hero_video_url) {
        try {
            const { data: oldSettings } = await supabase
                .from('settings')
                .select('hero_video_url')
                .eq('id', 1)
                .single()

            if (oldSettings?.hero_video_url && oldSettings.hero_video_url !== hero_video_url) {
                // Extract filename from URL (assumes standard Supabase Storage URL structure)
                const oldUrl = oldSettings.hero_video_url
                const oldFileName = oldUrl.substring(oldUrl.lastIndexOf('/') + 1)

                if (oldFileName) {
                    await supabase.storage.from('assets').remove([oldFileName])
                }
            }
        } catch (cleanupError) {
            console.error('Cleanup Warning:', cleanupError)
            // Non-fatal, continue
        }
    }

    // 5. Update Database
    const updateData: any = {
        whatsapp_primary,
        contact_email,
    }

    if (hero_video_url) {
        updateData.hero_video_url = hero_video_url
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
