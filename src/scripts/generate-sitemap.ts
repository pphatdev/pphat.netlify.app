import { currentDomain } from '../lib/data';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { readdirSync } from 'fs';

interface Route {
    path: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
}

const today = new Date().toISOString().split('T')[0];

// Known routes in the application
const pagesDirectory = join(process.cwd(), 'src/app');

function getRoutes(dir: string, baseRoute: string = ''): Route[] {
    const routes: Route[] = [];
    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            routes.push(...getRoutes(join(dir, file.name), `${baseRoute}/${file.name}`));
        } else {
            if (file.name === 'page.tsx') {
                let path = `${baseRoute}`
                    .replace(/\/\([^)]+\)/g, '') // remove all path contains `(name)/`
                    .replace(/\/$/, ''); // remove trailing slash

                if (path === '/404' || path === '/500' || path === '/_app' || path === '/_document') continue;

                // skip prefix `admin`, `auth`, `api`
                if (path.startsWith('/admin') || path.startsWith('/auth') || path.startsWith('/api')) continue;


                routes.push({
                    path: path || '/', // use '/' for empty path
                    changefreq: path === '' ? 'weekly' : 'monthly',
                    priority: path === '' ? 1.0 : 0.8
                });
            }
        }
    }

    return routes;
}

const routes: Route[] = getRoutes(pagesDirectory);

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