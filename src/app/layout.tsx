import "../styles/globals.css";
import React from "react";
import type { Metadata } from "next";
import Providers from "../components/ProgressBarProvider";
import { ThemeProvider } from 'next-themes'
import { homeHome } from "@lib/meta/home";
import { aladin, kantumruyPro, poppins, srisakdi, openSans } from "@lib/fonts";
import { cn } from "@lib/utils";
import CanonicalURL from "@components/canonical-url";
export { viewport } from "@lib/meta/viewport";
export const metadata: Metadata = homeHome;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <CanonicalURL />
            </head>
            <body className={cn(
                openSans.variable,
                poppins.variable,
                kantumruyPro.variable,
                aladin.variable,
                srisakdi.variable,
                "font-default antialiased"
            )}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
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
