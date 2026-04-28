import React from 'react';
import {
    NEXT_PUBLIC_APP_URL,
    PERSON_NAME,
    PERSON_ALTERNATE_NAME,
    PERSON_RELEGIEN_NAME,
    PERSON_SHORT_NAME,
    PERSON_NAME_VARIANTS,
    PERSON_GIVEN_NAME,
    PERSON_FAMILY_NAME,
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
    const profileImageUrl = `${NEXT_PUBLIC_APP_URL}${PERSON_IMAGE}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${NEXT_PUBLIC_APP_URL}#person`,
        "name": PERSON_NAME,
        "givenName": PERSON_GIVEN_NAME,
        "familyName": PERSON_FAMILY_NAME,
        "alternateName": Array.from(new Set([
            PERSON_RELEGIEN_NAME,
            PERSON_ALTERNATE_NAME,
            PERSON_SHORT_NAME,
            ...PERSON_NAME_VARIANTS
        ])),
        "additionalName": PERSON_ALTERNATE_NAME,
        "jobTitle": PERSON_JOB_TITLE,
        "description": `${PERSON_NAME} (${PERSON_ALTERNATE_NAME}) is the creator of pphat.me and a ${PERSON_JOB_TITLE} based in Phnom Penh, Cambodia.`,
        "url": NEXT_PUBLIC_APP_URL,
        "image": {
            "@type": "ImageObject",
            "url": profileImageUrl,
            "contentUrl": profileImageUrl,
            "caption": `${PERSON_NAME} profile photo`
        },
        "mainEntityOfPage": `${NEXT_PUBLIC_APP_URL}/about`,
        "subjectOf": `${NEXT_PUBLIC_APP_URL}/about`,
        "hasCredential": [
            "Senior Front-end Developer",
            "Freelance UI/UX Designer"
        ],
        "owns": {
            "@type": "WebSite",
            "@id": `${NEXT_PUBLIC_APP_URL}#website`
        },
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
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData)
            }}
        />
    );
}
