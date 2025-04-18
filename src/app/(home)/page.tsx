import React from "react";
import { Metadata } from "next";
import { appDescriptions, appName } from "@lib/data";
import OrganizationStructuredData from "@components/organization-structured-data";
import dynamic from 'next/dynamic';

const NavigationBar = dynamic(() => import('@components/navbar/navbar').then(mod => mod.NavigationBar), {
    ssr: true
});

const HeroSection = dynamic(() => import("@components/heros/home-hero"), {
    loading: () => <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>
});

export const metadata: Metadata = {
    title: appName,
    description: appDescriptions,
    authors: [{
        url: "https://new-pphat.netlify.app",
        name: "Leat Sophat",
    }],
    generator: "PPhat Dev",
    openGraph: {
        type: "profile",
        url: "https://new-pphat.netlify.app",
        title: appName,
        description: appDescriptions,
        siteName: appName,
        images: [{
            url: "https://new-pphat.netlify.app/assets/avatars/hero.webp",
        }],
    },
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    }
};

export default function Home() {

    return (
        <div className="w-full mx-auto min-h-screen overflow-y-auto">
            <OrganizationStructuredData />
            <NavigationBar />
            <HeroSection />
        </div>
    );
}
