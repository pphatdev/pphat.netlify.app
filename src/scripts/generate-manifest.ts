import { writeFileSync } from 'fs';
import { join } from 'path';
import { appDescriptions , appName} from '../lib/data';

const manifest = {
    name: appName,
    short_name: appName,
    description: appDescriptions,
    start_url: '/',
    display_override: ['fullscreen', 'minimal-ui'],
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
        {
            src: '/assets/icons/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
        },
        {
            src: '/assets/icons/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
        },
        {
            src: '/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
        },
        {
            src: '/assets/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
        },
        {
            src: "/assets/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
        },
        {
            src: "/assets/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
        }
    ],
    screenshots: [
        {
            src: '/assets/screenshots/dark.png',
            sizes: '1920x1080',
            type: 'image/png',
            "form_factor": "wide",
            "label": "Desktop - Dark Mode"
        },
        {
            src: '/assets/screenshots/light.png',
            sizes: '1920x1080',
            type: 'image/png',
            "form_factor": "narrow",
            "label": "Desktop - Light Mode"
        }
    ],
    categories: ['personal', 'portfolio', 'blog', 'web development', 'programming', 'software engineering'],
    iarc_rating_id: 'E',
    dir: 'ltr',
    lang: 'en-US',
    prefer_related_applications: false,
    related_applications: [],
    scope: '/',
    serviceworker: {
        src: '/service-worker.js',
        scope: '/',
        update_via_cache: 'none',
    },
    shortcuts: [],
};

const outputPath = join(__dirname, '../../public/site.webmanifest');

writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log('Web manifest generated at:', outputPath);