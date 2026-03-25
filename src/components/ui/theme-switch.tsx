"use client"

import React from "react"
import { cn } from "@lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
        </svg>
    );
}

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Mount component on client-side only
    useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent hydration mismatch by rendering nothing on server
    if (!mounted) {
        return null
    }

    const isDark = resolvedTheme === "dark"
    const toggleTheme = () => setTheme(isDark ? "light" : "dark")

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            toggleTheme()
        }
    }

    return (
        <div
            className={cn(
                "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
                isDark ? "bg-background/20 border border-foreground/20" : "bg-background/10 border border-foreground/10",
                className
            )}
            onClick={toggleTheme}
            onKeyDown={handleKeyDown}
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            tabIndex={0}
        >
            <div className="flex justify-between items-center w-full">
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        isDark
                            ? "transform translate-x-0 bg-foreground/20"
                            : "transform translate-x-8 bg-background/50"
                    )}
                >
                    {isDark
                        ? (<MoonIcon className="w-4 h-4 text-foreground" />)
                        : (<SunIcon className="w-4 h-4 text-foreground" />)
                    }
                </div>
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        isDark ? "bg-transparent" : "transform -translate-x-8"
                    )}
                >
                    {isDark
                        ? (<SunIcon className="w-4 h-4 text-foreground" />)
                        : (<MoonIcon className="w-4 h-4 text-foreground" />)
                    }
                </div>
            </div>
        </div>
    )
}