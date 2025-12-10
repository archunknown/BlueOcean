'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to sanitize price input
function formatPriceForDB(priceInput: any): number {
    if (!priceInput) return 0
    const priceStr = String(priceInput).replace(/[^0-9.]/g, '')
    return parseFloat(priceStr) || 0
}

// Helper to create URL-friendly slugs
function createSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD') // Decompose combined characters (e.g., 'á' -> 'a' + '´')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)/g, '') // Remove leading/trailing hyphens
}

// Helper to handle image upload
async function uploadImage(file: File): Promise<string> {
    const supabase = await createClient()
    const fileName = `tours/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    // Assuming 'tours-images' bucket exists
    const { data, error } = await supabase.storage
        .from('tours-images')
        .upload(fileName, file)

    if (error) {
        console.error('Upload error:', error)
        throw new Error('Error al subir la imagen')
    }

    const { data: { publicUrl } } = supabase.storage
        .from('tours-images')
        .getPublicUrl(fileName)

    return publicUrl
}

export async function createTour(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const price = formData.get('price')
    const short_description = formData.get('short_description') as string
    const long_description = formData.get('long_description') as string
    const duration = formData.get('duration') as string
    const capacity = formData.get('capacity')
    const imageFile = formData.get('image') as File
    const schedule = formData.get('schedule') as string
    const itineraryStr = formData.get('itinerary') as string
    const detailsStr = formData.get('details') as string

    // Parse JSON fields
    let itinerary = null
    let details = null
    try {
        if (itineraryStr) itinerary = JSON.parse(itineraryStr)
        if (detailsStr) details = JSON.parse(detailsStr)
    } catch (e) {
        console.error('Error parsing JSON fields', e)
    }

    if (!title || !price || !short_description || !imageFile) {
        return { error: 'Faltan campos obligatorios' }
    }

    try {
        const imageUrl = await uploadImage(imageFile)
        const formattedPrice = formatPriceForDB(price)
        const slug = createSlug(title)
        const category = formData.get('category') as string // Get category

        // Using any to bypass strict type mismatch (string vs number for price/id)
        const tourData: any = {
            slug,
            title,
            category: category || 'Tour', // Use form value
            price: String(formattedPrice), // Ensure string if DB expects string
            short_description,
            long_description: long_description || '',
            duration: duration || '',
            schedule: schedule || '',
            group_size: capacity ? String(capacity) : null, // Mapped to group_size
            image_url: imageUrl, // Mapped to image_url
            itinerary: itinerary,
            details: details
        }

        const { error } = await supabase
            .from('tours')
            .insert(tourData)

        if (error) {
            console.error('DB Insert Error:', error)
            return { error: 'Error al guardar en base de datos: ' + error.message }
        }

        revalidatePath('/admin/tours')
        revalidatePath('/tours')
        return { success: true }
    } catch (error: any) {
        console.error('Create Tour Error:', error)
        return { error: error.message || 'Error al crear el tour' }
    }
}

export async function updateTour(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const price = formData.get('price')
    const short_description = formData.get('short_description') as string
    const long_description = formData.get('long_description') as string
    const duration = formData.get('duration') as string
    const capacity = formData.get('capacity')
    const schedule = formData.get('schedule') as string
    const imageFile = formData.get('image') as File | null
    const itineraryStr = formData.get('itinerary') as string
    const detailsStr = formData.get('details') as string

    // Parse JSON fields
    let itinerary = null
    let details = null
    try {
        if (itineraryStr) itinerary = JSON.parse(itineraryStr)
        if (detailsStr) details = JSON.parse(detailsStr)
    } catch (e) {
        console.error('Error parsing JSON fields', e)
    }

    if (!id || !title || !price || !short_description) {
        return { error: 'Faltan campos obligatorios' }
    }

    try {
        // 1. Get current tour to preserve image if not updated
        const { data, error: fetchError } = await supabase
            .from('tours')
            .select('slug, image_url')
            .eq('id', id)
            .single()

        const currentTour: any = data

        if (fetchError || !currentTour) {
            return { error: 'Tour no encontrado' }
        }

        let imageUrl = currentTour.image_url

        // 2. Upload new image if provided
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImage(imageFile)
        }

        const formattedPrice = formatPriceForDB(price)

        // Using any to bypass strict checks
        const updateData: any = {
            title,
            category: category || 'Tour',
            price: String(formattedPrice),
            short_description,
            long_description: long_description || '',
            duration: duration || '',
            schedule: schedule || '',
            group_size: capacity ? String(capacity) : null,
            image_url: imageUrl,
            itinerary: itinerary,
            details: details
        }

        // 3. Update record
        const { error: updateError } = await (supabase
            .from('tours') as any)
            .update(updateData)
            .eq('id', id)

        if (updateError) {
            return { error: 'Error al actualizar: ' + updateError.message }
        }

        revalidatePath('/admin/tours')
        revalidatePath('/tours')
        // Revalidate specific tour page
        if (currentTour.slug) {
            revalidatePath(`/tours/${currentTour.slug}`)
        }

        return { success: true }
    } catch (error: any) {
        console.error('Update Tour Error:', error)
        return { error: error.message || 'Error al actualizar el tour' }
    }
}

export async function deleteTour(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('tours')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/tours')
        revalidatePath('/tours')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
