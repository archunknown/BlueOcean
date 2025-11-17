'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const allImages = [
  { src: 'https://picsum.photos/seed/islas/800/1200', category: 'Islas', title: 'Lobo Marino al Sol' },
  { src: 'https://picsum.photos/seed/desierto/800/900', category: 'Desierto', title: 'Duna Infinita' },
  { src: 'https://picsum.photos/seed/reserva/800/1000', category: 'Reserva', title: 'Acantilado Rojo' },
  { src: 'https://picsum.photos/seed/aventura/800/1100', category: 'Aventura', title: 'Salto en Buggy' },
  { src: 'https://picsum.photos/seed/fauna/800/950', category: 'Islas', title: 'Pelícanos en Vuelo' },
  { src: 'https://picsum.photos/seed/paisaje/800/1250', category: 'Reserva', title: 'La Catedral' },
  { src: 'https://picsum.photos/seed/buggy/800/850', category: 'Aventura', title: 'Adrenalina Pura' },
  { src: 'https://picsum.photos/seed/arena/800/1050', category: 'Desierto', title: 'Atardecer Dorado' },
];

const filters = ['Todas', 'Islas', 'Reserva', 'Desierto', 'Aventura'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const filteredImages = activeFilter === 'Todas'
    ? allImages
    : allImages.filter((image) => image.category === activeFilter);

  return (
    <section className="bg-white pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-10 text-center sm:mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-oceanBlue sm:text-5xl lg:text-6xl"
          >
            Galería de Aventuras
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg"
          >
            Descubre la belleza natural de Paracas a través de nuestras experiencias
          </motion.p>
        </div>
        
        {/* Filtros - Mejorados para móvil */}
        <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3 lg:mb-12">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-base
                ${activeFilter === filter 
                  ? 'bg-warmYellow text-oceanBlue shadow-lg' 
                  : 'bg-lightGray text-gray-600 hover:bg-gray-300 hover:shadow-md'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        {/* Galería Masonry - Optimizada */}
        <motion.div
          layout
          className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                layout
                key={image.src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl shadow-lg"
                onClick={() => setSelectedImg(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  width={800}
                  height={1200}
                  className="w-full transform transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                
                {/* Información */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-lg font-bold sm:text-xl">{image.title}</h3>
                  <p className="mt-1 text-sm text-turquoise">{image.category}</p>
                </div>

                {/* Icono de expandir */}
                <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal - Mejorado */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            {/* Imagen */}
            <motion.div 
              className="relative max-h-[90vh] max-w-5xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image 
                src={selectedImg} 
                alt="Imagen ampliada" 
                width={1200} 
                height={1800} 
                className="h-auto max-h-[90vh] w-auto rounded-lg shadow-2xl" 
              />
            </motion.div>
            
            {/* Botón cerrar */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:right-6 sm:top-6"
              onClick={() => setSelectedImg(null)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}