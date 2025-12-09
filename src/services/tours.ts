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
                .select('*')
                .returns<Tour[]>();

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
                .single<Tour>();

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
