'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface IntentLog {
    id: string
    input_text: string
    matched_intent: string | null
    similarity_score: number | null
    handled_by: 'pgvector' | 'llm' | 'human_takeover'
    response_text: string | null
    latency_ms: number | null
    created_at: string
    conversations?: { phone_number: string; estado: 'bot' | 'atencion_humana' } | null
}

interface Stats {
    totalMessages: number
    pgvectorCount: number
    llmCount: number
    pgvectorPercentage: number
    llmPercentage: number
    avgSimilarity: number
    avgLatencyMs: number
    handoffCount: number
    handoffPercentage: number
    resolutionPercentage: number
    totalSessions: number
}

interface DailyPoint { date: string; pgvector: number; llm: number; total: number }
interface SimBucket { range: string; count: number }

const EMPTY_STATS: Stats = {
    totalMessages: 0, pgvectorCount: 0, llmCount: 0,
    pgvectorPercentage: 0, llmPercentage: 0, avgSimilarity: 0,
    avgLatencyMs: 0, handoffCount: 0, handoffPercentage: 0,
    resolutionPercentage: 0, totalSessions: 0,
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

export default function MetricsPage() {
    const [logs, setLogs] = useState<IntentLog[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshedAt, setRefreshedAt] = useState<string>('')
    const [stats, setStats] = useState<Stats>(EMPTY_STATS)
    const [dailyData, setDailyData] = useState<DailyPoint[]>([])
    const [simBuckets, setSimBuckets] = useState<SimBucket[]>([])

    const fetchMetrics = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/metrics')
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body.error || `HTTP ${res.status}`)
            }
            const data = await res.json()
            setLogs(data.logs || [])
            setStats(data.stats)
            setDailyData(data.dailyData || [])
            setSimBuckets(data.simBuckets || [])
            setRefreshedAt(new Date().toLocaleTimeString('es-PE'))
            toast.success('Datos actualizados.')
        } catch {
            toast.error('Error al obtener métricas.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchMetrics() }, [fetchMetrics])

    const pieData = [
        { name: 'pgvector', value: stats.pgvectorCount, color: '#4f46e5' },
        { name: 'LLM RAG', value: stats.llmCount, color: '#0891b2' },
        { name: 'Humano', value: stats.handoffCount, color: '#d97706' },
    ].filter(d => d.value > 0)

    return (
        <div className="bg-gray-50 min-h-screen p-6 lg:p-10 space-y-8">

            {/* Page header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-indigo-600 tracking-widest uppercase mb-1">
                        Evaluación de Sistema — Tesis de Grado
                    </p>
                    <h1 className="text-xl font-bold text-gray-900">
                        Analíticas del Chatbot IA Híbrida
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">Blue Ocean Paracas Tours · Sistema multicapa pgvector + LLM</p>
                </div>
                <div className="flex items-center gap-3">
                    {refreshedAt && (
                        <span className="text-xs text-gray-400">Actualizado: {refreshedAt}</span>
                    )}
                    <button
                        onClick={fetchMetrics}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 shadow-sm"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Primary metric banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                            Similitud Coseno Promedio — Capa 1 (pgvector)
                        </p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-gray-900 tabular-nums">
                                {stats.avgSimilarity > 0 ? stats.avgSimilarity.toFixed(4) : '—'}
                            </span>
                            {stats.avgSimilarity >= 0.80 && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    ≥ Umbral 0.80 ✓
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            Calculado sobre {stats.pgvectorCount} resoluciones vectoriales locales
                        </p>
                    </div>
                    <div className="h-px lg:h-16 lg:w-px bg-gray-100" />
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Mensajes', value: stats.totalMessages },
                            { label: 'Sesiones', value: stats.totalSessions },
                            { label: 'Autonomía', value: `${stats.resolutionPercentage}%` },
                            { label: 'Latencia avg', value: stats.avgLatencyMs > 0 ? `${stats.avgLatencyMs}ms` : '—' },
                        ].map(item => (
                            <div key={item.label}>
                                <p className="text-2xl font-bold text-gray-900 tabular-nums">{item.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Layer breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
                        Distribución por Capa
                    </p>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                        paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...tooltipStyle} formatter={(v, n) => [v, n]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-3 space-y-2">
                                {pieData.map(d => (
                                    <div key={d.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                                            <span className="text-gray-600">{d.name}</span>
                                        </div>
                                        <span className="font-semibold text-gray-800">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">
                            Sin datos registrados
                        </div>
                    )}
                </div>

                {/* Similarity histogram */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
                        Histograma de Similitud Coseno
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={simBuckets} barSize={22} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip {...tooltipStyle} formatter={(v) => [v, 'Frecuencia']} />
                            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                                {simBuckets.map((entry, i) => {
                                    const fills = ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#4f46e5']
                                    return <Cell key={i} fill={fills[i] || '#4f46e5'} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Autonomy bars */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
                        Resolución por Canal
                    </p>
                    <div className="space-y-5">
                        {[
                            { label: 'Capa 1 — pgvector', pct: stats.pgvectorPercentage, count: stats.pgvectorCount, color: '#4f46e5' },
                            { label: 'Capa 2 — LLM RAG', pct: stats.llmPercentage, count: stats.llmCount, color: '#0891b2' },
                            { label: 'Operador humano', pct: stats.handoffPercentage, count: stats.handoffCount, color: '#d97706' },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                                    <span className="text-xs font-bold tabular-nums" style={{ color: item.color }}>
                                        {item.pct}%
                                        <span className="text-gray-400 font-normal ml-1">({item.count})</span>
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${item.pct}%`, background: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Tasa de resolución sin operador</p>
                        <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.resolutionPercentage}%</p>
                    </div>
                </div>
            </div>

            {/* Volume time-series */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
                    Volumen de Interacciones — Últimos 14 días
                </p>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                        <defs>
                            <linearGradient id="gPgv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gLlm" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0891b2" stopOpacity={0.12} />
                                <stop offset="100%" stopColor="#0891b2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip {...tooltipStyle} />
                        <Area type="monotone" dataKey="pgvector" name="Capa 1 pgvector"
                            stroke="#4f46e5" strokeWidth={1.5} fill="url(#gPgv)" dot={false} />
                        <Area type="monotone" dataKey="llm" name="Capa 2 LLM"
                            stroke="#0891b2" strokeWidth={1.5} fill="url(#gLlm)" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-5 mt-3">
                    {[{ color: '#4f46e5', label: 'Capa 1 pgvector' }, { color: '#0891b2', label: 'Capa 2 LLM' }].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                            <span className="text-xs text-gray-400">{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interaction log */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Registro de Interacciones — últimas 100 entradas
                    </p>
                </div>
                {loading ? (
                    <div className="py-16 text-center text-sm text-gray-400">Cargando registros...</div>
                ) : logs.length === 0 ? (
                    <div className="py-16 text-center text-sm text-gray-400">
                        Sin interacciones registradas aún.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    {['Timestamp', 'Teléfono', 'Mensaje entrada', 'Intención', 'Capa', 'Sim. coseno', 'Latencia'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap tabular-nums">
                                            {new Date(log.created_at).toLocaleString('es-PE', {
                                                day: '2-digit', month: '2-digit',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">
                                            {log.conversations?.phone_number ? `+${log.conversations.phone_number}` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate" title={log.input_text}>
                                            {log.input_text || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate" title={log.matched_intent || ''}>
                                            {log.matched_intent || '—'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {log.handled_by === 'pgvector' ? (
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                                                    pgvector
                                                </span>
                                            ) : log.handled_by === 'llm' ? (
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-700">
                                                    LLM RAG
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                                                    Humano
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                                            {log.similarity_score != null && log.similarity_score > 0 ? (
                                                <span className={log.similarity_score >= 0.80 ? 'text-emerald-600 font-semibold' : 'text-amber-500'}>
                                                    {log.similarity_score.toFixed(4)}
                                                </span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-400 tabular-nums whitespace-nowrap">
                                            {log.latency_ms ? `${log.latency_ms}ms` : <span className="text-gray-300">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
