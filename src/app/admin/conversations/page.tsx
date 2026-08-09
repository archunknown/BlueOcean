'use client'

import { useState, useEffect, useRef } from 'react'
import {
    MessageSquare,
    Send,
    RefreshCw,
    Bot,
    UserCheck,
    Phone,
    Clock,
    ToggleLeft,
    ToggleRight,
    ArrowLeft,
    Headphones
} from 'lucide-react'
import { toast } from 'sonner'

interface Message {
    id: string
    input_text: string
    response_text: string | null
    handled_by: 'pgvector' | 'llm' | 'human_takeover'
    matched_intent?: string | null
    created_at: string
}

interface Conversation {
    id: string
    phone_number: string
    estado: 'bot' | 'atencion_humana'
    updated_at: string
    messages: Message[]
}

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
    const [loading, setLoading] = useState(true)
    const [messageText, setMessageText] = useState('')
    const [sending, setSending] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchConversations()

        // Auto-refresco cada 3 segundos para mantener el chat actualizado
        const interval = setInterval(() => {
            fetchConversations(true)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [selectedConv?.messages])

    const selectedConvRef = useRef<Conversation | null>(null)
    useEffect(() => {
        selectedConvRef.current = selectedConv
    }, [selectedConv])

    async function fetchConversations(silent = false) {
        if (!silent) setLoading(true)
        try {
            const res = await fetch('/api/admin/conversations')
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setConversations(data.conversations || [])

            // Actualizar la conversación seleccionada si existe
            const currentSelected = selectedConvRef.current
            if (currentSelected) {
                const updated = (data.conversations || []).find(
                    (c: Conversation) => c.id === currentSelected.id
                )
                if (updated) setSelectedConv(updated)
            }

            if (!silent) toast.success('Conversaciones actualizadas.')
        } catch (err) {
            console.error('Error fetching conversations:', err)
            if (!silent) toast.error('Error al cargar conversaciones.')
        } finally {
            if (!silent) setLoading(false)
        }
    }

    async function toggleEstado(conv: Conversation) {
        const nuevoEstado = conv.estado === 'bot' ? 'atencion_humana' : 'bot'
        try {
            const res = await fetch('/api/admin/conversations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId: conv.id, estado: nuevoEstado }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            toast.success(`Estado cambiado a "${nuevoEstado === 'bot' ? 'Bot' : 'Atención Humana'}"`)
            await fetchConversations()
        } catch (err) {
            console.error('Error toggling estado:', err)
            toast.error('Error al cambiar estado.')
        }
    }

    async function sendMessage() {
        if (!selectedConv || !messageText.trim()) return
        setSending(true)
        try {
            const res = await fetch('/api/admin/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedConv.id,
                    phoneNumber: selectedConv.phone_number,
                    messageText: messageText.trim(),
                }),
            })
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}))
                throw new Error(errBody.error || `HTTP ${res.status}`)
            }
            toast.success('Mensaje enviado por WhatsApp.')
            setMessageText('')
            await fetchConversations()
        } catch (err) {
            console.error('Error sending message:', err)
            toast.error('Error al enviar mensaje.')
        } finally {
            setSending(false)
        }
    }

    function formatTime(dateStr: string) {
        return new Date(dateStr).toLocaleString('es-PE', {
            day: '2-digit', month: '2-digit',
            hour: '2-digit', minute: '2-digit',
        })
    }

    return (
        <div className="p-6 md:p-8 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Headphones className="h-6 w-6 text-blue-600" />
                        Conversaciones WhatsApp
                    </h1>
                    <p className="text-sm text-gray-500">Panel de atención humana y gestión de sesiones del bot.</p>
                </div>
                <button
                    onClick={() => fetchConversations()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Lista de conversaciones */}
                <div className={`${selectedConv ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-sm font-bold text-gray-700">Sesiones ({conversations.length})</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {loading && conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">Sin conversaciones registradas.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConv(conv)}
                                    className={`w-full text-left p-4 hover:bg-blue-50/50 transition-colors ${selectedConv?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-mono text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                            +{conv.phone_number}
                                        </span>
                                        {conv.estado === 'atencion_humana' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                                <UserCheck className="h-3 w-3" /> Humano
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                                <Bot className="h-3 w-3" /> Bot
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{conv.messages.length} mensajes</span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(conv.updated_at)}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Panel de chat */}
                <div className={`${selectedConv ? 'flex' : 'hidden lg:flex'} flex-col flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
                    {selectedConv ? (
                        <>
                            {/* Header del chat */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedConv(null)}
                                        className="lg:hidden p-1 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                                    </button>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                                            <Phone className="h-4 w-4 text-blue-600" />
                                            +{selectedConv.phone_number}
                                        </h3>
                                        <p className="text-xs text-gray-500">ID: {selectedConv.id.substring(0, 8)}...</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleEstado(selectedConv)}
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                        selectedConv.estado === 'atencion_humana'
                                            ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    }`}
                                >
                                    {selectedConv.estado === 'atencion_humana' ? (
                                        <><ToggleRight className="h-4 w-4" /> Modo: Humano</>
                                    ) : (
                                        <><ToggleLeft className="h-4 w-4" /> Modo: Bot</>
                                    )}
                                </button>
                            </div>

                            {/* Mensajes */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                                {selectedConv.messages.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm py-12">Sin mensajes registrados.</div>
                                ) : (
                                    [...selectedConv.messages].reverse().map((msg) => (
                                        <div key={msg.id} className="space-y-1.5">
                                            {/* Mensaje del cliente (burbuja izquierda) */}
                                            {msg.input_text && msg.input_text.trim() !== '' && (
                                                <div className="flex justify-start">
                                                    <div className="max-w-[75%] bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.input_text}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1 text-right">{formatTime(msg.created_at)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Respuesta del bot o del operador (burbuja derecha) */}
                                            {msg.response_text && msg.response_text.trim() !== '' && (
                                                <div className="flex justify-end">
                                                    <div className={`max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm ${
                                                        msg.handled_by === 'human_takeover'
                                                            ? 'bg-orange-50 border border-orange-200'
                                                            : msg.handled_by === 'pgvector'
                                                                ? 'bg-purple-50 border border-purple-200'
                                                                : 'bg-blue-50 border border-blue-200'
                                                    }`}>
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            {msg.handled_by === 'human_takeover' ? (
                                                                <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1"><UserCheck className="h-3 w-3" /> Operador</span>
                                                            ) : msg.handled_by === 'pgvector' ? (
                                                                <span className="text-[10px] font-bold text-purple-600 flex items-center gap-1"><Bot className="h-3 w-3" /> Capa 1</span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><Bot className="h-3 w-3" /> Capa 2</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.response_text}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1 text-right">{formatTime(msg.created_at)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Campo de envío */}
                            <div className="p-4 border-t border-gray-100 bg-white">
                                {selectedConv.estado === 'atencion_humana' ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                            placeholder="Escribir respuesta como operador..."
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={sending}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={sending || !messageText.trim()}
                                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
                                        >
                                            <Send className="h-4 w-4" />
                                            Enviar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-2 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Bot className="h-5 w-5 mx-auto mb-1 text-green-500" />
                                        Bot activo. Cambia a modo &quot;Humano&quot; para responder manualmente.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">Selecciona una conversación</p>
                                <p className="text-xs mt-1">Los chats activos aparecerán en el panel izquierdo.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
