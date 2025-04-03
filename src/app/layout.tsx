import "./globals.css";
import type { Metadata } from "next";
import Providers from "../components/ProgressBarProvider";
import { Poppins, Kantumruy_Pro } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import { appDescriptions, appName } from "@lib/data";
import { FloatingNav } from "@components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";

const poppins = Poppins({
    variable: "--font-poppins",
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

const kantumruyPro = Kantumruy_Pro({
    variable: "--font-kantumruy",
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'),
    title: appName,
    description: appDescriptions,
    keywords: ["leatsophat.me", "leat sophat", "sophat", "pphatdev", "pphat", "phat", "sophat", "leat", "sophat leat", "sophat dev"],
    icons: [
        {
            url: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon",
        },
        {
            url: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon"
        },
    ],
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        images: [
            {
                url: '/assets/screenshots/origin-dark.png',
                width: 1900,
                height: 926,
                alt: appName
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/assets/screenshots/origin-dark.png']
    }
};

export const viewport = {
    themeColor: "#ffffff",
    backgroundColor: "#ffffff",
    initialScale: "1.0",
    display: "standalone",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "About",
            link: "/?",
            icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Contact",
            link: "/?",
            icon: (
                <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
            ),
        },
    ];
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} ${kantumruyPro.variable} antialiased p-0 m-0`}>
                <ThemeProvider attribute="class" enableSystem defaultTheme="system">
                    <Providers>
                        <FloatingNav navItems={navItems} />
                        {children}
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
