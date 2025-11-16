'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const toursData = [
  {
    title: 'Islas Ballestas',
    description: 'Un increíble viaje en bote para observar la vida marina, incluyendo lobos marinos y pingüinos de Humboldt.',
    price: 'S/ 50',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    duration: '2 horas',
  },
  {
    title: 'Reserva Nacional de Paracas',
    description: 'Explora el impresionante paisaje desértico y las formaciones rocosas de la costa.',
    price: 'S/ 40',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    duration: '3 horas',
  },
  {
    title: 'Paseo en Buggy y Sandboard',
    description: 'Siente la adrenalina recorriendo las dunas del desierto de Paracas en un buggy y deslízate por la arena.',
    price: 'S/ 80',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    duration: '1.5 horas',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
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
      ease: 'easeOut',
    },
  },
};

export default function Tours() {
  return (
    <section className="py-24 bg-lightGray">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-16 tracking-tight">
          Aventuras Diseñadas para Ti
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          style={{ perspective: '1500px' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {toursData.map((tour) => (
            <motion.div
              key={tour.title}
              className="group relative rounded-2xl bg-white shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:shadow-2xl"
              variants={cardVariants}
            >
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <Image
                  src={tour.imageUrl}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oceanBlue/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute top-4 right-4 rounded-full bg-warmYellow px-4 py-2 text-lg font-black text-oceanBlue shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-0" style={{ transform: 'rotate(12deg)' }}>
                  {tour.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-oceanBlue">{tour.title}</h3>
                <p className="mt-2 text-gray-600">{tour.description}</p>
                <div className="mt-4 h-px bg-gray-200"></div>
                <p className="mt-4 text-sm text-gray-500">Duración: {tour.duration}</p>
              </div>
              <button className="w-full rounded-b-2xl bg-oceanBlue py-4 font-bold text-white transition-colors duration-300 group-hover:bg-warmYellow group-hover:text-oceanBlue">
                Reservar Ahora
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}