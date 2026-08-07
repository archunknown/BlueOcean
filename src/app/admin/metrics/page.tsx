'use client'

import { useState, useEffect } from 'react'
import { 
    Activity, 
    BarChart3, 
    Bot, 
    BrainCircuit, 
    CheckCircle2, 
    Clock, 
    HelpCircle, 
    Layers, 
    MessageSquare, 
    Percent, 
    RefreshCw, 
    UserCheck, 
    UserX 
} from 'lucide-react'
import { toast } from 'sonner'

interface IntentLog {
    id: string
    input_text: string
    matched_intent: string | null
    similarity_score: number | null
    handled_by: 'pgvector' | 'llm'
    response_text: string | null
    latency_ms: number | null
    created_at: string
    conversations?: {
        phone_number: string
        estado: 'bot' | 'atencion_humana'
    } | null
}

export default function MetricsPage() {
    const [logs, setLogs] = useState<IntentLog[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalMessages: 0,
        pgvectorCount: 0,
        llmCount: 0,
        pgvectorPercentage: 0,
        llmPercentage: 0,
        avgSimilarity: 0,
        handoffCount: 0,
        handoffPercentage: 0,
        resolutionPercentage: 0
    })

    useEffect(() => {
        fetchMetrics()
    }, [])

    async function fetchMetrics() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/metrics')
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}))
                throw new Error(errBody.error || `HTTP ${res.status}`)
            }

            const data = await res.json()

            setLogs((data.logs || []) as IntentLog[])
            setStats(data.stats)
            
            toast.success('Métricas de chatbot actualizadas.')
        } catch (err) {
            console.error('Error fetching metrics:', err)
            toast.error('No se pudieron obtener los registros de analíticas.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Métricas & Analíticas del Bot</h1>
                    <p className="text-sm text-gray-500">Evaluación académica y rendimiento del chatbot de IA Híbrida en producción (Tesis de Grado).</p>
                </div>
                <button
                    onClick={fetchMetrics}
                    disabled={loading}
                    className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar Datos
                </button>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-400">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-blue-50 px-2 py-0.5 rounded-full">Bot Load</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stats.totalMessages}</p>
                    <p className="text-xs text-gray-500 font-medium">Mensajes procesados por la IA</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-400">
                        <BrainCircuit className="h-5 w-5 text-purple-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-purple-50 px-2 py-0.5 rounded-full">Capa 1</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stats.pgvectorPercentage}%</p>
                    <p className="text-xs text-gray-500 font-medium">Resuelto localmente en pgvector</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-400">
                        <Layers className="h-5 w-5 text-indigo-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-indigo-50 px-2 py-0.5 rounded-full">Capa 2</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stats.llmPercentage}%</p>
                    <p className="text-xs text-gray-500 font-medium">Escalado a LLM (Gemini/Groq)</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-gray-400">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-green-50 px-2 py-0.5 rounded-full">Autonomía</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stats.resolutionPercentage}%</p>
                    <p className="text-xs text-gray-500 font-medium">Tasa de resolución sin operador</p>
                </div>
            </div>

            {/* Academic Evaluation Matrices (Tesis metrics) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Resolution Layers Stats */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Distribución de Carga de IA
                    </h2>
                    
                    <div className="space-y-4">
                        {/* pgvector Layer */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-gray-700 flex items-center gap-1.5">
                                    <Bot className="h-4 w-4 text-purple-600" />
                                    Capa 1: pgvector (Similitud Cos.)
                                </span>
                                <span className="text-gray-900">{stats.pgvectorCount} ({stats.pgvectorPercentage}%)</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-purple-600 transition-all duration-500" 
                                    style={{ width: `${stats.pgvectorPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* LLM Fallback Layer */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-gray-700 flex items-center gap-1.5">
                                    <BrainCircuit className="h-4 w-4 text-indigo-600" />
                                    Capa 2: LLM (Gemini Flash RAG)
                                </span>
                                <span className="text-gray-900">{stats.llmCount} ({stats.llmPercentage}%)</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-600 transition-all duration-500" 
                                    style={{ width: `${stats.llmPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Handoff Rate */}
                        <div className="space-y-1 pt-2 border-t border-gray-100">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-gray-700 flex items-center gap-1.5">
                                    <UserCheck className="h-4 w-4 text-red-600" />
                                    Derivado a Operador Humano
                                </span>
                                <span className="text-gray-900">{stats.handoffCount} ses. ({stats.handoffPercentage}%)</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-red-500 transition-all duration-500" 
                                    style={{ width: `${stats.handoffPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-blue-900">Métrica Académica de Tesis:</h4>
                        <p className="text-[11px] text-blue-800 leading-relaxed">
                            <strong>Similitud Coseno Promedio:</strong> {stats.avgSimilarity} (Corte en &ge; 0.80).<br />
                            Una tasa alta en Capa 1 indica respuestas óptimas, menor tiempo de respuesta y coste de ejecución nulo ($0/mes).
                        </p>
                    </div>
                </div>

                {/* Log de Interacciones */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Historial de Intenciones y Logs (Recientes)
                    </h2>

                    {loading ? (
                        <div className="py-12 text-center text-gray-500 text-sm">Cargando registros...</div>
                    ) : logs.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl p-6 text-gray-400">
                            <Bot className="h-10 w-10 mb-2 opacity-50" />
                            <p className="text-sm font-semibold text-gray-500">Sin interacciones de bot registradas</p>
                            <p className="text-xs">Los mensajes entrantes por WhatsApp se loguearán aquí automáticamente.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">Timestamp</th>
                                        <th className="px-4 py-3">Teléfono</th>
                                        <th className="px-4 py-3">Mensaje Turista</th>
                                        <th className="px-4 py-3">Intención Detectada</th>
                                        <th className="px-4 py-3">Capa</th>
                                        <th className="px-4 py-3 text-right">Confianza (Sim)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleTimeString('es-PE')}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-medium text-gray-700 whitespace-nowrap">
                                                {log.conversations?.phone_number || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 max-w-[200px] truncate text-gray-900" title={log.input_text}>
                                                {log.input_text}
                                            </td>
                                            <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                                                {log.matched_intent || 'n/a'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {log.handled_by === 'pgvector' ? (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                                        Capa 1: vector
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        Capa 2: LLM
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-semibold whitespace-nowrap">
                                                {log.similarity_score !== null && log.similarity_score > 0 
                                                    ? log.similarity_score.toFixed(4) 
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
