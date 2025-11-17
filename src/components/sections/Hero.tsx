'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20 sm:pt-24 lg:pt-20">
      {/* Fondo con Overlay y Efecto Ken Burns */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center animate-kenburns"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Contenido Central - 100% Responsivo */}
      <div className="relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-6xl rounded-2xl border border-white/20 bg-white/5 p-6 text-center shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-10 md:p-12 lg:p-16 xl:p-20"
        >
          {/* Título Principal - Totalmente Responsivo */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Siente el Poder
            </span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-white">del Océano</span>
          </motion.h1>

          {/* Subtítulo - Optimizado para móviles */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-4 max-w-3xl text-base font-light leading-relaxed text-gray-100 sm:mt-6 sm:text-lg md:text-xl lg:text-2xl"
          >
            Tu aventura épica en Paracas comienza aquí. Donde el desierto se encuentra con el mar.
          </motion.p>

          {/* Botón CTA - Completamente Responsivo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 sm:mt-8 lg:mt-10"
          >
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-warmYellow to-yellow-400 px-6 py-3 text-base font-bold uppercase tracking-wide text-oceanBlue shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50 sm:gap-3 sm:px-10 sm:py-4 sm:text-lg lg:px-12 lg:py-5 lg:text-xl"
            >
              <span>Explora Nuestros Tours</span>
              <svg 
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Indicador de Scroll - Solo desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-8 hidden lg:mt-12 lg:block"
          >
            <div className="mx-auto flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-white/60"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* BLOQUE <style jsx> ELIMINADO */}
    </section>
  );
}