import { BlurFade } from "@components/ui/blur-fade"
import { languages } from "./brands";
import { MagneticArea } from "@components/ui/magnetic-button";
import { Title } from "@components/ui/title";

export const HomeSkills = () => {

    const title = ["My ", "Tech Stack"]
    const description = `My tech stack includes modern frameworks, languages, and development tools that enable me to build efficient and scalable applications.`

    return (
        <section id="section-projects" className="max-w-5xl flex flex-col items-center mb-20 justify-center mx-auto">
            <BlurFade delay={0.25} inView className="flex flex-col items-center justify-center pb-1 mt-5">
                <Title as='h2' title={title} description={description} />
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
        </section>
    )
}