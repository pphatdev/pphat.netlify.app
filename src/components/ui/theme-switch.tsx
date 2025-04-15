"use client"

import React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
                isDark ? "bg-zinc-950 border border-zinc-800" : "bg-white border border-zinc-200",
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
                            ? "transform translate-x-0 bg-zinc-800"
                            : "transform translate-x-8 bg-gray-200"
                    )}
                >
                    {isDark
                        ? (<Moon className="w-4 h-4 text-white" strokeWidth={1.5} />)
                        : (<Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />)
                    }
                </div>
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        isDark ? "bg-transparent" : "transform -translate-x-8"
                    )}
                >
                    {isDark
                        ? (<Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} />)
                        : (<Moon className="w-4 h-4 text-black" strokeWidth={1.5} />)
                    }
                </div>
            </div>
        </div>
    )
}