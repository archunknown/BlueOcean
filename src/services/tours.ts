import { supabase } from '@/lib/supabase';
import { Tour, TourSchema } from '@/types/tour-schemas';

// Helper to format price for display (ensure "S/" prefix)
// Now strictly typed: accepts string, returns string
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
    // The previous service logic mutated price to a string for display. 
    // BUT the new strict Tour type expects 'price' to be a NUMBER.
    // So we CANNOT return a formatted string here anymore if we want to satisfy the type.
    // We return the number as is.
    return {
        ...data,
        // price: formatPrice(data.price), <-- REMOVED, data.price is already number
        duration: data.duration || 'Por consultar',
        group_size: data.group_size || 'Variado',
        short_description: data.short_description || '',
        long_description: data.long_description || '',
        schedule: data.schedule || '',
        is_active: data.is_active ?? true,
        // Ensure time_slots is an array (DB might return null)
        time_slots: Array.isArray(data.time_slots) ? data.time_slots : [],
        is_flexible_schedule: data.is_flexible_schedule ?? false,
    };
}

export async function getAllTours(options: { onlyActive?: boolean } = { onlyActive: true }): Promise<Tour[]> {
    let query = supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

    if (options?.onlyActive) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error || !data) {
        console.error('Error fetching tours:', error);
        return [];
    }

    // Filter out corrupted rows (nulls from parsing)
    return data.map(item => parseTour(item)).filter((t): t is Tour => t !== null);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null; // Don't log "error" for not found, just return null
    }

    return parseTour(data);
}
