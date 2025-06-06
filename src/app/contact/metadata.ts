import { Metadata } from "next";
import { appName, NEXT_PUBLIC_APP_URL } from "../../lib/constants";
import { getOgImageMetadata } from "@lib/utils/og-image";

const contactDescription = "Get in touch with me. I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.";

// Generate OG image metadata for this page
const ogImage = getOgImageMetadata({
    title: `${appName} | Contact`,
    subtitle: "Get in touch",
    description: contactDescription
});

export const metadata: Metadata = {
    title: `${appName} | Contact`,
    description: contactDescription,
    authors: [{
        url: NEXT_PUBLIC_APP_URL,
        name: appName,
    }],
    generator: appName,
    openGraph: {
        type: "website",
        url: NEXT_PUBLIC_APP_URL + "/contact",
        title: `${appName} | Contact`,
        description: contactDescription,
        siteName: appName,
        images: [ogImage],
    },
    formatDetection: {
        email: true,
        address: true,
        telephone: true,
    }
};
