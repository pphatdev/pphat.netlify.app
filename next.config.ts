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
        ],
    },
};

export default nextConfig;
