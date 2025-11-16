'use client';
import { motion } from 'framer-motion';

const processSteps = [
  {
    number: 1,
    title: 'Elige tu Aventura',
    description: 'Explora nuestra variedad de tours y selecciona la experiencia perfecta para ti.',
    icon: (
      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5-5m0 0l5-5m-5 5h12a2 2 0 002-2V7a2 2 0 00-2-2h-3" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Reserva Fácil',
    description: 'Completa tu reserva online o contáctanos directamente por WhatsApp.',
    icon: (
      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Confirmación Instantánea',
    description: 'Recibe la confirmación de tu tour y todos los detalles al instante.',
    icon: (
      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: '¡Vive la Aventura!',
    description: 'Prepárate para una experiencia inolvidable con Blue Ocean Adventure Tours.',
    icon: (
      <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
      ease: 'easeOut',
    },
  },
};

export default function OurProcess() {
  return (
    <section className="py-24 bg-oceanBlue">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-white mb-16 tracking-tight">
          Nuestro Proceso
        </h2>
        <motion.div
          className="relative grid grid-cols-1 lg:grid-cols-4 gap-8"
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
          {/* Línea conectora (solo desktop) */}
          <div className="absolute hidden lg:block top-1/2 left-0 right-0 h-1 bg-turquoise/50 -translate-y-1/2"></div>

          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-xl"
              variants={itemVariants}
            >
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-turquoise shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-warmYellow text-xl font-black text-oceanBlue shadow-md">
                  {step.number}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-oceanBlue mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}