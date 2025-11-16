// src/components/sections/Testimonials.tsx

const testimonialsData = [
  {
    name: 'Ana García',
    testimonial: '¡Una experiencia inolvidable! El tour a las Islas Ballestas fue espectacular. El equipo de Blue Ocean es muy profesional y amable.',
    rating: 5,
  },
  {
    name: 'John Doe',
    testimonial: 'El desierto de Paracas es de otro mundo. El paseo en buggy fue pura adrenalina. ¡Totalmente recomendado!',
    rating: 5,
  },
  {
    name: 'Maria Schmidt',
    testimonial: 'Servicio excelente y tours bien organizados. Aprendí mucho sobre la fauna local. Gracias, Blue Ocean.',
    rating: 4,
  },
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-warmYellow' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="py-12 bg-lightGray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-oceanBlue mb-8">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.name} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < testimonial.rating} />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
              <p className="mt-4 font-bold text-right text-oceanBlue">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}