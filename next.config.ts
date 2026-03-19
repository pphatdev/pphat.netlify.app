import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    compress: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**/*',
            },
            {
                protocol: 'https',
                hostname: 'www.shadcnblocks.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.api.pphat.stackdev.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 31,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },

    allowedDevOrigins: ['*.vercel.app', '*.netlify.app', 'localhost', '172.20.10.6', '172.20.10.2', '*.app.github.dev'],

    experimental: {
        optimizeCss: true,
        optimizePackageImports: [
            'next-themes',
            'lucide-react',
            '@tabler/icons-react',
            '@radix-ui/react-icons',
            'framer-motion',
            'recharts',
            'date-fns',
            '@tiptap/core',
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/pm',
            'react-syntax-highlighter',
        ],
        optimizeServerReact: true,
    },

    poweredByHeader: false,
    generateEtags: true,

    headers: async () => [
        {
            source: '/(.*)',
            headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
        },
        {
            source: '/assets/:path*',
            headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
        },
        {
            source: '/_next/static/:path*',
            headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
        },
        {
            source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg)',
            headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
        },
        {
            source: '/(.*)\\.(js|css)',
            headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
        },
        {
            source: '/(.*)\\.(woff|woff2|ttf|otf|eot)',
            headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
        },
    ],

    redirects: async () => [
        // Strip referral/tracking query params — redirect to canonical URL
        {
            source: '/:path*',
            has: [{ type: 'query', key: 'ref' }],
            destination: '/:path*',
            permanent: true,
        },
        {
            source: '/:path*',
            has: [{ type: 'query', key: 'utm_source' }],
            destination: '/:path*',
            permanent: false,
        },
    ],

    rewrites: async () => [
        {
            source: '/api/post',
            has: [
                {
                    type: 'query',
                    key: 'slug',
                    value: '(?<slug>.*)',
                },
            ],
            destination: '/api/posts/:slug',
        },
        {
            source: '/api/post/:slug',
            destination: '/api/posts/:slug',
        },
    ],

    turbopack: {
        rules: {}
    }
};

export default nextConfig;