import { MetadataRoute } from 'next';

// This follows the Next.js standard for robots.txt generation
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/login*',
                    '/(auth)/*',
                    '/data/',
                    '/google*.html',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/login*',
                    '/(auth)/*',
                    '/data/',
                    '/google*.html',
                ],
            },
        ],
        sitemap: 'https://pphat.top/sitemap.xml',
        host: 'https://pphat.top',
    };
}
