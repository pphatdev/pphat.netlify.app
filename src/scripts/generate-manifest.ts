import { writeFileSync } from 'fs';
import { join } from 'path';
import { appDescriptions, appName } from '../lib/constants';

interface ManifestIcon {
    src: string;
    sizes: string;
    type: string;
    purpose: string;
}

interface ManifestScreenshot {
    src: string;
    sizes: string;
    type: string;
    form_factor: string;
    label: string;
}

interface RelatedApplication {
    platform: string;
    url?: string;
    id?: string;
}

interface ManifestShortcut {
    name: string;
    short_name?: string;
    description?: string;
    url: string;
    icons?: ManifestIcon[];
}

interface WebManifest {
    name: string;
    short_name: string;
    description: string;
    start_url: string;
    id: string;
    display_override: string[];
    display: string;
    background_color: string;
    theme_color: string;
    orientation: string;
    icons: ManifestIcon[];
    screenshots: ManifestScreenshot[];
    categories: string[];
    iarc_rating_id: string;
    dir: string;
    lang: string;
    prefer_related_applications: boolean;
    related_applications: RelatedApplication[];
    scope: string;
    handle_links: string;
    launch_handler: {
        client_mode: string[];
    };
    edge_side_panel: {
        preferred_width: number;
    };
    serviceworker: {
        src: string;
        scope: string;
        update_via_cache: string;
    };
    shortcuts: ManifestShortcut[];
}

function createManifest(): WebManifest {
    return {
        name: appName,
        short_name: appName,
        description: appDescriptions,
        start_url: '/',
        id: '/',
        display_override: ['window-controls-overlay', 'fullscreen', 'minimal-ui'],
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: 'any',
        icons: getManifestIcons(),
        screenshots: getManifestScreenshots(),
        categories: ['personal', 'portfolio', 'blog', 'web development', 'programming', 'software engineering'],
        iarc_rating_id: 'E',
        dir: 'ltr',
        lang: 'en-US',
        prefer_related_applications: false,
        related_applications: [],
        scope: '/',
        handle_links: 'preferred',
        launch_handler: {
            client_mode: ['navigate-existing', 'auto']
        },
        edge_side_panel: {
            preferred_width: 480
        },
        serviceworker: {
            src: '/service-worker.js',
            scope: '/',
            update_via_cache: 'none',
        },
        shortcuts: []
    };
}

function getManifestIcons(): ManifestIcon[] {
    return [
        {
            src: '/assets/icons/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any'
        },
        {
            src: '/assets/icons/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any'
        },
        {
            src: '/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
            purpose: 'any'
        },
        {
            src: '/assets/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
        },
        {
            src: "/assets/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
        },
        {
            src: "/assets/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
        }
    ];
}

function getManifestScreenshots(): ManifestScreenshot[] {
    return [
        {
            src: '/assets/screenshots/dark.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: "wide",
            label: "Desktop - Dark Mode"
        },
        {
            src: '/assets/screenshots/light.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: "narrow",
            label: "Desktop - Light Mode"
        }
    ];
}

export function generateManifest(): void {
    const manifest = createManifest();
    const outputPath = join(__dirname, '../../public/site.webmanifest');

    writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Web manifest generated successfully.');
}

generateManifest();