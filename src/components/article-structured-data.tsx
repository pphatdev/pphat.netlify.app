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

    const plainTextContent = getPlainTextContent(content);
    const wordCount = plainTextContent.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Assume 200 words per minute

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${NEXT_PUBLIC_APP_URL}/posts/${slug}`,
        "headline": title,
        "description": description,
        "url": `${NEXT_PUBLIC_APP_URL}/posts/${slug}`,
        "datePublished": createdAt,
        "dateModified": updatedAt || createdAt,
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
            "image": {
                "@type": "ImageObject",
                "url": thumbnail,
                "width": 1200,
                "height": 630
            }
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