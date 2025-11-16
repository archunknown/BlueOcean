'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '@/hooks/useScroll';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrolled = useScroll(200); // Aparece después de 200px de scroll

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-oceanBlue to-turquoise text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Columna 1: Marca */}
          <div>
            <Link href="/" className="group">
              <span className="bg-gradient-to-r from-warmYellow to-white bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-105">
                Blue Ocean
              </span>
            </Link>
            <p className="mt-4 text-gray-200">Tu aventura comienza aquí.</p>
            {/* Newsletter (placeholder) */}
            <div className="mt-6">
              <p className="font-semibold mb-2">Suscríbete a nuestro Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full rounded-l-md border-none px-3 py-2 text-gray-900 focus:outline-none"
                />
                <button className="rounded-r-md bg-warmYellow px-4 py-2 font-bold text-oceanBlue hover:bg-yellow-400">
                  ➔
                </button>
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-200 hover:text-warmYellow">Inicio</Link></li>
              <li><Link href="/tours" className="text-gray-200 hover:text-warmYellow">Tours</Link></li>
              <li><Link href="/gallery" className="text-gray-200 hover:text-warmYellow">Galería</Link></li>
              <li><Link href="/testimonials" className="text-gray-200 hover:text-warmYellow">Testimonios</Link></li>
              <li><Link href="/contact" className="text-gray-200 hover:text-warmYellow">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Contáctanos</h3>
            <ul className="space-y-2 text-gray-200">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-warmYellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Av. Principal 123, Paracas
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-warmYellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +51 999 999 999
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-warmYellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                info@blueocean.com
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-warmYellow transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.252 1.691-4.771 4.919-4.919 1.265-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.44-.645 1.44-1.44s-.645-1.44-1.44-1.44z" /></svg>
              </a>
              <a href="#" className="text-gray-200 hover:text-warmYellow transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.407 0-6.18 2.76-6.18 6.18 0 .485.055.955.145 1.404-5.14-.26-9.673-2.73-12.762-6.49-.524.9-.829 1.982-.829 3.134 0 2.142 1.082 4.05 2.721 5.178-.798-.025-1.549-.245-2.203-.604v.08c0 2.986 2.127 5.473 4.924 6.04-.653.179-1.347.274-2.063.274-.507 0-.998-.05-1.473-.145.781 2.438 3.045 4.22 5.728 4.267-2.115 1.66-4.77 2.65-7.687 2.65-.499 0-.99-.029-1.476-.086 2.744 1.756 5.96 2.77 9.45 2.77 11.364 0 17.545-9.48 17.545-17.545 0-.267-.007-.535-.02-.799.96-.695 1.795-1.562 2.455-2.55z" /></svg>
              </a>
              <a href="#" className="text-gray-200 hover:text-warmYellow transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.271 0-4.192 1.549-4.192 4.615v3.385z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-oceanBlue/30 text-center text-gray-400">
          <p>&copy; {currentYear} Blue Ocean Adventure Tours. Todos los derechos reservados.</p>
          <p className="mt-2">Hecho con ❤️ en Paracas</p>
        </div>
      </div>

      {/* Botón Volver Arriba */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 rounded-full bg-warmYellow p-4 shadow-lg transition-colors hover:bg-yellow-400 focus:outline-none"
          >
            <svg className="h-6 w-6 text-oceanBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}