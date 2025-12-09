'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tour } from '@/lib/tours-data'; // Usamos el tipo local para mantener compatibilidad UI
import { ClockIcon } from '@heroicons/react/24/solid';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

interface ToursProps {
  tours: Tour[]; // Nueva prop: Los datos vienen de fuera
  limit?: number;
  showButton?: boolean;
}

export default function Tours({ tours, limit, showButton = true }: ToursProps) {
  const toursToDisplay = limit ? tours.slice(0, limit) : tours;

  return (
    <section id="tours" className="bg-lightGray pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36">
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
            Aventuras Diseñadas para Ti
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg"
          >
            Descubre la magia de Paracas con nuestros tours y alquileres cuidadosamente seleccionados.
          </motion.p>
        </div>

        {/* Grid de Tours */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {toursToDisplay.map((tour) => (
            // 2. ENVOLVER TARJETA EN LINK
            <Link key={tour.slug} href={`/tours/${tour.slug}`} passHref>
              <motion.div
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                variants={cardVariants}
              >
                {/* Imagen */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={tour.imageUrl}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 -right-10 z-10">
                    <div className="relative w-48 h-8 flex justify-center items-center transform rotate-45 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-xl border-b-2 border-yellow-600">
                      <span className="font-black text-lg tracking-wider text-red-700 [text-shadow:1px_1px_2px_rgba(0,0,0,0.2)]">{tour.price}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-oceanBlue backdrop-blur-sm sm:text-sm">
                    {tour.category}
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="mb-2 text-xl font-bold text-oceanBlue transition-colors group-hover:text-turquoise sm:text-2xl">
                    {tour.title}
                  </h3>
                  {/* 3. USAR SHORTDESCRIPTION */}
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {tour.shortDescription}
                  </p>

                  <div className="mt-auto border-t border-gray-200 pt-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <ClockIcon className="mr-2 h-5 w-5 text-turquoise" />
                      <span className="font-medium">Duración:</span>
                      <span className="ml-1.5">{tour.duration}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="font-bold text-oceanBlue group-hover:text-turquoise transition-colors">
                      Ver Detalles
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* CTA Ver Todos (si está en la página principal) */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center sm:mt-16"
          >
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-oceanBlue px-8 py-3 font-bold text-oceanBlue transition-all duration-300 hover:bg-oceanBlue hover:text-black sm:px-10 sm:py-4"
            >
              <span>Ver Todos los Tours</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}