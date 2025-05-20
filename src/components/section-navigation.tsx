"use client";

import { cn } from "@lib/utils";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

export const SectionNavigation = (
    { sections = [
        "hero",
        "skills",
        "about",
        "features",
        "faq",
        "contact",
    ] }: { sections?: string[]; }
) => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isHomeSection, setIsHomeSection] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);
    const pathname = usePathname();

    // const sections = useMemo(() => [
    //     "hero",
    //     "skills",
    //     "about",
    //     "features",
    //     "faq",
    //     "contact",
    // ], []);

    const handleScroll = useCallback(() => {
        if (isScrolling) return;

        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const { offsetTop, offsetHeight } = element;
                if (
                    scrollPosition >= offsetTop &&
                    scrollPosition < offsetTop + offsetHeight
                ) {
                    if (activeSection !== section) {
                        setActiveSection(section);
                        setIsHomeSection(section === "hero");

                        // Update URL hash without triggering navigation
                        window.history.replaceState(
                            null,
                            '',
                            `${pathname}#${section}`
                        );
                    }
                    break;
                }
            }
        }
    }, [sections, activeSection, isScrolling, pathname]);

    const navigateToSection = useCallback((section: string) => {
        setIsScrolling(true);
        const element = document.getElementById(section);
        if (element) {
            // Smooth scroll to the element
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(section);
            setIsHomeSection(section === "hero");

            // Update URL hash without full page reload
            window.history.replaceState(
                null,
                '',
                `${pathname}#${section}`
            );

            // Reset scrolling flag after animation completes
            setTimeout(() => setIsScrolling(false), 1000);
        } else {
            // If element doesn't exist yet (possible during route changes)
            // Update URL and let the useEffect handle the scrolling when page loads
            window.location.hash = section;
            setIsScrolling(false);
        }
    }, [pathname]);

    // Handle hash changes from external sources or route changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && sections.includes(hash) && hash !== activeSection) {
                setIsScrolling(true);

                // Small delay to ensure DOM is fully loaded after route change
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        setActiveSection(hash);
                        setIsHomeSection(hash === "hero");

                        // Reset scrolling flag after animation completes
                        setTimeout(() => setIsScrolling(false), 1000);
                    } else {
                        setIsScrolling(false);
                    }
                }, 100);
            }
        };

        // Check hash on initial load and route changes
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [sections, activeSection, pathname]);

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

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        e.preventDefault();
        navigateToSection(section);
    };

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isScrolling) return;

            if (e.key === 'ArrowUp' && prevSection) {
                e.preventDefault(); // Prevent default browser scrolling
                navigateToSection(prevSection);
            } else if (e.key === 'ArrowDown' && nextSection) {
                e.preventDefault(); // Prevent default browser scrolling
                navigateToSection(nextSection);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevSection, nextSection, isScrolling, navigateToSection]);

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
                        title={`${prevSection.charAt(0).toUpperCase() + prevSection.slice(1)} (Up Arrow)`}
                        onClick={(e) => handleNavClick(e, prevSection)}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <IconChevronUp className="size-4" />
                    </Link>
                )}
                {nextSection && (
                    <Link
                        href={`#${nextSection}`}
                        aria-label={`Go to ${nextSection} section`}
                        title={`${nextSection.charAt(0).toUpperCase() + nextSection.slice(1)} (Down Arrow)`}
                        onClick={(e) => handleNavClick(e, nextSection)}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <IconChevronDown className="size-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};