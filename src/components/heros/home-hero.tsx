"use client";

import React from "react";
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
import { Logos3 } from "@components/ui/logos3";
import { BlurFade } from "@components/ui/blur-fade";
import { bgGradientLine45deg } from "@components/background/gradient-line";

const demoData = {
    heading: "Trusted by these companies",
};


export default function HeroSection() {

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && <main className="w-full overflow-hidden flex items-center justify-center mx-auto min-h-[40rem] h-full overflow-x-hidden relative" id="hero">

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

                <section className="flex max-w-5xl mx-auto sm:justify-between z-20 flex-col lg:flex-row sm:h-full items-center gap-4" aria-label="Introduction">
                    <div className="px-2 sm:p-5 max-w-3xl">
                        <BlurFade delay={0.15} inView>
                            <div className="text-3xl text-center md:text-left md:text-6xl font-bold">
                                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                        <span className="mr-2 font-sans">{`Hello I'm`}</span>
                                    </div>
                                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 py-4">
                                        <span className="mr-2 font-sans">{`Hello I'm`}</span>
                                    </div>
                                </div>
                                <Cover>{appName}</Cover>
                            </div>
                        </BlurFade>
                        <div className="text-2xl text-center h-fit md:text-left font-semibold">
                            <FlipWords words={appPositions} />
                        </div>
                        <TextAnimate animation="slideLeft" by="word" className="whitespace-pre-wrap mt-5 text-center md:text-left">
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
                        <BlurFade delay={1} inView className="flex flex-col items-center justify-center w-full h-full">
                            {/* <MagneticArea > */}
                            <div className={cn(
                                "absolute -z-[1] w-full h-full blur-3xl left-1/2 translate-y-1/2 bottom-1/3 -translate-x-1/2 opacity-20 animate-rainbow",
                                "bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                                "bg-[length:200%]",
                            )}></div>

                            <div
                                className={cn(
                                    "relative flex max-sm:size-36 size-64 rounded-xl p-1 items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left",
                                    bgGradientLine45deg
                                )}
                                style={{
                                    width: "256px", // Explicit width
                                    height: "256px", // Explicit height
                                }}
                            >
                                <div
                                    className="h-full w-full bg-center m-1 bg-no-repeat mask-size-[105%_90%] mask-center mask-no-repeat"
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('/assets/avatars/hero.webp')`,
                                        maskImage: `url('/assets/masks/mask.webp')`,
                                    }}
                                />
                            </div>

                            {/* </MagneticArea> */}
                            <NavMenu />
                        </BlurFade>
                    </div>
                </section>
            </main >}
        </>
    );
}
