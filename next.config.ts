import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: "export",
    // images: {
    //     formats: ['image/webp', 'image/avif'],
    // }
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
        ],
        formats: ['image/webp', 'image/avif'],
    },
    allowedDevOrigins: ['*.vercel.app', '*.netlify.app',],
    compress: true,
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['next-themes']
    }
};

export default nextConfig;
