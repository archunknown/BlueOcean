'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'Galería', href: '/gallery' },
  { name: 'Testimonios', href: '/testimonials' },
  { name: 'Contacto', href: '/contact' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Usamos un umbral pequeño (10px) para el cambio
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamada inicial para establecer el estado correcto al cargar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LÓGICA PARA HEADER TRANSPARENTE ---
  const isTransparent = isHomePage && !isScrolled;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuPanelRef.current) {
      mobileMenuPanelRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ease-in-out pt-[env(safe-area-inset-top)] ${isTransparent
          ? 'bg-gradient-to-b from-black/50 to-transparent pb-4 sm:pb-5'
          : 'bg-white/95 pb-2 shadow-md backdrop-blur-lg sm:pb-3'
          }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group relative z-10 flex items-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo-editado.png"
              alt="Blue Ocean Paracas"
              width={200}
              height={70}
              className={`h-auto w-auto transition-all duration-300 ${isTransparent
                ? 'brightness-0 invert max-h-12 md:max-h-16' // Logo blanco
                : isScrolled
                  ? 'max-h-10 md:max-h-14' // Logo pequeño
                  : 'max-h-12 md:max-h-16' // Logo normal
                }`}
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1 2xl:gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`group relative px-2.5 py-2 text-sm font-semibold transition-all duration-300 xl:px-3 xl:text-base 2xl:px-4 2xl:text-lg ${isTransparent
                    ? (pathname === link.href ? 'text-warmYellow' : 'text-white hover:text-warmYellow/90')
                    : (pathname === link.href ? 'text-turquoise' : 'text-oceanBlue hover:text-turquoise')
                    }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-300 ${isTransparent
                      ? 'bg-gradient-to-r from-warmYellow to-amber-400'
                      : 'bg-gradient-to-r from-turquoise to-cyan-400'
                      } ${pathname === link.href
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMobileMenu}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 sm:h-11 sm:w-11 ${isTransparent
                ? 'text-white hover:bg-white/10 focus:ring-white/50'
                : 'text-black hover:bg-turquoise/10 focus:ring-turquoise/50'
                }`}
              aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative h-5 w-5 sm:h-5 sm:w-6">
                <span
                  className={`absolute left-0 h-0.5 w-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-black'} ${isMobileMenuOpen ? 'top-2.5 rotate-45' : 'top-0'
                    }`}
                ></span>
                <span
                  className={`absolute left-0 top-2 h-0.5 w-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-black'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-black'} ${isMobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-5'
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={closeMobileMenu}
          >
            <motion.div
              ref={mobileMenuPanelRef}
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300
              }}
              className="absolute right-0 top-0 h-full w-[90%] max-w-xs overflow-hidden shadow-2xl xs:w-[85%] sm:max-w-sm"
              onClick={(e) => e.stopPropagation()}
              aria-modal="true"
              role="dialog"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.95) 0%, rgba(0, 96, 100, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

              {/* Shimmer effect on edge */}
              <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              <div className="relative border-b border-white/20 p-4 sm:p-5 backdrop-blur-sm">
                <button
                  onClick={closeMobileMenu}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:rotate-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 sm:right-5 sm:top-5"
                  aria-label="Cerrar menú"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="pr-10 sm:pr-12">
                  <Image
                    src="/logo-editado.png"
                    alt="Blue Ocean Paracas"
                    width={140}
                    height={45}
                    className="h-auto w-auto max-h-10 brightness-0 invert sm:max-h-11 drop-shadow-lg"
                  />
                </div>
              </div>

              <ul className="flex flex-col space-y-2 p-4 sm:p-5">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + (0.05 * i),
                      type: 'spring',
                      damping: 20,
                      stiffness: 300
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`group relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-4 text-lg font-bold transition-all duration-300 sm:px-5 sm:py-4 sm:text-xl
                        ${pathname === link.href
                          ? 'bg-gradient-to-r from-white/20 to-white/10 text-warmYellow shadow-lg shadow-warmYellow/20'
                          : 'text-white hover:bg-white/10 hover:text-warmYellow hover:shadow-md'
                        }
                      `}
                    >
                      {/* Glow effect for active link */}
                      {pathname === link.href && (
                        <div className="absolute inset-0 bg-gradient-to-r from-warmYellow/10 to-transparent animate-pulse" />
                      )}

                      <span className="relative z-10 flex items-center gap-3">
                        {/* Icon placeholder for visual interest */}
                        <span className={`h-1.5 w-1.5 rounded-full transition-all ${pathname === link.href
                          ? 'bg-warmYellow scale-100'
                          : 'bg-white/30 scale-0 group-hover:scale-100'
                          }`} />
                        {link.name}
                      </span>

                      <svg
                        className={`relative z-10 h-5 w-5 transition-all duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5
                          ${pathname === link.href ? 'text-warmYellow' : 'text-white/40 group-hover:text-warmYellow'}
                        `}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}