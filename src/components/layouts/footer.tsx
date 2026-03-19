import Link from "next/link";
import {
    GITHUB_URL,
    LINKEDIN_URL,
    appTitle,
} from "@lib/constants";
import { GitHubIcon } from "../icons/github";
import { ArrowRightIcon, MailCheckIcon } from "lucide-react";
import { Button } from "../ui";
import { Ripple } from "../ui/ripple";

const footerLinks = {
    product: [
        { label: "Projects", href: "/projects" },
        { label: "Gallery", href: "/gallery" },
    ],
    company: [
        { label: "TURBOTECH Co., Ltd", href: "https://turbotech.com.kh/", external: true },
        { label: "PPhat Labs", href: "https://github.com/pphatlabs", external: true },
    ],
    resources: [
        { label: "Documentation", href: "/posts" },
        { label: "Community", href: `${GITHUB_URL}/discussions`, external: true },
        { label: "Support", href: "/contact" },
    ],
};

const socialLinks = [
    {
        label: "GitHub",
        href: GITHUB_URL,
        icon: GitHubIcon
    },
    {
        label: "LinkedIn",
        href: LINKEDIN_URL,
        icon: GitHubIcon
    },
    {

        label: "Email",
        href: "/contact",
        icon: MailCheckIcon
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t sm:px-3 mt-20 border-border/40 bg-linear-to-b from-background via-background/95 to-background backdrop-blur supports-backdrop-filter:bg-background/60">

            <div className="absolute overflow-hidden inset-0 pointer-events-none" aria-hidden="true">
                <Ripple mainCircleSize={150} numCircles={12} className="opacity-30" />
            </div>

            <div className="max-w-5xl mx-auto max-sm:px-5 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:px-5">
                    {/* Product Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base text-primary sm:pl-1">Product</h3>
                        <ul className="max-sm:gap-2 flex flex-col">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Button asChild className="mt-0 text-foreground/70 h-7 text-xs hover:text-primary xs:-translate-x-2.5">
                                        <Link href={link.href}>
                                            <ArrowRightIcon className='w-4 h-4' /> {link.label}
                                        </Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base text-primary sm:pl-1">Working at</h3>
                        <ul className="max-sm:gap-2 flex flex-col">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Button asChild className="mt-0 text-foreground/70 h-7 text-xs hover:text-primary xs:-translate-x-2.5">
                                        <Link href={link.href}>
                                            <ArrowRightIcon className='w-4 h-4' /> {link.label}
                                        </Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base text-primary sm:pl-1">Resources</h3>
                        <ul className="max-sm:gap-2 flex flex-col">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Button asChild className="mt-0 text-foreground/70 h-7 text-xs hover:text-primary xs:-translate-x-2.5">
                                        <Link href={link.href}>
                                            <ArrowRightIcon className='w-4 h-4' /> {link.label}
                                        </Link>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base sm:pl-1 text-primary">Social</h3>
                        <ul className="max-sm:gap-2 flex flex-col">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <li key={link.href}>
                                        <Button asChild className="mt-0 text-foreground/70 h-7 text-xs hover:text-primary xs:-translate-x-2.5">
                                            <Link href={link.href}>
                                                <ArrowRightIcon className='w-4 h-4' /> {link.label}
                                            </Link>
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/40 bg-background">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:px-5">
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            Copyright © {currentYear}{" "}
                            <Link href="/" className="font-semibold text-foreground hover:text-primary transition-colors" > {appTitle} </Link>
                            {" "}· All rights reserved
                        </p>

                        {/* <div className="flex items-center gap-6">
                            <Link
                                href="/privacy"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
