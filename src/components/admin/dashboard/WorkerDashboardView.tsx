'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
    Clock, Package, Headphones, CalendarPlus, Briefcase, ClipboardList
} from 'lucide-react'

// ── Paleta de marca ────────────────────────────────────────────────────
const BRAND = {
    oceanBlue: '#1E3A5F',
    turquoise: '#33A8B1',
    warmYellow: '#FFCC00',
    emeraldGreen: '#2E8B57',
    danger: '#EF4444',
}

const tooltipStyle = {
    contentStyle: {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    },
    labelStyle: { fontWeight: 700, color: '#111827', marginBottom: 4 },
}

// ── KpiCard ─────────────────────────────────────────────────────────────
interface KpiCardProps {
    label: string
    value: string | number
    icon: React.ElementType
    color: string
    subtext?: string
}

function KpiCard({ label, value, icon: Icon, color, subtext }: KpiCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-start gap-4">
            <div
                className="flex-shrink-0 rounded-xl p-3"
                style={{ backgroundColor: `${color}18` }}
            >
                <Icon className="h-6 w-6" style={{ color }} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
                {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
            </div>
        </div>
    )
}

// ── Props ───────────────────────────────────────────────────────────────
interface TodayBooking {
    tour_time: string
    client_name: string
    tour_title: string
    pax: number
    payment_status: string
}

interface WorkerDashboardViewProps {
    pendingPayment: number
    custodiaActiva: number
    humanConversations: number
    todayBookings: TodayBooking[]
    bookingsPerDay: { date: string; count: number }[]
}

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
    approved: { label: 'Pagado', color: '#2E8B57' },
    pending: { label: 'Pendiente', color: '#FFCC00' },
    rejected: { label: 'Rechazado', color: '#EF4444' },
}

export default function WorkerDashboardView({
    pendingPayment,
    custodiaActiva,
    humanConversations,
    todayBookings,
    bookingsPerDay,
}: WorkerDashboardViewProps) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Vista operativa · Blue Ocean Paracas</p>
                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-turquoise/10 text-turquoise border border-turquoise/20">
                    Modo Trabajador
                </span>
            </motion.div>

            {/* KPI Grid */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid gap-4 sm:grid-cols-3"
            >
                <KpiCard
                    label="Reservas pendientes de pago"
                    value={pendingPayment}
                    icon={Clock}
                    color={pendingPayment > 0 ? BRAND.warmYellow : BRAND.emeraldGreen}
                    subtext={pendingPayment > 0 ? 'Requieren validación' : 'Sin pendientes ✓'}
                />
                <KpiCard
                    label="Custodia activa ahora"
                    value={custodiaActiva}
                    icon={Package}
                    color={BRAND.turquoise}
                    subtext="Items en custodia (no retirados)"
                />
                <KpiCard
                    label="Esperando atención humana"
                    value={humanConversations}
                    icon={Headphones}
                    color={humanConversations > 0 ? BRAND.danger : BRAND.emeraldGreen}
                    subtext={humanConversations > 0 ? 'Chats pendientes de respuesta' : 'Sin chats pendientes ✓'}
                />
            </motion.div>

            {/* Tabla de hoy + Gráfico semanal */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="grid gap-6 lg:grid-cols-3"
            >
                {/* Reservas de hoy */}
                <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Reservas de hoy
                        </h2>
                        <Link
                            href="/admin/bookings"
                            className="text-xs font-medium text-turquoise hover:underline"
                        >
                            Ver todas
                        </Link>
                    </div>

                    {todayBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-center">
                            <CalendarPlus className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-500">Sin reservas para hoy</p>
                            <p className="text-xs text-gray-400 mt-1">Las reservas del día aparecerán aquí</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Hora</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Cliente</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Tour</th>
                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Pax</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Pago</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {todayBookings.map((b, i) => {
                                        const ps = paymentStatusLabels[b.payment_status] ?? { label: b.payment_status, color: '#9ca3af' }
                                        return (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">
                                                    {b.tour_time?.slice(0, 5) ?? '—'}
                                                </td>
                                                <td className="px-5 py-3 text-gray-900 font-medium whitespace-nowrap">
                                                    {b.client_name}
                                                </td>
                                                <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate" title={b.tour_title}>
                                                    {b.tour_title}
                                                </td>
                                                <td className="px-5 py-3 text-center text-gray-700">
                                                    {b.pax}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <span
                                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                                        style={{
                                                            backgroundColor: `${ps.color}18`,
                                                            color: ps.color,
                                                        }}
                                                    >
                                                        {ps.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Gráfico de barras semanal */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                        Reservas — últimos 7 días
                    </h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={bookingsPerDay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                {...tooltipStyle}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(v: any) => [Number(v ?? 0), 'Reservas']}
                            />
                            <Bar dataKey="count" fill={BRAND.turquoise} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Acciones Rápidas */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Acciones Rápidas</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                    <Link href="/admin/bookings/new">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-oceanBlue hover:text-oceanBlue transition-colors">
                            <CalendarPlus className="mx-auto mb-2 h-6 w-6" />
                            Reserva Inmediata
                        </button>
                    </Link>
                    <Link href="/admin/custodia">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-turquoise hover:text-turquoise transition-colors">
                            <Briefcase className="mx-auto mb-2 h-6 w-6" />
                            Custodia
                        </button>
                    </Link>
                    <Link href="/admin/bookings">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-turquoise hover:text-turquoise transition-colors">
                            <ClipboardList className="mx-auto mb-2 h-6 w-6" />
                            Ver Reservas
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
