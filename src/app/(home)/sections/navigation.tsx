"use client";

import { cn } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const HeaderNavigation = () => {
    const pathname = usePathname();
    const navItems = [
        {
            name: "Articles",
            link: "/projects",
            active: pathname === "/",
        },
        {
            name: "Articles",
            link: "/posts",
            active: pathname.startsWith("/posts"),
        },
        {
            name: "Hire me",
            link: "/about",
            active: pathname === "/about",
        },
        {
            name: "Contact",
            link: "/contact",
            active: pathname === "/contact",
        },
    ];

    return (
        <header className="fixed inset-x-0 bottom-2">
            <div className="py-5 w-fit mx-auto px-3">
                <nav className="ring ring-foreground/10 rounded-full p-1 flex items-center justify-center bg-background drop-shadow-2xl">
                    <ul className="flex items-center justify-evenly">
                        <li className="px-1.5">
                            <Link href={'/'}>
                                <span className="sr-only">Home Page</span>
                                <Image src={'/assets/logo/logo-solid-dark-mode.png'} alt="" className="object-cover rounded-full size-7" width={36} height={36}></Image>
                            </Link>
                        </li>

                        {navItems.map((item, index) => {
                            return (
                                <li key={index} className={cn(
                                    "rounded-full px-2.5 py-1 hover:bg-foreground/5 transition-colors duration-200 ease-in-out hover:ring-foreground/10 hover:ring-1",
                                    item.active ? "ring bg-foreground/5 ring-foreground/10 text-foreground" : ""
                                )}>
                                    <Link href={item.link} className="text-xs align-middle leading-tight font-light">
                                        <span className="sr-only">{item?.name}</span>
                                        {item?.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}