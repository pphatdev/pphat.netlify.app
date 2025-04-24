import React from "react";
import OrganizationStructuredData from "@components/organization-structured-data";
import dynamic from 'next/dynamic';
import GetInTouchSections from "./sections/home-getintouch";
import { Metadata } from "next";
import { appDescriptions, appName, currentDomain } from "@lib/data";
import { HomeProjects } from './sections/home-project';
import { BlurFade } from "@components/ui/blur-fade";
import { HomeSkills } from "./sections/home-skills";
import { HomeTiming } from "./sections/home-timing";

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
        url: currentDomain,
        name: "Leat Sophat",
    }],
    generator: "PPhat Dev",
    openGraph: {
        type: "profile",
        url: currentDomain,
        title: appName,
        description: appDescriptions,
        siteName: appName,
        images: [{
            url: currentDomain + "/assets/avatars/hero.webp",
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
        <div className="w-full relative mx-auto">
            <OrganizationStructuredData />
            <NavigationBar />
            <HeroSection />
            <BlurFade delay={0.25} inView>
                <HomeSkills />
            </BlurFade>
            <BlurFade delay={0.25} inView>
                <HomeProjects />
            </BlurFade>
            <BlurFade delay={0.25} inView>
                <div
                    className="w-full relative h-96 bg-foreground/5 bg-center flex items-center justify-center"
                    style={{
                        // backgroundImage: "url('https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                    }}
                    >
                    <HomeTiming showSeconds showTimezone />
                </div>
            </BlurFade>
            <BlurFade delay={0.25} inView>
                <GetInTouchSections />
            </BlurFade>
            <div className="h-20 fixed bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-background z-50" />
        </div>
    );
}
