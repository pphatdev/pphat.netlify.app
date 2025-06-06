import React from 'react';
import { appName, NEXT_PUBLIC_APP_URL } from '@lib/constants';

export default function ProjectsStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "url": `${NEXT_PUBLIC_APP_URL}/projects`,
                    "name": `${appName} Projects Portfolio`,
                    "description": "A collection of web development projects created by Leat Sophat (PPhat)"
                }
            ]
        },
        "name": `${appName} Projects`,
        "description": "Explore my portfolio of web development projects and applications.",
        "url": `${NEXT_PUBLIC_APP_URL}/projects`
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
