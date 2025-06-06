import { Metadata } from "next";
import { appDescriptions, appName, appPositions, NEXT_PUBLIC_APP_URL } from "../constants";
import { icons } from "./icons";
import { keywords } from "./keywords";

export const homeHome: Metadata = {
    metadataBase: new URL(NEXT_PUBLIC_APP_URL),
    title: {
        template: `%s | ${appName}`,
        default: `${appName} - Senior Front-end Developer & UI/UX Designer`
    },
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
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: NEXT_PUBLIC_APP_URL,
    },
    openGraph: {
        type: "profile",
        url: new URL(NEXT_PUBLIC_APP_URL),
        title: appName,
        description: appDescriptions,
        siteName: appName,
        images: [
            {
                url: `${new URL(NEXT_PUBLIC_APP_URL)}/assets/screenshots/origin-dark.png`,
                width: 1900,
                height: 926,
                alt: appName
            },
            {
                url: `${new URL(NEXT_PUBLIC_APP_URL)}/assets/avatars/hero.webp`,
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
    other: {
        'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || ''
    }
};