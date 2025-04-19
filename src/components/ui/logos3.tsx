"use client";

import React from 'react'
import AutoScroll from "embla-carousel-auto-scroll";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@components/ui/carousel";
import Image from "next/image";
import { icons } from '../../lib/meta/icons';

interface Logo {
    id: string;
    description: string;
    icons?: React.ComponentType;
    image: string;
    className?: string;
}

interface Logos3Props {
    heading?: string;
    logos?: Logo[];
    className?: string;
}

const NextLogo = () => {
    return (<svg height="309" className='h-7' fill='currentColor' preserveAspectRatio="xMidYMid" viewBox="0 0 512 309" width="512" xmlns="http://www.w3.org/2000/svg">
        <path d="m120.81043 80.5613102h96.567895v7.6753487h-87.715838v57.7670991h82.485077v7.675348h-82.485077v63.422619h88.721754v7.675348h-97.573811zm105.21877 0h10.260338l45.467384 63.4226188 46.4733-63.4226188 63.211264-80.5613102-103.850254 150.649363 53.514709 74.12771h-10.662704l-48.686315-67.462275-48.887497 67.462275h-10.461521l53.917074-74.12771zm118.899221 7.6753486v-7.6753486h110.047164v7.6753487h-50.698145v136.5404141h-8.852058v-136.5404141zm-344.928421-7.6753486h11.0650714l152.5808586 228.3226968-63.054372-84.106934-91.33713469-133.3086883-.40236623 133.3086883h-8.85205708zm454.083705 134.2241588c-1.808538 0-3.164943-1.401289-3.164943-3.212184 0-1.810897 1.356405-3.212186 3.164943-3.212186 1.830069 0 3.164943 1.401289 3.164943 3.212186 0 1.810895-1.334874 3.212184-3.164943 3.212184zm8.69821-8.450851h4.736648c.06459 2.565437 1.937721 4.290101 4.693588 4.290101 3.078821 0 4.822769-1.854014 4.822769-5.324899v-21.989457h4.82277v22.011016c0 6.251906-3.617077 9.852139-9.602478 9.852139-5.619388 0-9.473297-3.492442-9.473297-8.8389zm25.38413-.280256h4.779709c.409074 2.953486 3.294124 4.829057 7.449457 4.829057 3.875441 0 6.717429-2.004921 6.717429-4.764383 0-2.371411-1.808538-3.794259-5.920812-4.764383l-4.004619-.970122c-5.619389-1.315057-8.181486-4.031402-8.181486-8.601759 0-5.540482 4.521348-9.226949 11.303367-9.226949 6.308355 0 10.915822 3.686467 11.195715 8.925132h-4.693588c-.452134-2.867252-2.949641-4.65659-6.566718-4.65659-3.810849 0-6.351414 1.832454-6.351414 4.635033 0 2.220503 1.636295 3.492442 5.683978 4.441008l3.423305.840772c6.372946 1.487524 8.999632 4.074517 8.999632 8.752668 0 5.950089-4.607467 9.679672-11.970803 9.679672-6.889671 0-11.518667-3.557118-11.863152-9.119156z" />
    </svg>)
}

const Logos3 = ({
    logos = [
        {
            id: "logo-1",
            description: "TypeScript",
            image: "./assets/brands/language/typescript.svg",
            className: "h-7",
        },
        {
            id: "logo-2",
            description: "JavaScript",
            image: "./assets/brands/language/javascript.svg",
            className: "h-7",
        },
        {
            id: "logo-3",
            description: "NodeJS",
            image: "./assets/brands/language/nodejs.svg",
            className: "h-7",
        },
        {
            id: "logo-4",
            description: "ReactJS",
            image: "./assets/brands/language/react.svg",
            className: "h-7",
        },
        {
            id: "logo-5",
            description: "NextJs",
            image: "./assets/brands/language/nextjs.svg",
            icons: NextLogo,
            className: "h-7",
        },
        {
            id: "logo-6",
            description: "VueJS",
            image: "./assets/brands/language/vuejs.svg",
            className: "h-7",
        },
        {
            id: "logo-7",
            description: "NuxtJS",
            image: "./assets/brands/language/nuxtjs.svg",
            className: "h-7",
        },
        {
            id: "logo-8",
            description: "PHP",
            image: "./assets/brands/language/php.svg",
            className: "h-7",
        },
        {
            id: "logo-9",
            description: "Laravel",
            image: "./assets/brands/language/laravel.svg",
            className: "h-7",
        },
        {
            id: "logo-10",
            description: "CSS",
            image: "./assets/brands/language/css.svg",
            className: "h-7",
        },
        {
            id: "logo-11",
            description: "TailwindCSS",
            image: "./assets/brands/language/tailwind.svg",
            className: "h-7",
        },
    ],
}: Logos3Props) => {
    return (
        <div className="pt-10 hidden sm:block">
            <div className="relative mx-auto w-full flex items-center justify-center lg:max-w-5xl">
                <Carousel
                    opts={{ loop: true }}
                    plugins={[AutoScroll({ playOnInit: true })]}
                    className=' overflow-hidden'
                >
                    <CarouselContent className="ml-0">
                        {logos.map((logo) => (
                            <CarouselItem
                                key={logo.id}
                                className="flex justify-center pl-0 basis-1/9"
                            >
                                <div className="mx-10 flex shrink-0 items-center justify-center">
                                    <div>
                                        {logo.icons && <logo.icons />}
                                        {!logo.icons && <Image
                                            width={100}
                                            height={100}
                                            src={logo.image}
                                            alt={logo.description}
                                            className={logo.className}
                                        />}

                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
            </div>
        </div>
    );
};

export { Logos3 };
