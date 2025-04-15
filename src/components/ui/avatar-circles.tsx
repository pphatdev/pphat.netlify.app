"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@lib/utils";

interface Avatar {
    imageUrl: string;
    profileUrl: string;
    title?: string;
}
interface AvatarCirclesProps {
    className?: string;
    numPeople?: number;
    avatarUrls: Avatar[];
}

export const AvatarCircles = ({
    numPeople,
    className,
    avatarUrls,
}: AvatarCirclesProps) => {
    return (
        <div className={cn("z-10 flex -space-x-6 rtl:space-x-reverse", className)}>
            {avatarUrls.map((url, index) => (
                <Link
                    key={index}
                    href={url.profileUrl}
                    target="_blank"
                    title={url.title}
                    rel="noopener noreferrer"
                >
                    <div className="relative hover:z-50 transition-all hover:scale-110 h-10 w-10">
                        <Image
                            className="rounded-full border-2 border-foreground/10"
                            src={url.imageUrl}
                            fill
                            sizes="40px"
                            alt={`Avatar ${url?.title ?? ''} ?? ""`}
                        />
                    </div>
                </Link>
            ))}
            {(numPeople ?? 0) > 0 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/10 bg-background text-center text-xs font-medium text-background/80 ring-foreground/10 transition-all hover:scale-110 hover:bg-primary/50 hover:text-background/100">
                    +{numPeople}
                </div>
            )}
        </div>
    );
};
