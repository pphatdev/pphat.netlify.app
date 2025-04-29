import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: "export",
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.shadcnblocks.com',
                port: '',
                pathname: '/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 7,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    },
    allowedDevOrigins: ['*.vercel.app', '*.netlify.app', 'localhost', '172.20.10.6', '172.20.10.2'],
    compress: true,
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['next-themes']
    }
};

export default nextConfig;