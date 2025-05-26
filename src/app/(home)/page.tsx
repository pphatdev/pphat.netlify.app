import React from "react";
import GetInTouchSections from "./sections/home-getintouch";
import HeroSection from "@components/heros/home-hero";
import OrganizationStructuredData from "@components/organization-structured-data";
import HomePersonStructuredData from "@components/home-person-structured-data";
import WebsiteStructuredData from "@components/website-structured-data";
import { Metadata } from "next";
import { appDescriptions, appName, currentDomain } from "@lib/constants";
import { BlurFade } from "@components/ui/blur-fade";
import { HomeSkills } from "./sections/home-skills";
import { HomeFeatureSection } from "./sections/home-feature";
import { HomeAboutMe } from "./sections/home-aboutme";
import { HomeFAQSection } from "./sections/home-faq";
import { NavigationBar } from "@components/navbar/navbar";
import { RainbowGlow } from "@components/ui/rainbow-glow";
import { SectionNavigation } from "@components/section-navigation";

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
        'google-site-verification': 'your-google-site-verification-code'
    }
};

export default function Home() {

    return (
        <div className="w-full flex flex-col">
            <HomePersonStructuredData />
            <WebsiteStructuredData />
            <OrganizationStructuredData />
            <NavigationBar />
            <section id="hero" className="xl:pt-20">
                <HeroSection />
            </section>

            <section id="skills" className="relative">
                <BlurFade delay={0.2} inView>
                    <HomeSkills />
                </BlurFade>
            </section>

            <section id="about">
                <BlurFade delay={0.2} inView>
                    <HomeAboutMe />
                </BlurFade>
            </section>

            <section id="features">
                <BlurFade delay={0.2} inView>
                    <HomeFeatureSection />
                </BlurFade>
            </section>

            <HomeFAQSection />

            <section id="contact" className="flex flex-col snap-end">
                <GetInTouchSections />
            </section>

            <RainbowGlow className="opacity-5 top-0 h-96"/>

            <SectionNavigation />
            <div className="h-20 pointer-events-none fixed bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-background z-50" />
        </div>
    );
}
