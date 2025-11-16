// src/components/sections/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative h-[60vh] bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://picsum.photos/1600/900?random=10')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl font-bold">Explora el Océano con Nosotros</h1>
        <p className="mt-4 text-xl">
          Tu aventura en Paracas comienza aquí. Descubre las maravillas de las Islas Ballestas y más.
        </p>
        <Link
          href="/tours"
          className="mt-8 px-8 py-3 bg-warmYellow text-oceanBlue font-bold rounded hover:bg-yellow-400"
        >
          Ver Tours
        </Link>
      </div>
    </section>
  );
}