import { notFound } from 'next/navigation';
import { toursData, Tour } from '@/lib/tours-data'; // Import Tour type
import TourDetailView from './TourDetailView';

// Definición de tipos para los parámetros de la ruta
type Props = {
  params: Promise<{ slug: string }>;
};

// Genera las páginas estáticas para un mejor rendimiento
export async function generateStaticParams() {
  return toursData.map((tour) => ({
    slug: tour.slug,
  }));
}

// Helper para obtener los datos del tour por slug
const getTourBySlug = (slug: string): Tour | undefined => {
  return toursData.find((tour) => tour.slug === slug);
};

// Genera los metadatos para SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    return {
      title: 'Tour no encontrado',
    };
  }

  return {
    title: `${tour.title} | Blue Ocean`,
    description: tour.shortDescription,
  };
}

// --- Componente de Página (Servidor) ---
// Su única responsabilidad es obtener los datos y pasarlos al componente de cliente
export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  // Si el tour no se encuentra, muestra la página 404
  if (!tour) {
    notFound();
  }

  // RENDERIZAR EL COMPONENTE DE CLIENTE Y PASARLE TODOS LOS DATOS NECESARIOS
  return <TourDetailView tour={tour} allTours={toursData} />;
}
