'use client';

import React from 'react';
import { currentDomain, PERSON_ALTERNATE_NAME, PERSON_JOB_TITLE, PERSON_NAME } from '@lib/constants';

export default function WebsiteStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${currentDomain}#website`,
        "name": `${PERSON_NAME} - ${PERSON_JOB_TITLE}`,
        "alternateName": "PPhat Dev",
        "url": currentDomain,
        "description": `Portfolio of ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}), ${PERSON_JOB_TITLE} from Phnom Penh, Cambodia. Showcasing web development projects, skills, and professional experience.`,
        "inLanguage": "en-US",
        "publisher": {
            "@type": "Person",
            "@id": `${currentDomain}#person`,
            "name": PERSON_NAME
        },
        "copyrightHolder": {
            "@type": "Person",
            "@id": `${currentDomain}#person`,
            "name": PERSON_NAME
        },
        "copyrightYear": new Date().getFullYear().toString(),
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${currentDomain}/?search={search_term_string}`,
            "query-input": "required name=search_term_string"
        },
        "mainEntity": {
            "@type": "Person",
            "@id": `${currentDomain}#person`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
