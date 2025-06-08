import React from "react";
import OrganizationStructuredData from "@components/organization-structured-data";
import WebsiteStructuredData from "@components/website-structured-data";
import PersonStructuredData from "@components/person-structured-data";
import { Metadata } from "next";
import { appDescriptions, appName, currentDomain, GOOGLE_SITE_VERIFICATION } from "@lib/constants";
import { HeaderNavigation } from "./sections/navigation";
import { GridPattern } from "@components/ui/grid-pattern";
import { HereOne } from "@components/heros/hero-1";

export const metadata: Metadata = {
    title: appName,
    description: appDescriptions,
    authors: [{
        url: currentDomain,
        name: "Leat Sophat",
    }],
    generator: appName,
    keywords: [
        "Leat Sophat",
        "PPhat",
        "Senior Front-end Developer",
        "UI/UX Designer",
        "Web Developer",
        "React Developer",
        "Next.js Developer",
        "JavaScript Developer",
        "TypeScript Developer",
        "Phnom Penh",
        "Cambodia",
        "TURBOTECH"
    ],
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
        images: [{
            url: currentDomain + "/assets/avatars/hero.webp",
            width: 800,
            height: 600,
            alt: "Leat Sophat - Senior Front-end Developer and UI/UX Designer"
        }],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@pphatdev',
        creator: '@pphatdev',
        title: appName,
        description: appDescriptions,
        images: [currentDomain + "/assets/avatars/hero.webp"],
    },
    formatDetection: {
        email: true,
        address: true,
        telephone: true,
    },
    alternates: {
        canonical: currentDomain,
    },
    other: {
        'google-site-verification': GOOGLE_SITE_VERIFICATION
    }
};

export default function Home() {

    return (
        <div className="w-full flex flex-col -z-[5]">
            <PersonStructuredData />
            <WebsiteStructuredData />
            <OrganizationStructuredData />
            <HeaderNavigation />

            <div className="flex size-full absolute items-center pointer-events-none justify-center overflow-hidden opacity-50 rounded-lg border  p-20">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={"[mask-image:radial-gradient(1050px_circle_at_top,white,transparent)] -translate-y-1"}
                />
            </div>

            <HereOne />

            <div className="h-20 pointer-events-none fixed bottom-0 inset-x-0 bg-gradient-to-b from-transparent z-0 to-background z-10" />
        </div>
    );
}
