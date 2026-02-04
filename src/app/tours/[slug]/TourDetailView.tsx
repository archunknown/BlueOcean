'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { Tour } from '@/types/tour-schemas';
import RelatedTours from '@/components/sections/RelatedTours';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface TourDetailViewProps {
  tour: Tour;
  allTours: Tour[];
}

export default function TourDetailView({ tour, allTours }: TourDetailViewProps) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [pax, setPax] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');

  const handleBooking = () => {
    // WIP Implementation
    if (!date) {
      toast.error('Por favor selecciona una fecha');
      return;
    }
    if (!selectedTime) {
      toast.error('Por favor selecciona un horario');
      return;
    }

    toast.info('🚧 Funcionalidad en desarrollo', {
      description: 'Estamos trabajando para brindarte la mejor experiencia. ¡Gracias por tu paciencia!',
      duration: 5000,
    });

    // Original redirection logic commented out for production deployment
    /*
    const params = new URLSearchParams({
      tourId: tour.id?.toString() || '',
      date: date,
      time: selectedTime,
      pax: pax.toString()
    });

    router.push(`/checkout?${params.toString()}`);
    */
  };

  const InfoCard = () => (
    <div className="md:sticky md:top-28">
      <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-oceanBlue mb-4 border-b pb-3">Resumen del {tour.category}</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-turquoise mr-3" />
            <div>
              <p className="font-semibold text-gray-800">Duración</p>
              <p className="text-gray-600">{tour.duration}</p>
            </div>
          </div>
          {tour.schedule && (
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 text-turquoise mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Horario</p>
                <p className="text-gray-600">{tour.schedule}</p>
              </div>
            </div>
          )}
          {tour.group_size && (
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 text-turquoise mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Grupo</p>
                <p className="text-gray-600">{tour.group_size}</p>
              </div>
            </div>
          )}
        </div>
        <Link href="/contact" className="mt-6 block w-full text-center rounded-xl bg-oceanBlue py-3 font-bold text-white transition-all duration-300 hover:bg-turquoise active:scale-95">
          ¡Consultar Disponibilidad!
        </Link>
      </div>
    </div>
  );



  return (
    <>
      <div className="bg-lightGray">
        {/* ... (Existing Hero Section code same as before, no changes to Hero) ... */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-white"
        >
          <Image
            src={tour.image_url}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative z-10 text-center px-4"
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-medium border border-white/30 mb-3">{tour.category}</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-shadow-lg">{tour.title}</h1>
            <p className="mt-2 text-3xl font-bold text-warmYellow text-shadow-md">S/ {Number(tour.price).toFixed(2)}</p>
          </motion.div>
        </motion.section>

        {/* Main Content */}
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 lg:gap-16">

            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="md:col-span-2"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-oceanBlue mb-4">Descripción General</h2>
              <p className="text-gray-600 leading-relaxed mb-10 break-words whitespace-pre-wrap">
                {tour.long_description}
              </p>

              {tour.itinerary && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-oceanBlue mb-5 flex items-center">
                    <span className="mr-2">{tour.itinerary.icon || '📍'}</span>
                    {tour.itinerary.title}
                  </h3>
                  <ul className="space-y-3">
                    {tour.itinerary.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-6 w-6 text-turquoise mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.details && (
                <div>
                  <h3 className="text-2xl font-bold text-oceanBlue mb-5 flex items-center">
                    <span className="mr-2">{tour.details.icon || '✅'}</span>
                    {tour.details.title}
                  </h3>
                  <ul className="space-y-3">
                    {tour.details.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-6 w-6 text-turquoise mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Right Column (Info Card) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 md:mt-0"
            >
              <div className="md:sticky md:top-28">
                <div className="rounded-2xl bg-white shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-oceanBlue mb-4 border-b pb-3">Resumen del {tour.category}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-6 w-6 text-turquoise mr-3" />
                      <div>
                        <p className="font-semibold text-gray-800">Duración</p>
                        <p className="text-gray-600">{tour.duration}</p>
                      </div>
                    </div>
                    {/* ... keep existing icons ... */}
                  </div>

                  {/* Booking Inputs */}
                  <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                      {tour.is_flexible_schedule ? (
                        <input
                          type="time"
                          min="09:00"
                          max="17:00"
                          value={selectedTime}
                          onChange={(e) => {
                            const time = e.target.value;
                            if (time < '09:00' || time > '17:00') {
                              toast.error('El horario de atención es de 9:00 AM a 5:00 PM', {
                                duration: 3000,
                              });
                              setSelectedTime(''); // Reset or keep previous? Resetting is safer to prevent invalid submission
                              return;
                            }
                            setSelectedTime(time);
                          }}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all text-gray-600"
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {tour.time_slots && tour.time_slots.length > 0 ? (
                            tour.time_slots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-2 rounded-lg text-sm font-bold border transition-all ${selectedTime === time
                                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-900 hover:text-blue-900'
                                  }`}
                              >
                                {time}
                              </button>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 col-span-2">A coordinar</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Personas (Pax)</label>
                      <input
                        type="number"
                        min="1"
                        value={pax}
                        onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 outline-none transition-all text-gray-600"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-2xl font-bold text-oceanBlue">S/ {(Number(tour.price) * pax).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!date || !selectedTime}
                    className="mt-6 block w-full text-center rounded-xl bg-blue-900 py-3 font-bold text-white transition-all duration-300 hover:bg-cyan-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    Reservar Ahora
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </section>
      </div>



      {/* 3. RENDERIZAR CARRUSEL */}
      <RelatedTours allTours={allTours} currentTourSlug={tour.slug} />
    </>
  );
}
