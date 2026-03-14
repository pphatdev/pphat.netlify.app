import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "@components/heros/home-hero";
import OrganizationStructuredData from "@components/organization-structured-data";
import HomePersonStructuredData from "@components/home-person-structured-data";
import WebsiteStructuredData from "@components/website-structured-data";
import { Metadata } from "next";
import { appName, NEXT_PUBLIC_APP_URL } from "@lib/constants";
import { BlurFade } from "@components/ui/blur-fade";
import { NavigationBar } from "@components/navbar/navbar";
import { RainbowGlow } from "@components/ui/rainbow-glow";
import { SectionNavigation } from "@components/section-navigation";
import { getPublishedPosts } from "@lib/content";

// Lazy-load below-the-fold sections to reduce initial bundle size
const HomeSkills = dynamic(() => import("./sections/home-skills").then(mod => ({ default: mod.HomeSkills })), {
    loading: () => <div className="min-h-[200px]" />,
});
const HomeFeatureSection = dynamic(() => import("./sections/home-feature").then(mod => ({ default: mod.HomeFeatureSection })), {
    loading: () => <div className="min-h-[200px]" />,
});
const HomeAboutMe = dynamic(() => import("./sections/home-aboutme").then(mod => ({ default: mod.HomeAboutMe })), {
    loading: () => <div className="min-h-[200px]" />,
});
const HomeFAQSection = dynamic(() => import("./sections/home-faq").then(mod => ({ default: mod.HomeFAQSection })), {
    loading: () => <div className="min-h-[100px]" />,
});
const GetInTouchSections = dynamic(() => import("./sections/home-getintouch"));
const homeSearchImage = `${NEXT_PUBLIC_APP_URL}/assets/screenshots/home-dark.png`;
const homeTitle = `${appName} | Senior Front-end Developer & UI/UX Designer`;
const homeDescription = "Sophat LEAT (PPhat, Sophat L.) is a Senior Front-end Developer at TURBOTECH CO., LTD and Freelance UI/UX Designer in Phnom Penh, Cambodia. Explore projects, case studies, technical articles, blogs, and contact details.";

export const metadata: Metadata = {
    title: homeTitle,
    description: homeDescription,
    authors: [{
        url: NEXT_PUBLIC_APP_URL,
        name: "Sophat LEAT",
    }],
    generator: appName,
    keywords: [
        "Sophat LEAT",
        "PPhat",
        "pphat",
        "pphatdev",
        "creator of pphat.me",
        "sophat",
        "sophatleat",
        "Sophat LEAT",
        "Sophat Leat",
        "LEAT Sophat",
        "leatsophat",
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
        type: "website",
        url: NEXT_PUBLIC_APP_URL,
        title: appName,
        description: homeDescription,
        siteName: appName,
        images: [
            {
                url: homeSearchImage,
                width: 1900,
                height: 926,
                alt: `${appName} - Senior Front-end Developer and UI/UX Designer`,
                type: "image/png",
            },
        ],
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@pphatdev',
        creator: '@pphatdev',
        title: homeTitle,
        description: homeDescription,
        images: [homeSearchImage],
    },
    formatDetection: {
        email: true,
        address: true,
        telephone: true,
    },
    alternates: {
        canonical: NEXT_PUBLIC_APP_URL,
    },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
    },
};

export default function Home() {
    const latestPost = getPublishedPosts()[0] ?? null;

    return (
        <div className="w-full flex flex-col">
            <HomePersonStructuredData />
            <WebsiteStructuredData />
            <OrganizationStructuredData />
            <NavigationBar />
            <section id="hero" className="xl:pt-20">
                <HeroSection
                    latestPostSlug={latestPost?.slug}
                    latestPostTitle={latestPost?.title}
                />
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

            <section id="faq">
                <BlurFade delay={0.2} inView>
                    <HomeFAQSection />
                </BlurFade>
            </section>

            <section id="contact" className="flex flex-col snap-end">
                <GetInTouchSections />
            </section>

            <RainbowGlow className="opacity-5 top-0 h-96"/>

            <SectionNavigation />
            <div className="h-20 pointer-events-none fixed bottom-0 inset-x-0 bg-gradient-to-b from-transparent to-background z-50" />
        </div>
    );
}
