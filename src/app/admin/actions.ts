'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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
        full_name: formData.get('full_name') as string,
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
        full_name: formData.get('full_name') as string,
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

export async function getGlobalSettings() {
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

    return data
}

export async function updateGlobalSettings(formData: FormData) {
    const supabase = await createSupabaseClient()

    const rawData = {
        whatsapp_primary: formData.get('whatsapp_primary') as string,
        contact_email: formData.get('contact_email') as string,
    }

    const { error } = await supabase
        .from('settings')
        .update(rawData)
        .eq('id', 1)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
