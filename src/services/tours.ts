import { createClient } from '@/utils/supabase/server';
import { Tour, TourSchema } from '@/types/tour-schemas';

// Helper to format price for display (ensure "S/" prefix)
// Accepts number, returns string
function formatPrice(price: number): string {
    return `S/ ${price.toFixed(2)}`;
}

// Helper to safely parse any DB result into our strict Tour type
function parseTour(item: unknown): Tour | null {
    // 1. Zod Parse
    const result = TourSchema.safeParse(item);

    if (!result.success) {
        console.error('❌ Tour Data Integrity Error:', result.error);
        return null;
    }

    const data = result.data;

    // 2. Formatting Enhancements (Display Logic)
    return {
        ...data,
        duration: data.duration || 'Por consultar',
        group_size: data.group_size || 'Variado',
        short_description: data.short_description || '',
        long_description: data.long_description || '',
        schedule: data.schedule || '',
        is_active: data.is_active ?? true,
        time_slots: Array.isArray(data.time_slots) ? data.time_slots : [],
        is_flexible_schedule: data.is_flexible_schedule ?? false,
    };
}

export async function getAllTours(options: { onlyActive?: boolean } = { onlyActive: true }): Promise<Tour[]> {
    try {
        const supabaseClient = await createClient();
        let query = supabaseClient
            .from('tours')
            .select('*')
            .order('created_at', { ascending: false });

        if (options?.onlyActive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error('❌ Error fetching tours:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return [];
        }

        if (!data) {
            console.error('❌ Error fetching tours: No data returned from query.');
            return [];
        }

        // Filter out corrupted rows (nulls from parsing)
        return data.map(item => parseTour(item)).filter((t): t is Tour => t !== null);
    } catch (err: any) {
        console.error('❌ Critical error in getAllTours:', err?.message || err);
        return [];
    }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
    try {
        const supabaseClient = await createClient();
        const { data, error } = await supabaseClient
            .from('tours')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`❌ Error fetching tour by slug (${slug}):`, {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return null;
        }

        if (!data) {
            return null;
        }

        return parseTour(data);
    } catch (err: any) {
        console.error(`❌ Critical error in getTourBySlug (${slug}):`, err?.message || err);
        return null;
    }
}
