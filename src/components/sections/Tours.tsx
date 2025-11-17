'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link'; // 1. IMPORTAR LINK

const toursData = [
  {
    title: 'Islas Ballestas',
    description: 'Un increíble viaje en bote para observar la vida marina, incluyendo lobos marinos, pingüinos de Humboldt y aves guaneras.',
    price: 'S/ 50',
    imageUrl: 'https://picsum.photos/seed/islas-ballestas/800/600',
    duration: '2 horas',
    difficulty: 'Fácil',
    groupSize: '8-12 personas',
  },
  {
    title: 'Reserva Nacional de Paracas',
    description: 'Explora el impresionante paisaje desértico, playas vírgenes y las famosas formaciones rocosas de la costa peruana.',
    price: 'S/ 40',
    imageUrl: 'https://picsum.photos/seed/reserva-paracas/800/600',
    duration: '3 horas',
    difficulty: 'Moderado',
    groupSize: '6-10 personas',
  },
  {
    title: 'Buggy y Sandboard',
    description: 'Siente la adrenalina recorriendo las dunas del desierto en buggy y deslízate por la arena dorada al atardecer.',
    price: 'S/ 80',
    imageUrl: 'https://picsum.photos/seed/buggy-adventure/800/600',
    duration: '1.5 horas',
    difficulty: 'Avanzado',
    groupSize: '4-8 personas',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

interface ToursProps {
  limit?: number;
  showButton?: boolean;
}

export default function Tours({ limit, showButton = true }: ToursProps) {
  const toursToDisplay = limit ? toursData.slice(0, limit) : toursData;

  return (
    <section className="bg-lightGray pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36">
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg"
          >
            Descubre la magia de Paracas con nuestros tours cuidadosamente diseñados
          </motion.p>
        </div>

        {/* Grid de Tours */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {toursToDisplay.map((tour, index) => (
            <motion.div
              key={tour.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
              variants={cardVariants}
              whileHover={{ y: -10 }}
            >
              {/* Imagen */}
              <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                <Image
                  src={tour.imageUrl}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-oceanBlue/80 via-oceanBlue/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"></div>
                
                {/* Badge de precio */}
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-warmYellow px-4 py-2 shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-lg font-black text-oceanBlue sm:text-xl">{tour.price}</span>
                </div>

                {/* Badge de dificultad */}
                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-oceanBlue backdrop-blur-sm sm:text-sm">
                  {tour.difficulty}
                </div>
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="mb-2 text-xl font-bold text-oceanBlue transition-colors group-hover:text-turquoise sm:text-2xl">
                  {tour.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {tour.description}
                </p>

                {/* Información adicional */}
                <div className="mb-4 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Duración:</span>
                    <span className="ml-1">{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium">Grupo:</span>
                    <span className="ml-1">{tour.groupSize}</span>
                  </div>
                </div>

                {/* Botón */}
                <button className="w-full rounded-xl bg-oceanBlue py-3 font-bold text-white transition-all duration-300 hover:bg-turquoise active:scale-95 sm:py-4">
                  Reservar Ahora
                </button>
              </div>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Ver Todos */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center sm:mt-16"
          >
            {/* --- INICIO DE MODIFICACIÓN --- */}
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-oceanBlue px-8 py-3 font-bold transition-all duration-300 hover:bg-oceanBlue sm:px-10 sm:py-4"
            >
              <span className="text-oceanBlue transition-colors duration-300 group-hover:text-white">
                Ver Todos los Tours
              </span>
              <svg 
                className="h-5 w-5 text-oceanBlue transition-colors transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            {/* --- FIN DE MODIFICACIÓN --- */}
          </motion.div>
        )}
      </div>
    </section>
  );
}