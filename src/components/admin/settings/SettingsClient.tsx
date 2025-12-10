'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, User, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateGlobalSettings } from '@/app/admin/actions'
import { Settings } from '@/types/database'

interface SettingsClientProps {
    initialSettings: Settings | null
    userRole: 'admin' | 'worker' | null
    userEmail?: string
}

export default function SettingsClient({ initialSettings, userRole, userEmail }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<'company' | 'account'>('company')
    const [isLoading, setIsLoading] = useState(false)

    async function handleUpdate(formData: FormData) {
        setIsLoading(true)
        const result = await updateGlobalSettings(formData)
        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Configuración actualizada')
            // No strict need to reload as revalidatePath handles it, but optimistic UI would be better.
            // Since it's settings, a toast is enough.
        }
    }

    return (
        <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors gap-2
                            ${activeTab === 'company'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <Building2 className="h-4 w-4" />
                        Empresa
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors gap-2
                            ${activeTab === 'account'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <User className="h-4 w-4" />
                        Mi Cuenta
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                {activeTab === 'company' && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Configuración Global</h2>
                            <p className="text-sm text-gray-500">Información pública de contacto y ajustes generales.</p>
                        </div>

                        {userRole === 'admin' ? (
                            <form action={handleUpdate} className="space-y-6 max-w-xl">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Principal</label>
                                    <input
                                        name="whatsapp_primary"
                                        defaultValue={initialSettings?.whatsapp_primary || ''}
                                        type="text"
                                        placeholder="51999999999"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Número completo con código de país (sin +).</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email de Contacto</label>
                                    <input
                                        name="contact_email"
                                        defaultValue={initialSettings?.contact_email || ''}
                                        type="email"
                                        placeholder="contacto@blueocean.com"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Maintenance Mode Placeholder - User didn't ask for toggle yet but schema has it */}
                                {/* 
                                <div className="flex items-center gap-2 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="is_maintenance_mode" defaultChecked={initialSettings?.is_maintenance_mode} className="accent-blue-600 h-4 w-4" />
                                        <span className="text-sm font-medium text-gray-700">Modo Mantenimiento</span>
                                    </label>
                                </div> 
                                */}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <Lock className="h-10 w-10 text-gray-400 mb-2" />
                                <h3 className="font-medium text-gray-900">Acceso Restringido</h3>
                                <p className="text-sm text-gray-500 max-w-sm mt-1">
                                    Solo los administradores pueden modificar la configuración global de la empresa.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'account' && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Mi Cuenta</h2>
                            <p className="text-sm text-gray-500">Detalles de tu sesión actual.</p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Sesión Activa</h3>
                                <p className="text-gray-600 mt-1 mb-3">
                                    Has iniciado sesión como <strong>{userEmail || 'Usuario'}</strong>
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-200/50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                                    Rol: {userRole === 'admin' ? 'Administrador' : 'Trabajador'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
