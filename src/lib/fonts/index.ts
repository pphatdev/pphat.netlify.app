import { Aladin, Kantumruy_Pro, Poppins, Srisakdi } from "next/font/google";

export const aladin = Aladin({
    variable: "--font-aladin",
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const srisakdi = Srisakdi({
    variable: "--font-srisakdi",
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const poppins = Poppins({
    variable: "--font-poppins",
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const kantumruyPro = Kantumruy_Pro({
    variable: "--font-kantumruy",
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
});
