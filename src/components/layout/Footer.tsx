'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Hook personalizado para scroll (simulado)
const useScroll = (threshold = 200) => {
  const [scrolled, setScrolled] = useState(false);
  
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > threshold);
    });
  }
  
  return scrolled;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrolled = useScroll(200);
  const [email, setEmail] = useState('');

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
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent">
        <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="currentColor" className="text-white/5" d="M0,50 C360,100 720,0 1080,50 C1440,100 1440,0 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca + Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-block">
              <Image
                src="/logo.png"
                alt="New Logo"
                width={200}
                height={80}
                priority
              />
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Creando experiencias inolvidables en el paraíso costero de Paracas desde 2009.
            </p>
            
            {/* Newsletter con Glassmorphism */}
            <form onSubmit={handleNewsletterSubmit} className="mt-8">
              <p className="font-bold mb-3 text-warmYellow text-sm tracking-wide uppercase">
                Newsletter
              </p>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-white placeholder-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent focus:bg-white/10"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 rounded-lg bg-gradient-to-r from-turquoise to-emeraldGreen px-4 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-turquoise/50 hover:scale-105 active:scale-95"
                >
                  →
                </button>
              </div>
            </form>

            {/* Certificaciones */}
            <div className="mt-6 flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-emeraldGreen/20 border border-emeraldGreen/30 text-emeraldGreen text-xs font-bold">
                ✓ Certificado
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-warmYellow/20 border border-warmYellow/30 text-warmYellow text-xs font-bold">
                ★ 4.9/5
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="mb-6 text-xl font-black text-warmYellow tracking-tight">
              Explorar
            </h3>
            <ul className="space-y-3">
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
                    className="group relative inline-flex items-center text-white/70 transition-colors duration-300 hover:text-turquoise"
                  >
                    <span className="mr-2 text-turquoise opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:mr-3">
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
            <h3 className="mb-6 text-xl font-black text-warmYellow tracking-tight">
              Contáctanos
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  ),
                  text: 'Av. Principal 123, Paracas',
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  ),
                  text: '+51 999 999 999',
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  text: 'info@blueocean.com',
                },
              ].map((item, idx) => (
                <li key={idx} className="group flex items-start gap-3 transition-transform duration-300 hover:translate-x-1">
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-turquoise/10 border border-turquoise/20 transition-all duration-300 group-hover:bg-turquoise/20 group-hover:border-turquoise/40">
                    <svg className="h-5 w-5 text-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <span className="text-white/70 leading-relaxed text-sm group-hover:text-white/90 transition-colors">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="mb-6 text-xl font-black text-warmYellow tracking-tight">
              Síguenos
            </h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Únete a nuestra comunidad y descubre las mejores experiencias en Paracas.
            </p>
            <div className="flex gap-3">
              {[
                {
                  name: 'Instagram',
                  icon: (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.252 1.691-4.771 4.919-4.919 1.265-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.44-.645 1.44-1.44s-.645-1.44-1.44-1.44z" />
                  ),
                },
                {
                  name: 'Twitter',
                  icon: (
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.407 0-6.18 2.76-6.18 6.18 0 .485.055.955.145 1.404-5.14-.26-9.673-2.73-12.762-6.49-.524.9-.829 1.982-.829 3.134 0 2.142 1.082 4.05 2.721 5.178-.798-.025-1.549-.245-2.203-.604v.08c0 2.986 2.127 5.473 4.924 6.04-.653.179-1.347.274-2.063.274-.507 0-.998-.05-1.473-.145.781 2.438 3.045 4.22 5.728 4.267-2.115 1.66-4.77 2.65-7.687 2.65-.499 0-.99-.029-1.476-.086 2.744 1.756 5.96 2.77 9.45 2.77 11.364 0 17.545-9.48 17.545-17.545 0-.267-.007-.535-.02-.799.96-.695 1.795-1.562 2.455-2.55z" />
                  ),
                },
                {
                  name: 'Facebook',
                  icon: (
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.271 0-4.192 1.549-4.192 4.615v3.385z" />
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-turquoise/50 hover:scale-110 hover:shadow-lg hover:shadow-turquoise/20"
                  aria-label={social.name}
                >
                  <svg className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-turquoise" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                  <span className="absolute inset-0 bg-gradient-to-br from-turquoise/0 to-turquoise/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </a>
              ))}
            </div>

            {/* Horarios */}
            <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold text-warmYellow mb-2 uppercase tracking-wide">Horario</p>
              <p className="text-white/70 text-sm">Lun - Dom: 7:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              &copy; {currentYear} Blue Ocean Adventure Tours. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span>Hecho con</span>
              <motion.span
                className="text-red-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❤️
              </motion.span>
              <span>en Paracas</span>
            </div>
            <div className="flex gap-4 text-xs">
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

      {/* Botón Volver Arriba - Mejorado */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-warmYellow to-turquoise opacity-75 blur-lg"></div>
              
              {/* Button */}
              <div className="relative rounded-full bg-gradient-to-br from-warmYellow to-turquoise p-4 shadow-2xl transition-all duration-300 group-hover:shadow-warmYellow/50">
                <svg className="h-6 w-6 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Decorative gradient orbs */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-turquoise/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-warmYellow/5 rounded-full blur-3xl translate-x-1/2"></div>
    </footer>
  );
}