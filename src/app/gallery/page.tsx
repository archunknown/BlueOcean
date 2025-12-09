import GallerySection from '@/components/sections/Gallery';
import { getGalleryImages } from '@/services/gallery';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
    const images = await getGalleryImages();
    return (
        <main>
            <GallerySection images={images} />
        </main>
    );
}
