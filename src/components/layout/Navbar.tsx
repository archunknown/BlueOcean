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
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isTransparent 
            ? 'bg-gradient-to-b from-black/50 to-transparent py-4 sm:py-5' 
            : 'bg-white/95 py-2 shadow-md backdrop-blur-lg sm:py-3'
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group relative z-10 flex items-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo2.png"
              alt="Blue Ocean Paracas"
              width={200}
              height={70}
              className={`h-auto w-auto transition-all duration-300 ${
                isTransparent 
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
                  className={`group relative px-2.5 py-2 text-sm font-semibold transition-all duration-300 xl:px-3 xl:text-base 2xl:px-4 2xl:text-lg ${
                    isTransparent
                      ? (pathname === link.href ? 'text-warmYellow' : 'text-white hover:text-warmYellow/90')
                      : (pathname === link.href ? 'text-turquoise' : 'text-oceanBlue hover:text-turquoise')
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-300 ${
                       isTransparent
                        ? 'bg-gradient-to-r from-warmYellow to-amber-400'
                        : 'bg-gradient-to-r from-turquoise to-cyan-400'
                    } ${
                      pathname === link.href 
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
              className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 sm:h-11 sm:w-11 ${
                isTransparent 
                  ? 'text-white hover:bg-white/10 focus:ring-white/50' 
                  : 'text-oceanBlue hover:bg-turquoise/10 focus:ring-turquoise/50'
              }`}
              aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative h-5 w-5 sm:h-5 sm:w-6">
                <span
                  className={`absolute left-0 h-0.5 w-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-oceanBlue'} ${
                    isMobileMenuOpen ? 'top-2.5 rotate-45' : 'top-0'
                  }`}
                ></span>
                <span
                  className={`absolute left-0 top-2 h-0.5 w-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-oceanBlue'} ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-oceanBlue'} ${
                    isMobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-5'
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobileMenu}
          >
            <motion.div
              ref={mobileMenuPanelRef}
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 h-full w-[90%] max-w-xs bg-gradient-to-br from-oceanBlue via-oceanBlue to-cyan-900 shadow-2xl xs:w-[85%] sm:max-w-sm"
              onClick={(e) => e.stopPropagation()}
              aria-modal="true"
              role="dialog"
            >
              <div className="relative border-b border-white/10 p-4 sm:p-5">
                <button 
                  onClick={closeMobileMenu} 
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/50 sm:right-5 sm:top-5 sm:h-10 sm:w-10"
                  aria-label="Cerrar menú"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="pr-10 sm:pr-12">
                  <Image
                    src="/logo2.png"
                    alt="Blue Ocean Paracas"
                    width={140}
                    height={45}
                    className="h-auto w-auto max-h-9 brightness-0 invert sm:max-h-11"
                  />
                </div>
              </div>

              <ul className="flex flex-col space-y-1 p-4 sm:p-5">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`group flex items-center justify-between rounded-xl px-3 py-3 text-lg font-bold transition-all duration-300 sm:px-4 sm:py-4 sm:text-xl
                        ${pathname === link.href 
                          ? 'bg-white/10 text-warmYellow' 
                          : 'text-white hover:bg-white/5 hover:text-warmYellow'
                        }
                      `}
                    >
                      <span>{link.name}</span>
                      <svg 
                        className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5
                          ${pathname === link.href ? 'text-warmYellow' : 'text-white/50'}
                        `}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4 sm:p-5">
                <p className="text-center text-xs text-white/60 sm:text-sm">
                  © 2025 Blue Ocean Paracas
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}