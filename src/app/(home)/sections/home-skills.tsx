import { GradientLines } from "@components/background/gradient-line"
import { BlurFade } from "@components/ui/blur-fade"
import { languages } from "./brands";
import { MagneticArea } from "@components/ui/magnetic-button";

export const HomeSkills = () => {
    return (
        <section id="section-projects" className="max-w-5xl min-h-[45rem] flex flex-col items-center my-20 justify-center mx-auto">
            <BlurFade delay={0.25} inView className="flex flex-col items-center justify-center pb-1 mt-5">
                <h2 className="max-md:mb-3 px-5 w-full py-3 max-md:text-3xl text-5xl tracking-tighter font-bold font-sans">
                    {`My`} <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]"> Tech stack</span>
                </h2>
                <p className="max-md:mb-0 px-5 my-5 text-left text-foreground/500 tracking-normal">
                    {`My tech stack includes modern frameworks, languages, and development tools that enable me to build efficient and scalable applications.`}
                </p>
                <div className="w-full flex gap-5 mb-5 rounded-2xl shadow-card shadow-primary/5 bg-background p-8 px-5 flex-wrap justify-start">
                    {languages.map((lang, key) => (
                        <MagneticArea key={key}>
                            <div className="relative flex max-sm:h-9 max-sm:w-9 h-14 shadow-card shadow-primary/5 w-14 p-1 bg-background rounded-full items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left bg-[image:repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]">
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
            {/* <GradientLines className="-bottom-1/5 -z-[1]" /> */}
        </section>
    )
}