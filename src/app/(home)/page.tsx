import React from "react";
import HeroSection from "./sections/hero";
import { Metadata } from "next";
import { appDescriptions, appName } from "@lib/data";

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
    }
};

const DEMO_FAQS = [
    {
        question: "2018-2019",
        answer: "Gender",
    },
];


export default function Home() {

    return (
        <div className="w-full mx-auto min-h-screen overflow-y-auto">
            <HeroSection />
        </div>
    );
}
