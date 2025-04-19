"use client";

import React from "react";

import { Dock, DockIcon } from "@components/ui/dock";
import { IconBrandFigma, IconBrandGithub, IconBrandGoogle, IconBrandLinkedin } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@lib/utils";
import { bgGradientLine45deg } from "./background/gradient-line";

export type IconProps = React.HTMLAttributes<SVGElement>;

const items = [
    {
        name: "GitHub",
        href: "https://github.com/pphatdev",
        icons: IconBrandGithub
    },
    {
        name: "Google Developer",
        href: "https://g.dev/sophat",
        icons: IconBrandGoogle
    },
    {
        name: "Linked In",
        href: "https://kh.linkedin.com/in/pphatdev",
        icons: IconBrandLinkedin
    },
    // {
    //     name: "Behance",
    //     href: "",
    //     icons: IconBrandBehance
    // },
    // {
    //     name: "Dribbble",
    //     href: "",
    //     icons: IconBrandDribbble
    // },
    {
        name: "Figma",
        href: "https://www.figma.com/@PPhat",
        icons: IconBrandFigma
    },
]

export function NavMenu({
    className
}: React.HTMLAttributes<HTMLDivElement> & { className?: string }) {
    return (
        <div className={cn("relative" ,className)}>
            <Dock direction="bottom" className={cn(bgGradientLine45deg, 'text-foreground/10 rounded-none')}>
                {
                    items.map( (item, key) => (
                        <DockIcon key={key} className={cn(`from-foreground/10 text-primary transition-colors ease-in-out to-foreground/10 hover:to-foreground hover:from-foreground rounded-xl bg-gradient-to-t inline-flex w-fit px-2 py-2 gap-1 border-border`)}>
                            <Link href={item.href} target="_blank" aria-label={item.name}>
                                <item.icons />
                            </Link>
                        </DockIcon>
                    ))
                }
            </Dock>
        </div>
    );
}