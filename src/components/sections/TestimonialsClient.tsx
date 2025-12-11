'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface Testimonial {
    id: number
    name: string
    location: string
    content: string
    rating: number
}

interface TestimonialsClientProps {
    testimonials: Testimonial[]
}

const StarIcon = ({ i, rating }: { i: number; rating: number }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
    >
        <Star
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
        />
    </motion.div>
)

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
    if (testimonials.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-blue-500 fill-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Sé el primero en contarnos tu aventura!</h3>
                <p className="text-gray-500">
                    Tu opinión es muy valiosa para nosotros y ayuda a otros viajeros a elegir su próxima experiencia.
                </p>
            </div>
        )
    }

    // Duplicar para efecto infinito si hay suficientes items, si no, solo mostrar
    const displayTestimonials = testimonials.length > 3
        ? [...testimonials, ...testimonials]
        : testimonials

    const enableScroll = testimonials.length > 3

    return (
        <div className="relative">
            {/* Máscara de desvanecimiento para el carrusel */}
            <div className={`group relative w-full ${enableScroll ? '[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]' : ''}`}>
                <motion.div
                    className={`flex ${enableScroll ? 'min-w-full animate-scroll' : 'justify-center flex-wrap'} gap-6 group-hover:[animation-play-state:paused] py-10`}
                    animate={enableScroll ? { x: ['0%', '-50%'] } : undefined}
                    transition={enableScroll ? { ease: 'linear', duration: 40, repeat: Infinity } : undefined}
                >
                    {displayTestimonials.map((testimonial, index) => (
                        <div
                            key={`${testimonial.id}-${index}`}
                            className="w-[85vw] max-w-md flex-shrink-0 sm:w-[70vw] lg:w-[450px]"
                        >
                            <div className="h-full rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 sm:p-8 flex flex-col justify-between">
                                <div>
                                    {/* Header con avatar y estrellas */}
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar (Iniciales) */}
                                            <div className="relative">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-lg font-bold text-white shadow-md">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                            </div>

                                            {/* Nombre y ubicación */}
                                            <div>
                                                <p className="font-bold text-blue-900 sm:text-lg">{testimonial.name}</p>
                                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                                            </div>
                                        </div>

                                        {/* Badge de verificado (Dummy Visual) */}
                                        <div className="rounded-full bg-cyan-500/10 p-2">
                                            <svg className="h-5 w-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Estrellas */}
                                    <div className="mb-4 flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} i={i} rating={testimonial.rating} />
                                        ))}
                                    </div>

                                    {/* Testimonial */}
                                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base italic">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                {/* Footer con icono */}
                                <div className="mt-6 flex items-center gap-2 text-cyan-600">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-semibold">Experiencia Verificada</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
