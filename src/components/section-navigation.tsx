"use client";

import { IconArrowDownCircle, IconArrowUpCircle } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";

export const SectionNavigation = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const sections = useMemo(() => [
        "hero",
        "skills",
        "about",
        "features",
        "contact",
    ], []);

    // Use useCallback to memoize the scroll handler
    const handleScroll = useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        // Find the section currently in view
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const { offsetTop, offsetHeight } = element;
                if (
                    scrollPosition >= offsetTop &&
                    scrollPosition < offsetTop + offsetHeight
                ) {
                    setActiveSection(section);
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
        <div className="h-full flex items-center fixed right-2 inset-y-0 z-[9999]">
            <div className='bg-foreground/5 ring-1 w-fit ml-auto ring-foreground/10 justify-end gap-4 flex flex-col rounded-full p-1'>
                {prevSection && (
                    <Link
                        href={`#${prevSection}`}
                        aria-label={`Go to ${prevSection} section`}
                        title={prevSection.charAt(0).toUpperCase() + prevSection.slice(1)}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <IconArrowUpCircle className="size-4" />
                    </Link>
                )}
                {nextSection && (
                    <Link
                        href={`#${nextSection}`}
                        aria-label={`Go to ${nextSection} section`}
                        title={nextSection.charAt(0).toUpperCase() + nextSection.slice(1)}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <IconArrowDownCircle className="size-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};