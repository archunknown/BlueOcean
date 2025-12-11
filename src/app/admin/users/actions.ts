'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as 'admin' | 'worker'
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const dni = formData.get('dni') as string

    if (!email || !password || !role) {
        return { error: 'Email, contraseña y rol son obligatorios' }
    }

    try {
        const supabaseAdmin = createAdminClient()

        // 1. Create Auth User
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role }
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('No se pudo crear el usuario')

        // 2. Update Profile with extra data
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                role,
                first_name,
                last_name,
                dni
            })
            .eq('id', authData.user.id)

        if (profileError) throw profileError

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        console.error('Create User Error:', error)
        return { error: error.message || 'Error al crear usuario' }
    }
}

export async function updateUser(id: string, formData: FormData) {
    const email = formData.get('email') as string
    const role = formData.get('role') as 'admin' | 'worker'
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const dni = formData.get('dni') as string

    try {
        const supabaseAdmin = createAdminClient()

        // 1. Update Auth Email if changed (Requires Service Role)
        if (email) {
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email })
            if (authError) throw authError
        }

        // 2. Update Profile Data
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                email, // Sync email in profile
                role,
                first_name,
                last_name,
                dni
            })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function adminResetPassword(id: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    try {
        const supabaseAdmin = createAdminClient()

        const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
            password: newPassword
        })

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Error al restablecer contraseña' }
    }
}

export async function deleteUser(userId: string) {
    const supabaseAdmin = createAdminClient()

    try {
        // Delete from Auth (cascades to profile usually if set up, or we delete profile manually)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) throw error

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
