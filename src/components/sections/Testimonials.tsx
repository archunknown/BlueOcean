'use client';
import { motion } from 'framer-motion';

const testimonialsData = [
  // ... (datos de testimonios sin cambios)
  {
    name: 'Ana García',
    avatar: 'AG',
    location: 'Lima, Perú',
    testimonial: '¡Una experiencia inolvidable! El tour a las Islas Ballestas fue espectacular. El equipo de Blue Ocean es muy profesional y amable.',
    rating: 5,
  },
  {
    name: 'John Davis',
    avatar: 'JD',
    location: 'New York, USA',
    testimonial: 'El desierto de Paracas es de otro mundo. El paseo en buggy fue pura adrenalina. ¡Totalmente recomendado!',
    rating: 5,
  },
  {
    name: 'Maria Silva',
    avatar: 'MS',
    location: 'São Paulo, Brasil',
    testimonial: 'Servicio excelente y tours bien organizados. Aprendí mucho sobre la fauna local. Gracias, Blue Ocean.',
    rating: 5,
  },
  {
    name: 'Carlos Rodriguez',
    avatar: 'CR',
    location: 'Buenos Aires, Argentina',
    testimonial: 'La mejor forma de conocer Paracas. La seguridad y el conocimiento de los guías es de primer nivel.',
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    avatar: 'SL',
    location: 'Paris, France',
    testimonial: 'Vimos delfines y pingüinos, fue mágico. Una organización impecable de principio a fin.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    avatar: 'MC',
    location: 'Singapore',
    testimonial: 'Increíble aventura en el desierto. Los guías son expertos y muy atentos. Volveré sin duda.',
    rating: 5,
  },
];

// --- INICIO DE MODIFICACIÓN ---
// --- MODIFICACIÓN AQUÍ ---
const StarIcon = ({ i, rating }: { i: number; rating: number }) => (
  <motion.svg
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
    className={`w-5 h-5 ${i < rating ? 'text-warmYellow fill-warmYellow' : 'text-gray-600 fill-gray-600'}`}
    viewBox="0 0 20 20"
  >
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </motion.svg>
);
// --- FIN DE MODIFICACIÓN ---

export default function Testimonials() {
  // Duplicamos para el scroll infinito
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="overflow-hidden bg-gradient-to-br from-oceanBlue to-cyan-900 pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Historias Reales de Aventureros
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-base text-cyan-100 sm:mt-4 sm:text-lg"
          >
            <span className="font-bold text-warmYellow">4.9/5</span> basado en 200+ reviews
          </motion.p>
        </div>
        
        {/* Carrusel de testimonios */}
        <div className="relative">
          <div className="group relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <motion.div 
              className="flex min-w-full animate-scroll gap-6 group-hover:[animation-play-state:paused]"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-[85vw] max-w-md flex-shrink-0 sm:w-[70vw] lg:w-[450px]"
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:shadow-turquoise/20 sm:p-8">
                    {/* Header con avatar y estrellas */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-turquoise to-cyan-500 text-xl font-bold text-white shadow-lg sm:h-16 sm:w-16">
                            {testimonial.avatar}
                          </div>
                        </div>
                        
                        {/* Nombre y ubicación */}
                        <div>
                          <p className="font-bold text-white sm:text-lg">{testimonial.name}</p>
                          <p className="text-sm text-cyan-200">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      {/* Badge de verificado */}
                      <div className="rounded-full bg-turquoise/20 p-2">
                        <svg className="h-5 w-5 text-turquoise" fill="currentColor" viewBox="0 0 20 20">
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
                    <p className="text-sm leading-relaxed text-gray-200 sm:text-base">
                      "{testimonial.testimonial}"
                    </p>

                    {/* Footer con icono */}
                    <div className="mt-6 flex items-center gap-2 text-turquoise">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-semibold">Tour Verificado</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 gap-6 sm:mt-16 sm:grid-cols-4 sm:gap-8"
        >
          {[
            { label: 'Tours Realizados', value: '10,000+' },
            { label: 'Clientes Felices', value: '8,500+' },
            { label: 'Años de Experiencia', value: '15+' },
            { label: 'Rating Promedio', value: '4.9/5' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-black text-warmYellow sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-cyan-100 sm:text-base">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}