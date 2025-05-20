import React from "react"
import Link from "next/link"
import { GridPattern } from "@components/ui/grid-pattern"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { BlurFade } from "@components/ui/blur-fade"
import { BackgroundBeamsWithCollision } from "@components/ui/background-beams-with-collision"

export const ProjectHero = () => {
    return (
        <div className="min-h-36 sm:min-h-80 flex bg-gradient-to-b from-primary/10 pt-24 to-background flex-col overflow-clip relative items-start justify-center">
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
            <div className="w-full p-4 sm:px-5 flex flex-col max-w-5xl mx-auto ">
                <BlurFade delay={0.6} inView className="flex flex-col items-start justify-start">
                    <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none"> Contr<span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">ibute</span> </h1>
                </BlurFade>
                <BlurFade delay={0.5} inView className="flex max-sm:order-first flex-col items-start justify-start">
                    <Link href="/" className="hover:bg-foreground/5 font-sans transition-all duration-300 max-sm:mt-0 mt-7 items-center hover:ring w-fit ring-foreground/10 justify-start flex rounded-full hover:px-4 p-1.5">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </BlurFade>
            </div>
        </div>
    )
}