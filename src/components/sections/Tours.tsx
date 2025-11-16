// src/components/sections/Tours.tsx
import Image from 'next/image';

const toursData = [
  {
    title: 'Islas Ballestas',
    description: 'Un increíble viaje en bote para observar la vida marina, incluyendo lobos marinos y pingüinos de Humboldt.',
    price: 'S/ 50',
    imageUrl: 'https://picsum.photos/800/600?random=1',
  },
  {
    title: 'Reserva Nacional de Paracas',
    description: 'Explora el impresionante paisaje desértico y las formaciones rocosas de la costa.',
    price: 'S/ 40',
    imageUrl: 'https://picsum.photos/800/600?random=2',
  },
  {
    title: 'Paseo en Buggy y Sandboard',
    description: 'Siente la adrenalina recorriendo las dunas del desierto de Paracas en un buggy y deslízate por la arena.',
    price: 'S/ 80',
    imageUrl: 'https://picsum.photos/800/600?random=3',
  },
];

export default function Tours() {
  return (
    <section className="py-12 bg-lightGray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-oceanBlue mb-8">Nuestros Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toursData.map((tour) => (
            <div key={tour.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-56">
                <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-oceanBlue">{tour.title}</h3>
                <p className="mt-2 text-gray-600">{tour.description}</p>
                <p className="mt-4 text-lg font-semibold text-emeraldGreen">{tour.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}