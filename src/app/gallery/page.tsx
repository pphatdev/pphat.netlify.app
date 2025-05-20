import React from 'react'
import { BlurFade } from "@components/ui/blur-fade"
import { images } from "./image"
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from "next";
import { appName, currentDomain } from "@lib/constants";

export const metadata: Metadata = {
    title: `Gallery | ${appName}`,
    description: "Explore my photo gallery showcasing memorable moments and experiences.",
    authors: [{
        url: currentDomain,
        name: `${appName}`,
    }],
    generator: `Gallery | ${appName}`,
    openGraph: {
        type: "website",
        url: `${currentDomain}/gallery`,
        title: `Gallery | ${appName}`,
        description: "Explore my photo gallery showcasing memorable moments and experiences.",
        siteName: `${appName} | Gallery`,
        images: [{
            url: currentDomain + "/assets/avatars/hero.webp",
        }],
    },
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    }
};

export default function Gallery() {
    return (
        <section className="max-w-4xl mx-auto py-4">
            <div className="columns-2 gap-4 sm:columns-3">
                {images.map((item, idx) => (
                    <BlurFade key={idx} delay={0.25 + idx * 0.05} inView>
                        <Link href={item.link || '#'}
                            aria-label={`View details for ${item.alt}`}
                            className="block mb-4 overflow-hidden rounded-lg hover:opacity-90 transition-opacity">
                            <Image
                                src={item.src}
                                alt={item.alt}
                                className="size-full rounded-lg object-contain"
                                width={item.width}
                                height={item.height}
                            />
                            {item.caption && (
                                <p className="mt-2 sr-only text-sm text-gray-600">{item.caption}</p>
                            )}
                        </Link>
                    </BlurFade>
                ))}
            </div>
        </section>
    )
}

