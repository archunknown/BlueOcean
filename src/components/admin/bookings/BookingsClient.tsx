'use client'

import { useState } from 'react'
import { confirmBooking, approvePayment, deleteBooking } from '@/app/admin/bookings/actions'
import { CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyDollarIcon, BanknotesIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { toast } from 'sonner'
import type { BookingWithClient } from '@/types/booking-types'
import BookingDetailModal from './BookingDetailModal'

interface BookingsClientProps {
    initialBookings: BookingWithClient[]
}

const statusBadges = {
    pending_payment: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
}

const statusLabels = {
    pending_payment: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
}

const paymentBadges = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    approved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
}

const paymentLabels = {
    pending: 'Pendiente',
    approved: 'Pagado',
    rejected: 'Rechazado',
}

export default function BookingsClient({ initialBookings }: BookingsClientProps) {
    const [bookings, setBookings] = useState(initialBookings)
    const [selectedBooking, setSelectedBooking] = useState<BookingWithClient | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleViewDetails = (booking: BookingWithClient) => {
        setSelectedBooking(booking)
        setIsModalOpen(true)
    }

    const handleConfirm = async (id: string) => {
        toast.promise(confirmBooking(id), {
            loading: 'Confirmando...',
            success: (data) => {
                if (data.success) {
                    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
                    return 'Reserva confirmada exitosamente'
                } else {
                    throw new Error(data.message)
                }
            },
            error: (err) => `Error: ${err.message}`
        })
    }

    const handleApprovePayment = async (id: string) => {
        toast.promise(approvePayment(id), {
            loading: 'Registrando pago...',
            success: (data) => {
                if (data.success) {
                    setBookings(prev => prev.map(b => b.id === id ? { ...b, payment_status: 'approved' } : b))
                    return 'Pago registrado exitosamente'
                } else {
                    throw new Error(data.message)
                }
            },
            error: (err) => `Error: ${err.message}`
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.')) return

        toast.promise(deleteBooking(id), {
            loading: 'Eliminando...',
            success: (data) => {
                if (data.success) {
                    setBookings(prev => prev.filter(b => b.id !== id))
                    return 'Reserva eliminada exitosamente'
                } else {
                    throw new Error(data.message)
                }
            },
            error: (err) => `Error: ${err.message}`
        })
    }

    // Helper to generate WhatsApp Link for admin to contact client
    const getWhatsAppLink = (booking: BookingWithClient) => {
        const message = `Hola ${booking.client_name}, te escribo de Blue Ocean sobre tu reserva ${booking.booking_code}.`
        return `https://wa.me/${booking.client_phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour / Fecha</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-bold text-gray-900">{booking.booking_code}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{booking.client_name}</div>
                                    <div className="text-xs text-gray-500">{booking.client_email}</div>
                                    <div className="text-xs text-gray-500">{booking.client_phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <div className="font-medium text-gray-900 truncate max-w-[200px]" title={booking.tour_title}>
                                        {booking.tour_title}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                                        <span>📅 {booking.tour_date}</span>
                                        <span className="flex items-center gap-1 text-gray-700 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                                            <ClockIcon className="h-3 w-3" />
                                            {booking.tour_time?.slice(0, 5) || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">{booking.pax} pax</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentBadges[booking.payment_status as keyof typeof paymentBadges] || 'bg-gray-100'}`}>
                                        {paymentLabels[booking.payment_status as keyof typeof paymentLabels] || booking.payment_status || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {formatPrice(booking.total_price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadges[booking.status as keyof typeof statusBadges] || 'bg-gray-100 text-gray-800'}`}>
                                        {statusLabels[booking.status as keyof typeof statusLabels] || booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center space-x-2">

                                        <button
                                            onClick={() => handleViewDetails(booking)}
                                            className="text-gray-600 hover:text-gray-900 p-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Ver Detalles"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>

                                        <a
                                            href={getWhatsAppLink(booking)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-800 p-1 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                                            title="Contactar por WhatsApp"
                                        >
                                            <PhoneIcon className="h-5 w-5" />
                                        </a>

                                        {booking.payment_status === 'pending' && (
                                            <button
                                                onClick={() => handleApprovePayment(booking.id)}
                                                className="text-green-600 hover:text-green-800 p-1 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                                                title="Registrar Pago (Yape/Efectivo)"
                                            >
                                                <BanknotesIcon className="h-5 w-5" />
                                            </button>
                                        )}

                                        {booking.status === 'pending_payment' && (
                                            <button
                                                onClick={() => handleConfirm(booking.id)}
                                                className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                                                title="Confirmar Reserva"
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                            title="Eliminar Reserva"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No hay reservas registradas.
                    </div>
                )}
            </div>

            <BookingDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                booking={selectedBooking}
            />
        </div>
    )
}
