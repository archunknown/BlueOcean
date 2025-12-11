'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Save, Search, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Client } from '@/types/database'
import { createClient, updateClient, fetchDniData } from '@/app/admin/actions'

interface ClientFormProps {
    client?: Client | null
    onClose: () => void
    onSuccess: () => void
}

export default function ClientForm({ client, onClose, onSuccess }: ClientFormProps) {
    const isEditing = !!client
    const [isLoading, setIsLoading] = useState(false)
    const [isSearchingDni, setIsSearchingDni] = useState(false)
    const [docType, setDocType] = useState(client?.document_type || 'DNI')

    // Refs for manual value setting
    const firstNameRef = useRef<HTMLInputElement>(null)
    const patSurnameRef = useRef<HTMLInputElement>(null)
    const matSurnameRef = useRef<HTMLInputElement>(null)

    function toTitleCase(str: string) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    async function handleDniChange(e: React.ChangeEvent<HTMLInputElement>) {
        const dni = e.target.value

        // Only auto-search if 8 digits and type is DNI
        if (docType === 'DNI' && dni.length === 8) {
            setIsSearchingDni(true)
            toast.info('Consultando RENIEC...')

            const result = await fetchDniData(dni)

            setIsSearchingDni(false)

            if (result.success && result.data) {
                if (firstNameRef.current) firstNameRef.current.value = toTitleCase(result.data.first_name)
                if (patSurnameRef.current) patSurnameRef.current.value = toTitleCase(result.data.paternal_surname)
                if (matSurnameRef.current) matSurnameRef.current.value = toTitleCase(result.data.maternal_surname)
                toast.success('Datos encontrados')
            } else {
                toast.warning('DNI no encontrado. Ingrese los datos manualmente.')
                // Optional: clear fields or leave as is
            }
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)

        let result
        if (isEditing && client) {
            result = await updateClient(client.id, formData)
        } else {
            result = await createClient(formData)
        }

        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(isEditing ? 'Cliente actualizado' : 'Cliente registrado')
            onSuccess()
            onClose()
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-12 gap-3">
                {/* Names */}
                <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombres *</label>
                    <input
                        ref={firstNameRef}
                        name="first_name"
                        defaultValue={client?.first_name}
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Juan Carlos"
                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido Paterno *</label>
                    <input
                        ref={patSurnameRef}
                        name="paternal_surname"
                        defaultValue={client?.paternal_surname}
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Pérez"
                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido Materno *</label>
                    <input
                        ref={matSurnameRef}
                        name="maternal_surname"
                        defaultValue={client?.maternal_surname}
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Gómez"
                    />
                </div>

                {/* Document */}
                <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo Doc.</label>
                    <select
                        name="document_type"
                        value={docType || 'DNI'}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="DNI">DNI</option>
                        <option value="CE">CE</option>
                        <option value="PASAPORTE">Pasaporte</option>
                    </select>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex justify-between">
                        <span>Número Doc.</span>
                        {docType === 'DNI' && (
                            <span className={`text-[10px] ${isSearchingDni ? 'text-blue-600 animate-pulse' : 'text-green-400'}`}>
                                {isSearchingDni ? 'Consultando...' : 'Digita 8 números para autocompletar'}
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <input
                            name="document_number"
                            defaultValue={client?.document_number || ''}
                            onChange={handleDniChange}
                            type="text"
                            maxLength={docType === 'DNI' ? 8 : 20}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder={docType === 'DNI' ? "12345678" : "Documento..."}
                        />
                        {isSearchingDni && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact */}
                <div className="col-span-12">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        name="email"
                        defaultValue={client?.email}
                        type="email"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="juan@ejemplo.com"
                    />
                </div>
                <div className="col-span-7">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                    <input
                        name="phone"
                        defaultValue={client?.phone || ''}
                        type="tel"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="+51 999..."
                    />
                </div>

                {/* Country */}
                <div className="col-span-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">País</label>
                    <input
                        name="country"
                        defaultValue={client?.country || ''}
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Perú"
                    />
                </div>

                {/* Notes */}
                <div className="col-span-12">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Notas Internas</label>
                    <textarea
                        name="notes"
                        defaultValue={client?.notes || ''}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Preferencias..."
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
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
                    {isEditing ? 'Guardar' : 'Registrar'}
                </button>
            </div>
        </form>
    )
}
