'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useScroll } from '@/hooks/useScroll';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'Galería', href: '/gallery' },
  { name: 'Testimonios', href: '/testimonials' },
  { name: 'Contacto', href: '/contact' },
];

export default function Navbar() {
  const scrolled = useScroll(50);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 mx-auto mt-4 max-w-6xl rounded-full transition-all duration-500
          ${scrolled ? 'bg-oceanBlue/90 shadow-2xl backdrop-blur-lg' : 'bg-white/10 backdrop-blur-sm'}`}
      >
        <nav className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="group">
            <span className="bg-gradient-to-r from-turquoise to-warmYellow bg-clip-text text-2xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110">
              Blue Ocean
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="group relative text-white transition-colors duration-300 hover:text-warmYellow"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-warmYellow transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
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
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex h-screen w-full items-center justify-center bg-oceanBlue/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col items-center space-y-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-bold text-white transition-colors duration-300 hover:text-warmYellow"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}