'use client';

import React from 'react';
import { appName, currentDomain } from '@lib/data';

export default function AboutStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "Person",
            "name": "Leat Sophat",
            "alternateName": "PPhat",
            "description": "Senior Front-end Developer and Freelance UI/UX Designer from Phnom Penh, Cambodia",
            "jobTitle": "Senior Front-end Developer",
            "worksFor": {
                "@type": "Organization",
                "name": "TURBOTECH CO., LTD"
            },
            "url": `${currentDomain}/about`,
            "sameAs": [
                "https://github.com/leatsophat",
                "https://www.linkedin.com/in/leatsophat/"
            ]
        },
        "name": `About ${appName}`,
        "description": "I'm Leat Sophat (PPhat), a Senior Front-end Developer and Freelance UI/UX Designer from Phnom Penh, Cambodia.",
        "url": `${currentDomain}/about`
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
