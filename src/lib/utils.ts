import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NEXT_PUBLIC_APP_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getBaseUrl = (): string => {
    const raw = NEXT_PUBLIC_APP_URL.trim();
    const parsed = new URL(raw);
    if (parsed.hostname.startsWith('www.')) {
        parsed.hostname = parsed.hostname.slice(4);
    }
    return parsed.toString().replace(/\/$/, '');
}