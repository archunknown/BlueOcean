'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: '¿Qué incluyen los tours?',
    answer: 'Nuestros tours incluyen transporte, guía bilingüe certificado, equipo de seguridad y entradas a las atracciones. Los detalles específicos varían según el tour.',
  },
  {
    question: '¿Necesito reservar con anticipación?',
    answer: 'Recomendamos reservar con al menos 48 horas de anticipación, especialmente durante temporada alta, para asegurar tu cupo.',
  },
  {
    question: '¿Qué pasa si hay mal tiempo?',
    answer: 'En caso de condiciones climáticas adversas, nos pondremos en contacto contigo para reprogramar o ofrecerte un reembolso completo.',
  },
  {
    question: '¿Los tours son aptos para niños?',
    answer: 'Sí, la mayoría de nuestros tours son aptos para niños. Consulta la descripción de cada tour para detalles específicos o contáctanos.',
  },
  {
    question: '¿Ofrecen descuentos grupales?',
    answer: 'Sí, ofrecemos descuentos especiales para grupos grandes. Por favor, contáctanos para una cotización personalizada.',
  },
  {
    question: '¿Cuál es la política de cancelación?',
    answer: 'Ofrecemos cancelación flexible. Puedes cancelar hasta 24 horas antes del tour para un reembolso completo. Consulta nuestros términos y condiciones para más detalles.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-lightGray">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-16 tracking-tight">
          Preguntas Frecuentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              className="rounded-2xl bg-white shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                className="flex w-full items-center justify-between p-6 text-left font-bold text-oceanBlue focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-xl">{item.question}</span>
                <motion.svg
                  className="h-6 w-6 text-turquoise"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="px-6 pb-6 text-gray-700"
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}