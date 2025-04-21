import { GradientLines } from "@components/background/gradient-line"
import { BlurFade } from "@components/ui/blur-fade"
import { designed, languages } from "./brands";
import { MagneticArea } from "@components/ui/magnetic-button";
import { TextAnimate } from "@components/text-animation";

export const HomeSkills = () => {
    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <BlurFade delay={0.25} inView className="flex flex-col items-center justify-center pb-1 mt-5">
                <h2 className="max-md:mb-3 px-5 w-full py-3 max-md:text-3xl text-5xl tracking-tighter font-bold font-sans">
                    {`My`} <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]"> Tech stack</span>
                </h2>
                <p className="max-md:mb-0 px-5 my-5 text-left text-foreground/500 tracking-normal">
                    {`My tech stack includes modern frameworks, languages, and development tools that enable me to build efficient and scalable applications.`}
                </p>
                <div className="w-full flex gap-5 mb-5 rounded-2xl bg-background p-8 px-5 flex-wrap justify-start">
                    {languages.map((lang, key) => (
                        <MagneticArea key={key}>
                            <div className="relative flex max-sm:h-9 max-sm:w-9 h-14 shadow shadow-card w-14 p-1 bg-background rounded-full items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left bg-[image:repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]">
                                <div
                                    className={`h-full w-full bg-center m-1 bg-no-repeat mask-size-[105%_90%] mask-center mask-no-repeat`}
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('${lang.src}')`,
                                        maskImage: `url('/assets/masks/mask.webp')`
                                    }}
                                />
                            </div>
                        </MagneticArea>
                    ))}
                </div>
            </BlurFade>
            <BlurFade delay={0.25} inView className="flex w-full flex-col items-center justify-center pb-1 mt-5">
                <h2 className="max-md:mb-3 px-5 w-full py-3 max-md:text-3xl text-5xl tracking-tighter font-bold font-sans">
                    {`My`} <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]"> designed tools</span>
                </h2>
                <p className="max-md:mb-0 w-full px-5 my-5 text-left text-foreground/500 tracking-normal">
                    {`I utilize a range of design tools to create user interfaces, graphics, and visual elements that enhance the user experience and aesthetic appeal of my projects.`}
                </p>
                <div className="w-full flex gap-5 rounded-2xl mb-5 bg-background p-8 px-5 flex-wrap justify-start">
                    {designed.map((lang, key) => (
                        <MagneticArea key={key}>
                            <div className="relative flex max-sm:h-9 max-sm:w-9 h-14 shadow shadow-card w-14 p-1 bg-background rounded-full items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left bg-[image:repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]">
                                <div
                                    className={`h-full w-full bg-center m-1 bg-no-repeat mask-size-[105%_90%] mask-center mask-no-repeat`}
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('${lang.src}')`,
                                        maskImage: `url('/assets/masks/mask.webp')`
                                    }}
                                />
                            </div>
                        </MagneticArea>
                    ))}
                </div>
            </BlurFade>
            <GradientLines className="bottom-0 -z-[1]" />
        </section>
    )
}