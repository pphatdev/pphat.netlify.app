"use client";
import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@lib/utils";
import { SparklesCore } from "@ui/sparkles";

export const Cover = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const [hovered, setHovered] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const [containerWidth, setContainerWidth] = useState(0);
    const [beamPositions, setBeamPositions] = useState<number[]>([]);

    useEffect(() => {
        if (ref.current) {
            setContainerWidth(ref.current?.clientWidth ?? 0);

            const height = ref.current?.clientHeight ?? 0;
            const numberOfBeams = Math.floor(height / 10); // Adjust the divisor to control the spacing
            const positions = Array.from(
                { length: numberOfBeams },
                (_, i) => (i + 1) * (height / (numberOfBeams + 1))
            );
            setBeamPositions(positions);
        }
    }, []);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            ref={ref}
            className="relative group/cover pointer-events-auto inline-block bg-background/80 p-2 transition duration-200 rounded-sm"
        >
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 0.2, },
                        }}
                        className="h-full w-full overflow-hidden absolute inset-0"
                    >
                        <motion.div
                            animate={{ translateX: ["-50%", "0%"], }}
                            transition={{
                                translateX: {
                                    duration: 10,
                                    ease: "linear",
                                    repeat: Infinity,
                                },
                            }}
                            className="w-[200%] h-full flex"
                        >
                            <SparklesCore background="transparent" minSize={0.4} maxSize={1} particleDensity={500} className="w-full h-full" particleColor="#FFFFFF" />
                            <SparklesCore background="transparent" minSize={0.4} maxSize={1} particleDensity={500} className="w-full h-full" particleColor="#FFFFFF" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {beamPositions.map((position, index) => (
                <Beam
                    key={index}
                    hovered={hovered}
                    duration={Math.random() * 2 + 1}
                    delay={Math.random() * 2 + 1}
                    width={containerWidth}
                    style={{ top: `${position}px`, }}
                />
            ))}
            <motion.span
                key={String(hovered)}
                layout
                animate={hovered ? {
                    scale: 0.95,
                } : {
                    scale: 1,
                }}
                transition={{
                    duration: 0.2,
                    layout: {
                        type: "spring",
                        bounce: 0.2
                    }
                }}
                className={cn(
                    "inline-block text-foreground relative z-20 group-hover/cover:text-foreground will-change-transform",
                    className
                )}
            >
                {children}
            </motion.span>
            <CircleIcon className="absolute -right-[2px] -top-[2px]" />
            <CircleIcon className="absolute -bottom-[2px] -right-[2px]" />
            <CircleIcon className="absolute -left-[2px] -top-[2px]" />
            <CircleIcon className="absolute -bottom-[2px] -left-[2px]" />
        </div>
    );
};

export const Beam = ({
    className,
    delay,
    duration,
    hovered,
    width = 600,
    ...svgProps
}: {
    className?: string;
    delay?: number;
    duration?: number;
    hovered?: boolean;
    width?: number;
} & React.ComponentProps<typeof motion.svg>) => {
    const id = useId();

    return (
        <motion.svg
            width={width ?? "600"}
            height="1"
            viewBox={`0 0 ${width ?? "600"} 1`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("absolute inset-x-0 w-full", className)}
            {...svgProps}
        >
            <motion.path d={`M0 0.5H${width ?? "600"}`} stroke={`url(#svgGradient-${id})`} />

            <defs>
                <motion.linearGradient
                    id={`svgGradient-${id}`}
                    key={String(hovered)}
                    gradientUnits="userSpaceOnUse"
                    initial={{ x1: "0%", x2: hovered ? "-10%" : "-5%", y1: 0, y2: 0, }}
                    animate={{ x1: "110%", x2: hovered ? "100%" : "105%", y1: 0, y2: 0, }}
                    transition={{
                        duration: hovered ? 0.5 : duration ?? 2,
                        ease: "linear",
                        repeat: Infinity,
                        delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
                        repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : delay ?? 1,
                    }}
                >
                    <stop stopColor="#2EB9DF" stopOpacity="0" />
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                </motion.linearGradient>
            </defs>
        </motion.svg>
    );
};

export const CircleIcon = ({
    className,
    // delay,
}: {
    className?: string;
    // delay?: number;
}) => {
    return (
        <div
            className={cn(
                `pointer-events-none animate-pulse group-hover/cover:hidden group-hover/cover:opacity-100 group h-2 w-2 rounded-full bg-primary opacity-20 group-hover/cover:bg-primary`,
                className
            )}
        ></div>
    );
};
