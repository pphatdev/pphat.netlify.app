import { appName, NEXT_PUBLIC_APP_URL } from "../constants";
import { icons } from "./icons";
import { keywords } from "./keywords";
import { Metadata } from "next";

export const projectsMeta: Metadata = {
    metadataBase: new URL(NEXT_PUBLIC_APP_URL),
    title: `Projects | ${appName}`,
    description: 'Explore my portfolio of web development projects and applications.',
    keywords: [...keywords, 'web development', 'projects', 'portfolio', 'React', 'TypeScript', 'fullstack'],
    icons: icons,
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        title: `Projects | ${appName}`,
        description: 'Explore my portfolio of web development projects and applications.',
        url: `${NEXT_PUBLIC_APP_URL}/projects`,
        images: [
            {
                url: '/assets/cover/contributes.png',
                width: 1900,
                height: 926,
                alt: `${appName} Projects`
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/assets/screenshots/origin-dark.png']
    }
};

export default projectsMeta;