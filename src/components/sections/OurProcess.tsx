'use client';
import { motion } from 'framer-motion';

const processSteps = [
  {
    number: 1,
    title: 'Elige tu Aventura',
    description: 'Explora nuestra variedad de tours y selecciona la experiencia perfecta para ti.',
    icon: (
      <svg className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Reserva Fácil',
    description: 'Completa tu reserva online o contáctanos directamente por WhatsApp.',
    icon: (
      <svg className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Confirmación Instantánea',
    description: 'Recibe la confirmación de tu tour y todos los detalles al instante.',
    icon: (
      <svg className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: '¡Vive la Aventura!',
    description: 'Prepárate para una experiencia inolvidable con Blue Ocean Adventure Tours.',
    icon: (
      <svg className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// /src/components/sections/OurProcess.tsx

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

export default function OurProcess() {
  return (
    <section className="bg-gradient-to-br from-oceanBlue to-cyan-900 py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Nuestro Proceso
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-base text-cyan-100 sm:mt-4 sm:text-lg"
          >
            Reservar tu aventura es simple y rápido en solo 4 pasos
          </motion.p>
        </div>

        <motion.div
          className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Línea conectora - Solo desktop */}
          <div className="absolute left-0 right-0 top-16 hidden h-1 bg-gradient-to-r from-turquoise/30 via-turquoise to-turquoise/30 lg:block"></div>

          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="group relative z-10 flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              {/* Card */}
              <div className="w-full rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 group-hover:shadow-2xl sm:p-8">
                {/* Icono con número */}
                <div className="relative mx-auto mb-6 w-fit">
                  {/* Círculo del icono */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-turquoise to-cyan-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-turquoise/50 sm:h-24 sm:w-24">
                    {step.icon}
                  </div>
                  {/* Badge del número */}
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-warmYellow to-yellow-400 text-xl font-black text-oceanBlue shadow-lg transition-all duration-300 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-2xl">
                    {step.number}
                  </div>
                </div>

                {/* Título */}
                <h3 className="mb-3 text-xl font-bold text-oceanBlue transition-colors duration-300 group-hover:text-turquoise sm:text-2xl">
                  {step.title}
                </h3>

                {/* Descripción */}
                <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                  {step.description}
                </p>
              </div>

              {/* Flecha conectora - Solo móvil */}
              {index < processSteps.length - 1 && (
                <div className="my-4 flex items-center justify-center lg:hidden">
                  <svg className="h-8 w-8 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center sm:mt-16"
        >
          <button className="group inline-flex items-center gap-2 rounded-full bg-warmYellow px-8 py-4 font-bold text-oceanBlue shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <span>Comienza tu Aventura Ahora</span>
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}