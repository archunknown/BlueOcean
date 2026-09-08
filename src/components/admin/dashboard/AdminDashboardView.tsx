'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
    TrendingUp, Calendar, CreditCard, MessageSquare,
    Compass, Users, Image as ImageIcon, Settings,
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
    color: string   // hex
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

// ── Chart card wrapper ──────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{title}</h2>
            {children}
        </div>
    )
}

// ── Props ───────────────────────────────────────────────────────────────
interface AdminDashboardViewProps {
    ingresosMes: number
    reservasMes: number
    ticketPromedio: number
    testimoniosPendientes: number
    revenueByDay: { date: string; revenue: number }[]
    bookingsByStatus: { name: string; value: number; color: string }[]
    topTours: { name: string; count: number }[]
    salesChannel: { name: string; value: number; color: string }[]
}

function formatCurrency(n: number) {
    return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function AdminDashboardView({
    ingresosMes,
    reservasMes,
    ticketPromedio,
    testimoniosPendientes,
    revenueByDay,
    bookingsByStatus,
    topTours,
    salesChannel,
}: AdminDashboardViewProps) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Panel de administración · Blue Ocean Paracas</p>
            </motion.div>

            {/* KPI Grid */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <KpiCard
                    label="Ingresos del mes"
                    value={formatCurrency(ingresosMes)}
                    icon={TrendingUp}
                    color={BRAND.oceanBlue}
                    subtext="Pagos aprobados este mes"
                />
                <KpiCard
                    label="Reservas confirmadas"
                    value={reservasMes}
                    icon={Calendar}
                    color={BRAND.emeraldGreen}
                    subtext="Este mes"
                />
                <KpiCard
                    label="Ticket promedio"
                    value={formatCurrency(ticketPromedio)}
                    icon={CreditCard}
                    color={BRAND.turquoise}
                    subtext="Ingreso / reserva confirmada"
                />
                <KpiCard
                    label="Testimonios pendientes"
                    value={testimoniosPendientes}
                    icon={MessageSquare}
                    color={testimoniosPendientes > 0 ? BRAND.danger : BRAND.emeraldGreen}
                    subtext={testimoniosPendientes > 0 ? 'Requieren aprobación' : 'Todo al día ✓'}
                />
            </motion.div>

            {/* Gráficos — fila 1: área (wide) + dona de estados */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="grid gap-6 lg:grid-cols-3"
            >
                {/* Área: ingresos por día */}
                <div className="lg:col-span-2">
                    <ChartCard title="Ingresos confirmados — últimos 30 días">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={revenueByDay} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradOcean" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={BRAND.oceanBlue} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={BRAND.oceanBlue} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={4}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `S/${v}`}
                                    width={52}
                                />
                                <Tooltip
                                    {...tooltipStyle}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(v: any) => [`S/ ${Number(v ?? 0).toFixed(2)}`, 'Ingresos']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke={BRAND.oceanBlue}
                                    strokeWidth={2}
                                    fill="url(#gradOcean)"
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 0, fill: BRAND.oceanBlue }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Dona: estados de reservas */}
                <ChartCard title="Reservas por estado — últimos 30 días">
                    {bookingsByStatus.length === 0 ? (
                        <div className="flex items-center justify-center h-[220px] text-sm text-gray-400">Sin datos</div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={bookingsByStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={46}
                                        outerRadius={72}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {bookingsByStatus.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        {...tooltipStyle}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(v: any) => [Number(v ?? 0), 'Reservas']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-1.5 mt-2">
                                {bookingsByStatus.map((d) => (
                                    <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1.5 text-gray-600">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                            {d.name}
                                        </span>
                                        <span className="font-semibold text-gray-800">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </ChartCard>
            </motion.div>

            {/* Gráficos — fila 2: top tours + canal de venta */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-6 lg:grid-cols-2"
            >
                {/* Barras horizontales: top 5 tours */}
                <ChartCard title="Top 5 tours más reservados — últimos 90 días">
                    {topTours.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">Sin datos</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={topTours}
                                layout="vertical"
                                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={130}
                                    tick={{ fontSize: 10, fill: '#374151' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v: string) => v.length > 20 ? v.slice(0, 18) + '…' : v}
                                />
                                <Tooltip
                                    {...tooltipStyle}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(v: any) => [Number(v ?? 0), 'Reservas']}
                                />
                                <Bar dataKey="count" fill={BRAND.turquoise} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Dona: canal de venta */}
                <ChartCard title="Canal de venta: Online vs Presencial — últimos 30 días">
                    {salesChannel.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">Sin reservas confirmadas en el período</div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={salesChannel}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={42}
                                        outerRadius={66}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {salesChannel.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        {...tooltipStyle}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(v: any) => [Number(v ?? 0), 'Reservas']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-1.5 mt-2">
                                {salesChannel.map((d) => (
                                    <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1.5 text-gray-600">
                                            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                            {d.name}
                                        </span>
                                        <span className="font-semibold text-gray-800">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </ChartCard>
            </motion.div>

            {/* Acciones Rápidas */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Acciones Rápidas</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link href="/admin/tours/new">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-oceanBlue hover:text-oceanBlue transition-colors">
                            <Compass className="mx-auto mb-2 h-6 w-6" />
                            Crear Tour
                        </button>
                    </Link>
                    <Link href="/admin/clients">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-turquoise hover:text-turquoise transition-colors">
                            <Users className="mx-auto mb-2 h-6 w-6" />
                            Registrar Cliente
                        </button>
                    </Link>
                    <Link href="/admin/gallery">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-turquoise hover:text-turquoise transition-colors">
                            <ImageIcon className="mx-auto mb-2 h-6 w-6" />
                            Subir Imagen
                        </button>
                    </Link>
                    <Link href="/admin/settings">
                        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm font-medium text-gray-600 hover:border-gray-500 hover:text-gray-800 transition-colors">
                            <Settings className="mx-auto mb-2 h-6 w-6" />
                            Configuración
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
