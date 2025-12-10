'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { Check, X, Trash2, MapPin, Loader2, MessageSquare, Star, Quote } from 'lucide-react'
import { approveTestimonial, rejectTestimonial } from '@/app/actions/testimonials'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
    id: number
    name: string
    location: string
    content: string
    rating: number
    is_approved: boolean
    created_at: string
}

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'pending' | 'approved'>('pending')
    const [pendingActionId, setPendingActionId] = useState<number | null>(null)
    const [isPending, startTransition] = useTransition()

    const supabase = createClient()

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function fetchTestimonials() {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('Error al cargar testimonios')
        } else {
            setTestimonials(data || [])
        }
        setIsLoading(false)
    }

    async function handleApprove(id: number) {
        setPendingActionId(id)
        startTransition(async () => {
            const result = await approveTestimonial(id)
            if (result.success) {
                toast.success('Testimonio aprobado')
                setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_approved: true } : t))
            } else {
                toast.error('Error al aprobar')
            }
            setPendingActionId(null)
        })
    }

    async function handleReject(id: number) {
        if (!confirm('¿Estás seguro de que quieres eliminar este testimonio?')) return

        setPendingActionId(id)
        startTransition(async () => {
            const result = await rejectTestimonial(id)
            if (result.success) {
                toast.success('Testimonio eliminado')
                setTestimonials(prev => prev.filter(t => t.id !== id))
            } else {
                toast.error('Error al eliminar')
            }
            setPendingActionId(null)
        })
    }

    const pendingCount = testimonials.filter(t => !t.is_approved).length
    const approvedCount = testimonials.filter(t => t.is_approved).length
    const avgRating = testimonials.length > 0
        ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
        : '0.0'

    const filteredTestimonials = testimonials.filter(t =>
        filter === 'pending' ? !t.is_approved : t.is_approved
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto"
        >
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Moderación</h1>
                    <p className="text-sm text-gray-500 mt-2 max-w-lg">
                        Gestiona las opiniones de tus clientes. Aprueba las auténticas para mostrarlas en la web.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 md:w-32 text-center">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendientes</p>
                        <p className={`text-2xl font-bold ${pendingCount > 0 ? 'text-blue-600' : 'text-gray-900'}`}>{pendingCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 md:w-32 text-center">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Publicados</p>
                        <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 md:w-32 text-center hidden sm:block">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</p>
                        <div className="flex items-center justify-center gap-1">
                            <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Custom Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${filter === 'pending'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <span>Pendientes de Revisión</span>
                            {pendingCount > 0 && (
                                <span className={`ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block ${filter === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'}`}>
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${filter === 'approved'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <span>Publicados</span>
                            <span className={`ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block ${filter === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'}`}>
                                {approvedCount}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No hay testimonios aquí</h3>
                        <p className="text-gray-500 mt-1">
                            {filter === 'pending' ? '¡Estás al día! No hay nuevas reseñas pendientes.' : 'Aún no has aprobado ningún testimonio.'}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTestimonials.map((testimonial) => (
                                <motion.div
                                    key={testimonial.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
                                >
                                    <div className="p-6 flex-1">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm">{testimonial.name}</h3>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {testimonial.location || 'Mundo'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold items-center gap-1">
                                                {testimonial.rating} <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                            </div>
                                        </div>

                                        {/* Quote */}
                                        <div className="relative">
                                            <Quote className="absolute -top-1 -left-1 h-6 w-6 text-gray-100 transform -scale-x-100" />
                                            <p className="text-gray-600 text-sm leading-relaxed relative z-10 pl-4 italic">
                                                "{testimonial.content}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                                        {filter === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(testimonial.id)}
                                                disabled={pendingActionId === testimonial.id}
                                                className="flex-1 bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 hover:text-green-700 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
                                            >
                                                {pendingActionId === testimonial.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                Aprobar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleReject(testimonial.id)}
                                            disabled={pendingActionId === testimonial.id}
                                            className={`flex-1 bg-white border border-gray-200 hover:border-red-500 hover:bg-red-50 hover:text-red-700 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${filter === 'approved' ? 'w-full text-red-600' : ''}`}
                                        >
                                            {pendingActionId === testimonial.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            {filter === 'pending' ? 'Ignorar' : 'Eliminar de la web'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    )
}
