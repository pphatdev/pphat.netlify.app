"use client";

import { cn } from "@lib/utils";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";

export const SectionNavigation = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isHomeSection, setIsHomeSection] = useState(true);
    const sections = useMemo(() => [
        "hero",
        "skills",
        "about",
        "features",
        "faq",
        "contact",
    ], []);

    const handleScroll = useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const { offsetTop, offsetHeight } = element;
                if (
                    scrollPosition >= offsetTop &&
                    scrollPosition < offsetTop + offsetHeight
                ) {
                    setActiveSection(section);
                    setIsHomeSection(section === "hero");
                    break;
                }
            }
        }
    }, [sections]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const debouncedHandleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 100);
        };

        window.addEventListener('scroll', debouncedHandleScroll);

        // Call once on mount to set initial active section
        handleScroll();

        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
            clearTimeout(timeoutId);
        };
    }, [handleScroll]);

    const currentIndex = sections.indexOf(activeSection);
    const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
    const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

    return (
        <div className={cn(
            "h-fit flex items-center fixed inset-y-0 z-50 transition-all group duration-300 ease-in-out",
            isHomeSection
                ? "left-1/2 -translate-x-1/2 top-[90%] animate-bounce"
                : "right-2 top-1/2 -translate-y-1/2 max-md:top-[90%] max-md:right-2 max-md:bottom-2",
        )}>
            <div className='bg-foreground/5 ring-1 w-fit ml-auto max-md:group-hover:bg-background/50 ring-foreground/10 justify-end gap-4 flex flex-col rounded-full p-1'>
                {prevSection && (
                    <Link
                        href={`#${prevSection}`}
                        aria-label={`Go to ${prevSection} section`}
                        title={prevSection.charAt(0).toUpperCase() + prevSection.slice(1)}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <IconChevronUp className="size-4" />
                    </Link>
                )}
                {nextSection && (
                    <Link
                        href={`#${nextSection}`}
                        aria-label={`Go to ${nextSection} section`}
                        title={nextSection.charAt(0).toUpperCase() + nextSection.slice(1)}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <IconChevronDown className="size-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};