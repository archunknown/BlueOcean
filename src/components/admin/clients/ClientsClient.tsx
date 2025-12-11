'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Search, Users, Mail, Phone, Globe, Edit2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { deleteClient } from '@/app/admin/actions'
import { Client } from '@/types/database'
import ClientForm from '../ClientForm' // Importing the new reusable form

export default function ClientsClient({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState(initialClients)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<Client | null>(null)

    // Filter clients
    const filteredClients = clients.filter(client => {
        const fullName = `${client.first_name || ''} ${client.paternal_surname || ''} ${client.maternal_surname || ''}`.trim()
        console.log(fullName)
        return (
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.document_number?.includes(searchTerm)
        )
    })

    function handleOpenCreate() {
        setEditingClient(null)
        setIsModalOpen(true)
    }

    function handleOpenEdit(client: Client) {
        setEditingClient(client)
        setIsModalOpen(true)
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return

        const result = await deleteClient(id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Cliente eliminado')
            setClients(prev => prev.filter(c => c.id !== id))
        }
    }

    function handleSuccess() {
        // Simple reload to fetch fresh data. 
        // In a more complex app we would update the state optimistically or re-fetch.
        window.location.reload()
    }

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o DNI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Cliente
                </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Documento</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Ubicación</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {filteredClients.map((client) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        layout
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {client.first_name?.charAt(0) || client.paternal_surname?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{client.first_name} {client.paternal_surname} {client.maternal_surname}</p>
                                                    {client.notes && (
                                                        <span className="text-xs text-gray-400 max-w-[150px] truncate block" title={client.notes}>
                                                            {client.notes}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.document_number ? (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <FileText className="h-3 w-3 text-gray-400" />
                                                    <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                        {client.document_type || 'DOC'}
                                                    </span>
                                                    {client.document_number}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="h-3 w-3" />
                                                    {client.email}
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Phone className="h-3 w-3" />
                                                        {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {client.country ? (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-3 w-3 text-gray-400" />
                                                    {client.country}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(client)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredClients.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No se encontraron clientes.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-2xl mx-4"
                    >
                        <h2 className="mb-5 text-xl font-bold text-gray-900">
                            {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h2>

                        <ClientForm
                            client={editingClient}
                            onClose={() => setIsModalOpen(false)}
                            onSuccess={handleSuccess}
                        />

                    </motion.div>
                </div>
            )}
        </div>
    )
}
