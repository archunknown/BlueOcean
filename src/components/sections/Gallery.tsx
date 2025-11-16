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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-8 tracking-tight">
          Galería de Aventuras
        </h2>
        
        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300
                ${activeFilter === filter ? 'bg-warmYellow text-oceanBlue' : 'bg-lightGray text-gray-600 hover:bg-gray-300'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Galería Masonry */}
        <motion.div
          layout
          className="columns-1 gap-4 sm:columns-2 xl:columns-3"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                layout
                key={image.src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-lg"
                onClick={() => setSelectedImg(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  width={800}
                  height={1200}
                  className="w-full transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <h3 className="text-lg font-bold">{image.title}</h3>
                  <p className="text-sm">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            layoutId={selectedImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <Image src={selectedImg} alt="Imagen ampliada" width={1200} height={1800} className="h-full w-full object-contain" />
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 right-6 rounded-full bg-white/20 p-2 text-white"
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