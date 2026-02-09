'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, User, Lock, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { updateGlobalSettings } from '@/app/admin/actions'
import { Settings } from '@/types/database'
import { createClient } from '@/utils/supabase/client'

interface SettingsClientProps {
    initialSettings: Settings | null
    userRole: 'admin' | 'worker' | null
    userEmail?: string
}

export default function SettingsClient({ initialSettings, userRole, userEmail }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'account'>('general')
    const [isLoading, setIsLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [statusMessage, setStatusMessage] = useState('')
    const supabase = createClient()

    // --- Upload Helpers ---

    async function uploadMedia(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(fileName, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw new Error('Error al subir archivo a Storage: ' + uploadError.message)
        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName)
        return publicUrl
    }

    // --- Submit Handlers ---

    async function handleGeneralSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const formData = new FormData(e.currentTarget)
            const result = await updateGlobalSettings(formData)
            if (result.error) toast.error(result.error)
            else toast.success('Configuración general actualizada')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleMediaSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setUploadProgress(0)

        const formData = new FormData(e.currentTarget)
        const videoFile = formData.get('hero_video') as File
        const isUploadingVideo = videoFile && videoFile.size > 0

        if (!isUploadingVideo) {
            // Just in case they submitted without changing file? Though usually this form is just for the file.
            // If there's other media settings later, standard update.
            // For now, if no file selected, maybe warn or just nothing?
            // Actually, if they just hit save without file?
            toast.info('Seleccione una imagen para actualizar')
            setIsLoading(false)
            return
        }

        // Progress Simulation
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                const newProgress = prev >= 90 ? prev : prev + 5
                if (newProgress < 30) setStatusMessage('Preparando el archivo...')
                else if (newProgress < 60) setStatusMessage('Subiendo a la nube segura...')
                else if (newProgress < 85) setStatusMessage('Optimizando formato...')
                else setStatusMessage('Finalizando cambios...')
                return newProgress
            })
        }, 800)

        try {
            if (videoFile.size > 5 * 1024 * 1024) {
                throw new Error('La imagen excede el límite de 5MB')
            }

            const videoUrl = await uploadMedia(videoFile)
            formData.delete('hero_video')
            formData.append('hero_video_url', videoUrl)

            const result = await updateGlobalSettings(formData)
            if (result.error) toast.error(result.error)
            else {
                toast.success('Multimedia actualizada')
                window.location.reload()
            }
        } catch (error: any) {
            toast.error(error.message)
            clearInterval(progressInterval)
        } finally {
            clearInterval(progressInterval)
            setUploadProgress(100)
            setTimeout(() => {
                setIsLoading(false)
                setUploadProgress(0)
                setStatusMessage('')
            }, 1000)
        }
    }

    return (
        <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex space-x-8 min-w-max" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors gap-2
                            ${activeTab === 'general'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <Building2 className="h-4 w-4" />
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors gap-2
                            ${activeTab === 'media'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <ImageIcon className="h-4 w-4" />
                        Multimedia
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

                {/* --- GENERAL TAB --- */}
                {activeTab === 'general' && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Configuración General</h2>
                            <p className="text-sm text-gray-500">Información pública de contacto y ajustes básicos.</p>
                        </div>

                        {userRole === 'admin' ? (
                            <form onSubmit={handleGeneralSubmit} className="space-y-6 max-w-xl">
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
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        ) : <AccessRestricted />}
                    </motion.div>
                )}


                {/* --- MEDIA TAB --- */}
                {activeTab === 'media' && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Multimedia Global</h2>
                            <p className="text-sm text-gray-500">Imágenes y videos principales del sitio (Hero).</p>
                        </div>

                        {userRole === 'admin' ? (
                            <form onSubmit={handleMediaSubmit} className="space-y-6 max-w-xl">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-blue-600" />
                                        Media Principal (Hero)
                                    </label>

                                    <div className="space-y-4">
                                        {initialSettings?.hero_video_url && (
                                            <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-video shadow-sm">
                                                <img
                                                    src={initialSettings.hero_video_url}
                                                    alt="Hero Media"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-sm">
                                                    ACTUAL
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                            <input
                                                name="hero_video"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2.5 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-xs file:font-bold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100
                                                    focus:outline-none transition-all cursor-pointer"
                                            />
                                            <p className="text-xs text-gray-500 mt-3 text-center">
                                                Subir nueva imagen. Formatos: JPG, PNG, WEBP (Máx 5MB).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {isLoading && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 animate-pulse">
                                            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                                            <span className="font-medium animate-fade-in">
                                                {statusMessage || 'Subiendo archivo...'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {isLoading ? 'Subiendo...' : 'Actualizar Multimedia'}
                                    </button>
                                </div>
                            </form>
                        ) : <AccessRestricted />}
                    </motion.div>
                )}

                {/* --- ACCOUNT TAB --- */}
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

function AccessRestricted() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Lock className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="font-medium text-gray-900">Acceso Restringido</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">
                Solo los administradores pueden modificar esta configuración.
            </p>
        </div>
    )
}
