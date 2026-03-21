import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@lib/content';

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
        const publishedPosts = await getPublishedPosts();

        const postRoutes: MetadataRoute.Sitemap = publishedPosts.map(post => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        routes.push(...postRoutes);
    } catch (error) {
        console.error('Error reading post data for sitemap:', error);
    }

    return routes;
}
