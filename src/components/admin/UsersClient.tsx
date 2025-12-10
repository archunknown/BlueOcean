'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, User, Shield, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createUser, deleteUser } from '@/app/admin/users/actions'

interface Profile {
    id: string
    email: string
    role: 'admin' | 'worker'
    created_at?: string
}

export default function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [users] = useState(initialUsers) // In a real app we might use router.refresh() to update this prop

    async function handleCreate(formData: FormData) {
        setIsLoading(true)
        const result = await createUser(formData)
        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Usuario creado correctamente')
            setIsCreateOpen(false)
            // Ideally reset form here
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return

        const result = await deleteUser(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Usuario eliminado')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">Gestión de Usuarios</span>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
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
                        className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {user.role === 'admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{user.email}</h3>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                        {user.role === 'admin' ? 'Administrador' : 'Trabajador'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Eliminar usuario"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Create Modal (Simple Overlay) */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
                        <form action={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="******"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select
                                    name="role"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="worker">Trabajador (Acceso Limitado)</option>
                                    <option value="admin">Administrador (Acceso Total)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creando...' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
