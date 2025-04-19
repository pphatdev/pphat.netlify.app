import React from "react";
import OrganizationStructuredData from "@components/organization-structured-data";
import dynamic from 'next/dynamic';
import GetInTouchSections from "./sections/home-getintouch";
import { Metadata } from "next";
import { appDescriptions, appName } from "@lib/data";
import { HomeProjects } from './sections/home-project';
import { BlurFade } from "@components/ui/blur-fade";
import { HomeArticles } from "./sections/home-articles";
import { HomeSkills } from "./sections/home-skills";

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
        <div className="w-full relative mx-auto overflow-y-auto">
            <OrganizationStructuredData />
            <NavigationBar />
            <HeroSection />
            <BlurFade delay={0.25} inView>
                <HomeSkills />
            </BlurFade>
            <BlurFade delay={0.25} inView>
                <HomeProjects />
            </BlurFade>
            {/* <BlurFade delay={0.25} inView>
                <HomeArticles />
            </BlurFade> */}
            <BlurFade delay={0.25} inView>
                <GetInTouchSections />
            </BlurFade>
            <div className="h-20 fixed bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-background z-50"/>
        </div>
    );
}
