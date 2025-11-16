'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validación con Zod
const contactFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Formato de correo electrónico inválido'),
  message: z.string().min(20, 'El mensaje debe tener al menos 20 caracteres'),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (data: ContactFormInputs) => {
    setSubmitStatus('loading');
    try {
      // Simular envío de formulario
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Formulario enviado:', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setTimeout(() => setSubmitStatus('idle'), 3000); // Resetear estado después de 3 segundos
    }
  };

  const getInputClasses = (fieldName: keyof ContactFormInputs) => `
    peer w-full px-4 py-3 pt-6 border rounded-lg bg-white text-gray-900
    focus:outline-none focus:ring-2 focus:ring-turquoise
    ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}
  `;

  const getLabelClasses = (fieldName: keyof ContactFormInputs) => `
    absolute left-4 top-1 text-xs text-gray-500 transition-all duration-200
    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
    peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-0
    ${errors[fieldName] ? 'text-red-500' : ''}
  `;

  return (
    <section className="py-24 bg-lightGray">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-16 tracking-tight">
          ¿Listo para tu Aventura?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >
            <h3 className="text-3xl font-bold text-oceanBlue mb-6">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder=" "
                  className={getInputClasses('name')}
                  {...register('name')}
                />
                <label htmlFor="name" className={getLabelClasses('name')}>
                  Nombre Completo
                </label>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  className={getInputClasses('email')}
                  {...register('email')}
                />
                <label htmlFor="email" className={getLabelClasses('email')}>
                  Correo Electrónico
                </label>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  rows={5}
                  placeholder=" "
                  className={getInputClasses('message')}
                  {...register('message')}
                ></textarea>
                <label htmlFor="message" className={getLabelClasses('message')}>
                  Tu Mensaje
                </label>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                className={`w-full rounded-full py-3 text-lg font-bold text-white transition-all duration-300
                  ${submitStatus === 'loading' ? 'bg-gray-500 cursor-not-allowed' : 'bg-oceanBlue hover:bg-turquoise'}
                  ${submitStatus === 'success' ? 'bg-emeraldGreen' : ''}
                `}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitStatus === 'loading' && (
                  <svg className="inline-block animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {submitStatus === 'success' ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
              </motion.button>
            </form>
          </motion.div>

          {/* Información de Contacto y Mapa */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white p-8 rounded-2xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-3xl font-bold text-oceanBlue mb-6">Encuéntranos</h3>
              <p className="text-gray-700 mb-4">
                Estamos ubicados en el corazón de Paracas, listos para ayudarte a planificar tu próxima aventura.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-3 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Av. Principal 123, Paracas, Perú
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-3 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +51 999 999 999
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-3 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@blueocean.com
                </li>
              </ul>
            </div>
            {/* Placeholder para Google Maps */}
            <div className="mt-8 h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
              Mapa de Google Maps aquí
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}