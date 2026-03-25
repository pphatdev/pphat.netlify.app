import { MetadataRoute } from 'next';
import { NEXT_PUBLIC_API } from '@lib/constants';

// This file generates a dynamic sitemap using Next.js API
// It only includes canonical URLs that return 200 status codes
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://pphat.me';

    // Get current date for lastModified
    const currentDate = new Date();

    // Define the main routes - only include actual HTML pages
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
    ];

    // Add dynamic post routes
    try {
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles?page=1&limit=500`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            return routes;
        }

        const payload = (await response.json()) as {
            data?: Array<{ slug?: string; published_date?: string; created_date?: string; updated_date?: string; published?: boolean; status?: boolean; is_deleted?: boolean }>;
        };
        const publishedPosts = Array.isArray(payload.data)
            ? payload.data.filter((post) => (post.status ?? true) && !(post.is_deleted ?? false) && (post.published ?? true) && !!post.slug)
            : [];

        const postRoutes: MetadataRoute.Sitemap = publishedPosts.map(post => ({
            url: `${baseUrl}/posts/${String(post.slug)}`,
            lastModified: new Date(post.updated_date || post.published_date || post.created_date || currentDate),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        routes.push(...postRoutes);
    } catch (error) {
        console.error('Error reading post data for sitemap:', error);
    }

    return routes;
}
