'use client'

import { useActionState, useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, CalendarIcon, UsersIcon, GlobeAltIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { createBooking } from '@/app/actions/booking'
import type { CreateBookingState } from '@/app/actions/booking'
import type { Settings } from '@/types/database'

// Tasas de Mercado Pago
const MP_COMMISSION_RATE = 0.045; // 4.5%
const MP_FIXED_FEE = 1.50;      // 1.50 Soles

interface CheckoutFormProps {
    secureParams: {
        tourId: string
        date: string
        time: string
        pax: string
        tour: {
            title: string
            price: number // Numeric price from DB
        }
    }
    settings: Settings | null
}

const initialState: CreateBookingState = {
    success: false,
    message: ''
}

function SubmitButton({ finalPrice }: { finalPrice: string }) {
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
                `Pagar S/ ${finalPrice}`
            )}
        </button>
    )
}

export default function CheckoutForm({ secureParams, settings }: CheckoutFormProps) {
    const [state, formAction] = useActionState(createBooking, initialState)
    const router = useRouter()

    // Client-side state for improved UX inputs
    const [docType, setDocType] = useState('DNI')
    const [docNumber, setDocNumber] = useState('')
    const [phone, setPhone] = useState('')

    // Redirect on success
    useEffect(() => {
        if (state.success && state.bookingCode) {
            router.push(`/checkout/thank-you?code=${state.bookingCode}`)
        }
    }, [state.success, state.bookingCode, router])

    // Calculation Logic
    const pax = parseInt(secureParams.pax || '1')
    const basePrice = secureParams.tour.price * pax
    const finalPrice = (basePrice + MP_FIXED_FEE) / (1 - MP_COMMISSION_RATE)
    const commission = finalPrice - basePrice

    // Formats
    const basePriceDisplay = basePrice.toFixed(2)
    const commissionDisplay = commission.toFixed(2)
    const finalPriceDisplay = finalPrice.toFixed(2)

    // Input Handlers
    const handleDocNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // If DNI, only digits
        if (docType === 'DNI') {
            if (/^\d*$/.test(val) && val.length <= 8) {
                setDocNumber(val)
            }
        } else {
            // Other docs, max 12 chars
            if (val.length <= 12) {
                setDocNumber(val)
            }
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // Allow +, spaces, and digits
        if (/^[0-9+\s]*$/.test(val)) {
            setPhone(val)
        }
    }

    return (
        <div className="relative min-h-[600px]">
            <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Hidden Inputs for Server Action */}
                <input type="hidden" name="tourId" value={secureParams.tourId} />
                <input type="hidden" name="tourDate" value={secureParams.date} />
                <input type="hidden" name="tourTime" value={secureParams.time} />
                <input type="hidden" name="pax" value={secureParams.pax} />

                {/* Left Column: Client Data & Payment */}
                <div className="lg:col-span-7 space-y-8">

                    {/* 1. Datos Personales */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                            Datos del Cliente
                        </h3>

                        <div className="space-y-4">
                            {/* Nombres */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        required
                                        name="clientFirstName"
                                        type="text"
                                        className={`w-full rounded-xl border ${state.errors?.clientFirstName ? 'border-red-500 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                        placeholder="Ej. Juan"
                                    />
                                </div>
                                {state.errors?.clientFirstName && <p className="mt-1 text-xs text-red-600">{state.errors.clientFirstName[0]}</p>}
                            </div>

                            {/* Apellidos Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                                    <input
                                        required
                                        name="clientPaternalSurname"
                                        type="text"
                                        className={`w-full rounded-xl border ${state.errors?.clientPaternalSurname ? 'border-red-500 bg-red-50' : 'border-gray-300'} px-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                        placeholder="Ej. Pérez"
                                    />
                                    {state.errors?.clientPaternalSurname && <p className="mt-1 text-xs text-red-600">{state.errors.clientPaternalSurname[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                                    <input
                                        required
                                        name="clientMaternalSurname"
                                        type="text"
                                        className={`w-full rounded-xl border ${state.errors?.clientMaternalSurname ? 'border-red-500 bg-red-50' : 'border-gray-300'} px-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                        placeholder="Ej. Gómez"
                                    />
                                    {state.errors?.clientMaternalSurname && <p className="mt-1 text-xs text-red-600">{state.errors.clientMaternalSurname[0]}</p>}
                                </div>
                            </div>

                            {/* Pais */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">País de residencia</label>
                                <div className="relative">
                                    <GlobeAltIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        name="clientCountry"
                                        type="text"
                                        className={`w-full rounded-xl border ${state.errors?.clientCountry ? 'border-red-500 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                        placeholder="Ej. Perú"
                                    />
                                </div>
                                {state.errors?.clientCountry && <p className="mt-1 text-xs text-red-600">{state.errors.clientCountry[0]}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Doc.</label>
                                    <div className="relative">
                                        <select
                                            name="clientDocumentType"
                                            value={docType}
                                            onChange={(e) => {
                                                setDocType(e.target.value)
                                                setDocNumber('') // Clear number on type change
                                            }}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all appearance-none bg-white"
                                        >
                                            <option value="DNI">DNI</option>
                                            <option value="CE">CE</option>
                                            <option value="PASAPORTE">Pasaporte</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                                    <div className="relative">
                                        <IdentificationIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            name="clientDocumentNumber"
                                            type="text"
                                            value={docNumber}
                                            onChange={handleDocNumberChange}
                                            className={`w-full rounded-xl border ${state.errors?.clientDocumentNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                            placeholder={docType === 'DNI' ? '8 dígitos' : 'Número de documento'}
                                        />
                                    </div>
                                    {state.errors?.clientDocumentNumber && <p className="mt-1 text-xs text-red-600">{state.errors.clientDocumentNumber[0]}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            name="clientPhone"
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            className={`w-full rounded-xl border ${state.errors?.clientPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                            placeholder="+51 999 999 999"
                                        />
                                    </div>
                                    {state.errors?.clientPhone && <p className="mt-1 text-xs text-red-600">{state.errors.clientPhone[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input
                                            required
                                            name="clientEmail"
                                            type="email"
                                            className={`w-full rounded-xl border ${state.errors?.clientEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-3 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all`}
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>
                                    {state.errors?.clientEmail && <p className="mt-1 text-xs text-red-600">{state.errors.clientEmail[0]}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Método de Pago (Simplificado) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                            Pago Seguro
                        </h3>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-14 bg-white rounded border border-gray-200 flex items-center justify-center">
                                    <CreditCardIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Pasarela de Pagos</p>
                                    <p className="text-sm text-gray-600">Pagos procesados de forma segura por Mercado Pago (Tarjeta, Yape, Plin).</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-200">
                                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Tus datos están protegidos con encriptación SSL de 256 bits.
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
                                    <p className="text-gray-900 font-bold text-right w-2/3">{secureParams.tour.title}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" /> Fecha
                                    </p>
                                    <p className="text-gray-900 font-medium">{secureParams.date}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <UsersIcon className="h-4 w-4" /> Pasajeros
                                    </p>
                                    <p className="text-gray-900 font-medium">{secureParams.pax} Personas</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4" /> Hora
                                    </p>
                                    <p className="text-gray-900 font-medium">{secureParams.time}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600">Subtotal Tour</p>
                                    <p className="text-gray-900 font-medium">S/ {basePriceDisplay}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm">Cargos por Servicio Online</p>
                                    <p className="text-gray-500 text-sm">S/ {commissionDisplay}</p>
                                </div>
                                <div className="flex justify-between items-end pt-2 border-t border-dashed border-gray-200">
                                    <p className="text-gray-900 font-bold text-lg">Total a Pagar</p>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-blue-900">S/ {finalPriceDisplay}</p>
                                        <p className="text-xs text-green-600 font-medium">Impuestos incluidos</p>
                                    </div>
                                </div>
                            </div>

                            {state.message && !state.success && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {state.message}
                                </div>
                            )}

                            <SubmitButton finalPrice={finalPriceDisplay} />

                            <p className="mt-4 text-xs text-center text-gray-400">
                                Al confirmar, serás redirigido a Mercado Pago para completar tu compra de forma segura.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
