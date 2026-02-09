'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CalendarDaysIcon, UserIcon, CreditCardIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/solid'
import type { BookingWithClient } from '@/types/booking-types'

interface BookingDetailModalProps {
    isOpen: boolean
    onClose: () => void
    booking: BookingWithClient | null
}

export default function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
    if (!isOpen || !booking) return null

    // Format helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
    }

    const formatDate = (date: string) => {
        return new Date(date + 'T00:00:00').toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getWhatsAppLink = () => {
        if (!booking.client_phone) return '#'
        const phone = booking.client_phone.replace(/[^0-9]/g, '')
        const message = `Hola ${booking.client_first_name}, te escribo de Blue Ocean sobre tu reserva ${booking.booking_code}.`
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    }

    const statusColors = {
        pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        completed: 'bg-blue-100 text-blue-800 border-blue-200'
    }

    const statusLabels = {
        pending_payment: 'Por Pagar',
        confirmed: 'Confirmada',
        cancelled: 'Cancelada',
        completed: 'Completada'
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                Reserva #{booking.booking_code}
                            </h2>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                                {statusLabels[booking.status as keyof typeof statusLabels] || booking.status}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">

                            {/* Client Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                                    <UserIcon className="h-5 w-5 text-sky-600" />
                                    Información del Cliente
                                </div>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-gray-500 font-medium">Nombre Completo</dt>
                                        <dd className="text-gray-900 font-medium mt-0.5">{booking.client_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">Documento</dt>
                                        <dd className="text-gray-900 mt-0.5">
                                            {booking.clients?.document_type}: {booking.clients?.document_number || 'N/A'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">Contacto</dt>
                                        <dd className="text-gray-900 mt-0.5 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">✉️</span> {booking.client_email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">📞</span> {booking.client_phone}
                                            </div>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">País</dt>
                                        <dd className="text-gray-900 mt-0.5">{booking.clients?.country || 'No especificado'}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Tour Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                                    <CalendarDaysIcon className="h-5 w-5 text-sky-600" />
                                    Detalles del Tour
                                </div>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-gray-500 font-medium">Experiencia</dt>
                                        <dd className="text-gray-900 font-bold mt-0.5">{booking.tour_title}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">Fecha y Hora</dt>
                                        <dd className="text-gray-900 mt-0.5 capitalize">
                                            {formatDate(booking.tour_date)} - {booking.tour_time}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">Pasajeros</dt>
                                        <dd className="text-gray-900 mt-0.5 font-medium">
                                            {booking.pax} personas
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Payment Section - Full Width on Mobile, Half on Desktop */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                                    <CreditCardIcon className="h-5 w-5 text-sky-600" />
                                    Información de Pago
                                </div>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-gray-500 font-medium">Monto Total</dt>
                                        <dd className="text-xl font-bold text-gray-900 mt-0.5">
                                            {formatCurrency(booking.total_price)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">Estado del Pago</dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${booking.payment_status === 'approved' ? 'bg-green-50 text-green-700' :
                                                    booking.payment_status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {booking.payment_status === 'approved' ? 'Aprobado' :
                                                    booking.payment_status === 'pending' ? 'Pendiente' : 'Rechazado'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 font-medium">ID Transacción</dt>
                                        <dd className="text-gray-900 mt-0.5 font-mono text-xs bg-gray-50 px-2 py-1 rounded w-fit">
                                            {booking.payment_id || '---'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Notes Section - Full Width */}
                            <div className="col-span-1 sm:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-sky-600" />
                                    Notas Adicionales
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 italic border border-gray-100">
                                    {booking.clients?.notes ? (
                                        booking.clients.notes
                                    ) : (
                                        <span className="text-gray-400 not-italic">No hay notas registradas para este cliente.</span>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cerrar
                        </button>
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#25D366] hover:bg-[#128C7E] rounded-lg transition-colors shadow-sm"
                        >
                            <PhoneIcon className="h-4 w-4" />
                            Contactar por WhatsApp
                        </a>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
