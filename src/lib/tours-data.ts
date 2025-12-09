export interface Tour {
  id?: string;
  slug: string;
  title: string;
  category: 'Tour' | 'Alquiler';
  shortDescription: string;
  longDescription: string;
  price: string;
  imageUrl: string;
  duration: string;
  groupSize?: string;
  schedule?: string;
  itinerary?: {
    title: string;
    items: string[];
  };
  details?: {
    title: string;
    items: string[];
  };
}

export const toursData: Tour[] = [
  {
    slug: 'islas-ballestas',
    title: 'Islas Ballestas',
    category: 'Tour',
    shortDescription: 'Navega en modernos deslizadores y descubre la majestuosa fauna marina de Paracas.',
    longDescription: 'Embárcate en una emocionante travesía de dos horas hacia las Islas Ballestas a bordo de nuestros modernos deslizadores de fibra de vidrio, con capacidad para 40 a 50 pasajeros. Este tour es una inmersión completa en el ecosistema marino, donde podrás admirar el enigmático Candelabro, impresionantes formaciones rocosas como el Arco del Deseo y el Perfil de Cristo. Serás testigo de la vibrante vida salvaje, observando de cerca colonias de lobos marinos, pingüinos de Humboldt y una gran diversidad de aves guaneras en su hábitat natural.',
    price: 'S/ 40',
    imageUrl: '/tours/islas-ballestas.jpg',
    duration: '2 horas',
    groupSize: '40-50 pax',
    schedule: 'Salidas 8am, 10am, 12pm',
    itinerary: {
      title: 'Recorrido Principal',
      items: [
        'Paseo por la bahía de Paracas',
        'Observación del Candelabro',
        'Visita a las formaciones rocosas',
        'Avistamiento de fauna marina',
        'Antiguo muelle guanero',
      ],
    },
    details: {
      title: 'Incluye',
      items: [
        'Chalecos salvavidas',
        'Guía profesional (español/inglés)',
        'Asistencia permanente',
      ],
    }
  },
  {
    slug: 'reserva-nacional-auto',
    title: 'Reserva Nacional en Auto',
    category: 'Tour',
    shortDescription: 'Recorre los paisajes más icónicos de la reserva en la comodidad de un tour privado.',
    longDescription: 'Descubre la inmensidad y belleza del desierto costero con nuestro tour en auto por la Reserva Nacional de Paracas. Esta experiencia te llevará a través de paisajes surrealistas, playas de colores únicos y acantilados impresionantes, todo desde la comodidad y exclusividad de un vehículo privado. Es la opción perfecta para quienes desean explorar a fondo y con calma los tesoros de la reserva.',
    price: 'S/ 90',
    imageUrl: '/tours/reserva-nacional.jpg',
    duration: 'Aprox. 4 horas',
    groupSize: 'Privado',
    schedule: 'Salidas flexibles',
    itinerary: {
      title: 'Puntos de Visita',
      items: [
        'Mirador Istmo (vista panorámica)',
        'Playa Roja',
        'Playa La Mina',
        'Playa Lagunillas (tiempo para almorzar)',
        'Centro de Interpretación',
      ],
    },
    details: {
      title: 'Ventajas',
      items: [
        'Flexibilidad de horarios',
        'Paradas personalizadas',
        'Ideal para fotógrafos',
        'Comodidad y privacidad',
      ],
    }
  },
  {
    slug: 'mini-buggies-arenacross',
    title: 'Mini Buggies Arenacross',
    category: 'Tour',
    shortDescription: '¡Toma el volante! Conduce tu propio buggy en un tour guiado de 20km por el desierto.',
    longDescription: 'Siente la adrenalina y la libertad de recorrer el desierto de Paracas al volante de tu propio Mini Buggy. Nuestros vehículos son automáticos y fáciles de manejar. En este tour guiado de 2 horas, recorrerás 20 kilómetros de paisajes desérticos espectaculares, combinando la emoción de la velocidad con vistas inolvidables.',
    price: 'S/ 100',
    imageUrl: '/tours/mini-buggies.jpg',
    duration: '2 horas',
    groupSize: '1-2 personas por buggy',
    schedule: 'Accesos: 9am - 3pm',
    itinerary: {
      title: 'Ruta de Aventura',
      items: [
        'Playa Yumaque',
        'Mirador Istmo',
        'Playa Roja',
        'Paradas para fotos en el desierto',
      ],
    },
    details: {
      title: 'Requisitos',
      items: [
        'Licencia de conducir (opcional)',
        'Ganas de aventura',
        'Lentes de sol y protector solar',
        'Ropa cómoda',
      ],
    }
  },
  {
    slug: 'alquiler-moto-scooter',
    title: 'Alquiler de Moto Scooter',
    category: 'Alquiler',
    shortDescription: 'Explora la Reserva Nacional de Paracas a tu propio ritmo con total libertad.',
    longDescription: '¿Prefieres la independencia? Alquila una de nuestras scooters y diseña tu propia aventura. Te proporcionamos un mapa con las rutas sugeridas y todo el equipo necesario para que explores la Reserva Nacional de Paracas con seguridad y a tu aire. Siente la brisa del mar mientras descubres playas escondidas y paisajes únicos.',
    price: 'S/ 80',
    imageUrl: '/tours/scooter.jpg',
    duration: 'Día completo',
    groupSize: '1-2 personas',
    schedule: '9am a 5pm',
    details: {
      title: 'Incluye',
      items: [
        'Scooter moderna y segura',
        'Cascos de seguridad',
        'Mapa de la reserva',
        'Asistencia en ruta',
      ],
    }
  },
  {
    slug: 'alquiler-bicicleta',
    title: 'Alquiler de Bicicleta',
    category: 'Alquiler',
    shortDescription: 'Conecta con la naturaleza de forma ecológica y saludable.',
    longDescription: 'Para los amantes del deporte y la naturaleza, ofrecemos alquiler de bicicletas de montaña. Es una forma increíblemente gratificante y ecológica de experimentar la belleza de la Reserva Nacional. Sigue las rutas ciclísticas y siente la satisfacción de llegar a cada mirador con tu propio esfuerzo.',
    price: 'S/ 25',
    imageUrl: '/tours/bicicleta.jpg',
    duration: 'Día completo',
    groupSize: 'Individual',
    schedule: '9am a 5pm',
    details: {
      title: 'Incluye',
      items: [
        'Bicicleta de montaña',
        'Casco de seguridad',
        'Mapa de rutas ciclísticas',
        'Kit de herramientas básico',
      ],
    }
  },
];
