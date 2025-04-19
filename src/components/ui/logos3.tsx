"use client";

import React from 'react'
import AutoScroll from "embla-carousel-auto-scroll";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@components/ui/carousel";
import Image from "next/image";

interface Logo {
    id: string;
    description: string;
    image: string;
    className?: string;
}

interface Logos3Props {
    heading?: string;
    logos?: Logo[];
    className?: string;
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
                                        <Image
                                            width={100}
                                            height={100}
                                            src={logo.image}
                                            alt={logo.description}
                                            className={logo.className}
                                        />
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
