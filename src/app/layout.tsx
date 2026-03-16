import "../styles/globals.css";
import React from "react";
import type { Metadata } from "next";
import Providers from "../components/ProgressBarProvider";
import { ThemeProvider } from 'next-themes'
import { homeHome } from "../lib/meta/home";
import { aladin, kantumruyPro, poppins, srisakdi, openSans } from "../lib/fonts";
import { cn } from "../lib/utils";
import GoogleIndexingVerification from "../components/google-indexing-verification";
import { GITHUB_URL, LINKEDIN_URL, NEXT_PUBLIC_APP_URL, PERSON_IMAGE, TWITTER_URL } from "@lib/constants";
export { viewport } from "../lib/meta/viewport";
export const metadata: Metadata = homeHome;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&display=swap"
                />
                <link rel="dns-prefetch" href="https://pphat.me" />
                <GoogleIndexingVerification />
                <link rel="me" href={GITHUB_URL} />
                <link rel="me" href={LINKEDIN_URL} />
                <link rel="me" href={TWITTER_URL} />
                <link rel="image_src" href={`${NEXT_PUBLIC_APP_URL}${PERSON_IMAGE}`} />
                <link rel="alternate" type="application/rss+xml" title="PPhat Dev RSS" href="https://pphat.me/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title="PPhat Dev Atom" href="https://pphat.me/atom.xml" />
                <link rel="alternate" type="application/feed+json" title="PPhat Dev JSON Feed" href="https://pphat.me/feed.json" />
                <meta name="priority" content="1.0" />
                <meta name="revisit-after" content="1 day" />
            </head>
            <body className={cn(
                poppins.variable,
                kantumruyPro.variable,
                aladin.variable,
                srisakdi.variable,
                openSans.variable,
                `antialiased p-0 m-0 font-sans bg-body`
            )} style={{ overflowX: 'hidden' }}>
                <ThemeProvider
                    attribute="class"
                    enableSystem
                    defaultTheme="system"
                    disableTransitionOnChange
                >
                    <Providers>
                        {children}
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
