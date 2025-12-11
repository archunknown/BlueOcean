import { notFound } from 'next/navigation';
import { getTourBySlug, getAllTours } from '@/services/tours';
import TourDetailView from './TourDetailView';

// Definición de tipos para los parámetros de la ruta
type Props = {
  params: Promise<{ slug: string }>;
};

// For now, we'll rely on dynamic rendering to ensure updates are seen immediately.
// We can re-enable static params with ISR later if needed.
export const dynamic = 'force-dynamic';

// Genera los metadatos para SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

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

  // Fetch specific tour and all tours for "Related Tours" or navigation if needed by the view
  const [tour, allTours] = await Promise.all([
    getTourBySlug(slug),
    getAllTours()
  ]);

  // Si el tour no se encuentra, muestra la página 404
  if (!tour) {
    notFound();
  }

  // RENDERIZAR EL COMPONENTE DE CLIENTE Y PASARLE TODOS LOS DATOS NECESARIOS
  return <TourDetailView tour={tour} allTours={allTours} />;
}
