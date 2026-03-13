"use client";

import React from "react";
import Link from "next/link";
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
import { Badge } from "@components/ui/badge";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
    latestPostSlug?: string;
    latestPostTitle?: string;
}

export default function HeroSection({ latestPostSlug, latestPostTitle }: HeroSectionProps) {

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

        canvas.width = 500;
        canvas.height = 500;

        Promise.all([
            loadImage('/assets/gallery/WEBP/IMG_1915.webp'),
            loadImage('/assets/masks/mask.png')
        ]).then(([img, mask]) => {
            const scale = Math.max(
                canvas.width / img.width,
                canvas.height / img.height
            );
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(mask, 0, 0, 500, 500);
        });
    }, []);

    const latestBlogHref = latestPostSlug ? `/posts/${latestPostSlug}` : '/posts';
    const latestBlogAria = latestPostTitle ? `New blog: ${latestPostTitle}` : 'New blog';
    const latestBlogLabel = latestPostTitle ?? 'New Blog';

    return (
        <main className="w-full pt-20 p-5 flex min-h-[45rem] items-center justify-center mx-auto h-full overflow-x-hidden relative">
            <h1 className="sr-only">{appName}</h1>
            <p className="sr-only">{appDescriptions ?? ""}</p>
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
                    <BlurFade delay={0.1} inView>
                        <div className="mb-2 flex justify-center md:justify-start">
                            <Link href={latestBlogHref} aria-label={latestBlogAria} className="group inline-flex">
                                <Badge
                                    variant="outline"
                                    className="max-w-[min(90vw,42rem)] rounded-full border-primary/40 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                                    title={latestPostTitle ?? 'Last Blog'}
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                                        </span>
                                        <span className="shrink-0">New Blog</span>
                                        <span className="text-primary/60">|</span>
                                        <span className="truncate text-foreground">{latestBlogLabel}</span>
                                        <span className="ml-1 inline-flex w-0 overflow-hidden transition-[width] duration-200 group-hover:w-4">
                                            <ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                                        </span>
                                    </span>
                                </Badge>
                            </Link>
                        </div>
                    </BlurFade>
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
                            {/* <MagneticArea>
                                <ThemeToggle />
                            </MagneticArea> */}
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
    );
}