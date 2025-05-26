'use client';

import React from 'react';
import { currentDomain } from '@lib/constants';

interface BreadcrumbItem {
    name: string;
    url: string;
    position: number;
}

interface BreadcrumbStructuredDataProps {
    items: BreadcrumbItem[];
}

export default function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item) => ({
            "@type": "ListItem",
            "position": item.position,
            "name": item.name,
            "item": {
                "@type": "WebPage",
                "@id": item.url.startsWith('http') ? item.url : `${currentDomain}${item.url}`
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
