import { notFound } from 'next/navigation';
import { getTourBySlug, getAllTours } from '@/services/tours';
import TourDetailView from './TourDetailView';
import { Metadata } from 'next';

// Definición de tipos para los parámetros de la ruta
type Props = {
  params: Promise<{ slug: string }>;
};

// --- OPTIMIZATION: Incremental Static Regeneration (ISR) ---
// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600;
// Make it dynamic params (default), but pre-render known paths
export const dynamicParams = true;

// Pre-generate paths for all existing tours at build time
export async function generateStaticParams() {
  const tours = await getAllTours();
  return tours.map((tour) => ({
    slug: tour.slug,
  }));
}

// Genera los metadatos para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return {
      title: 'Tour no encontrado',
    };
  }

  return {
    title: `${tour.title} | Blue Ocean`,
    description: tour.short_description,
  };
}

// --- Componente de Página (Servidor) ---
export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;

  // Fetch specific tour and all tours for "Related Tours" or navigation
  // Parallel data fetching is good here.
  const [tour, allTours] = await Promise.all([
    getTourBySlug(slug),
    getAllTours()
  ]);

  if (!tour) {
    notFound();
  }

  return <TourDetailView tour={tour} allTours={allTours} />;
}
