"use client";

import React from "react";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@components/ui/background-beams-with-collision";
import { Cover } from "@components/ui/cover";
import { FlipWords } from "@components/flip-words";
import { GridPattern } from "@components/ui/grid-pattern";
import { TextAnimate } from "@components/text-animation";
import { appDescriptions, appName, appPositions } from "@lib/data";
import { NavMenu } from "@components/dock-menu";
import { ThemeToggle } from "@components/ui/theme-switch";
import { MagneticArea } from "@components/ui/magnetic-button";
import { cn } from "@lib/utils";
import Link from "next/link";
import { Logos3 } from "@components/ui/logos3";
import { BlurFade } from "@components/ui/blur-fade";
// import { Button } from '../../../components/ui/moving-border';

const demoData = {
    heading: "Trusted by these companies",
    logos: [
        {
            id: "logo-1",
            description: "Astro",
            image: "https://www.shadcnblocks.com/images/block/logos/astro.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-2",
            description: "Figma",
            image: "https://www.shadcnblocks.com/images/block/logos/figma.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-3",
            description: "Next.js",
            image: "https://www.shadcnblocks.com/images/block/logos/nextjs.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-4",
            description: "React",
            image: "https://www.shadcnblocks.com/images/block/logos/react.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-6",
            description: "Supabase",
            image: "https://www.shadcnblocks.com/images/block/logos/supabase.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-7",
            description: "Tailwind CSS",
            image: "https://www.shadcnblocks.com/images/block/logos/tailwind.svg",
            className: "h-4 w-auto",
        },
        {
            id: "logo-8",
            description: "Vercel",
            image: "https://www.shadcnblocks.com/images/block/logos/vercel.svg",
            className: "h-7 w-auto",
        },
    ],
};


export default function HeroSection() {

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && <main className="w-full mx-auto min-h-full h-full overflow-x-hidden relative" id="hero">

                <h1 className="sr-only">{appName}</h1>
                <p className="sr-only">{appDescriptions ?? ""}</p>
                <BackgroundBeamsWithCollision className="flex items-center absolute -z-[1] pointer-events-none justify-center w-full h-screen" />
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <GridPattern
                        width={30}
                        height={30}
                        x={-1}
                        y={-1}
                        strokeDasharray={"4 2"}
                        className={"[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] absolute w-full "}
                    />
                </div>

                <section className="flex max-w-5xl max-h-80 min-h-[calc(100dvh_-48px)] mx-auto sm:justify-between z-20 flex-col md:flex-row sm:h-full items-center gap-4" aria-label="Introduction">
                    <div className="px-5 sm:p-5 max-w-3xl">
                        <BlurFade delay={0.15} inView>
                            <div className="text-4xl text-center md:text-left md:text-6xl font-bold">
                                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                        <span className="mr-2">{`Hello I'm`}</span>
                                    </div>
                                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 py-4">
                                        <span className="mr-2">{`Hello I'm`}</span>
                                    </div>
                                </div>
                                <Cover>{appName}</Cover>
                            </div>
                        </BlurFade>
                        <div className="text-2xl text-center h-fit md:text-left font-semibold">
                            <FlipWords words={appPositions} />
                        </div>
                        <TextAnimate animation="slideLeft" by="word" className="whitespace-pre-wrap mt-5">
                            {appDescriptions ?? ""}
                        </TextAnimate>
                        <BlurFade delay={0.65} inView>
                            <Logos3 {...demoData} />
                        </BlurFade>
                        <BlurFade delay={0.75} inView>
                            <nav className="flex flex-col z-50 justify-center sm:justify-start sm:flex-row items-center gap-4 mt-6">
                                <MagneticArea>
                                    <ThemeToggle />
                                </MagneticArea>
                            </nav>
                        </BlurFade>
                    </div>
                    <div className={cn("order-first relative mt-10 sm:mt-0 shrink-0 md:order-last")}>
                        <BlurFade delay={1} inView>
                            <MagneticArea >
                                <div className={cn(
                                    "absolute -z-[1] w-full h-full blur-3xl left-1/2 translate-y-1/2 bottom-1/3 -translate-x-1/2 opacity-20 animate-rainbow",
                                    "bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                                    "bg-[length:200%]",
                                )}></div>

                                <Link href={'/gallery'} className="flex mx-auto items-center justify-center overflow-hidden w-36 h-36 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-sky-500/5 via-teal-500/5 to-green-500/5 hover:scale-125 transition-transform duration-300 ease-in-out">
                                    <Image
                                        src="/assets/avatars/hero.webp"
                                        width={512}
                                        height={512}
                                        alt="LEAT Sophat - Senior Front-end Developer and UI/UX Designer"
                                        className={cn(
                                            "w-36 rounded-full sm:rounded-md sm:w-80 h-36 sm:h-80 object-cover select-none"
                                        )}
                                        priority
                                        loading="eager"
                                    />
                                </Link>

                            </MagneticArea>
                            <NavMenu />
                        </BlurFade>
                    </div>
                </section>
            </main >}
        </>
    );
}
