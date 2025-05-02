"use client";

import React from 'react'
import AutoScroll from "embla-carousel-auto-scroll";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@components/ui/carousel";
import Image from "next/image";
import { cn } from '@lib/utils';

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
    return (
        <svg height="512" width="512" viewBox="0 0 512 512" className='w-5 h-5' fill='currentColor'>
            <path d="m386.3985596 35.5079727c-169.3385315-99.5687332-384.5140285 22.0419274-386.3862926 218.3738175-1.8282685 191.716507 201.0625916 315.5454712 370.0206604 231.1632233l-184.4725331-271.408722.0000305 167.9969177c0 18.6138916-35.6191101 18.6138916-35.6191101 0v-225.2124176c0-14.7758484 27.4472504-15.9884033 35.2252045-3.1443481l210.2631683 317.2959595c157.9509888-101.737259 155.8170166-338.1359864-9.0311279-435.0644303zm-23.7556153 317.9385605-35.7316284-54.5765381v-149.4116669c0-13.9324646 35.7316284-13.9324646 35.7316284 0z" />
        </svg>
    )
}

const Logos3 = ({
    logos = [
        {
            id: "logo-1",
            description: "TypeScript",
            image: "./assets/brands/language/typescript.svg",
            className: "h-5",
        },
        {
            id: "logo-2",
            description: "JavaScript",
            image: "./assets/brands/language/javascript.svg",
            className: "h-5",
        },
        {
            id: "logo-3",
            description: "Node JS",
            image: "./assets/brands/language/nodejs.svg",
            className: "h-5",
        },
        {
            id: "logo-4",
            description: "React JS",
            image: "./assets/brands/language/react.svg",
            className: "h-5",
        },
        {
            id: "logo-5",
            description: "Next Js",
            image: "./assets/brands/language/nextjs.svg",
            icons: NextLogo,
            className: "h-7 w-7",
        },
        {
            id: "logo-6",
            description: "Vue JS",
            image: "./assets/brands/language/vuejs.svg",
            className: "h-5",
        },
        {
            id: "logo-7",
            description: "Nuxt JS",
            image: "./assets/brands/language/nuxtjs.svg",
            className: "h-5",
        },
        {
            id: "logo-8",
            description: "PHP",
            image: "./assets/brands/language/php.svg",
            className: "h-5",
        },
        {
            id: "logo-9",
            description: "Laravel",
            image: "./assets/brands/language/laravel.svg",
            className: "h-5",
        },
        {
            id: "logo-10",
            description: "CSS",
            image: "./assets/brands/language/css.svg",
            className: "h-5",
        },
        {
            id: "logo-11",
            description: "Tailwind CSS",
            image: "./assets/brands/language/tailwind.svg",
            className: "h-5",
        },
    ],
}: Logos3Props) => {
    return (
        <div className="pt-10 hidden sm:block">
            <div className="relative mx-auto w-full flex items-center justify-center lg:max-w-5xl">
                <Carousel
                    opts={{ loop: true }}
                    plugins={[AutoScroll({ playOnInit: true, speed: 0.5, stopOnFocusIn: true })]}
                    className='overflow-hidden'
                >
                    <CarouselContent className="ml-0">
                        {logos.map((logo) => (
                            <CarouselItem
                                key={logo.id}
                                className="flex justify-center w-full pl-0 basis-1/4"
                            >
                                <div className="px-10 flex shrink-0 gap-1 items-center justify-center">
                                    {logo.icons && <logo.icons />}
                                    {!logo.icons && (
                                        <Image
                                            width={100}
                                            height={100}
                                            src={logo.image}
                                            alt={logo.description}
                                            className={cn("h-7 w-7", logo.className)}
                                        />
                                    )}
                                    <span className='font-medium'>{logo.description}</span>
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