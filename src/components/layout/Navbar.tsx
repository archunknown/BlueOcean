// src/components/layout/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-oceanBlue text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Blue Ocean
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-warmYellow">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/tours" className="hover:text-warmYellow">
              Tours
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="hover:text-warmYellow">
              Galería
            </Link>
          </li>
          <li>
            <Link href="/testimonials" className="hover:text-warmYellow">
              Testimonios
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-warmYellow">
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}