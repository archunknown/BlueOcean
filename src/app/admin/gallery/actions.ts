'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to delete old image from storage
async function deleteOldImage(imageUrl: string) {
    if (!imageUrl) return;
    try {
        const supabase = await createClient();
        const urlObj = new URL(imageUrl);
        const pathParts = urlObj.pathname.split('/tours-images/');
        if (pathParts.length < 2) return;

        const relativePath = pathParts[1];

        const { error } = await supabase.storage
            .from('tours-images')
            .remove([relativePath]);

        if (error) {
            console.error('Failed to cleanup old gallery image:', error);
        }
    } catch (e) {
        console.error('Error in deleteOldImage:', e);
    }
}

async function uploadGalleryImage(file: File): Promise<string> {
    const supabase = await createClient()

    // Validation
    if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen')
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('La imagen no debe superar los 5MB')
    }

    const fileName = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    const { error } = await supabase.storage
        .from('tours-images')
        .upload(fileName, file)

    if (error) {
        console.error('Upload error:', error)
        throw new Error('Error al subir la imagen a galería')
    }

    const { data: { publicUrl } } = supabase.storage
        .from('tours-images')
        .getPublicUrl(fileName)

    return publicUrl
}

export async function createImage(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const imageFile = formData.get('image') as File

    if (!title || !imageFile) {
        return { error: 'Faltan campos obligatorios' }
    }

    try {
        const imageUrl = await uploadGalleryImage(imageFile)

        const { error } = await supabase
            .from('gallery')
            .insert({
                title,
                category: category || 'Social',
                image_url: imageUrl
            })

        if (error) throw error

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true }
    } catch (error: any) {
        console.error('Create Image Error:', error)
        return { error: error.message || 'Error al guardar la imagen' }
    }
}

// NEW: Update Action (Handles storage cleanup)
export async function updateImage(id: string, formData: FormData) {
    const supabase = await createClient()

    try {
        // 1. Fetch current for cleanup
        const { data: current, error: fetchError } = await supabase
            .from('gallery')
            .select('image_url')
            .eq('id', id)
            .single()

        if (fetchError || !current) return { error: 'Imagen no encontrada' }

        const title = formData.get('title') as string
        const category = formData.get('category') as string
        const imageFile = formData.get('image') as File | null

        let imageUrl = current.image_url
        let imageChanged = false

        // 2. Upload New if present
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadGalleryImage(imageFile)
            imageChanged = true
        }

        // 3. Update DB
        const { error } = await supabase
            .from('gallery')
            .update({
                title,
                category,
                image_url: imageUrl
            })
            .eq('id', id)

        if (error) throw error

        // 4. Cleanup Old
        if (imageChanged) {
            await deleteOldImage(current.image_url)
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteImage(id: string) {
    const supabase = await createClient()

    try {
        // 1. Fetch URL from DB for safety
        const { data: current, error: fetchError } = await supabase
            .from('gallery')
            .select('image_url')
            .eq('id', id)
            .single()

        if (fetchError) throw new Error('Imagen no encontrada')

        // 2. Delete from DB
        const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', id)

        if (error) throw error

        // 3. Delete from Storage
        if (current && current.image_url) {
            await deleteOldImage(current.image_url)
        }

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
