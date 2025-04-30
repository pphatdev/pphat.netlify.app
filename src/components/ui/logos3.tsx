"use client";

import React from 'react'
import Image from "next/image";
import { cn } from '@lib/utils';
import { InfiniteSlider } from '@components/infinit-scroll';

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
        <div className="w-full overflow-hidden relative">
            <div className="relative h-[100px] w-full">
                <InfiniteSlider className='flex h-full w-full items-center' duration={40} gap={48} >
                    {logos.map(({ id, image, className, description }) => (
                        <div key={id} className={cn("flex justify-center px-4 gap-2 w-full", className)} >
                            <Image
                                width={100}
                                height={100}
                                src={image}
                                alt={description}
                                className={cn("h-7 w-7", className)}
                            />
                            <span className='font-medium whitespace-nowrap'>{description}</span>
                        </div>
                    ))}
                </InfiniteSlider>

                <div className='bg-gradient-to-l from-background to-transparent top-0 w-20 h-[100px] absolute right-0' />
                <div className='bg-gradient-to-r from-background to-transparent top-0 w-20 h-[100px] absolute left-0' />
            </div>
        </div>
    );
};

export { Logos3 };
