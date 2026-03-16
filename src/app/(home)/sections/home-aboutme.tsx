import { bgGradientLine45deg } from '@components/background/gradient-line';
import { Badge } from '@components/ui/badge';
import { RainbowGlow } from '@components/ui/rainbow-glow';
import { PERSON_ALTERNATE_NAME, PERSON_IMAGE, PERSON_NAME, PERSON_RELEGIEN_NAME, PERSON_SHORT_NAME } from '@lib/constants';
import { Title } from '@components/ui/title';
import { cn } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';


export const HomeAboutMe = () => {
    const title = "About me!";

    const description = <p> My name is <span className="text-primary font-semibold">{PERSON_NAME}</span>, my relegien name is <span className="text-primary font-semibold">{PERSON_RELEGIEN_NAME}</span>, and I&apos;m known online as <span className="text-primary font-semibold">{PERSON_ALTERNATE_NAME}</span>.
        I'm a Senior Front-end Developer at <Link href="https://turbotech.com.kh/" target="_blank" rel="noopener noreferrer">TURBOTECH CO., LTD</Link>, and as a Freelance UI/UX Designer.
        I'm from <Link href="https://en.wikipedia.org/wiki/Phnom_Penh" target="_blank" rel="noopener noreferrer">Phnom Penh, Cambodia</Link>.
        <br/>
        I started my career as a Front-end Developer in 2021, and I have a passion for creating beautiful and functional user interfaces. I love to learn new technologies and improve my skills every day. I am also a big fan of open-source projects and I enjoy contributing to the community. I believe that sharing knowledge is the key to success in this field.
    </p>;

    return (
        <div className="max-w-5xl flex flex-col relative items-center my-20 justify-center mx-auto">
            <RainbowGlow className="opacity-5"/>
            <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
                <div className="flex gap-4 flex-col">
                    <div className='px-5'>
                        <Badge variant="outline" className='py-1.5 px-3'>{title}</Badge>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <Title as='h2' title={["Who", "the hell am I ?"]} description={description} />
                        <p className="sr-only">
                            {PERSON_NAME}, {PERSON_RELEGIEN_NAME}, {PERSON_ALTERNATE_NAME}, {PERSON_SHORT_NAME}
                        </p>
                    </div>
                    <div className="flex flex-row gap-4 px-5">
                        <Link href={`/gallery`} className="rounded-full cursor-pointer bg-primary px-4 py-1.5 bg-linear-to-tr from-primary/10 to-primary/90 text-primary-foreground"> Gallery </Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 max-md:gap-5 max-lg:gap-2 gap-8 max-md:p-5">
                    <div>
                        <div className={cn("relative flex aspect-square w-full rounded-xl px-1 items-center justify-center overflow-hidden border text-foreground/10 bg-size-[8px_8px] bg-top-left", bgGradientLine45deg)}>
                            <Image
                                src={PERSON_IMAGE}
                                alt={`Profile photo of ${PERSON_NAME} (${PERSON_RELEGIEN_NAME}), known online as ${PERSON_ALTERNATE_NAME}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain m-1"
                                style={{
                                    maskImage: `url('/assets/masks/mask.webp')`,
                                    maskSize: '105% 100%',
                                    maskPosition: 'center',
                                    maskRepeat: 'no-repeat'
                                }}
                                loading="eager"
                                priority
                            />
                        </div>
                    </div>
                    <div className='row-span-2'>
                        <div className={cn("relative flex w-full h-full rounded-xl px-2 items-center justify-center overflow-hidden border text-foreground/10 bg-size-[8px_8px] bg-top-left", bgGradientLine45deg)}>
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
                        <div className={cn("relative flex aspect-square w-full rounded-xl items-center justify-center overflow-hidden border text-foreground/10 bg-size-[8px_8px] bg-top-left", bgGradientLine45deg)}>
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
        </div>
    )
}