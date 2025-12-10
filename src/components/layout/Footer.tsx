'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const useScroll = (threshold = 200) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

interface Props {
  email?: string | null;
  phoneNumber?: string | null;
}

export default function Footer({ email: customEmail, phoneNumber }: Props) {
  const currentYear = new Date().getFullYear();
  const scrolled = useScroll(200);
  const [email, setEmail] = useState('');

  const displayEmail = customEmail || 'ytasayco59@gmail.com';
  const displayPhone = phoneNumber || '+51 988 211 694';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter:', email);
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-b from-oceanBlue via-[#152d4a] to-[#0f2238] text-white overflow-hidden">
      {/* Decorative Wave */}
      <div className="absolute top-0 left-0 w-full h-16 sm:h-20 lg:h-24 bg-gradient-to-b from-white/5 to-transparent">
        <svg className="absolute bottom-0 w-full h-16 sm:h-20 lg:h-24" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="currentColor" className="text-white/5" d="M0,50 C360,100 720,0 1080,50 C1440,100 1440,0 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-3 pt-16 pb-6 relative z-10 xs:px-4 xs:pt-18 sm:pt-20 sm:pb-8 lg:pt-24 lg:px-8">
        {/* Grid Principal - Optimizado para móviles */}
        <div className="grid grid-cols-2 gap-6 mb-10 xs:gap-7 xs:mb-12 sm:gap-8 sm:mb-14 lg:grid-cols-4 lg:gap-10 lg:mb-16">

          {/* Columna 1: Marca + Newsletter - Ocupa 2 columnas en móvil */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-block">
              <Image
                src="/logo.png"
                alt="Blue Ocean Logo"
                width={200}
                height={80}
                className="h-auto w-auto max-w-[160px] xs:max-w-[180px] sm:max-w-[200px]"
                priority
              />
            </Link>
            <p className="mt-3 text-white/70 text-xs leading-relaxed xs:text-sm sm:mt-4">
              Creando experiencias inolvidables en el paraíso costero de Paracas desde 2009.
            </p>

            {/* Newsletter con Glassmorphism */}
            <form onSubmit={handleNewsletterSubmit} className="mt-6 sm:mt-8">
              <p className="font-bold mb-2 text-warmYellow text-xs tracking-wide uppercase xs:text-sm sm:mb-3">
                Newsletter
              </p>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-white placeholder-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent focus:bg-white/10 xs:px-4 xs:py-3 xs:pr-12"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 rounded-lg bg-gradient-to-r from-turquoise to-emeraldGreen px-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-turquoise/50 hover:scale-105 active:scale-95 xs:px-4"
                >
                  →
                </button>
              </div>
            </form>

            {/* Certificaciones - Responsive */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-emeraldGreen/20 border border-emeraldGreen/30 text-emeraldGreen text-[10px] font-bold xs:px-3 xs:py-1.5 xs:text-xs">
                ✓ Certificado
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-warmYellow/20 border border-warmYellow/30 text-warmYellow text-[10px] font-bold xs:px-3 xs:py-1.5 xs:text-xs">
                ★ 4.9/5
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="mb-4 text-lg font-black text-warmYellow tracking-tight xs:text-xl sm:mb-6">
              Explorar
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              {[
                { name: 'Inicio', href: '/' },
                { name: 'Tours', href: '/tours' },
                { name: 'Galería', href: '/gallery' },
                { name: 'Testimonios', href: '/testimonials' },
                { name: 'Contacto', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group relative inline-flex items-center text-sm text-white/70 transition-colors duration-300 hover:text-turquoise xs:text-base"
                  >
                    <span className="mr-1.5 text-turquoise opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:mr-2.5 xs:mr-2 xs:group-hover:mr-3">
                      →
                    </span>
                    {link.name}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-turquoise to-transparent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="mb-4 text-lg font-black text-warmYellow tracking-tight xs:text-xl sm:mb-6">
              Contáctanos
            </h3>
            <ul className="space-y-3 xs:space-y-4">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  ),
                  text: 'AA.HH Alberto tataje Muñoz Mz b lote 6, Paracas 11550',
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  ),
                  text: displayPhone,
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  text: displayEmail,
                },
              ].map((item, idx) => (
                <li key={idx} className="group flex items-start gap-2.5 transition-transform duration-300 hover:translate-x-1 xs:gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-turquoise/10 border border-turquoise/20 transition-all duration-300 group-hover:bg-turquoise/20 group-hover:border-turquoise/40 xs:h-9 xs:w-9 sm:h-10 sm:w-10">
                    <svg className="h-4 w-4 text-turquoise xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <span className="text-xs leading-relaxed text-white/70 group-hover:text-white/90 transition-colors xs:text-sm">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="mb-4 text-lg font-black text-warmYellow tracking-tight xs:text-xl sm:mb-6">
              Síguenos
            </h3>
            <p className="text-xs leading-relaxed text-white/70 mb-4 xs:text-sm sm:mb-6">
              Únete a nuestra comunidad y descubre las mejores experiencias en Paracas.
            </p>
            <div className="flex gap-2.5 xs:gap-3">
              {[
                {
                  name: 'Instagram',
                  href: 'https://www.instagram.com/blue_ocean_paracas/',
                  icon: (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.252 1.691-4.771 4.919-4.919 1.265-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.44-.645 1.44-1.44s-.645-1.44-1.44-1.44z" />
                  ),
                },
                {
                  name: 'Facebook',
                  href: 'https://www.facebook.com/profile.php?id=100061274204845',
                  icon: (
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.271 0-4.192 1.549-4.192 4.615v3.385z" />
                  ),
                },
                {
                  name: 'TikTok',
                  href: 'https://www.tiktok.com/@blue_ocean_paracas',
                  icon: (
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-turquoise/50 hover:scale-110 hover:shadow-lg hover:shadow-turquoise/20 xs:h-11 xs:w-11 sm:h-12 sm:w-12"
                  aria-label={social.name}
                >
                  <svg className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-turquoise xs:h-5 xs:w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                  <span className="absolute inset-0 bg-gradient-to-br from-turquoise/0 to-turquoise/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </a>
              ))}
            </div>

            {/* Horarios */}
            <div className="mt-5 rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-sm xs:mt-6 xs:p-4">
              <p className="text-[10px] font-bold text-warmYellow mb-1.5 uppercase tracking-wide xs:text-xs xs:mb-2">Horario</p>
              <p className="text-white/70 text-xs xs:text-sm">Lun - Dom: 7:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - 100% Responsive */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
            <p className="text-white/50 text-[10px] text-center xs:text-xs sm:text-left sm:text-sm">
              &copy; {currentYear} Blue Ocean Adventure Tours. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-1.5 text-white/50 text-[10px] xs:gap-2 xs:text-xs sm:text-sm">
              <span>Hecho con</span>
              <motion.span
                className="text-red-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❤️
              </motion.span>
              <span>en Paracas | By Arch Adrian</span>
            </div>
            <div className="flex gap-3 text-[10px] xs:gap-4 xs:text-xs">
              <Link href="/privacy" className="text-white/50 hover:text-turquoise transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-turquoise transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Volver Arriba - Responsive */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 group xs:bottom-7 xs:right-7 sm:bottom-8 sm:right-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-warmYellow to-turquoise opacity-75 blur-lg"></div>
              <div className="relative rounded-full bg-gradient-to-br from-warmYellow to-turquoise p-3 shadow-2xl transition-all duration-300 group-hover:shadow-warmYellow/50 xs:p-3.5 sm:p-4">
                <svg className="h-5 w-5 text-oceanBlue xs:h-5.5 xs:w-5.5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Decorative gradient orbs */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-turquoise/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 sm:w-80 sm:h-80 lg:w-96 lg:h-96"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-warmYellow/5 rounded-full blur-3xl translate-x-1/2 sm:w-80 sm:h-80 lg:w-96 lg:h-96"></div>
    </footer>
  );
}