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
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 31,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    },
    allowedDevOrigins: ['*.vercel.app', '*.netlify.app', 'localhost', '172.20.10.6', '172.20.10.2', '*.app.github.dev'],
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['next-themes'],
        turbo: {
            loaders: {},
            rules: {}
        }, // Enable Turbo with required options
        optimizeServerReact: true, // Optimize server-side React
    },
    poweredByHeader: false, // Remove X-Powered-By header
    generateEtags: true, // Generate ETags for caching
};

export default nextConfig;