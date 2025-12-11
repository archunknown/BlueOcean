'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function uploadGalleryImage(file: File): Promise<string> {
    const supabase = await createClient()
    const fileName = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    const { data, error } = await supabase.storage
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
        revalidatePath('/gallery') // If public gallery exists
        return { success: true }
    } catch (error: any) {
        console.error('Create Image Error:', error)
        return { error: error.message || 'Error al guardar la imagen' }
    }
}

export async function deleteImage(id: string, imageUrl: string) {
    const supabase = await createClient()

    try {
        // 1. Delete from Storage
        // Extract filename from URL (e.g., .../tours-images/gallery/filename.jpg -> gallery/filename.jpg)
        // Usually URL is publicUrl. Storage expects path relative to bucket root?
        // Wait, 'from('tours-images').remove(['gallery/file.jpg'])'
        // Let's assume URL format matches what we need to extract.
        if (imageUrl) {
            const urlParts = imageUrl.split('/tours-images/')
            if (urlParts.length > 1) {
                const storagePath = urlParts[1] // "gallery/filename..."
                await supabase.storage
                    .from('tours-images')
                    .remove([storagePath])
            }
        }

        // 2. Delete from DB
        const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/gallery')
        revalidatePath('/gallery')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
