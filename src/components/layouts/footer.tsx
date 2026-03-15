import Link from "next/link";
import {
    GITHUB_URL,
    LINKEDIN_URL,
    TWITTER_URL,
    appTitle,
    // NEXT_PUBLIC_APP_URL,
    // appDescriptions
} from "@lib/constants";
import { GitHubIcon } from "../icons/github";
// import { LinkedInIcon } from "../icons/linkedin";
// import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon, ArrowRightIcon, MailCheckIcon } from "lucide-react";
import { Button } from "../ui";
// import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Projects", href: "/projects" },
        { label: "Gallery", href: "/gallery" },
    ],
    company: [
        { label: "About Me", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Blogs", href: "/posts" },
    ],
    resources: [
        { label: "Documentation", href: "/posts" },
        { label: "Community", href: GITHUB_URL, external: true },
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
        <footer className="w-full border-t px-3 border-border/40 bg-gradient-to-b from-background via-background/95 to-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-5xl mx-auto max-sm:px-5 py-12 md:py-16 lg:py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
                        <Link href="/" className="inline-block group">
                            <h2 className="text-xl font-bold text-primary group-hover:text-primary transition-colors">
                                Sophat L.
                            </h2>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Building scalable systems & crafting digital experiences.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-base text-primary pl-2">Product</h3>
                        <ul className="gap-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Button asChild className="mt-0 text-foreground hover:text-primary -translate-x-2.5">
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
                        <h3 className="font-semibold text-base text-primary pl-2">Company</h3>
                        <ul className="gap-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Button asChild className="mt-0 text-foreground hover:text-primary -translate-x-2.5">
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
                        <h3 className="font-semibold text-base text-primary pl-2">Resources</h3>
                        <ul className="gap-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Button asChild className="mt-0 text-foreground hover:text-primary -translate-x-2.5">
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
                        <h3 className="font-semibold text-base pl-2 text-primary">Social</h3>
                        <ul className="gap-2">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <li key={link.href}>
                                        <Button asChild className="mt-0 text-foreground hover:text-primary -translate-x-2.5">
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
                <div className="pt-8 border-t border-border/40">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground text-center md:text-left">
                                Copyright © {currentYear}{" "}
                                <Link
                                    href="/"
                                    className="font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                    {appTitle}
                                </Link>
                                {" "}· All rights reserved
                            </p>
                        </div>

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
