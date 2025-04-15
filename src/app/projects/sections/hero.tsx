import { GridPattern } from "@components/ui/grid-pattern"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Meteors } from "@components/ui/meteors"
import { BlurFade } from "@components/ui/blur-fade"

export const ProjectHero = () => {
    return (
        <BlurFade delay={0.15} inView className="min-h-80 flex flex-col border-b overflow-clip relative items-start justify-center">
            <Meteors />
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
            <div className="w-full p-4 sm:px-10 max-w-5xl mx-auto ">
                <BlurFade delay={0.6} inView className="flex flex-col items-start justify-start">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                        Projects
                    </h1>
                </BlurFade>
                <BlurFade delay={0.5} inView className="flex flex-col items-start justify-start">
                    <Link href="/" className="hover:bg-foreground/5 font-default transition-all duration-300 mt-7 items-center hover:ring w-fit ring-foreground/10 justify-start flex rounded-full hover:px-4 p-1.5">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Projects
                    </Link>
                </BlurFade>
            </div>
        </BlurFade>
    )
}