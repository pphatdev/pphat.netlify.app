'use client';

import React from 'react';
import {
    NEXT_PUBLIC_APP_URL,
    PERSON_NAME,
    PERSON_ALTERNATE_NAME,
    PERSON_JOB_TITLE,
    PERSON_IMAGE,
    CONTACT_EMAIL,
    CONTACT_PHONE,
    ADDRESS_STREET,
    ADDRESS_LOCALITY,
    ADDRESS_REGION,
    ADDRESS_POSTAL_CODE,
    ADDRESS_COUNTRY,
    COMPANY_NAME,
    COMPANY_URL,
    GITHUB_URL,
    LINKEDIN_URL,
    TWITTER_URL,
    FIGMA_URL,
    UNIVERSITY_NAME
} from '@lib/constants';

export default function HomePersonStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${NEXT_PUBLIC_APP_URL}#person`,
        "name": PERSON_NAME,
        "alternateName": PERSON_ALTERNATE_NAME,
        "jobTitle": PERSON_JOB_TITLE,
        "url": NEXT_PUBLIC_APP_URL,
        "image": `${NEXT_PUBLIC_APP_URL}${PERSON_IMAGE}`,
        "email": `mailto:${CONTACT_EMAIL}`,
        "telephone": CONTACT_PHONE,
        "address": {
            "@type": "PostalAddress",
            "@id": `${NEXT_PUBLIC_APP_URL}#address`,
            "streetAddress": ADDRESS_STREET,
            "addressLocality": ADDRESS_LOCALITY,
            "addressRegion": ADDRESS_REGION,
            "postalCode": ADDRESS_POSTAL_CODE,
            "addressCountry": ADDRESS_COUNTRY
        },
        "colleague": [
            `${COMPANY_URL}team`,
            GITHUB_URL
        ],
        "sameAs": [
            GITHUB_URL,
            `${GITHUB_URL.replace('github.com', 'pphatdev.github.io')}`,
            NEXT_PUBLIC_APP_URL,
            FIGMA_URL,
            LINKEDIN_URL,
            TWITTER_URL
        ],
        "knowsAbout": [
            "Web Development",
            "Front-end Development",
            "UI/UX Design",
            "JavaScript",
            "TypeScript",
            "React",
            "Next.js",
            "TailwindCSS",
            "Node.js"
        ],
        "worksFor": {
            "@type": "Organization",
            "name": COMPANY_NAME,
            "url": COMPANY_URL
        },
        "homeLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": ADDRESS_LOCALITY,
                "addressRegion": ADDRESS_REGION,
                "addressCountry": ADDRESS_COUNTRY
            }
        },
        "nationality": {
            "@type": "Country",
            "name": "Cambodia"
        },
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": UNIVERSITY_NAME
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.parse(JSON.stringify(structuredData))
            }}
        />
    );
}
