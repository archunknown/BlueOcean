import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.blueoceanparacastours.com';

    // Create a simple Supabase client using environment variables
    // This avoids using createBrowserClient which would break server-side builds
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all tours from the database
    const { data: tours } = await supabase
        .from('tours')
        .select('slug, updated_at')
        .order('updated_at', { ascending: false });

    // Static routes
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

    // Dynamic routes from tours
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
