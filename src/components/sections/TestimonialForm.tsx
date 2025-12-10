'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Star, Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { submitTestimonial } from '@/app/actions/testimonials'

export default function TestimonialForm() {
    const [isPending, startTransition] = useTransition()
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)

    async function handleSubmit(formData: FormData) {
        formData.set('rating', rating.toString())

        startTransition(async () => {
            const result = await submitTestimonial(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('¡Gracias por tu opinión!', {
                    description: 'Será publicada en breve tras la verificación.'
                })
                // Reset form manually since we're using controlled rating but uncontrolled inputs roughly
                const form = document.getElementById('testimonial-form') as HTMLFormElement
                form?.reset()
                setRating(5)
            }
        })
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Comparte tu Experiencia</h3>
                <p className="text-gray-500">Tu opinión nos ayuda a mejorar y guía a otros viajeros.</p>
            </div>

            <form id="testimonial-form" action={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Tu nombre"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad / País</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ej: Lima, Perú"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-100 text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-3 text-sm font-medium text-gray-500">
                            {hoverRating || rating}/5
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tu Mensaje</label>
                    <textarea
                        name="content"
                        required
                        rows={4}
                        placeholder="¡Cuéntanos qué fue lo que más te gustó!"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                </div>

                {/* Anti-Spam Honeypot - Hidden from users */}
                <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                Enviar Opinión
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
