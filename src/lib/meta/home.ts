import { appDescriptions, appName } from "@lib/data";

export const homeHome = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'),
    title: appName,
    description: appDescriptions,
    keywords: ["leatsophat.me", "leat sophat", "sophat", "pphatdev", "pphat", "phat", "sophat", "leat", "sophat leat", "sophat dev"],
    icons: [
        {
            url: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon",
        },
        {
            url: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon"
        },
    ],
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        images: [
            {
                url: '/assets/screenshots/origin-dark.png',
                width: 1900,
                height: 926,
                alt: appName
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/assets/screenshots/origin-dark.png']
    }
};