'use client'

import { useState, useEffect, useActionState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useFormStatus } from 'react-dom'
import { createBooking } from '@/app/actions/booking'
import type { Tour } from '@/types/tour-schemas' // Assuming this type exists or close enough

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    tour: Tour
}

const initialState = {
    success: false,
    message: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-blue-900 py-3 text-white font-bold hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
    )
}

export default function BookingModal({ isOpen, onClose, tour }: BookingModalProps) {
    const [state, formAction] = useActionState(createBooking, initialState)

    // Reset state when modal opens/closes if needed, or just let it persist?
    // User wants "Estado B (Éxito - Ticket)". 
    // If we close and reopen, maybe we want a fresh form.
    // Let's keep it simple for now.

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            {!state.success ? (
                                /* STATE A: FORM */
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-blue-900 mb-2">Reservar Tour</h2>
                                    <p className="text-sm text-gray-600 mb-6">Completa tus datos para pre-confirmar tu lugar en <strong>{tour.title}</strong>.</p>

                                    <form action={formAction} className="space-y-4">
                                        <input type="hidden" name="tourId" value={tour.id} />
                                        <input type="hidden" name="tourTitle" value={tour.title} />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                            <input required name="clientName" type="text" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="Juan Pérez" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                                <input required name="clientPhone" type="tel" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="+51 999..." />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input required name="clientEmail" type="email" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="juan@mail.com" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                                <input required name="tourDate" type="date" min={new Date().toISOString().split('T')[0]} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Personas (Pax)</label>
                                                <input required name="pax" type="number" min="1" defaultValue="1" className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" />
                                            </div>
                                        </div>

                                        {state.message && (
                                            <p className="text-red-500 text-sm text-center">{state.message}</p>
                                        )}

                                        <div className="pt-2">
                                            <SubmitButton />
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                /* STATE B: SUCCESS TICKET */
                                <div className="p-8 text-center bg-gradient-to-br from-white to-blue-50">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircleIcon className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Reserva Pre-confirmada!</h2>
                                    <p className="text-gray-600 text-sm mb-6">Tu código de reserva es:</p>

                                    <div className="bg-white border-2 border-dashed border-blue-900/30 rounded-xl p-4 mb-6">
                                        <p className="text-4xl font-mono font-black text-blue-900 tracking-wider">{state.bookingCode}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total a pagar: <span className="font-bold text-gray-900">{state.totalPrice}</span></p>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-6">
                                        Para finalizar, envíanos este código por WhatsApp para coordinar el pago.
                                    </p>

                                    <a
                                        href={state.whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full rounded-xl bg-[#25D366] py-3 text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                                    >
                                        Ir a WhatsApp
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
