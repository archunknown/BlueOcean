'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Briefcase, 
    Check, 
    Luggage, 
    PawPrint, 
    Printer, 
    Plus, 
    QrCode, 
    Search, 
    ShieldAlert, 
    Clock, 
    Signpost,
    X
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { registerCustody, checkOutCustody, getActiveCustodyItems } from './actions'

interface CustodiaItem {
    id: string
    reserva_id: string | null
    tipo: 'locker' | 'mascota'
    codigo_qr: string
    estado: 'ingresado' | 'retirado'
    created_at: string
    bookings?: {
        booking_code: string
        client_name: string
        tour_title: string
    } | null
}

export default function CustodiaPage() {
    const supabase = createClient()
    const [items, setItems] = useState<CustodiaItem[]>([])
    const [loading, setLoading] = useState(true)

    // Form states
    const [tipo, setTipo] = useState<'locker' | 'mascota'>('locker')
    const [bookingCodeInput, setBookingCodeInput] = useState('')
    const [foundBooking, setFoundBooking] = useState<{ id: string; client_name: string; tour_title: string } | null>(null)
    const [searchingBooking, setSearchingBooking] = useState(false)
    const [codigoQrValue, setCodigoQrValue] = useState('')
    
    // Active receipt modal
    const [receiptItem, setReceiptItem] = useState<{
        codigo: string
        tipo: 'locker' | 'mascota'
        clientName: string
        bookingCode?: string
        date: string
    } | null>(null)

    const printRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchCustodyItems()
    }, [])

    async function fetchCustodyItems() {
        setLoading(true)
        try {
            const data = await getActiveCustodyItems()
            setItems(data as unknown as CustodiaItem[])
        } catch (err) {
            console.error('Error fetching custody items:', err)
            toast.error('No se pudieron cargar los equipajes en custodia.')
        } finally {
            setLoading(false)
        }
    }

    async function handleSearchBooking() {
        if (!bookingCodeInput.trim()) return
        setSearchingBooking(true)
        setFoundBooking(null)
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('id, client_name, tour_title')
                .eq('booking_code', bookingCodeInput.trim().toUpperCase())
                .maybeSingle()

            if (error) throw error

            if (data) {
                setFoundBooking(data)
                toast.success(`Reserva encontrada: ${data.client_name}`)
            } else {
                toast.error('No se encontró ninguna reserva con ese código.')
            }
        } catch (err) {
            console.error('Error searching booking:', err)
            toast.error('Error al buscar la reserva.')
        } finally {
            setSearchingBooking(false)
        }
    }

    async function handleRegisterCustody(e: React.FormEvent) {
        e.preventDefault()

        // Generate a random unique QR token if not provided
        const randId = Math.random().toString(36).substring(2, 10).toUpperCase()
        const qrCode = `BO-CUST-${tipo === 'locker' ? 'LK' : 'PET'}-${randId}`

        const result = await registerCustody({
            tipo,
            codigoQr: qrCode,
            reservaId: foundBooking?.id || null
        })

        if (!result.success) {
            toast.error(result.message)
            return
        }

        toast.success(result.message)

        // Set for print modal
        setReceiptItem({
            codigo: qrCode,
            tipo,
            clientName: foundBooking?.client_name || 'Cliente Particular',
            bookingCode: bookingCodeInput || undefined,
            date: new Date().toLocaleString('es-PE')
        })

        // Reset form
        setBookingCodeInput('')
        setFoundBooking(null)
        fetchCustodyItems()
    }

    async function handleCheckOut(id: string, code: string) {
        const result = await checkOutCustody(id)

        if (!result.success) {
            toast.error(result.message)
            return
        }

        toast.success(`Retiro procesado para el código: ${code}`)
        fetchCustodyItems()
    }

    function handlePrint() {
        const printContent = printRef.current?.innerHTML
        const windowUrl = 'about:blank'
        const uniqueName = new Date().getTime()
        const windowName = `Print_${uniqueName}`
        
        const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0')
        if (printWindow && printContent) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Voucher de Custodia - Blue Ocean</title>
                        <style>
                            body {
                                font-family: 'Helvetica Neue', Arial, sans-serif;
                                text-align: center;
                                padding: 20px;
                                margin: 0;
                                color: #333;
                            }
                            .card {
                                border: 2px dashed #000;
                                padding: 20px;
                                display: inline-block;
                                max-width: 300px;
                                border-radius: 8px;
                            }
                            h2 { margin: 0 0 10px 0; font-size: 20px; }
                            p { margin: 5px 0; font-size: 14px; }
                            .qr-container { margin: 20px 0; }
                            .footer { font-size: 10px; color: #777; margin-top: 15px; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h2>CUSTODIA BLUE OCEAN</h2>
                            <p><strong>Tipo:</strong> ${tipo === 'locker' ? 'LOCKER/EQUIPAJE' : 'MASCOTA'}</p>
                            <p><strong>Pasajero:</strong> ${receiptItem?.clientName}</p>
                            ${receiptItem?.bookingCode ? `<p><strong>Reserva:</strong> ${receiptItem.bookingCode}</p>` : ''}
                            <div class="qr-container">${printRef.current?.querySelector('.qr-wrapper')?.innerHTML || ''}</div>
                            <p style="font-size: 16px; font-weight: bold; letter-spacing: 1px;">${receiptItem?.codigo}</p>
                            <p class="footer">Fecha: ${receiptItem?.date}<br>Conserve este ticket para retirar sus pertenencias.</p>
                        </div>
                    </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.focus()
            // Delay print to allow rendering in some engines
            setTimeout(() => {
                printWindow.print()
                printWindow.close()
            }, 500)
        }
    }

    // Counters
    const activeLockers = items.filter(i => i.tipo === 'locker').length
    const activePets = items.filter(i => i.tipo === 'mascota').length

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Módulo de Custodia</h1>
                    <p className="text-sm text-gray-500">Gestión logística de lockers de equipaje y espacios de mascotas para pasajeros.</p>
                </div>
            </div>

            {/* Counters Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                        <Luggage className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Lockers Ocupados</p>
                        <h3 className="text-2xl font-bold text-gray-900">{activeLockers}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                        <PawPrint className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Espacios de Mascota</p>
                        <h3 className="text-2xl font-bold text-gray-900">{activePets}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-green-50 text-green-600">
                        <Check className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total en Custodia Activa</p>
                        <h3 className="text-2xl font-bold text-gray-900">{items.length}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registration Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit">
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-blue-600" />
                            Registrar Ingreso
                        </h2>
                    </div>

                    <form onSubmit={handleRegisterCustody} className="space-y-4">
                        {/* Selector de Tipo */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">Tipo de Custodia</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setTipo('locker')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition-all ${
                                        tipo === 'locker' 
                                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm' 
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Luggage className="h-4 w-4" />
                                    Equipaje (Locker)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTipo('mascota')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition-all ${
                                        tipo === 'mascota' 
                                            ? 'border-purple-600 bg-purple-50/50 text-purple-700 shadow-sm' 
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <PawPrint className="h-4 w-4" />
                                    Mascota
                                </button>
                            </div>
                        </div>

                        {/* Código de Reserva Vinculado (Opcional) */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Código de Reserva (Opcional)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="BO-1234"
                                    value={bookingCodeInput}
                                    onChange={(e) => setBookingCodeInput(e.target.value)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleSearchBooking}
                                    disabled={searchingBooking}
                                    className="px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mostrar Reserva Encontrada */}
                        {foundBooking && (
                            <div className="bg-green-50/70 border border-green-200 p-4 rounded-xl space-y-1">
                                <p className="text-xs font-semibold text-green-800">Pasajero Vinculado:</p>
                                <p className="text-sm font-bold text-green-900">{foundBooking.client_name}</p>
                                <p className="text-xs text-green-700">Tour: {foundBooking.tour_title}</p>
                                <button
                                    type="button"
                                    onClick={() => setFoundBooking(null)}
                                    className="text-xs text-red-600 hover:underline pt-1.5 block"
                                >
                                    Desvincular reserva
                                </button>
                            </div>
                        )}

                        <button
                          type="submit"
                          className={`w-full py-3 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                            tipo === 'locker' 
                              ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' 
                              : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
                          }`}
                        >
                            <Plus className="h-4 w-4" />
                            Registrar Ingreso de {tipo === 'locker' ? 'Equipaje' : 'Mascota'}
                        </button>
                    </form>
                </div>

                {/* Active Custody List */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900">Custodia Activa en Agencia</h2>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-gray-500 text-sm">Cargando custodia activa...</div>
                    ) : items.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400">
                            <Briefcase className="h-10 w-10 mb-2 opacity-50" />
                            <p className="text-sm font-semibold text-gray-500">Sin custodia activa</p>
                            <p className="text-xs">No hay lockers u equipajes registrados en este momento.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                                <thead className="bg-gray-50/75 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Código QR / ID</th>
                                        <th className="px-6 py-4">Tipo</th>
                                        <th className="px-6 py-4">Pasajero / Reserva</th>
                                        <th className="px-6 py-4">Hora Ingreso</th>
                                        <th className="px-6 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-900 flex items-center gap-2">
                                                <QrCode className="h-4 w-4 text-gray-400" />
                                                {item.codigo_qr}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.tipo === 'locker' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                        <Luggage className="h-3 w-3" />
                                                        Locker
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                                                        <PawPrint className="h-3 w-3" />
                                                        Mascota
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{item.bookings?.client_name || 'Cliente Particular'}</div>
                                                {item.bookings?.booking_code && (
                                                    <div className="text-xs text-gray-500 font-medium">Ref: {item.bookings.booking_code}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs flex items-center gap-1 mt-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(item.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleCheckOut(item.id, item.codigo_qr)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-xs transition-colors"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    Retirar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Print Voucher Modal */}
            <AnimatePresence>
                {receiptItem && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-100"
                        >
                            <div className="p-6 space-y-6" ref={printRef}>
                                <div className="text-center space-y-1">
                                    <h3 className="text-xl font-bold text-gray-900">Voucher de Custodia</h3>
                                    <p className="text-xs text-gray-500">Blue Ocean Paracas Tours</p>
                                </div>

                                <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Tipo:</span>
                                        <span className="font-bold text-gray-900 uppercase">{receiptItem.tipo === 'locker' ? 'Equipaje/Locker' : 'Mascota'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Cliente:</span>
                                        <span className="font-bold text-gray-900">{receiptItem.clientName}</span>
                                    </div>
                                    {receiptItem.bookingCode && (
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Reserva:</span>
                                            <span className="font-bold text-gray-900">{receiptItem.bookingCode}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Fecha:</span>
                                        <span>{receiptItem.date}</span>
                                    </div>
                                </div>

                                {/* QR Code Display */}
                                <div className="flex justify-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm qr-wrapper">
                                    <QRCodeSVG 
                                        value={receiptItem.codigo} 
                                        size={160} 
                                        level="M"
                                        includeMargin={false}
                                    />
                                </div>

                                <div className="text-center">
                                    <p className="font-mono font-bold text-lg tracking-wider text-gray-900">{receiptItem.codigo}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">Presente este código para retirar su equipaje/mascota de la agencia.</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Printer className="h-4 w-4" />
                                    Imprimir Voucher
                                </button>
                                <button
                                    onClick={() => setReceiptItem(null)}
                                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
