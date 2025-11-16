// src/components/sections/Gallery.tsx
import Image from 'next/image';

const images = [
  'https://picsum.photos/800/600?random=4',
  'https://picsum.photos/800/600?random=5',
  'https://picsum.photos/800/600?random=6',
  'https://picsum.photos/800/600?random=7',
  'https://picsum.photos/800/600?random=8',
  'https://picsum.photos/800/600?random=9',
];

export default function Gallery() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-oceanBlue mb-8">Nuestra Galería</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src={src} alt={`Galería de Blue Ocean ${index + 1}`} fill className="object-cover hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}