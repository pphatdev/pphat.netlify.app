import "./globals.css";
import type { Metadata } from "next";
import Providers from "../components/ProgressBarProvider";
import { ThemeProvider } from 'next-themes'
import { homeHome } from "@lib/meta/home";
import { aladin, kantumruyPro, poppins, srisakdi } from "@lib/fonts";
export { viewport } from "@lib/meta/viewport";
export const metadata: Metadata = homeHome;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            </head>
            <body className={`${poppins.variable} ${kantumruyPro.variable} ${aladin.variable} ${srisakdi.variable} antialiased p-0 m-0`}>
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
