import { MetadataRoute } from 'next';

// This file will help Google index your site correctly
export default function googled09d85bc262ab29e(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/login',
                '/(auth)/',
                '/data/',
            ],
        },
        sitemap: 'https://pphat.top/sitemap.xml',
    };
}
