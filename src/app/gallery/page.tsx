import GallerySection from '@/components/sections/Gallery';
import { getGalleryImages } from '@/services/gallery';

export const dynamic = 'force-dynamic'; // Opcional: Para asegurar que siempre intente traer datos frescos

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main>
      <GallerySection images={images} />
    </main>
  );
}