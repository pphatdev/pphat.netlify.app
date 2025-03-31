"use client";

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
            id: "logo-2",
            description: "Logo 2",
            image: "https://shadcnblocks.com/images/block/logos/figma.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-3",
            description: "Logo 3",
            image: "https://shadcnblocks.com/images/block/logos/nextjs.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-4",
            description: "Logo 4",
            image: "https://shadcnblocks.com/images/block/logos/react.png",
            className: "h-7 w-auto",
        },
        {
            id: "logo-6",
            description: "Logo 6",
            image: "https://shadcnblocks.com/images/block/logos/supabase.svg",
            className: "h-7 w-auto",
        },
        {
            id: "logo-7",
            description: "Logo 7",
            image: "https://shadcnblocks.com/images/block/logos/tailwind.svg",
            className: "h-4 w-auto",
        },
    ],
}: Logos3Props) => {
    return (
        <div className="pt-10 hidden sm:block">
            <div className="relative mx-auto w-full flex items-center justify-center lg:max-w-5xl">
                <Carousel
                    opts={{ loop: true }}
                    plugins={[AutoScroll({ playOnInit: true })]}
                >
                    <CarouselContent className="ml-0">
                        {logos.map((logo) => (
                            <CarouselItem
                                key={logo.id}
                                className="flex justify-center pl-0 basis-1/4"
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
