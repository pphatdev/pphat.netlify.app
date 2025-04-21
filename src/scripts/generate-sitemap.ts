import { currentDomain } from '../lib/data';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface Route {
    path: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
}

const today = new Date().toISOString().split('T')[0];

// Known routes in the application
const routes: Route[] = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/gallery', changefreq: 'monthly', priority: 0.8 },
    { path: '/faq', changefreq: 'monthly', priority: 0.7 },
];

export function generateSitemap(): void {
    try {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset
                xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
                <!-- created with pphat.netlify.app -->
                ${routes.map(
                    route => (`
                        <url>
                            <loc>${encodeURI(`${currentDomain}${route.path}`)}</loc>
                            <lastmod>${today}</lastmod>
                            <changefreq>${route.changefreq}</changefreq>
                            <priority>${route.priority.toFixed(1)}</priority>
                        </url>`
                    )
                ).join('\n')}
            </urlset>`;

        const outputPath = join(__dirname, '../../public/sitemap.xml');
        writeFileSync(outputPath, sitemap.replace(/\s+/g, " "), 'utf-8');
        console.log('✅ Sitemap generated successfully.');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run the function
generateSitemap();