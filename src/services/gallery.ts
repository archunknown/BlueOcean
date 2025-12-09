import { supabase } from '@/lib/supabase';
import { galleryData, GalleryItem } from '@/lib/gallery-data';
import { Database } from '@/types/database';

type GalleryRow = Database['public']['Tables']['gallery']['Row'];

export async function getGalleryImages(): Promise<GalleryItem[]> {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false })
            .returns<GalleryRow[]>();

        if (error || !data || data.length === 0) {
            // console.warn('⚠️ Usando galería local (Fallback).');
            return galleryData;
        }

        return data.map((item) => ({
            id: item.id.toString(), // Convert string id
            title: item.title,
            category: item.category,
            src: item.image_url,
        }));

    } catch (error) {
        console.error('❌ Error crítico fetching gallery:', error);
        return galleryData;
    }
}
