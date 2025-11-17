'use client';
import { motion } from 'framer-motion';

const features = [
  {
    title: '15+ años de experiencia',
    description: 'Líderes en turismo de aventura en Paracas, con un historial probado de excelencia.',
    icon: (
      <svg 
        className="h-10 w-10 sm:h-12 sm:w-12" // <-- CLASES DE COLOR ELIMINADAS
        fill="currentColor" // <-- ASEGURADO
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Guías certificados',
    description: 'Expertos locales bilingües que conocen cada rincón de Paracas.',
    icon: (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Seguridad garantizada',
    description: 'Equipos de última generación y protocolos estrictos para tu tranquilidad.',
    icon: (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Grupos pequeños',
    description: 'Experiencias personalizadas con atención exclusiva en cada tour.',
    icon: (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Compromiso ambiental',
    description: 'Turismo sostenible que protege la belleza natural de Paracas.',
    icon: (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Cancelación flexible',
    description: 'Entendemos que los planes cambian. Opciones sin estrés.',
    icon: (
      <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const, // <-- Añadir 'as const'
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-oceanBlue sm:text-5xl lg:text-6xl"
          >
            ¿Por Qué Elegirnos?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg"
          >
            Más que tours, creamos experiencias inolvidables con los más altos estándares
          </motion.p>
        </div>

        {/* Grid de características */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-lightGray to-gray-100 p-6 shadow-md transition-all duration-300 hover:shadow-2xl sm:p-8"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full pointer-events-none"></div>

              {/* Contenido */}
              <div className="relative z-10">
                {/* Icono con fondo */}
                <div className="mb-4 inline-flex rounded-xl bg-turquoise/10 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-turquoise sm:mb-6">                  {feature.icon}
                </div>

                {/* Título */}
                <h3 className="mb-2 text-xl font-bold text-oceanBlue sm:text-2xl">
                  {feature.title}
                </h3>

                {/* Descripción */}
                <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                  {feature.description}
                </p>
              </div>

              {/* Decoración */}
              <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-turquoise/5 transition-all duration-300 group-hover:scale-150 group-hover:bg-turquoise/10"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center sm:mt-16"
        >
          <p className="text-lg font-semibold text-oceanBlue sm:text-xl">
            Más de <span className="text-turquoise">10,000 viajeros felices</span> confían en nosotros
          </p>
        </motion.div>
      </div>
    </section>
  );
}