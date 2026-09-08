'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    IdentificationIcon,
    CalendarIcon,
    GlobeAltIcon,
    CheckCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline'
import { Users, Loader2, Search } from 'lucide-react'
import { createManualBooking, type ManualBookingState } from '@/app/admin/bookings/actions'
import { fetchDniData } from '@/app/admin/actions'

// ─── Tipos mínimos del tour que el Server Component pasa al form ───────────
export interface TourOption {
    id: string
    title: string
    price: number
    time_slots: string[] | null
    is_flexible_schedule: boolean
}

interface NewManualBookingFormProps {
    tours: TourOption[]
}

// ─── Botón de submit ───────────────────────────────────────────────────────
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            id="manual-booking-submit"
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 text-white font-bold text-base hover:bg-blue-800 transition-all shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Registrando reserva...
                </>
            ) : (
                <>
                    <CheckCircleIcon className="h-5 w-5" />
                    Confirmar Reserva Presencial
                </>
            )}
        </button>
    )
}

// ─── Componente principal ──────────────────────────────────────────────────
const initialState: ManualBookingState = { success: false, message: '' }

export default function NewManualBookingForm({ tours }: NewManualBookingFormProps) {
    const [state, formAction] = useActionState(createManualBooking, initialState)

    // Tour seleccionado
    const [selectedTourId, setSelectedTourId] = useState<string>(tours[0]?.id ?? '')
    const selectedTour = tours.find((t) => t.id === selectedTourId) ?? tours[0]

    // Fecha — default: hoy en hora local de Perú (UTC-5)
    const todayLocal = new Date()
        .toLocaleDateString('sv-SE', { timeZone: 'America/Lima' }) // YYYY-MM-DD
    const [date, setDate] = useState(todayLocal)

    // Hora
    const [selectedTime, setSelectedTime] = useState('')

    // PAX
    const [pax, setPax] = useState(1)

    // Documento
    const [docType, setDocType] = useState('DNI')
    const [docNumber, setDocNumber] = useState('')
    const [isSearchingDni, setIsSearchingDni] = useState(false)

    // Refs para autocompletar desde DNI
    const firstNameRef = useRef<HTMLInputElement>(null)
    const patSurnameRef = useRef<HTMLInputElement>(null)
    const matSurnameRef = useRef<HTMLInputElement>(null)

    // Reset hora cuando cambia el tour
    useEffect(() => {
        setSelectedTime('')
    }, [selectedTourId])

    // Toast en error de servidor
    useEffect(() => {
        if (!state.success && state.message && state.message !== '') {
            toast.error(state.message)
        }
    }, [state])

    // ── Precio en vivo (sin comisión MP) ────────────────────────────────────
    const pricePerPerson = selectedTour?.price ?? 0
    const totalPrice = pricePerPerson * pax

    // ── Lookup de DNI ────────────────────────────────────────────────────────
    function toTitleCase(str: string) {
        return str
            .toLowerCase()
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
    }

    async function handleDniLookup() {
        if (docType !== 'DNI' || docNumber.length !== 8) {
            toast.warning('Ingresa un DNI de 8 dígitos para buscar.')
            return
        }
        setIsSearchingDni(true)
        toast.info('Consultando RENIEC...')
        const result = await fetchDniData(docNumber)
        setIsSearchingDni(false)
        if (result.success && result.data) {
            if (firstNameRef.current) firstNameRef.current.value = toTitleCase(result.data.first_name)
            if (patSurnameRef.current) patSurnameRef.current.value = toTitleCase(result.data.paternal_surname)
            if (matSurnameRef.current) matSurnameRef.current.value = toTitleCase(result.data.maternal_surname)
            toast.success('Datos encontrados en RENIEC')
        } else {
            toast.warning('DNI no encontrado. Ingresa los datos manualmente.')
        }
    }

    // ── Pantalla de éxito ────────────────────────────────────────────────────
    if (state.success && state.bookingCode) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 ring-4 ring-green-200">
                    <CheckCircleIcon className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h2>
                <p className="text-gray-500 mb-8 max-w-sm">{state.message}</p>

                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8 w-full max-w-xs">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                        Código de Reserva
                    </p>
                    <p className="text-4xl font-black text-blue-700 font-mono tracking-wider">
                        {state.bookingCode}
                    </p>
                </div>

                <p className="text-sm text-gray-400 mb-6">
                    Se enviará un voucher al correo del cliente en breves momentos.
                </p>

                <button
                    id="manual-booking-new"
                    onClick={() => window.location.reload()}
                    className="rounded-xl border-2 border-blue-700 text-blue-700 font-bold px-8 py-3 hover:bg-blue-50 transition-colors"
                >
                    Registrar otra reserva
                </button>
            </div>
        )
    }

    // ── Formulario ───────────────────────────────────────────────────────────
    return (
        <form action={formAction} className="space-y-8">

            {/* ── Sección 1: Tour, Fecha, Hora y Pasajeros ── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
                    Detalles del Tour
                </h2>

                {/* Tour */}
                <div>
                    <label htmlFor="tourId" className="block text-sm font-medium text-gray-700 mb-1">
                        Tour / Servicio
                    </label>
                    <select
                        id="tourId"
                        name="tourId"
                        value={selectedTourId}
                        onChange={(e) => setSelectedTourId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all bg-white"
                    >
                        {tours.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.title} — S/ {t.price.toFixed(2)} p/p
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fecha */}
                <div>
                    <label htmlFor="tourDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                    </label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            id="tourDate"
                            name="tourDate"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all text-gray-700"
                        />
                    </div>
                    {state.errors?.tourDate && (
                        <p className="mt-1 text-xs text-red-600">{state.errors.tourDate[0]}</p>
                    )}
                </div>

                {/* Hora — replica exacta de TourDetailView.tsx líneas 199–239 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horario
                    </label>

                    {/* Campo oculto para enviar el valor al Server Action */}
                    <input type="hidden" name="tourTime" value={selectedTime} />

                    {selectedTour?.is_flexible_schedule ? (
                        /* Horario flexible → input libre con validación de rango */
                        <div className="relative">
                            <ClockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                id="tourTimeFlexible"
                                type="time"
                                min="06:30"
                                max="17:00"
                                value={selectedTime}
                                onChange={(e) => {
                                    const time = e.target.value
                                    if (time < '06:30' || time > '17:00') {
                                        toast.error('El horario de atención es de 6:30 AM a 5:00 PM', {
                                            duration: 3000,
                                        })
                                        setSelectedTime('')
                                        return
                                    }
                                    setSelectedTime(time)
                                }}
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all text-gray-700"
                            />
                        </div>
                    ) : selectedTour?.time_slots && selectedTour.time_slots.length > 0 ? (
                        /* Horario fijo → selector de opciones */
                        <select
                            id="tourTimeSelect"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all bg-white"
                        >
                            <option value="">— Selecciona un horario —</option>
                            {selectedTour.time_slots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    ) : (
                        /* Sin time_slots y sin flexible → input de texto libre */
                        <div className="relative">
                            <ClockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                id="tourTimeFree"
                                type="text"
                                placeholder="A coordinar (ej. 09:00)"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all text-gray-700"
                            />
                        </div>
                    )}

                    {state.errors?.tourTime && (
                        <p className="mt-1 text-xs text-red-600">{state.errors.tourTime[0]}</p>
                    )}
                </div>

                {/* Pasajeros */}
                <div>
                    <label htmlFor="pax" className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Pasajeros (PAX)
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                id="pax"
                                name="pax"
                                type="number"
                                min="1"
                                max="50"
                                value={pax}
                                onChange={(e) => setPax(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all text-gray-700"
                            />
                        </div>
                        <div className="shrink-0 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2.5 text-right min-w-[140px]">
                            <p className="text-xs text-blue-500 font-medium">Total</p>
                            <p className="text-xl font-black text-blue-700">
                                S/ {totalPrice.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    {state.errors?.pax && (
                        <p className="mt-1 text-xs text-red-600">{state.errors.pax[0]}</p>
                    )}
                </div>
            </section>

            {/* ── Sección 2: Datos del Cliente ── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
                    Datos del Cliente
                </h2>

                {/* Tipo y Número de Documento */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label htmlFor="clientDocumentType" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo Doc.
                        </label>
                        <select
                            id="clientDocumentType"
                            name="clientDocumentType"
                            value={docType}
                            onChange={(e) => {
                                setDocType(e.target.value)
                                setDocNumber('')
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all bg-white"
                        >
                            <option value="DNI">DNI</option>
                            <option value="CE">CE</option>
                            <option value="PASAPORTE">Pasaporte</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="clientDocumentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Documento
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <IdentificationIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                                <input
                                    id="clientDocumentNumber"
                                    name="clientDocumentNumber"
                                    type="text"
                                    value={docNumber}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        if (docType === 'DNI') {
                                            if (/^\d*$/.test(val) && val.length <= 8) setDocNumber(val)
                                        } else {
                                            if (val.length <= 12) setDocNumber(val)
                                        }
                                    }}
                                    placeholder={docType === 'DNI' ? '8 dígitos' : 'Número'}
                                    className={`w-full rounded-lg border ${state.errors?.clientDocumentNumber ? 'border-red-400 bg-red-50' : 'border-gray-300'} pl-10 pr-3 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all`}
                                />
                            </div>
                            {docType === 'DNI' && (
                                <button
                                    id="manual-booking-dni-lookup"
                                    type="button"
                                    onClick={handleDniLookup}
                                    disabled={isSearchingDni || docNumber.length !== 8}
                                    title="Buscar en RENIEC"
                                    className="shrink-0 flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSearchingDni ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                        </div>
                        {state.errors?.clientDocumentNumber && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.clientDocumentNumber[0]}</p>
                        )}
                    </div>
                </div>

                {/* Nombre */}
                <div>
                    <label htmlFor="clientFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombres
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            id="clientFirstName"
                            name="clientFirstName"
                            type="text"
                            ref={firstNameRef}
                            required
                            placeholder="Ej. Juan"
                            className={`w-full rounded-lg border ${state.errors?.clientFirstName ? 'border-red-400 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all`}
                        />
                    </div>
                    {state.errors?.clientFirstName && (
                        <p className="mt-1 text-xs text-red-600">{state.errors.clientFirstName[0]}</p>
                    )}
                </div>

                {/* Apellidos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="clientPaternalSurname" className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido Paterno
                        </label>
                        <input
                            id="clientPaternalSurname"
                            name="clientPaternalSurname"
                            type="text"
                            ref={patSurnameRef}
                            required
                            placeholder="Ej. Pérez"
                            className={`w-full rounded-lg border ${state.errors?.clientPaternalSurname ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all`}
                        />
                        {state.errors?.clientPaternalSurname && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.clientPaternalSurname[0]}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="clientMaternalSurname" className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido Materno
                        </label>
                        <input
                            id="clientMaternalSurname"
                            name="clientMaternalSurname"
                            type="text"
                            ref={matSurnameRef}
                            required
                            placeholder="Ej. Gómez"
                            className={`w-full rounded-lg border ${state.errors?.clientMaternalSurname ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all`}
                        />
                        {state.errors?.clientMaternalSurname && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.clientMaternalSurname[0]}</p>
                        )}
                    </div>
                </div>

                {/* Teléfono y Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                id="clientPhone"
                                name="clientPhone"
                                type="tel"
                                required
                                placeholder="+51 999 999 999"
                                className={`w-full rounded-lg border ${state.errors?.clientPhone ? 'border-red-400 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all`}
                            />
                        </div>
                        {state.errors?.clientPhone && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.clientPhone[0]}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            <input
                                id="clientEmail"
                                name="clientEmail"
                                type="email"
                                required
                                placeholder="correo@ejemplo.com"
                                className={`w-full rounded-lg border ${state.errors?.clientEmail ? 'border-red-400 bg-red-50' : 'border-gray-300'} pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all`}
                            />
                        </div>
                        {state.errors?.clientEmail && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.clientEmail[0]}</p>
                        )}
                    </div>
                </div>

                {/* País (opcional) */}
                <div>
                    <label htmlFor="clientCountry" className="block text-sm font-medium text-gray-700 mb-1">
                        País de Residencia <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                        <GlobeAltIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            id="clientCountry"
                            name="clientCountry"
                            type="text"
                            placeholder="Ej. Perú"
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* ── Resumen de precio ── */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-5 py-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-blue-700">
                        {selectedTour?.title ?? '—'} × {pax} pax
                    </p>
                    <p className="text-xs text-blue-400 mt-0.5">
                        Pago presencial · Sin comisión de pasarela
                    </p>
                </div>
                <p className="text-2xl font-black text-blue-800">
                    S/ {totalPrice.toFixed(2)}
                </p>
            </div>

            {/* ── Error general del servidor ── */}
            {!state.success && state.message && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {state.message}
                </div>
            )}

            <SubmitButton />
        </form>
    )
}
