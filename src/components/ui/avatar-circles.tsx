"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@lib/utils";
import { Contributor } from "src/types/projects";

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export const AvatarCircles = ({ avatars, className = '' }: { avatars: Contributor[]; className?: string }) => {
    return (
        <div className={cn("z-10 flex -space-x-6 rtl:space-x-reverse", className)}>
            {avatars.map((avatar, index) => {
                const validUrl = isValidUrl(avatar.url);
                return (
                    <Link
                        key={index}
                        href={validUrl ? avatar.url : '#'}
                        target={validUrl ? "_blank" : undefined}
                        title={avatar.name}
                        rel={validUrl ? "noopener noreferrer" : undefined}
                        onClick={(e) => !validUrl && e.preventDefault()}
                    >
                        <div className="relative hover:z-50 transition-all hover:scale-110 h-10 w-10">
                            <Image
                                className="rounded-full border-2 border-foreground/10"
                                src={avatar.profile}
                                style={{ zIndex: avatars.length - index }} // Ensure later avatars are on top
                                fill
                                sizes="40px"
                                alt={`Avatar ${avatar.name}`}
                            />
                        </div>
                    </Link>
                );
            })}
            {(avatars.length - 3) > 0 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/10 bg-background text-center text-xs font-medium text-background/80 ring-foreground/10 transition-all hover:scale-110 hover:bg-primary/50 hover:text-background/100">
                    +{avatars.length - 3}
                </div>
            )}
        </div>
    );
};
