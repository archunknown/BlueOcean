import { supabase } from '@/lib/supabase';
import { Tour } from '@/lib/tours-data';

// Helper to format price for display (ensure "S/" prefix)
function formatPrice(price: string): string {
    if (!price) return 'S/ 0.00';
    if (price.startsWith('S/')) return price;
    if (price.startsWith('$')) return price.replace('$', 'S/ ');
    return `S/ ${price}`;
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

    // Explicit mapping to avoid type inference issues
    return data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        price: formatPrice(item.price),
        duration: item.duration || 'Por consultar',
        category: item.category || 'Tour',
        imageUrl: item.image_url,
        shortDescription: item.short_description || '',
        longDescription: item.long_description || '',
        groupSize: item.group_size || 'Variado',
        schedule: item.schedule || '',
        itinerary: item.itinerary,
        details: item.details
    }));
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    // Explicit mapping here too
    const item: any = data;

    return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        price: formatPrice(item.price),
        duration: item.duration || 'Por consultar',
        category: item.category || 'Tour',
        imageUrl: item.image_url,
        shortDescription: item.short_description || '',
        longDescription: item.long_description || '',
        groupSize: item.group_size || 'Variado',
        schedule: item.schedule || '',
        itinerary: item.itinerary,
        details: item.details
    };
}
