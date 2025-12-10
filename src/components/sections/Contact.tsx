'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FakeMap from '../FakeMap';

// Esquema de validación con Zod
const contactFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Formato de correo electrónico inválido'),
  message: z.string().min(20, 'El mensaje debe tener al menos 20 caracteres'),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

interface Props {
  email?: string | null;
  phoneNumber?: string | null;
}

export default function Contact({ email, phoneNumber }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormInputs) => {
    const phone = phoneNumber || '51988211694';
    const message = `Hola Blue Ocean, mi nombre es ${data.name}. Mi correo es ${data.email}.\n\nMensaje: ${data.message}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
    reset();
  };

  const getInputClasses = (fieldName: keyof ContactFormInputs) => `
    peer w-full px-4 py-3 pt-6 border rounded-lg bg-lightGray/50 text-oceanBlue
    focus:outline-none focus:ring-4 focus:ring-turquoise/20
    ${errors[fieldName] ? 'border-danger' : 'border-oceanBlue/20'}
  `;

  const getLabelClasses = (fieldName: keyof ContactFormInputs) => `
    absolute left-4 top-1 text-xs text-oceanBlue/70 transition-all duration-200
    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
    peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-0
    ${errors[fieldName] ? 'text-danger peer-focus:text-danger' : 'peer-focus:text-turquoise'}
  `;

  return (
    <section className="bg-lightGray pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-16 tracking-tight">
          ¿Listo para tu Aventura?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
          {/* Formulario de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >
            <h3 className="text-3xl font-bold text-oceanBlue mb-2">Envíanos un Mensaje</h3>
            <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-oceanBlue/80">
            </div>
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
                  <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
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
                  <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
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
                  <p className="mt-1 text-sm text-danger">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                className="w-full rounded-full bg-[#25D366] py-3 text-lg font-bold text-white transition-all duration-300 hover:bg-[#128C7E] hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar por WhatsApp
                </span>
              </motion.button>
              <p className="text-center text-sm text-oceanBlue/60 mt-4">
                🔥 8 personas han preguntado hoy
              </p>
            </form>
          </motion.div>

          {/* Columna 2: Información de Contacto y Mapa */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white p-8 rounded-2xl shadow-xl"
          >
            {/* Información de Contacto */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-oceanBlue mb-6">Encuéntranos</h3>
              <p className="text-oceanBlue/80 mb-6">
                Estamos ubicados en el corazón de Paracas, listos para ayudarte a planificar tu próxima aventura.
              </p>
              <ul className="space-y-4 text-oceanBlue/80">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-3 text-turquoise flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>AA.HH Alberto tataje Muñoz Mz b lote 6, Paracas 11550</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-3 text-turquoise flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+51 988 211 694</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-3 text-turquoise flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>ytasayco59@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Mapa de Google */}
            <div className="w-full">
              <h4 className="text-lg font-bold text-oceanBlue mb-4">Nuestra Ubicación</h4>
              <div className="w-full h-[400px]">
                <FakeMap />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}