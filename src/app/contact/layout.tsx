import React from "react";
import { Metadata } from "next";
import { appName, currentDomain } from "@lib/data";
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
        url: currentDomain,
        name: appName,
    }],
    generator: appName,
    openGraph: {
        type: "website",
        url: currentDomain + "/contact",
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

export default function ContactLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
