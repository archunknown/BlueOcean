'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, UsersIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { Tour } from '@/lib/tours-data';

interface TourDetailViewProps {
  tour: Tour;
}

export default function TourDetailView({ tour }: TourDetailViewProps) {

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
                {tour.groupSize && (
                    <div className="flex items-center">
                        <UsersIcon className="h-6 w-6 text-turquoise mr-3" />
                        <div>
                            <p className="font-semibold text-gray-800">Grupo</p>
                            <p className="text-gray-600">{tour.groupSize}</p>
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
      <div className="bg-lightGray">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-white"
        >
          <Image
            src={tour.imageUrl}
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
            <p className="mt-2 text-3xl font-bold text-warmYellow text-shadow-md">{tour.price}</p>
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
              <p className="text-gray-600 leading-relaxed mb-10">
                {tour.longDescription}
              </p>

              {tour.itinerary && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-oceanBlue mb-5 flex items-center"><MapPinIcon className="h-6 w-6 mr-2"/> {tour.itinerary.title}</h3>
                  <ul className="space-y-3">
                    {tour.itinerary.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-6 w-6 text-turquoise mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {tour.details && (
                <div>
                  <h3 className="text-2xl font-bold text-oceanBlue mb-5">{tour.details.title}</h3>
                   <ul className="space-y-3">
                    {tour.details.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-6 w-6 text-turquoise mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
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
              <InfoCard />
            </motion.div>

          </div>
        </section>
      </div>
  );
}
