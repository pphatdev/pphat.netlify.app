"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@lib/utils";

interface PostCoverImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function PostCoverImage({ src, alt, className }: PostCoverImageProps) {
    const [mounted, setMounted] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    return (
        <>
            {/* Skeleton shimmer shown while loading */}
            <div
                className={cn(
                    "absolute inset-0 bg-foreground/5 animate-pulse transition-opacity duration-500",
                    loaded ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                aria-hidden="true"
            />

            <Image
                src={src}
                alt={alt}
                width={800}
                height={450}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                className={cn(
                    "w-full h-full object-cover transition-all duration-700 ease-out",
                    mounted
                        ? loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
                        : "opacity-0",
                    className
                )}
                unoptimized={src?.startsWith("http")}
                onLoad={() => setLoaded(true)}
            />
        </>
    );
}
