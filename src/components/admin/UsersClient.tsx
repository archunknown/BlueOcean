'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, User, Shield, AlertCircle, Edit2, Save, Loader2, RefreshCw, Key } from 'lucide-react'
import { toast } from 'sonner'
import { createUser, deleteUser, updateUser, adminResetPassword } from '@/app/admin/users/actions'
import { fetchDniData } from '@/app/admin/actions'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Profile {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    dni: string | null
    role: 'admin' | 'worker'
    created_at?: string
}

export default function UsersClient({ initialUsers, currentUserId }: { initialUsers: Profile[], currentUserId?: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editingUser, setEditingUser] = useState<Profile | null>(null)
    const [isSearchingDni, setIsSearchingDni] = useState(false)

    const [userToDelete, setUserToDelete] = useState<string | null>(null)

    // Form Refs
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)

    function toTitleCase(str: string) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    async function handleDniChange(e: React.ChangeEvent<HTMLInputElement>) {
        const dni = e.target.value
        if (dni.length === 8) {
            setIsSearchingDni(true)
            toast.info('Consultando RENIEC...')
            const result = await fetchDniData(dni)
            setIsSearchingDni(false)

            if (result.success && result.data) {
                if (firstNameRef.current) firstNameRef.current.value = toTitleCase(result.data.first_name)
                // Combine paternal and maternal surnames for last_name
                const fullLastName = `${result.data.paternal_surname} ${result.data.maternal_surname}`.trim()
                if (lastNameRef.current) lastNameRef.current.value = toTitleCase(fullLastName)
                toast.success('Datos encontrados')
            } else {
                toast.warning('DNI no encontrado. Ingrese los datos manualmente')
            }
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        let result

        if (editingUser) {
            // Update
            result = await updateUser(editingUser.id, formData)

            // Check if password reset is requested
            const newPassword = formData.get('new_password') as string
            if (newPassword && newPassword.trim() !== '') {
                const passResult = await adminResetPassword(editingUser.id, newPassword)
                if (passResult.error) toast.error(`Error contraseña: ${passResult.error}`)
                else toast.success('Contraseña actualizada')
            }
        } else {
            // Create
            result = await createUser(formData)
        }

        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(editingUser ? 'Usuario actualizado' : 'Usuario creado')
            setIsModalOpen(false)
            setEditingUser(null)
            setTimeout(() => window.location.reload(), 500)
        }
    }

    function openCreate() {
        setEditingUser(null)
        setIsModalOpen(true)
    }

    function openEdit(user: Profile) {
        setEditingUser(user)
        setIsModalOpen(true)
    }

    function handleDelete(id: string) {
        setUserToDelete(id)
    }

    async function confirmDelete() {
        if (!userToDelete) return
        const result = await deleteUser(userToDelete)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Usuario eliminado')
            setTimeout(() => window.location.reload(), 500)
        }
        setUserToDelete(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">Gestión de Usuarios</span>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Users List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {initialUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${user.id === currentUserId ? 'ring-2 ring-blue-500/20' : ''}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {user.role === 'admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Sin nombre'}
                                        </h3>
                                        {user.id === currentUserId && (
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">TÚ</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                {user.role === 'admin' ? 'Administrador' : 'Trabajador'}
                            </span>

                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEdit(user)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                    title="Editar usuario"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                {user.id !== currentUserId && (
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                        title="Eliminar usuario"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal (Create/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="w-full max-w-lg rounded-xl bg-white shadow-2xl mx-4 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form action={handleSubmit} className="p-6 space-y-4">
                            {/* DNI & Search */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">DNI (Autocompletar)</label>
                                    <div className="relative">
                                        <input
                                            name="dni"
                                            defaultValue={editingUser?.dni || ''}
                                            onChange={handleDniChange}
                                            maxLength={8}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="12345678"
                                        />
                                        {isSearchingDni && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Rol</label>
                                    <select
                                        name="role"
                                        defaultValue={editingUser?.role || 'worker'}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="worker">Trabajador</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombres</label>
                                    <input
                                        ref={firstNameRef}
                                        name="first_name"
                                        defaultValue={editingUser?.first_name || ''}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Apellidos</label>
                                    <input
                                        ref={lastNameRef}
                                        name="last_name"
                                        defaultValue={editingUser?.last_name || ''}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingUser?.email || ''}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Password Section */}
                            <div className="pt-4 mt-4 border-t border-dashed border-gray-200">
                                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <Key className="h-3 w-3" />
                                    {editingUser ? 'Restablecer Contraseña (Opcional)' : 'Contraseña'}
                                </label>
                                <input
                                    name={editingUser ? 'new_password' : 'password'}
                                    type="password"
                                    minLength={6}
                                    required={!editingUser}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder={editingUser ? "Dejar vacío para mantener actual" : "Mínimo 6 caracteres"}
                                />
                                {editingUser && (
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Escribe aquí solo si deseas cambiar la contraseña de este usuario.
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-500/20"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta y el acceso de este usuario.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
