"use client";
import { cn } from "@lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";


interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        active: boolean;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            className={cn("fixed inset-x-0 top-3 z-40 w-full px-3 md:top-5 md:px-4", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    ) : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(14px)" : "blur(0px)",
                y: visible ? 6 : 0,
                scale: visible ? 0.985 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
            }}
            className={cn(
                "relative z-60 mx-auto hidden w-full max-w-5xl items-center justify-between rounded-[1.75rem] border border-transparent px-3 py-2 lg:flex",
                visible
                    ? "bg-background/75 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-foreground/8 border-border/50"
                    : "bg-background/55 ring-1 ring-foreground/8 shadow-[0_6px_20px_rgba(0,0,0,0.04)]",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "hidden flex-1 items-center justify-center gap-1.5 px-6 text-sm font-medium lg:flex",
                className,
            )}
        >
            {items.map((item, idx) => (
                <Link
                    onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className={cn(
                        "relative rounded-full px-4 py-2 transition-colors duration-200",
                        item.active ? "text-foreground" : "text-foreground/72 hover:text-foreground"
                    )}
                    key={`link-${idx}`}
                    href={item.link}
                >
                    {(hovered === idx || item.active) && (
                        <motion.div
                            layoutId={"hovered"}
                            className={cn(
                                "absolute inset-0 h-full w-full rounded-full bg-foreground/7 ring-1 ring-foreground/10",
                            )}
                        />
                    )}
                    <span className="relative z-20">{item.name}</span>
                </Link>
            ))}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(14px)" : "blur(0px)",
                y: visible ? 6 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1.5rem)] flex-col justify-between rounded-[1.75rem] border border-border/40 bg-background/75 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] lg:hidden",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    className={cn(
                        "absolute inset-x-0 top-[calc(100%+0.75rem)] z-50 mx-auto flex w-full max-w-sm flex-col rounded-[1.5rem] border border-border/60 bg-background/95 px-4 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-md",
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return isOpen ? (
        <button
            type="button"
            onClick={onClick}
            aria-label="Close navigation menu"
            className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground transition-colors hover:bg-foreground/5"
        >
            <IconX className="size-5" />
        </button>
    ) : (
        <button
            type="button"
            onClick={onClick}
            aria-label="Open navigation menu"
            className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground transition-colors hover:bg-foreground/5"
        >
            <IconMenu2 className="size-5" />
        </button>
    );
};

export const NavbarLogo = () => {
    return (
        <Link href="/" className="z-50 flex shrink-0 items-center gap-3" aria-label="Home">
            <div className="bg-foreground/3 ring-foreground/8 flex size-10 items-center justify-center rounded-2xl ring-1">
                <Image width={26} height={26} src={'/assets/logo/logo-transparent-dark-mode.png'} alt={"Logo"} className="hidden dark:block" />
                <Image width={26} height={26} src={'/assets/logo/logo-transparent-light-mode.png'} alt={"Logo"} className="dark:hidden" />
            </div>
            <div className="hidden min-w-0 md:block">
                <p className="truncate text-sm font-semibold tracking-wide text-foreground">PPhat</p>
                <p className="truncate text-xs text-foreground/55">Frontend engineer</p>
            </div>
            {/* {process.env?.NODE_ENV === "development" && <Badge className="py-0.5 pt-1 h-fit -translate-y-3 bg-background text-[8px] uppercase" variant={"outline"}>Dev Mode</Badge>} */}
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles = "px-4 py-2 rounded-full bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary: "shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]",
        secondary: "bg-transparent shadow-none dark:text-white",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]",
        gradient: "bg-linear-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};
