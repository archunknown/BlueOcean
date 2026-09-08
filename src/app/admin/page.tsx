import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/roles'
import AdminDashboardView from '@/components/admin/dashboard/AdminDashboardView'
import WorkerDashboardView from '@/components/admin/dashboard/WorkerDashboardView'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const role = await getUserRole()

    // Developer no tiene dashboard genérico, redirigir a métricas
    if (role === 'developer') {
        redirect('/admin/metrics')
    }

    const supabase = await createClient()

    // ── Fechas de referencia ─────────────────────────────────────────────
    const now = new Date()

    // Inicio del mes actual (UTC)
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()

    // Últimos 30 días
    const thirtyDaysAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 29)).toISOString()

    // Últimos 7 días
    const sevenDaysAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6)).toISOString()

    // Últimos 90 días
    const ninetyDaysAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 89)).toISOString()

    // Fecha de hoy en formato YYYY-MM-DD (para tour_date)
    const todayStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Lima' }) // 'sv-SE' da YYYY-MM-DD

    // ════════════════════════════════════════════════════════════════════
    // RAMA ADMIN
    // ════════════════════════════════════════════════════════════════════
    if (role === 'admin') {
        const [
            approvedMonthRows,
            statusLast30Rows,
            topToursRows,
            channelRows,
            pendingTestimonialsResult,
        ] = await Promise.all([
            // Ingresos y reservas confirmadas del mes (para KPIs y gráfico de área)
            supabase
                .from('bookings')
                .select('total_price, created_at')
                .eq('payment_status', 'approved')
                .gte('created_at', startOfMonth),

            // Reservas últimos 30 días (para dona de estados)
            supabase
                .from('bookings')
                .select('status, created_at')
                .gte('created_at', thirtyDaysAgo),

            // Top tours últimos 90 días (para barras horizontales)
            supabase
                .from('bookings')
                .select('tour_title')
                .gte('created_at', ninetyDaysAgo),

            // Canal de venta: bookings confirmados últimos 30 días
            supabase
                .from('bookings')
                .select('payment_provider')
                .eq('status', 'confirmed')
                .gte('created_at', thirtyDaysAgo),

            // Testimonios pendientes
            supabase
                .from('testimonials')
                .select('*', { count: 'exact', head: true })
                .eq('is_approved', false),
        ])

        // ── Agregaciones en servidor ─────────────────────────────────────

        // KPI: ingresos del mes y reservas confirmadas del mes
        const approvedRows = approvedMonthRows.data ?? []
        const ingresosMes = approvedRows.reduce((sum, r) => sum + (r.total_price ?? 0), 0)
        const reservasMes = approvedRows.length
        const ticketPromedio = reservasMes > 0 ? ingresosMes / reservasMes : 0
        const testimoniosPendientes = pendingTestimonialsResult.count ?? 0

        // Gráfico de área: ingresos por día (últimos 30 días)
        const byDay = new Map<string, number>()
        // Rellenar todos los días con 0 para evitar huecos
        for (let i = 29; i >= 0; i--) {
            const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
            byDay.set(d.toISOString().slice(0, 10), 0)
        }
        for (const row of approvedRows) {
            const day = new Date(row.created_at).toISOString().slice(0, 10)
            if (byDay.has(day)) {
                byDay.set(day, (byDay.get(day) ?? 0) + (row.total_price ?? 0))
            }
        }
        const revenueByDay = Array.from(byDay.entries()).map(([date, revenue]) => ({
            date: date.slice(5), // MM-DD
            revenue: Math.round(revenue * 100) / 100,
        }))

        // Gráfico de dona: reservas por estado (últimos 30 días)
        const statusMap = new Map<string, number>()
        for (const row of statusLast30Rows.data ?? []) {
            const s = row.status ?? 'unknown'
            statusMap.set(s, (statusMap.get(s) ?? 0) + 1)
        }
        const bookingsByStatus = [
            { name: 'Confirmado', value: statusMap.get('confirmed') ?? 0, color: '#2E8B57' },
            { name: 'Pago pendiente', value: statusMap.get('pending_payment') ?? 0, color: '#FFCC00' },
            { name: 'Cancelado', value: statusMap.get('cancelled') ?? 0, color: '#EF4444' },
        ].filter(d => d.value > 0)

        // Gráfico de barras: top 5 tours últimos 90 días
        const tourCount = new Map<string, number>()
        for (const row of topToursRows.data ?? []) {
            const t = row.tour_title ?? 'Sin título'
            tourCount.set(t, (tourCount.get(t) ?? 0) + 1)
        }
        const topTours = Array.from(tourCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))

        // Gráfico de dona: canal de venta
        const channelMap = new Map<string, number>()
        for (const row of channelRows.data ?? []) {
            const p = row.payment_provider ?? 'sin_proveedor'
            channelMap.set(p, (channelMap.get(p) ?? 0) + 1)
        }
        const salesChannel = [
            { name: 'Online (MercadoPago)', value: channelMap.get('mercadopago') ?? 0, color: '#1E3A5F' },
            { name: 'Presencial', value: channelMap.get('manual') ?? 0, color: '#33A8B1' },
        ].filter(d => d.value > 0)

        return (
            <AdminDashboardView
                ingresosMes={ingresosMes}
                reservasMes={reservasMes}
                ticketPromedio={ticketPromedio}
                testimoniosPendientes={testimoniosPendientes}
                revenueByDay={revenueByDay}
                bookingsByStatus={bookingsByStatus}
                topTours={topTours}
                salesChannel={salesChannel}
            />
        )
    }

    // ════════════════════════════════════════════════════════════════════
    // RAMA WORKER
    // ════════════════════════════════════════════════════════════════════
    const [
        pendingPaymentResult,
        custodiaResult,
        humanConvResult,
        todayBookingsResult,
        weeklyBookingsRows,
    ] = await Promise.all([
        // Reservas pendientes de pago
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending_payment'),

        // Custodia activa
        supabase
            .from('custodia')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'ingresado'),

        // Conversaciones esperando humano
        supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'atencion_humana'),

        // Reservas de hoy
        supabase
            .from('bookings')
            .select('tour_time, client_name, tour_title, pax, payment_status')
            .eq('tour_date', todayStr)
            .order('tour_time', { ascending: true }),

        // Volumen de reservas últimos 7 días
        supabase
            .from('bookings')
            .select('created_at')
            .gte('created_at', sevenDaysAgo),
    ])

    // Agregación de reservas por día (últimos 7 días)
    const weekMap = new Map<string, number>()
    for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
        weekMap.set(d.toISOString().slice(0, 10), 0)
    }
    for (const row of weeklyBookingsRows.data ?? []) {
        const day = new Date(row.created_at).toISOString().slice(0, 10)
        if (weekMap.has(day)) {
            weekMap.set(day, (weekMap.get(day) ?? 0) + 1)
        }
    }
    const bookingsPerDay = Array.from(weekMap.entries()).map(([date, count]) => ({
        date: date.slice(5), // MM-DD
        count,
    }))

    return (
        <WorkerDashboardView
            pendingPayment={pendingPaymentResult.count ?? 0}
            custodiaActiva={custodiaResult.count ?? 0}
            humanConversations={humanConvResult.count ?? 0}
            todayBookings={todayBookingsResult.data ?? []}
            bookingsPerDay={bookingsPerDay}
        />
    )
}
