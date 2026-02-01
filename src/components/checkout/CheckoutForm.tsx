'use client'

import { useActionState, useState, useEffect } from 'react'
import Image from 'next/image'
import { useFormStatus } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, CreditCardIcon, QrCodeIcon, UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline'
import { createBooking } from '@/app/actions/booking'
import type { Settings } from '@/types/database'

interface CheckoutFormProps {
    searchParams: {
        tourId: string
        title: string
        price: string
        date: string
        pax: string
    }
    settings: Settings | null
}

const initialState = {
    success: false,
    message: '',
    bookingCode: '',
    totalPrice: '',
    whatsappUrl: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-blue-900 py-4 text-white font-bold hover:bg-cyan-600 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {pending ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                </>
            ) : (
                'Confirmar Reserva'
            )}
        </button>
    )
}

export default function CheckoutForm({ searchParams, settings }: CheckoutFormProps) {
    const [state, formAction] = useActionState(createBooking, initialState)
    const [totalPriceCalculated, setTotalPriceCalculated] = useState('0.00')
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Sync modal state with action success
    useEffect(() => {
        if (state.success) {
            setIsModalOpen(true)
        }
    }, [state.success])

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsModalOpen(false)
        }
        if (isModalOpen) window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isModalOpen])

    // Parse pax and price for immediate visual feedback
    useEffect(() => {
        const pax = parseInt(searchParams.pax || '1')
        const priceClean = searchParams.price?.replace(/[^0-9.]/g, '') || '0'
        const total = (parseFloat(priceClean) * pax).toFixed(2)
        setTotalPriceCalculated(total)
    }, [searchParams])

    return (
        <div className="relative min-h-[600px]">
            {/* Success Overlay & Modal */}
            <AnimatePresence>
                {state.success && isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="w-[92vw] max-w-[420px] max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="flex flex-col items-center text-center space-y-4">
                                {/* Success Icon */}
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircleIcon className="h-7 w-7 text-green-600" />
                                </div>

                                {/* Header */}
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-gray-900">¡Reserva Pre-confirmada!</h2>
                                    <p className="text-sm text-gray-600">
                                        Tu código de pedido es <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded">{state.bookingCode}</span>
                                    </p>
                                </div>

                                {/* QR Section */}
                                <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 border-dashed">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Escanea para pagar con Yape/Plin</p>

                                    <div className="mx-auto w-44 h-44 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                        {settings?.yape_qr_url ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={settings.yape_qr_url}
                                                    alt="Payment QR"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <QrCodeIcon className="h-10 w-10" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500">Monto total a transferir</p>
                                        <p className="text-xl font-bold text-gray-900">{state.totalPrice}</p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <a
                                    href={state.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-11 rounded-xl bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-md active:scale-[0.98]"
                                >
                                    <span>Enviar Constancia Confirmar</span>
                                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Hidden Inputs for Server Action (Strict Schema) */}
                <input type="hidden" name="tourId" value={searchParams.tourId} />
                <input type="hidden" name="tourTitle" value={searchParams.title} />
                <input type="hidden" name="tourDate" value={searchParams.date} />
                <input type="hidden" name="pax" value={searchParams.pax} />

                {/* Left Column: Client Data & Payment */}
                <div className="lg:col-span-7 space-y-8">

                    {/* 1. Datos Personales */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                            Datos del Cliente
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input required name="clientName" type="text" className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="Ej. Juan Pérez" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI / Pasaporte</label>
                                    <div className="relative">
                                        <IdentificationIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input required name="clientDni" type="text" className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="12345678" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input required name="clientPhone" type="tel" className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="+51 999 999 999" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input required name="clientEmail" type="email" className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all" placeholder="juan@ejemplo.com" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Método de Pago */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                            Método de Pago
                        </h3>

                        <div className="space-y-4">
                            {/* Yape Option (Active) */}
                            <label className="relative flex items-center justify-between p-4 rounded-xl border-2 border-blue-600 bg-blue-50 cursor-pointer transition-all hover:bg-blue-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-white" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-600 text-white font-bold p-2 rounded-lg">
                                            <QrCodeIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Yape / Plin</p>
                                            <p className="text-sm text-gray-500">Escanea el QR y envía la constancia.</p>
                                        </div>
                                    </div>
                                </div>
                                <input type="radio" name="paymentHeader" defaultChecked className="hidden" />
                            </label>

                            {/* Card Option (Disabled) */}
                            <div className="relative flex items-center p-4 rounded-xl border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed">
                                <div className="flex items-center gap-4">
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-200 text-gray-500 font-bold p-2 rounded-lg">
                                            <CreditCardIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Tarjeta de Crédito / Débito</p>
                                            <p className="text-sm text-gray-500">Próximamente disponible.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Resumen de Reserva</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <p className="text-gray-500 text-sm">Tour</p>
                                    <p className="text-gray-900 font-bold text-right w-2/3">{searchParams.title}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" /> Fecha
                                    </p>
                                    <p className="text-gray-900 font-medium">{searchParams.date}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <UsersIcon className="h-4 w-4" /> Pasajeros
                                    </p>
                                    <p className="text-gray-900 font-medium">{searchParams.pax} Personas</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-gray-500 text-sm">Precio por persona</p>
                                    <p className="text-gray-900 font-medium">{searchParams.price}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-gray-900 font-bold text-lg">Total a Pagar</p>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-blue-900">S/ {totalPriceCalculated}</p>
                                        <p className="text-xs text-green-600 font-medium">Impuestos incluidos</p>
                                    </div>
                                </div>
                            </div>

                            {state.message && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {state.message}
                                </div>
                            )}

                            <SubmitButton />

                            <p className="mt-4 text-xs text-center text-gray-400">
                                Al confirmar, aceptas nuestros términos y condiciones.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
