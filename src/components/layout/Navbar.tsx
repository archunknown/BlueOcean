'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'Galería', href: '/gallery' },
  { name: 'Testimonios', href: '/testimonials' },
  { name: 'Contacto', href: '/contact' },
];

interface NavbarProps {
  onOpenBookingModal: () => void;
}

export default function Navbar({ onOpenBookingModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuPanelRef.current) {
      mobileMenuPanelRef.current.focus();
    } else if (!isMobileMenuOpen && mobileMenuButtonRef.current) {
      mobileMenuButtonRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = mobileMenuPanelRef.current?.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 w-full bg-oceanBlue shadow-lg transition-all duration-300"
      >
        <nav className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className="group">
            <span
              className="bg-gradient-to-r from-turquoise to-warmYellow bg-clip-text text-2xl font-bold text-transparent transition-filter duration-300 group-hover:brightness-125"
            >
              Blue Ocean
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`group relative text-white transition-colors duration-300 hover:text-warmYellow
                    ${pathname === link.href ? 'text-warmYellow font-bold' : ''}
                  `}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100
                      ${pathname === link.href ? 'scale-x-100 bg-warmYellow' : 'bg-warmYellow'}
                    `}
                  ></span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={onOpenBookingModal}
                className="rounded-full bg-emeraldGreen px-5 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:brightness-110"
              >
                Reservar Ahora
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu} // Cierra al hacer clic fuera
          >
            <motion.div
              ref={mobileMenuPanelRef}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute right-0 top-0 h-full w-3/4 bg-oceanBlue p-8 shadow-lg" // Panel más pequeño
              onClick={(e) => e.stopPropagation()} // Evita que el click en el panel cierre el menú
              aria-modal="true"
              role="dialog"
            >
              <button onClick={closeMobileMenu} className="absolute top-4 right-4 text-white focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ul className="mt-16 flex flex-col items-start space-y-6">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`text-3xl font-bold transition-colors duration-300 hover:text-warmYellow
                        ${pathname === link.href ? 'text-warmYellow' : 'text-white'}
                      `}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * navLinks.length, duration: 0.3 }}
                >
                  <button
                    onClick={() => {
                      onOpenBookingModal();
                      closeMobileMenu();
                    }}
                    className="mt-4 w-full rounded-full bg-emeraldGreen px-5 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-600"
                  >
                    Reservar Ahora
                  </button>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}