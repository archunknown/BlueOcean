'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar después de 300px de scroll
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);

      // Ocultar cuando llega al footer (últimos 400px)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const distanceToBottom = documentHeight - (scrollTop + windowHeight);
      setIsAtBottom(distanceToBottom < 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && !isAtBottom && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 xs:bottom-24 sm:bottom-6"
        >
          <Link
            href="/tours"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-warmYellow to-yellow-400 px-5 py-3 text-sm font-bold text-oceanBlue shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50 xs:px-6 xs:py-3.5 sm:px-8 sm:py-4 sm:text-base"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-warmYellow to-yellow-400 opacity-50 blur-xl"></div>

            {/* Icon */}
            <svg className="h-5 w-5 xs:h-5.5 xs:w-5.5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>

            {/* Text */}
            <span className="whitespace-nowrap">Ver Tours</span>

            {/* Arrow with animation */}
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
          </Link>

          {/* Floating badge - Solo mobile */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg sm:hidden"
          >
            !
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}