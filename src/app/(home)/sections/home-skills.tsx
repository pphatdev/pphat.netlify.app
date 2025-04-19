import { GradientLines } from "@components/background/gradient-line"
import { BlurFade } from "@components/ui/blur-fade"
import { brands } from "./brands";

export const HomeSkills = () => {
    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <BlurFade delay={0.25} inView>
                <div className="p-5 pb-1 mt-5">
                    <h2 className="max-md:mb-3 mb-4 text-center max-md:text-3xl text-5xl tracking-tighter font-bold font-default">{`💻 Skills`}</h2>
                    {/* <p className="max-md:mb-0 mb-5 text-center text-foreground/500 tracking-normal">
                        {`I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.`}
                    </p> */}
                </div>
                <div className="w-full flex max-sm:gap-y-5 max-sm:gap-2 gap-5 border divide-y divide-x bg-background  p-8 rounded-4xl flex-wrap justify-center">
                    {brands.map((brand, key) => (

                        // <div key={key} className="flex rounded-3xl opacity-50 hover:opacity-100 items-center shrink-0 justify-center p-4">
                        //     <Image
                        //         src={brand.src}
                        //         width={brand.width}
                        //         height={brand.height}
                        //         alt={`${brand.alt} logo`}
                        //         className="object-center relative max-sm:h-10 w-[56px] h-full"
                        //     />

                        <div key={key} className="relative mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border text-foreground/10 bg-[size:8px_8px] bg-top-left bg-[image:repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]">
                            <div
                                className={`h-full w-full bg-[url(${brand.src})] bg-cover bg-center bg-no-repeat mask-size-[110%_90%] mask-center mask-no-repeat`}
                                style={{ maskImage: "url('/assets/masks/mask.png')" }}
                            />
                        </div>
                    ))}
                </div>
            </BlurFade>
            <GradientLines className="bottom-20 -z-[1]" />
        </section>
    )
}