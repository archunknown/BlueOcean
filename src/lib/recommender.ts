import { createClient } from '@/utils/supabase/server';

export interface TourRecommendation {
    id: string;
    title: string;
    price: number;
    slug: string;
    image_url: string;
    discounted_price: number;
    discount_percentage: number;
}

/**
 * Static association rules (derived from offline Apriori analysis of historical purchases)
 * mapping a primary tour slug to recommended complement slugs.
 */
const SLUG_RULES_MAP: Record<string, string[]> = {
    'islas-ballestas': ['reserva-nacional-paracas', 'mini-buggies', 'alquiler-bicicletas'],
    'reserva-nacional-paracas': ['islas-ballestas', 'cuatrimotos', 'alquiler-bicicletas'],
    'mini-buggies': ['islas-ballestas', 'reserva-nacional-paracas'],
    'cuatrimotos': ['islas-ballestas', 'reserva-nacional-paracas'],
    'alquiler-bicicletas': ['islas-ballestas', 'reserva-nacional-paracas']
};

/**
 * Gets cross-selling recommendations for a given tour.
 * Applies a default 15% discount on the recommended tours to incentivize purchase.
 */
export async function getRecommendations(tourSlug: string, limit: number = 2): Promise<TourRecommendation[]> {
    const supabase = await createClient();

    // 1. Get recommendation slugs from association rules map
    const targetSlugs = SLUG_RULES_MAP[tourSlug] || ['islas-ballestas', 'reserva-nacional-paracas'];

    // 2. Fetch the corresponding tour details from the DB
    const { data: tours, error } = await supabase
        .from('tours')
        .select('id, title, price, slug, image_url')
        .in('slug', targetSlugs)
        .eq('is_active', true)
        .limit(limit);

    if (error || !tours) {
        console.error('Error fetching recommendations from DB:', error);
        return [];
    }

    // 3. Apply standard 15% discount for cross-selling recommendation package
    const discountPercentage = 15;
    return tours.map(t => {
        const discountedPrice = parseFloat((t.price * (1 - discountPercentage / 100)).toFixed(2));
        return {
            id: t.id,
            title: t.title,
            price: t.price,
            slug: t.slug,
            image_url: t.image_url,
            discounted_price: discountedPrice,
            discount_percentage: discountPercentage
        };
    });
}
