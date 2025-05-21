"use client";

import React from "react";
import { cn } from "@lib/utils";

interface RainbowGlowProps {
    className?: string;
}

export function RainbowGlow({ className }: RainbowGlowProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Function to get computed color value from CSS variable
        const getComputedColor = (cssVar: string): string => {
            // Get the computed style
            const style = getComputedStyle(document.documentElement);
            // Get the CSS variable value
            const value = style.getPropertyValue(cssVar).trim();
            // Return as HSL
            return `hsl(${value})`;
        };

        // Set canvas dimensions
        const updateCanvasSize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Get computed colors
        const colors = [
            getComputedColor('--color-1'),
            getComputedColor('--color-5'),
            getComputedColor('--color-3'),
            getComputedColor('--color-4'),
            getComputedColor('--color-2')
        ];

        // Animation variables
        let offset = 0;
        let animationFrameId: number;

        // Animation function
        const animate = () => {
            if (!ctx) return;

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

            // Calculate positions with offset
            colors.forEach((color, index) => {
                const position = (index / (colors.length - 1) + offset) % 1;
                gradient.addColorStop(position, color);
            });

            // Fill canvas with gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update offset for animation
            offset += 0.002;
            if (offset > 1) offset = 0;

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={cn(
                "absolute -z-[1] w-full h-full blur-3xl left-1/2 translate-y-1/2 bottom-1/3 -translate-x-1/2 opacity-30",
                className
            )}
            aria-hidden="true"
        />
    );
}