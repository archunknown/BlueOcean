'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as 'admin' | 'worker'

    if (!email || !password || !role) {
        return { error: 'Todos los campos son obligatorios' }
    }

    try {
        // Use Admin Client to bypass RLS and avoid session switching
        const supabaseAdmin = createAdminClient()

        // 1. Create Auth User
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: { role }
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('No se pudo crear el usuario')

        // 2. Update Profile Role
        // The trigger likely created the profile with default role. We update it.
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role })
            .eq('id', authData.user.id)

        if (profileError) throw profileError

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        console.error('Create User Error:', error)
        return { error: error.message || 'Error al crear usuario' }
    }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    try {
        // Note: improved security would require Service Role to delete from auth.users.
        // We can only delete from public.profiles here with the standard client.
        // If the project has a "On Delete Profile -> Delete Auth User" trigger, it works.
        // Otherwise, we just delete the profile access.

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (error) throw error

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
