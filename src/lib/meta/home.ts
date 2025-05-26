import { Metadata } from "next";
import { appDescriptions, appName, appPositions, currentDomain } from "@lib/constants";
import { icons } from "./icons";
import { keywords } from "./keywords";

export const homeHome: Metadata = {
    metadataBase: new URL(currentDomain),
    title: appName,
    description: appDescriptions,
    keywords: [
        ...keywords,
        "Leat Sophat",
        "PPhat",
        "Senior Front-end Developer",
        "UI/UX Designer",
        "Web Developer",
        "React Developer",
        "Next.js Developer",
        "Phnom Penh",
        "Cambodia",
        "TURBOTECH"
    ],
    icons: icons,
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: "profile",
        url: currentDomain,
        title: appName,
        description: appDescriptions,
        siteName: appName,
        images: [
            {
                url: '/assets/screenshots/origin-dark.png',
                width: 1900,
                height: 926,
                alt: appName
            },
            {
                url: '/assets/avatars/hero.webp',
                width: 800,
                height: 600,
                alt: `${appName} - ${appPositions.join(' & ')}`
            }
        ],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@pphatdev',
        creator: '@pphatdev',
        images: ['/assets/screenshots/origin-dark.png']
    },
    alternates: {
        canonical: currentDomain,
    },
    other: {
        'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || ''
    }
};