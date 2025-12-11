import { supabase } from '@/lib/supabase';
import { galleryData, GalleryItem } from '@/lib/gallery-data';

export async function getGalleryImages(): Promise<GalleryItem[]> {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.warn('⚠️ Usando galería local (Fallback).');
            return galleryData;
        }

        return (data as any[]).map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            src: item.image_url,
        }));

    } catch (error) {
        console.error('❌ Error crítico fetching gallery:', error);
        return galleryData;
    }
}
