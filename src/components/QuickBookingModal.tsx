'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const bookingSchema = z.object({
  tour: z.string().min(1, 'Selecciona un tour'),
  date: z.string().min(1, 'Selecciona una fecha'),
  people: z.number().min(1, 'Al menos 1 persona'),
  name: z.string().min(3, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
});

type BookingInputs = z.infer<typeof bookingSchema>;

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickBookingModal({ isOpen, onClose }: QuickBookingModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingInputs>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { people: 1 },
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onSubmit = async (data: BookingInputs) => {
    setSubmitStatus('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Reserva rápida enviada:', data);
      setSubmitStatus('success');
      reset();
      setTimeout(onClose, 2000); // Cerrar modal después de éxito
    } catch (error) {
      console.error('Error al enviar reserva:', error);
      setSubmitStatus('error');
    } finally {
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const getInputClasses = (fieldName: keyof BookingInputs) => `
    peer w-full px-4 py-3 pt-6 border rounded-lg bg-white text-gray-900
    focus:outline-none focus:ring-2 focus:ring-turquoise
    ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}
  `;

  const getLabelClasses = (fieldName: keyof BookingInputs) => `
    absolute left-4 top-1 text-xs text-gray-500 transition-all duration-200
    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
    peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-0
    ${errors[fieldName] ? 'text-red-500' : ''}
  `;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-11/12 max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Evitar que el click cierre el modal
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-lightGray p-2 text-gray-600 hover:bg-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="mb-6 text-3xl font-bold text-oceanBlue">Reserva Rápida</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <select
                  id="tour"
                  className={getInputClasses('tour')}
                  {...register('tour')}
                >
                  <option value="">Selecciona un Tour</option>
                  <option value="islas-ballestas">Islas Ballestas</option>
                  <option value="reserva-paracas">Reserva Nacional de Paracas</option>
                  <option value="buggy-sandboard">Paseo en Buggy y Sandboard</option>
                </select>
                <label htmlFor="tour" className={getLabelClasses('tour')}>
                  Tour
                </label>
                {errors.tour && (
                  <p className="mt-1 text-sm text-red-500">{errors.tour.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="date"
                  type="date"
                  placeholder=" "
                  className={getInputClasses('date')}
                  {...register('date')}
                />
                <label htmlFor="date" className={getLabelClasses('date')}>
                  Fecha
                </label>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="people"
                  type="number"
                  placeholder=" "
                  className={getInputClasses('people')}
                  {...register('people', { valueAsNumber: true })}
                />
                <label htmlFor="people" className={getLabelClasses('people')}>
                  Número de Personas
                </label>
                {errors.people && (
                  <p className="mt-1 text-sm text-red-500">{errors.people.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder=" "
                  className={getInputClasses('name')}
                  {...register('name')}
                />
                <label htmlFor="name" className={getLabelClasses('name')}>
                  Tu Nombre
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
                  Tu Email
                </label>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
                {submitStatus === 'success' ? '¡Reserva Confirmada!' : 'Confirmar Reserva'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}