"use client";
import { FlipWords } from "@components/flip-words";
import { BlurFade } from "@components/ui";
import { Cover } from "@components/ui/cover";
import { MagneticArea } from "@components/ui/magnetic-button";
import { RainbowGlow } from "@components/ui/rainbow-glow";
import { appName, appPositions } from "@lib/constants";
import { cn } from "@lib/utils";
import React from "react";

export const HereOne = () => {
    const loadImage = (src: string): Promise<HTMLImageElement> => new Promise<HTMLImageElement>(resolve => {
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
        <div className="min-h-[50rem] w-full relative bg-gradient-to-b from-teal-500/10 to-transparent flex items-start justify-center">
            <div className="grid lg:grid-cols-3 max-w-5xl mx-auto w-full z-50 max-xs:mt-0 mt-24 lg:mt-40 pointer-events-auto">
                <BlurFade delay={0.15} inView className="max-md:px-0 px-10 lg:col-span-2">
                    <div className="text-4xl text-center max-lg:mt-10 lg:text-left md:text-6xl pb-5 font-bold">
                        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 py-4 [text-rendering:optimizeLegibility]">
                                <span className="mr-2 font-sans [font-display:swap]">{`Hi I'm`}</span>
                            </div>
                        </div>
                        <Cover>{appName}</Cover>
                    </div>
                    <div className="max-md:text-xl text-2xl text-center h-fit md:text-left font-semibold">
                        <FlipWords words={appPositions} />
                    </div>

                    <BlurFade delay={0.50} inView className="mt-5 relative text-center max-w-full md:text-left">
                        <p className="text-wrap leading-relaxed">
                            {`Hello! I'm Sophat LEAT, also known as PPhat, and I'm thrilled to have you here. This portfolio showcases my journey, projects, and passions as a developer and creator. Explore my work, check out my skills, and feel free to connect if you'd like to collaborate or learn more. Let's build something amazing together!`}
                        </p>
                    </BlurFade>
                </BlurFade>

                <BlurFade delay={0.25} inView className={cn("order-first relative mt-10 min-lg:min-h-72 min-w-72 sm:mt-0 shrink-0 lg:order-last flex max-md:w-40 mx-auto max-md:py-10 flex-col items-center justify-center")}>
                    <MagneticArea className="max-sm:w-56 w-72 aspect-square relative">
                        <canvas ref={renderCanvas} className="h-full w-full bg-center m-1" />
                        <RainbowGlow className="opacity-30" />
                    </MagneticArea>
                </BlurFade>
            </div>
        </div>
    );
}