import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // CORRECCIÓN: Eliminado 'www' para coincidir con tu dominio primario en Netlify
    const baseUrl = 'https://blueoceanparacastours.com';

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: tours } = await supabase
        .from('tours')
        .select('slug, updated_at')
        .order('updated_at', { ascending: false });

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/tours`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/testimonials`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    const tourRoutes: MetadataRoute.Sitemap = tours
        ? tours.map((tour) => ({
            url: `${baseUrl}/tours/${tour.slug}`,
            lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        }))
        : [];

    return [...staticRoutes, ...tourRoutes];
}