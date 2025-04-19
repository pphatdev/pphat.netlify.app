import { GradientLines } from "@components/background/gradient-line"
import { BlurFade } from "@components/ui/blur-fade"
import Image from "next/image";

export const HomeSkills = () => {
    const brands = [
        {
            name: "loops",
            logo: "https://assets.rapidui.dev/brands/loops.svg",
        },
    ];

    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <GradientLines className="top-1/2 -z-[1]" />
            <BlurFade delay={0.25} inView>
                <div className="p-5 pb-1 mt-5">
                    <h2 className="max-md:mb-3 mb-4 text-center max-md:text-3xl text-5xl tracking-tighter font-bold font-default">{`Skills`}</h2>
                    <p className="max-md:mb-0 mb-5 text-center text-foreground/500 tracking-normal">
                        {`I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.`}
                    </p>
                </div>
                <div className="max-w-xs mx-auto grid grid-cols-2 items-center md:grid-cols-3 md:max-w-lg lg:grid-cols-6 lg:max-w-3xl">
                    {brands.map((brand) => (
                        <div key={brand.name} className="flex items-center justify-center p-4">
                            <div className="relative h-[56px] w-full">
                                <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </BlurFade>
        </section>
    )
}