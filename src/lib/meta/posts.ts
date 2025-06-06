import { appName, NEXT_PUBLIC_APP_URL } from "@lib/constants";
import { icons } from "./icons";
import { keywords } from "./keywords";
import { Metadata } from "next";

export const postsMeta: Metadata = {
    metadataBase: new URL(NEXT_PUBLIC_APP_URL),
    title: `Articles | ${appName}`,
    description: 'Read my blog posts about web development, design, and technology.',
    keywords: [...keywords, 'blog', 'articles', 'tech blog', 'web development blog', 'programming', 'front-end'],
    icons: icons,
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        title: `Articles | ${appName}`,
        description: 'Read my blog posts about web development, design, and technology.',
        url: `${NEXT_PUBLIC_APP_URL}/posts`,
        images: [
            {
                url: '/assets/screenshots/origin-dark.png',
                width: 1900,
                height: 926,
                alt: `${appName} Articles`
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/assets/screenshots/origin-dark.png']
    }
};

export default postsMeta;
