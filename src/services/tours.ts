import { supabase } from '@/lib/supabase';
import { Tour, TourSchema } from '@/types/tour-schemas';

// Helper to format price for display (ensure "S/" prefix)
// Now strictly typed: accepts string, returns string
function formatPrice(price: string): string {
    if (!price) return 'S/ 0.00';
    if (price.startsWith('S/')) return price;
    if (price.startsWith('$')) return price.replace('$', 'S/ ');
    // Validation to prevent double prefixing if logic fails elsewhere
    return `S/ ${price}`;
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
    // currently we mutate the price for display in the service (Frontend expects "S/ ...")
    // This is a bit of a pattern violation (Service should return raw data), but maintaining existing behavior for now.
    return {
        ...data,
        price: formatPrice(data.price),
        duration: data.duration || 'Por consultar',
        group_size: data.group_size || 'Variado',
        short_description: data.short_description || '',
        long_description: data.long_description || '',
        schedule: data.schedule || ''
    };
}

export async function getAllTours(): Promise<Tour[]> {
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

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
