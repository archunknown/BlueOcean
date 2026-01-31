'use client'

import { useState } from 'react'
import { confirmBooking } from '@/app/admin/bookings/actions'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']

interface BookingsClientProps {
    initialBookings: Booking[]
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

export default function BookingsClient({ initialBookings }: BookingsClientProps) {
    const [bookings, setBookings] = useState(initialBookings)

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

    // Helper to generate WhatsApp Link for admin to contact client
    const getWhatsAppLink = (booking: Booking) => {
        const message = `Hola ${booking.client_name}, te escribo de Blue Ocean sobre tu reserva ${booking.booking_code}.`
        return `https://wa.me/${booking.client_phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {booking.tour_title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{booking.tour_date}</div>
                                    <div className="text-xs text-gray-500">{booking.pax} pax</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {booking.total_price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadges[booking.status as keyof typeof statusBadges] || 'bg-gray-100 text-gray-800'}`}>
                                        {statusLabels[booking.status as keyof typeof statusLabels] || booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center space-x-2">
                                        <a
                                            href={getWhatsAppLink(booking)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-800 p-1 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                                            title="Contactar por WhatsApp"
                                        >
                                            <PhoneIcon className="h-5 w-5" />
                                        </a>

                                        {booking.status === 'pending_payment' && (
                                            <button
                                                onClick={() => handleConfirm(booking.id)}
                                                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center"
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                Confirmar
                                            </button>
                                        )}
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
        </div>
    )
}
