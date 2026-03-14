"use client";

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface MarkdownImageProps {
    src?: string;
    alt?: string;
    className?: string;
    fallbackSrc?: string;
}

const DEFAULT_FALLBACK_SRC = 'https://cdn.api.pphat.stackdev.cloud/api/image/404.png?fm=webp&w=500';

export function MarkdownImage({ src, alt, className, fallbackSrc = DEFAULT_FALLBACK_SRC }: MarkdownImageProps) {
    const pathname = usePathname();
    const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc);
    const assetApiPath = React.useMemo(() => {
        const [section] = pathname.split('/').filter(Boolean);
        return section === 'projects' ? '/api/project' : '/api/post';
    }, [pathname]);

    const currentSlug = React.useMemo(() => {
        const segments = pathname.split('/').filter(Boolean);
        return segments[segments.length - 1] || '';
    }, [pathname]);

    const resolveImageSrc = React.useCallback((value?: string) => {
        if (!value) {
            return fallbackSrc;
        }

        const trimmed = value.trim();
        if (
            trimmed.startsWith('http://')
            || trimmed.startsWith('https://')
            || trimmed.startsWith('//')
            || trimmed.startsWith('/')
            || trimmed.startsWith('data:')
            || trimmed.startsWith('blob:')
        ) {
            return trimmed;
        }

        if (!currentSlug) {
            return trimmed;
        }

        const asset = trimmed.replace(/^\.\//, '');
        return `${assetApiPath}?slug=${encodeURIComponent(currentSlug)}&asset=${encodeURIComponent(asset)}`;
    }, [assetApiPath, currentSlug, fallbackSrc]);

    React.useEffect(() => {
        setCurrentSrc(resolveImageSrc(src));
    }, [src, resolveImageSrc]);

    const handleError = () => {
        if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
        }
    };

    return (
        <Image
            src={currentSrc}
            alt={alt || 'Image'}
            width={800}
            height={450}
            onError={handleError}
            loading="lazy"
            unoptimized
            className={['w-full sm:p-2 border !mt-0 !rounded-xl h-auto', className].filter(Boolean).join(' ')}
        />
    );
}