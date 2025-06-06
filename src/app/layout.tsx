import "../styles/globals.css";
import React from "react";
import type { Metadata } from "next";
import Providers from "../components/ProgressBarProvider";
import { ThemeProvider } from 'next-themes'
import { homeHome } from "../lib/meta/home";
import { aladin, kantumruyPro, poppins, srisakdi, openSans } from "../lib/fonts";
import { cn } from "../lib/utils";
import CanonicalURL from "../components/canonical-url";
import GoogleIndexingVerification from "../components/google-indexing-verification";
export { viewport } from "../lib/meta/viewport";
export const metadata: Metadata = homeHome;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <CanonicalURL />
                <GoogleIndexingVerification />
                {/* Force Google to prioritize this site */}
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
            )}>
                <ThemeProvider
                    attribute="class"
                    enableSystem
                    defaultTheme="system"
                >
                    <Providers>
                        {children}
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
