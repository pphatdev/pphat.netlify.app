import React from "react";
import { Metadata } from "next";
import { appName, currentDomain } from "@lib/constants";

const contactDescription = "Get in touch with me. I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.";

export const metadata: Metadata = {
    title: `Contact | ${appName}`,
    description: contactDescription,
    authors: [{
        url: currentDomain,
        name: appName,
    }],
    generator: appName,
    openGraph: {
        type: "website",
        url: currentDomain + "/contact",
        title: `Contact | ${appName}`,
        description: contactDescription,
        siteName: appName,
        images: [
            { url: `${currentDomain}/assets/screenshots/contact-light.png`, },
            { url: `${currentDomain}/assets/screenshots/contact-dark.png`, },
        ],
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
