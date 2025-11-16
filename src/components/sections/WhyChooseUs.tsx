'use client';
import { motion } from 'framer-motion';

const features = [
  {
    title: '15+ años de experiencia',
    description: 'Líderes en turismo de aventura en Paracas, con un historial probado.',
    icon: (
      <svg className="h-12 w-12 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.86 2.05A10 10 0 0012 22a10 10 0 004.14-19.95M12 2a10 10 0 00-4.14 19.95" />
      </svg>
    ),
  },
  {
    title: 'Guías certificados bilingües',
    description: 'Expertos locales que hablan tu idioma y conocen cada rincón.',
    icon: (
      <svg className="h-12 w-12 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 3H11.414a1 1 0 00-.707.293L9.293 4.707A1 1 0 018.586 5H6a2 2 0 00-2 2v11a2 2 0 002 2h2M9 17v-5h2v5m4-5v5h2v-5" />
      </svg>
    ),
  },
  {
    title: 'Seguridad garantizada',
    description: 'Equipos de última generación y protocolos estrictos para tu tranquilidad.',
    icon: (
      <svg className="h-12 w-12 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.276a11.955 11.955 0 010 11.312c-.922 1.407-2.42 2.407-4.095 2.407H7.95c-1.675 0-3.173-1-4.095-2.407a11.955 11.955 0 010-11.312c.922-1.407 2.42-2.407 4.095-2.407h6.11c1.675 0 3.173 1 4.095 2.407z" />
      </svg>
    ),
  },
  {
    title: 'Grupos pequeños',
    description: 'Experiencias personalizadas y atención exclusiva en cada tour.',
    icon: (
      <svg className="h-12 w-12 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 3H11.414a1 1 0 00-.707.293L9.293 4.707A1 1 0 018.586 5H6a2 2 0 00-2 2v11a2 2 0 002 2h2M9 17v-5h2v5m4-5v5h2v-5" />
      </svg>
    ),
  },
  {
    title: 'Compromiso ambiental',
    description: 'Turismo sostenible que protege la belleza natural de Paracas.',
    icon: (
      <svg className="h-12 w-12 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: 'Cancelación flexible',
    description: 'Entendemos que los planes cambian. Opciones de cancelación sin estrés.',
    icon: (
      <svg className="h-12 w-12 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      ease: 'easeOut',
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-16 tracking-tight">
          ¿Por Qué Elegirnos?
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
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
              className="group rounded-2xl bg-lightGray p-8 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              variants={itemVariants}
            >
              <div className="mb-4 flex justify-center transition-transform duration-300 group-hover:-translate-y-2">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-oceanBlue mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}