import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        // CORRECCIÓN: Eliminado 'www'
        sitemap: 'https://blueoceanparacastours.com/sitemap.xml',
    };
}