import { appDescriptions, appName, currentDomain } from "@lib/constants";
import { icons } from "./icons";
import { keywords } from "./keywords";

export const homeHome = {
    metadataBase: new URL(currentDomain),
    title: appName,
    description: appDescriptions,
    keywords: keywords,
    icons: icons,
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