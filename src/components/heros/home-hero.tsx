"use client";

import React from "react";
// import { BackgroundBeamsWithCollision } from "@components/ui/background-beams-with-collision";
import { Cover } from "@components/ui/cover";
import { FlipWords } from "@components/flip-words";
import { GridPattern } from "@components/ui/grid-pattern";
import { appDescriptions, appName, appPositions } from "@lib/constants";
import { NavMenu } from "@components/dock-menu";
import { ThemeToggle } from "@components/ui/theme-switch";
import { MagneticArea } from "@components/ui/magnetic-button";
import { cn } from "@lib/utils";
import { Logos3 } from "@components/ui/logos3";
import { BlurFade } from "@components/ui/blur-fade";
import { RainbowGlow } from "@components/ui/rainbow-glow";
// import { bgGradientLine45deg } from "@components/background/gradient-line";


export default function HeroSection() {

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise<HTMLImageElement>(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });

    const renderCanvas = React.useCallback((canvas: HTMLCanvasElement | null): void => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 300;
        canvas.height = 300;

        Promise.all([
            loadImage('/assets/gallery/WEBP/IMG_1915.webp'),
            loadImage('/assets/masks/mask.png')
        ]).then(([img, mask]) => {
            // Calculate dimensions to cover the canvas
            const scale = Math.max(
                canvas.width / img.width,
                canvas.height / img.height
            );
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            // Draw image with object-cover behavior
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // Apply mask
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(mask, 0, 0, 500, 500);
        });
    }, []);

    return (
        <div>
            {mounted && (
                <main className="w-full pt-20 p-5 flex min-h-[45rem] items-center justify-center mx-auto h-full overflow-x-hidden relative">
                    <h1 className="sr-only">{appName}</h1>
                    <p className="sr-only">{appDescriptions ?? ""}</p>
                    {/* <BackgroundBeamsWithCollision className="flex items-center absolute -z-[1] pointer-events-none justify-center w-full h-screen" /> */}
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

                    <section className="flex max-w-5xl justify-center mx-auto lg:-translate-y-20 max-md:justify-start z-20 flex-col lg:flex-row md:h-full items-center gap-4" aria-label="Introduction">
                        <div className="px-2 sm:p-10 w-full max-w-3xl">
                            <BlurFade delay={0.15} inView>
                                <div className="text-3xl text-center md:text-left md:text-6xl font-bold">
                                    <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                        <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 py-4 [text-rendering:optimizeLegibility]">
                                            <span className="mr-2 font-sans [font-display:swap]">{`Hi I'm`}</span>
                                        </div>
                                    </div>
                                    <Cover>{appName}</Cover>
                                </div>
                            </BlurFade>
                            <div className="max-md:text-xl text-2xl text-center h-fit md:text-left font-semibold">
                                <FlipWords words={appPositions} />
                            </div>

                            <BlurFade delay={0.50} inView className="mt-5 relative flex text-center max-w-full md:text-left">
                                {appDescriptions ?? ""}
                            </BlurFade>

                            <BlurFade delay={0.60} inView>
                                <Logos3 heading="Trusted by these companies" />
                            </BlurFade>

                            <BlurFade delay={0.70} inView>
                                <nav className="flex flex-col z-50 justify-center sm:justify-start sm:flex-row items-center gap-4 mt-6 max-md:px-3">
                                    <MagneticArea>
                                        <ThemeToggle />
                                    </MagneticArea>
                                </nav>
                            </BlurFade>
                        </div>
                        <BlurFade delay={0.25} inView className={cn("order-first relative mt-10 min-lg:min-h-72 min-w-72 sm:mt-0 shrink-0 lg:order-last flex max-md:w-40 mx-auto flex-col items-center justify-center")}>
                            <MagneticArea className="max-sm:w-56 w-72 aspect-square relative">
                                <canvas ref={renderCanvas} className="h-full w-full bg-center m-1" />
                                <RainbowGlow className="opacity-30" />
                            </MagneticArea>
                            <NavMenu />
                        </BlurFade>
                    </section>
                </main>
            )}
        </div>
    );
}