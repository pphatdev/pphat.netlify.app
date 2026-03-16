import { Metadata } from "next";
import {
    appDescriptions,
    appName,
    appPositions,
    NEXT_PUBLIC_APP_URL,
    PERSON_ALTERNATE_NAME,
    PERSON_IMAGE,
    PERSON_NAME,
    PERSON_RELEGIEN_NAME
} from "../constants";
import { icons } from "./icons";
import { keywords } from "./keywords";

const profileImage = `${new URL(NEXT_PUBLIC_APP_URL)}${PERSON_IMAGE}`;

export const homeHome: Metadata = {
    metadataBase: new URL(NEXT_PUBLIC_APP_URL),
    title: {
        template: `%s`,
        default: `${appName} - Senior Front-end Developer & UI/UX Designer`
    },
    description: appDescriptions,
    keywords: [
        ...keywords,
        PERSON_NAME,
        PERSON_RELEGIEN_NAME,
        PERSON_ALTERNATE_NAME,
        "Sophat",
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
    openGraph: {
        type: "profile",
        url: new URL(NEXT_PUBLIC_APP_URL),
        title: appName,
        description: appDescriptions,
        siteName: appName,
        images: [
            {
                url: profileImage,
                width: 1200,
                height: 1200,
                alt: `${PERSON_NAME} profile photo`
            },
            {
                url: `${new URL(NEXT_PUBLIC_APP_URL)}/assets/screenshots/origin-dark.png`,
                width: 1900,
                height: 926,
                alt: `${appName} - ${appPositions.join(' & ')}`
            }
        ],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@pphatdev',
        creator: '@pphatdev',
        images: [profileImage]
    },
    other: {
        'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || ''
    }
};