'use client';

import React from 'react';
import {
    appName,
    currentDomain,
    PERSON_NAME,
    PERSON_ALTERNATE_NAME,
    PERSON_JOB_TITLE,
    COMPANY_NAME,
    GITHUB_URL,
    LINKEDIN_URL
} from '@lib/constants';

export default function AboutStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "Person",
            "name": PERSON_NAME,
            "alternateName": PERSON_ALTERNATE_NAME,
            "description": `I'm ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}), a ${PERSON_JOB_TITLE}.`,
            "jobTitle": PERSON_JOB_TITLE,
            "worksFor": {
                "@type": "Organization",
                "name": COMPANY_NAME,
            },
            "url": `${currentDomain}/about`,
            "sameAs": [
                GITHUB_URL,
                LINKEDIN_URL
            ]
        },
        "name": `About ${appName}`,
        "description": `I'm ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}), a ${PERSON_JOB_TITLE}.`,
        "url": `${currentDomain}/about`
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
