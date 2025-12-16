'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  videoUrl?: string | null;
}

export default function Hero({ videoUrl }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden pt-16 xs:pt-18 sm:pt-20 md:pt-24 lg:pt-20 min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen landscape:min-h-[100vh]">
      {/* Fondo con Ken Burns Animation - Optimizado para imagen estática */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoUrl && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="relative h-full w-full"
          >
            <Image
              src={videoUrl}
              alt="Hero Background"
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover object-center"
            />
          </motion.div>
        )}

        {/* Overlay con efecto Vignette - Adaptativo por dispositivo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 sm:from-black/40 sm:via-transparent sm:to-black/50 lg:from-black/30 lg:via-transparent lg:to-black/40 pointer-events-none z-10"></div>

        {/* Vignette lateral para enmarcar el contenido */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.3)_100%)] sm:bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.2)_100%)] pointer-events-none z-10"></div>
      </div>

      {/* Contenido Central - Optimizado para móvil */}
      <div className="relative z-10 flex min-h-[70vh] sm:min-h-[80vh] lg:min-h-[calc(100vh-80px)] items-center justify-center px-3 py-6 xs:px-4 xs:py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-6xl rounded-xl border border-white/20 bg-white/5 p-4 text-center shadow-2xl backdrop-blur-xl xs:rounded-2xl xs:p-5 sm:p-7 md:rounded-3xl md:p-9 lg:p-16 xl:p-20"
        >
          {/* Título Principal - Compacto en móvil */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
          >
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Siente el Poder
            </span>
            <br className="hidden xs:block" />
            <span className="xs:hidden"> </span>
            <span className="text-white">del Océano</span>
          </motion.h1>

          {/* Subtítulo - Más corto en móvil */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-2.5 max-w-3xl text-xs font-light leading-relaxed text-gray-100 xs:text-sm xs:mt-3 sm:mt-4 sm:text-base md:text-lg lg:text-xl lg:mt-5"
          >
            Tu aventura épica en Paracas comienza aquí
          </motion.p>

          {/* Botón CTA - Compacto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-4 xs:mt-5 sm:mt-6 lg:mt-8"
          >
            <Link
              href="/tours"
              className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-warmYellow to-yellow-400 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-oceanBlue shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50 xs:gap-2 xs:px-6 xs:py-3 sm:gap-2.5 sm:px-7 sm:py-3.5 sm:text-base md:px-9 md:py-4 lg:px-11 lg:py-4.5 lg:text-lg"
            >
              <span>Ver Tours</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 xs:h-4 xs:w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Badge de "Scroll para más" - Solo desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-4 hidden text-xs text-white/70 lg:mt-6 lg:block"
          >
            <div className="mx-auto flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-white/60"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}