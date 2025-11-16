'use client';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    name: 'Ana G.',
    avatar: 'AG',
    testimonial: '¡Una experiencia inolvidable! El tour a las Islas Ballestas fue espectacular. El equipo de Blue Ocean es muy profesional y amable.',
    rating: 5,
  },
  {
    name: 'John D.',
    avatar: 'JD',
    testimonial: 'El desierto de Paracas es de otro mundo. El paseo en buggy fue pura adrenalina. ¡Totalmente recomendado!',
    rating: 5,
  },
  {
    name: 'Maria S.',
    avatar: 'MS',
    testimonial: 'Servicio excelente y tours bien organizados. Aprendí mucho sobre la fauna local. Gracias, Blue Ocean.',
    rating: 4,
  },
  {
    name: 'Carlos R.',
    avatar: 'CR',
    testimonial: 'La mejor forma de conocer Paracas. La seguridad y el conocimiento de los guías es de primer nivel.',
    rating: 5,
  },
  {
    name: 'Sophie L.',
    avatar: 'SL',
    testimonial: 'Vimos delfines y pingüinos, fue mágico. Una organización impecable de principio a fin.',
    rating: 5,
  },
];

const StarIcon = ({ i, rating }: { i: number; rating: number }) => (
  <motion.svg
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
    className={`w-5 h-5 ${i < rating ? 'text-warmYellow' : 'text-gray-600'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </motion.svg>
);

export default function Testimonials() {
  // Duplicamos los testimonios para el efecto de scroll infinito
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="py-24 bg-oceanBlue overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-white mb-4 tracking-tight">
          Historias Reales de Aventureros
        </h2>
        <p className="text-center text-lg text-turquoise mb-12">
          4.9/5 basado en 200+ reviews de Google y TripAdvisor
        </p>
        
        <div className="group relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <motion.div 
            className="flex min-w-full animate-scroll group-hover:[animation-play-state:paused]"
            animate={{ x: ['0%', '-100%'] }}
            transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="w-[90vw] max-w-md flex-shrink-0 px-4">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
                  <div className="flex items-center mb-4">
                    <div className="relative mr-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-turquoise text-xl font-bold text-white">
                        {testimonial.avatar}
                      </div>
                      <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-t-warmYellow border-l-warmYellow border-r-turquoise/50 border-b-turquoise/50"></div>
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} i={i} rating={testimonial.rating} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.testimonial}"</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}