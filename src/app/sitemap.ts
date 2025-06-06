import { MetadataRoute } from 'next';

// This file generates a dynamic sitemap using Next.js API
// It will supplement the existing static sitemap.xml file
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://pphat.top';

    // Get current date for lastModified
    const currentDate = new Date();

    // Define the main routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/posts`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sitemap.xml`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/robots.txt`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.1,
        },
    ];

    return routes;
}
