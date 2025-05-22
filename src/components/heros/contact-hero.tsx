import React from "react"
import { GridPattern } from "@components/ui/grid-pattern"
import { BlurFade } from "@components/ui/blur-fade"
import { BackgroundBeamsWithCollision } from "@components/ui/background-beams-with-collision"
import { RainbowGlow } from "@components/ui/rainbow-glow"

export const ContactHero = () => {
    return (
        <div className="min-h-36 sm:min-h-80 flex bg-gradient-to-b from-primary/10 pt-24 to-background flex-col overflow-clip relative items-start justify-center">
            <RainbowGlow className="opacity-10"/>
            <BackgroundBeamsWithCollision className="flex items-center absolute -z-[1] pointer-events-none max-w-5xl left-1/2 -translate-x-1/2 mx-auto justify-center w-full h-full" />
            <div className="absolute inset-y-0 left-1/3 right-0 pointer-events-none" aria-hidden="true">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    strokeDasharray={"4 2"}
                    className={"[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] absolute w-full "}
                />
            </div>
            <div className="w-full p-4 sm:px-5 space-y-5 flex flex-col max-w-5xl mx-auto ">
                <BlurFade delay={0.6} inView className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none"> Get in <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">Touch</span> </h1>
                </BlurFade>
                <BlurFade delay={0.5} inView className="flex flex-col items-start justify-center">
                    <p className="text-center max-w-3xl mx-auto">{`Get in touch with me. I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.`}</p>
                </BlurFade>
            </div>
        </div>
    )
}