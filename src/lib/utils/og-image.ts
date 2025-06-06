/**
 * Utility functions for generating OpenGraph image URLs
 */

import { NEXT_PUBLIC_APP_URL } from "@lib/constants";

type OgImageParams = {
    title?: string;
    subtitle?: string;
    description?: string;
};

/**
 * Generates an OpenGraph image URL with the specified parameters
 */
export function getOgImageUrl({
    title = 'Leat Sophat',
    subtitle = 'Frontend Developer',
    description = 'Portfolio & Personal Website',
}: OgImageParams = {}): string {
    const params = new URLSearchParams();

    if (title) params.append('title', title);
    if (subtitle) params.append('subtitle', subtitle);
    if (description) params.append('description', description);

    const baseUrl = NEXT_PUBLIC_APP_URL;
    return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Generates OpenGraph image metadata for a page
 */
export function getOgImageMetadata({
    title,
    subtitle,
    description,
}: OgImageParams = {}): { url: string; width: number; height: number; alt: string } {
    return {
        url: getOgImageUrl({ title, subtitle, description }),
        width: 1200,
        height: 630,
        alt: title || 'Leat Sophat - Portfolio & Personal Website',
    };
}