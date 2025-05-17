"use client";

import React from "react";
import { NavigationBar } from "@components/navbar/navbar";
import { AboutMeHero } from "@components/heros/about-hero";
import { AboutTimeline } from "./sections/timeline";
import { BlurFade } from '@components/ui/blur-fade';

const Posts = () => {
    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <NavigationBar />
            <AboutMeHero />

            <section>
                <BlurFade delay={1}>
                    <AboutTimeline />
                </BlurFade>
            </section>
        </main>
    )
};

export default Posts;