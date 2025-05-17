import { bgGradientLine45deg } from '@components/background/gradient-line';
import { FlipWords } from '@components/flip-words';
import { BlurFade } from '@components/ui/blur-fade';
import { Cover } from '@components/ui/cover';
import { MagneticArea } from '@components/ui/magnetic-button';
import { ThemeToggle } from '@components/ui/theme-switch';
import { cn } from '@lib/utils';


export const AboutMeHero = ({
    description,
    appPositions
}: {
    description: string;
    appPositions: string[];
}) => {


    return (
        <div className="max-w-5xl flex flex-col items-center my-20 pt-10 justify-center mx-auto">
            <h1 className='sr-only'>About Me</h1>
            <p className='sr-only'>{description}</p>
            <div className="grid grid-cols-1 gap-8 items-center justify-center lg:grid-cols-2">
                <div className="px-2 sm:p-5 z-10 max-w-3xl bg-gradient-to-b from-background/5 via-background to-background">
                    <BlurFade delay={0.15} inView>
                        <div className="text-3xl text-center md:text-left md:text-6xl font-bold">
                            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 py-4 [text-rendering:optimizeLegibility]">
                                    <span className="mr-2 font-sans [font-display:swap]">{`About`}</span>
                                </div>
                            </div>
                            <Cover>{'Me 🫡'}</Cover>
                        </div>
                    </BlurFade>
                    <div className="max-md:text-xl text-2xl text-center h-fit md:text-left font-semibold">
                        <FlipWords words={appPositions} />
                    </div>
                    <BlurFade delay={0.50} inView className="mt-5 relative flex text-center max-w-full md:text-left">
                        {description && <p className="max-md:mb-0 my-5 text-left text-foreground/90 tracking-normal [&>*]:hover:transition-all [&>a]:text-primary [&>a]:hover:font-semibold"
                            dangerouslySetInnerHTML={
                                { __html: description.replace(/\n/g, '<br />'), }
                            }
                        />}
                    </BlurFade>

                    <BlurFade delay={0.70} inView>
                        <nav className="flex flex-col z-50 justify-center sm:justify-start sm:flex-row items-center gap-4 mt-6 max-md:px-3">
                            <MagneticArea>
                                <ThemeToggle />
                            </MagneticArea>
                        </nav>
                    </BlurFade>
                </div>
                <BlurFade delay={0.70} inView className="grid max-lg:-translate-y-1/4 max-lg:max-h-60 z-0 max-lg:order-first grid-cols-2 max-md:gap-5 max-lg:gap-2 gap-8 max-md:p-5">
                    <div className='rotate-12 hover:rotate-0 transition-all duration-500'>
                        <div className={cn("relative flex aspect-square w-full rounded-2xl px-1 items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left", bgGradientLine45deg)}>
                            <div
                                className="h-full w-full bg-center m-1 bg-no-repeat mask-size-[105%_100%] mask-center mask-no-repeat"
                                style={{
                                    backgroundSize: "contain",
                                    backgroundImage: `url('/assets/avatars/krate-1.webp')`,
                                    maskImage: `url('/assets/masks/mask.webp')`,
                                }}
                            />
                        </div>
                    </div>
                    <div className='row-span-2 max-lg:rotate-12'>
                        <div className={cn("relative flex w-full h-full rounded-2xl px-2 items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left", bgGradientLine45deg)}>
                            <div
                                className="h-full w-full bg-center bg-no-repeat mask-size-[130%_100%] mask-center mask-no-repeat"
                                style={{
                                    backgroundSize: "contain",
                                    backgroundImage: `url('/assets/avatars/rom-lech.webp')`,
                                    maskImage: `url('/assets/masks/mask.webp')`,
                                }}
                            />
                        </div>
                    </div>
                    <div className='-rotate-6 hover:rotate-0 transition-all duration-500'>
                        <div className={cn("relative flex aspect-square w-full rounded-2xl items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left", bgGradientLine45deg)}>
                            <div
                                className="h-full w-full bg-center bg-no-repeat mask-size-[105%_100%] mask-center mask-no-repeat"
                                style={{
                                    backgroundSize: "cover",
                                    backgroundImage: `url('/assets/avatars/kampot-2.webp')`,
                                    maskImage: `url('/assets/masks/mask.webp')`,
                                }}
                            />
                        </div>
                    </div>
                </BlurFade>
            </div>
        </div>
    )
}