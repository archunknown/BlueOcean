'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const RATE_LIMIT_COOKIE = 'last_testimonial_submission'
const RATE_LIMIT_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function submitTestimonial(formData: FormData) {
    const supabase = await createClient()
    const cookieStore = await cookies()

    // 1. Anti-Spam: Check Cookie
    const lastSubmission = cookieStore.get(RATE_LIMIT_COOKIE)
    if (lastSubmission) {
        const lastTime = parseInt(lastSubmission.value)
        const now = Date.now()
        if (now - lastTime < RATE_LIMIT_DURATION) {
            return { error: 'Ya has enviado una opinión recientemente. ¡Gracias por tu entusiasmo!' }
        }
    }

    const name = formData.get('name') as string
    const location = formData.get('location') as string
    const rating = parseInt(formData.get('rating') as string)
    const content = formData.get('content') as string

    // Honeypot check (field should be empty and hidden in UI, implemented in form next)
    const honeypot = formData.get('website_url') as string
    if (honeypot) {
        // Silently fail for bots
        return { success: true }
    }

    if (!name || !rating || !content) {
        return { error: 'Faltan campos obligatorios' }
    }

    try {
        const { error } = await supabase
            .from('testimonials')
            .insert({
                name,
                location: location || '',
                rating,
                content,
                is_approved: false // Default to false
            })

        if (error) throw error

        // 2. Anti-Spam: Set Cookie
        cookieStore.set(RATE_LIMIT_COOKIE, Date.now().toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours in seconds
        })

        return { success: true }
    } catch (error: any) {
        console.error('Error submitting testimonial:', error)
        return { error: error.message || 'Error al enviar testimonio' }
    }
}

export async function approveTestimonial(id: number) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('testimonials')
            .update({ is_approved: true })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/testimonials')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function rejectTestimonial(id: number) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/testimonials')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}