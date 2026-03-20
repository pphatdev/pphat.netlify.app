/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { NEXT_PUBLIC_APP_URL, appName } from '@lib/constants';

interface Author {
    name: string;
    profile: string;
    url: string;
}

interface ArticleStructuredDataProps {
    title: string;
    description: string;
    slug: string;
    thumbnail?: string;
    authors: Author[];
    tags: string[];
    createdAt: string;
    updatedAt?: string;
    content: string;
}

export default function ArticleStructuredData({
    title,
    description,
    slug,
    thumbnail,
    authors,
    tags,
    createdAt,
    updatedAt,
    content
}: ArticleStructuredDataProps) {
    // Extract plain text from JSON content for wordCount
    const getPlainTextContent = (jsonContent: string): string => {
        try {
            const parsed = JSON.parse(jsonContent);
            const extractText = (node: any): string => {
                if (node.type === 'text') {
                    return node.text || '';
                }
                if (node.content && Array.isArray(node.content)) {
                    return node.content.map(extractText).join(' ');
                }
                return '';
            };
            return extractText(parsed);
        } catch {
            return content;
        }
    };

    // Extract all blog gallery images from content
    const extractGalleryImages = (jsonContent: string): string[] => {
        try {
            const parsed = JSON.parse(jsonContent);
            const images: string[] = [];

            const extractImages = (node: any) => {
                if (node.type === 'image' && node.attrs?.src) {
                    images.push(node.attrs.src);
                }
                if (node.content && Array.isArray(node.content)) {
                    node.content.forEach(extractImages);
                }
            };

            extractImages(parsed);
            return images;
        } catch {
            return [];
        }
    };

    const formatDateTimeWithOffset = (dateInput: string): string => {
        const date = new Date(dateInput);

        if (Number.isNaN(date.getTime())) {
            return dateInput;
        }

        const pad = (value: number): string => String(value).padStart(2, '0');
        const offsetMinutes = -date.getTimezoneOffset();
        const sign = offsetMinutes >= 0 ? '+' : '-';
        const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
        const offsetRemainderMinutes = pad(Math.abs(offsetMinutes) % 60);

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${offsetHours}:${offsetRemainderMinutes}`;
    };

    const plainTextContent = getPlainTextContent(content);
    const galleryImages = extractGalleryImages(content);
    const wordCount = plainTextContent.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Assume 200 words per minute
    const publishedDate = formatDateTimeWithOffset(createdAt);
    const modifiedDate = formatDateTimeWithOffset(updatedAt || createdAt);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${NEXT_PUBLIC_APP_URL}/posts/${slug}`,
        "headline": title,
        "description": description,
        "url": `${NEXT_PUBLIC_APP_URL}/posts/${slug}`,
        "datePublished": publishedDate,
        "dateModified": modifiedDate,
        "wordCount": wordCount,
        "timeRequired": `PT${readingTime}M`,
        "articleBody": plainTextContent.substring(0, 500) + (plainTextContent.length > 500 ? '...' : ''),
        "keywords": tags.join(', '),
        "articleSection": "Technology",
        "inLanguage": "en-US",
        "author": authors.map(author => ({
            "@type": "Person",
            "name": author.name,
            "url": author.url,
            "image": author.profile
        })),
        "publisher": {
            "@type": "Person",
            "name": appName,
            "url": NEXT_PUBLIC_APP_URL,
            "logo": {
                "@type": "ImageObject",
                "url": `${NEXT_PUBLIC_APP_URL}/assets/logo/logo-solid-dark-mode.png`,
                "width": 200,
                "height": 200
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${NEXT_PUBLIC_APP_URL}/posts/${slug}`
        },
        "isPartOf": {
            "@type": "Blog",
            "@id": `${NEXT_PUBLIC_APP_URL}/posts`,
            "name": `${appName} Blog`,
            "url": `${NEXT_PUBLIC_APP_URL}/posts`
        },
        ...(thumbnail && {
            "image": [
                {
                    "@type": "ImageObject",
                    "url": thumbnail,
                    "width": 1200,
                    "height": 630,
                    "description": `${title} - Cover Image`
                },
                ...galleryImages.map((img, idx) => ({
                    "@type": "ImageObject",
                    "url": img.startsWith('http') ? img : `${NEXT_PUBLIC_APP_URL}${img}`,
                    "width": 1200,
                    "height": 630,
                    "description": `${title} - Gallery Image ${idx + 1}`
                }))
            ]
        }),
        "about": [
            {
                "@type": "Thing",
                "name": "Web Development"
            },
            {
                "@type": "Thing",
                "name": "Programming"
            },
            ...tags.map(tag => ({
                "@type": "Thing",
                "name": tag
            }))
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}