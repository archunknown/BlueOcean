import { createClient } from '@/utils/supabase/server'
import TestimonialForm from './TestimonialForm'
import TestimonialsClient from './TestimonialsClient'

export default async function Testimonials() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  return (
    <section className="overflow-hidden bg-lightGray pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-4">
            Historias Reales de Aventureros
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">
            <span className="font-bold text-yellow-500">4.9/5</span> basado en clientes felices
          </p>
        </div>

        {/* Cliente para la animación del carrusel */}
        <TestimonialsClient testimonials={testimonials || []} />

        {/* Formulario de Envío */}
        <div className="mt-20">
          <TestimonialForm />
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:mt-16 sm:grid-cols-4 sm:gap-8">
          {[
            { label: 'Tours Realizados', value: '1,500+' },
            { label: 'Clientes Felices', value: '1,000+' },
            { label: 'Años de Experiencia', value: '3+' },
            { label: 'Rating Promedio', value: '4.9/5' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-black text-blue-900 sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}