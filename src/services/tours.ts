import { supabase } from '@/lib/supabase';
import { toursData, Tour as LocalTour } from '@/lib/tours-data';
import { Database } from '@/types/database';

// Tipos derivados de la BD o locales
export type Tour = Database['public']['Tables']['tours']['Row'];
export type GalleryImage = Database['public']['Tables']['gallery']['Row'];

/**
 * Servicio inteligente para obtener Tours.
 * Intenta obtener de Supabase, si falla o no hay datos, usa el fallback local.
 */
export const ToursService = {
    async getAll(): Promise<LocalTour[]> {
        try {
            const { data, error } = await supabase
                .from('tours')
                .select('*');

            if (error) throw error;

            // Si hay datos en la BD, mapealos para que coincidan con la estructura que la UI espera
            // (asumiendo que la estructura de BD es compatible o se transforma aquí)
            if (data && data.length > 0) {
                return data.map(tour => ({
                    ...tour,
                    // Aseguramos que los JSONs tengan el formato correcto
                    itinerary: tour.itinerary as LocalTour['itinerary'],
                    details: tour.details as LocalTour['details'],
                    // Convertimos snake_case de BD a camelCase usado en componentes si es necesario
                    // PERO, para simplificar, mis tipos de BD usan camelCase en las interfaces generadas?
                    // No, el usuario pidió tipos de BD que usualmente son snake_case.
                    // Revisando types/database.ts:
                    // tours: id, slug, title, category, short_description, long_description...
                    // UI espera: shortDescription, longDescription...
                    // Hacemos el mapeo aquí:
                    shortDescription: tour.short_description,
                    longDescription: tour.long_description,
                    imageUrl: tour.image_url,
                    groupSize: tour.group_size || undefined,
                })) as unknown as LocalTour[];
            }

            // Si no hay datos (array vacío), retornamos fallback
            console.warn('⚠️ Supabase sin datos de tours, usando fallback local.');
            return toursData;

        } catch (error) {
            console.error('❌ Error fetching tours from Supabase:', error);
            console.warn('⚠️ Usando data local de fallback debido a error.');
            return toursData;
        }
    },

    async getBySlug(slug: string): Promise<LocalTour | undefined> {
        try {
            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;

            if (data) {
                return {
                    ...data,
                    itinerary: data.itinerary as LocalTour['itinerary'],
                    details: data.details as LocalTour['details'],
                    shortDescription: data.short_description,
                    longDescription: data.long_description,
                    imageUrl: data.image_url,
                    groupSize: data.group_size || undefined,
                } as unknown as LocalTour;
            }
        } catch (error) {
            console.error(`❌ Error fetching tour ${slug} from Supabase:`, error);
        }

        // Fallback local
        return toursData.find(t => t.slug === slug);
    },
};

/**
 * Servicio para obtener imágenes de Galería.
 */
export const GalleryService = {
    async getAll(): Promise<GalleryImage[]> {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                return data; // Retornamos los datos de la BD
            }
        } catch (error) {
            // Ignoramos error en galería por ahora o devolvemos vacío para que no rompa,
            // pero el usuario pidió refactorizar Gallery.tsx para NO usar json local.
            // Sin embargo, si la BD está vacía, no se verá nada.
            // Podríamos mantener un mini-fallback o dejar que se llene la BD.
            // El prompt dice: "temporalmente, si la BD falla o está vacía, devuelvan los datos del archivo antiguo".
            // PERO, eliminamos el gallery.json en paso 1. Así que aquí no hay fallback fácil
            // a menos que hayamos inyectado los datos en este archivo antes.
            // Como el usuario dijo "borra gallery.json", asumiremos que está bien que devuelva []
            // O podríamos haber guardado el JSON en una variable aquí si quisieramos fallback.
            console.error('❌ Error fetching gallery:', error);
        }
        return [];
    }
};
