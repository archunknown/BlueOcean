'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Client } from '@/types/database'
import { createClient, updateClient } from '@/app/admin/actions'

interface ClientFormProps {
    client?: Client | null
    onClose: () => void
    onSuccess: () => void
}

export default function ClientForm({ client, onClose, onSuccess }: ClientFormProps) {
    const isEditing = !!client
    const [isLoading, setIsLoading] = useState(false)

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
                {/* Full Name */}
                <div className="col-span-12">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                    <input
                        name="full_name"
                        defaultValue={client?.full_name}
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Juan Pérez"
                    />
                </div>

                {/* Document */}
                <div className="col-span-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo Doc.</label>
                    <select
                        name="document_type"
                        defaultValue={client?.document_type || 'DNI'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="DNI">DNI</option>
                        <option value="CE">CE</option>
                        <option value="PASAPORTE">Pasaporte</option>
                    </select>
                </div>
                <div className="col-span-8">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Número Doc.</label>
                    <input
                        name="document_number"
                        defaultValue={client?.document_number || ''}
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: 12345678"
                    />
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
