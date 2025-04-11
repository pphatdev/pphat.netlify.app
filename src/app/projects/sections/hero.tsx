import { GridPattern } from "@components/ui/grid-pattern"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { OrbitingCirclesHero } from "./orbiting-circles-hero"

export const ProjectHero = () => {
    return (
        <section className="min-h-96 flex flex-col border-b relative items-start justify-center">
            <div className="absolute inset-y-0 left-1/3 right-0 pointer-events-none" aria-hidden="true">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    strokeDasharray={"4 2"}
                    className={"[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] absolute w-full "}
                />
                <OrbitingCirclesHero/>
            </div>
            <div className="w-full p-4 sm:px-10 max-w-5xl mx-auto ">
                <h1 className='mb-4 text-5xl font-bold font-aladin'>Projects</h1>

                <Link href="/" className="hover:bg-foreground/5 transition-all duration-300 mt-7 items-center hover:ring w-fit ring-foreground/10 justify-start flex rounded-full hover:px-4 p-1.5">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Projects
                </Link>
            </div>

        </section>
    )
}