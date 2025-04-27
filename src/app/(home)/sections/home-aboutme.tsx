import { bgGradientLine45deg } from '@components/background/gradient-line';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Title } from '@components/ui/title';
import { cn } from '@lib/utils';


export const HomeAboutMe = () => {
    const title = "About me!";

    const description = `My name is <span class="text-primary font-semibold">Leat Sophat</span>, also known as <span className="text-primary font-semibold">PPhat</span>.
        I'm a Senior Front-end Developer at <a href="https://turbotech.com.kh/" target="_blank" rel="noopener noreferrer">TURBOTECH CO.,LTD</a>.
        I'm from <a href="https://en.wikipedia.org/wiki/Phnom_Penh" target="_blank" rel="noopener noreferrer">Phnom Penh, Cambodia</a>.
        I was born in October 2001 in <a href="https://simple.wikipedia.org/wiki/Prey_Veng_province" target="_blank" rel="noopener noreferrer">Prey Veng Province</a>.
        I'm studying in my second year of <a href="https://cus.edu.kh/" target="_blank" rel="noopener noreferrer">Computer Science at Cambodian University for Specialties (CUS)</a>.
    `

    return (
        <section className="max-w-5xl mx-auto min-h-screen">
            <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
                <div className="flex gap-4 flex-col">
                    <div className='px-5'>
                        <Badge variant="outline" className='py-1.5'>{title}</Badge>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <Title as='h2' title={["Who", "the hell am I ?"]} description={description} />
                    </div>
                    <div className="flex flex-row gap-4 px-5">
                        <Button className="rounded-full cursor-pointer"> Contact us </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 max-md:gap-5 max-lg:gap-2 gap-8 max-md:p-5">
                    <div>
                        <div className={cn( "relative flex aspect-square w-full rounded-xl px-1 items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left", bgGradientLine45deg )}>
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
                    <div className='row-span-2'>
                        <div className={cn( "relative flex w-full h-full rounded-xl px-2 items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left", bgGradientLine45deg )}>
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
                    <div>
                        <div className={cn( "relative flex aspect-square w-full rounded-xl items-center justify-center overflow-hidden border text-foreground/10 bg-[size:8px_8px] bg-top-left", bgGradientLine45deg )}>
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
                </div>
            </div>
        </section>
    )
}