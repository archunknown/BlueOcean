'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Fondo con Efecto Ken Burns */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center animate-kenburns"
          style={{ backgroundImage: "url('https://picsum.photos/1920/1080?random=11')" }}
        ></div>
      </div>

      {/* Contenido Central con Glassmorphism */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-11/12 max-w-4xl rounded-2xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-lg"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-turquoise to-warmYellow bg-clip-text text-7xl font-black uppercase tracking-tight text-transparent md:text-8xl"
          >
            Siente el Poder del Océano
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-4 text-lg font-light text-white md:text-xl"
          >
            Tu aventura épica en Paracas comienza aquí. Donde el desierto se encuentra con el mar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="group mt-8 inline-block"
            style={{ perspective: '1000px' }}
          >
            <Link
              href="/tours"
              className="block rounded-full bg-warmYellow px-10 py-4 text-lg font-black text-oceanBlue shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:[transform:rotateX(10deg)_translateZ(20px)]"
            >
              Explora Nuestros Tours
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}