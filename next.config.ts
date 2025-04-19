import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: "export",
    // domains: [
    //     'github.com',
    //     'avatars.githubusercontent.com',
    //     'www.shadcnblocks.com',
    // ],
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
    },
    allowedDevOrigins: ['*.vercel.app', '*.netlify.app', 'localhost', '172.20.10.6', '172.20.10.2'],
    compress: true,
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['next-themes']
    }
};

export default nextConfig;
