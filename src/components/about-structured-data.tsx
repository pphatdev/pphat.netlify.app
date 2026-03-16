import React from 'react';
import {
    appName,
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
    COMPANY_NAME,
    GITHUB_URL,
    LINKEDIN_URL
} from '@lib/constants';

export default function AboutStructuredData() {
    const personImageUrl = `${NEXT_PUBLIC_APP_URL}${PERSON_IMAGE}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${NEXT_PUBLIC_APP_URL}/about`,
        "name": `About ${appName}`,
        "description": `I'm ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}), a ${PERSON_JOB_TITLE}.`,
        "url": `${NEXT_PUBLIC_APP_URL}/about`,
        "mainEntityOfPage": `${NEXT_PUBLIC_APP_URL}/about`,
        "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": personImageUrl,
            "contentUrl": personImageUrl,
            "caption": `${PERSON_NAME} profile photo`
        },
        "image": {
            "@type": "ImageObject",
            "url": personImageUrl,
            "contentUrl": personImageUrl,
            "caption": `${PERSON_NAME} profile photo`
        },
        "dateCreated": "2021-01-01T00:00:00Z",
        "dateModified": new Date().toISOString(),
        "mainEntity": {
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
            "description": `I'm ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}), a ${PERSON_JOB_TITLE}.`,
            "jobTitle": PERSON_JOB_TITLE,
            "image": {
                "@type": "ImageObject",
                "url": personImageUrl,
                "contentUrl": personImageUrl,
                "caption": `${PERSON_NAME} profile photo`
            },
            "worksFor": {
                "@type": "Organization",
                "name": COMPANY_NAME,
            },
            "url": `${NEXT_PUBLIC_APP_URL}/about`,
            "sameAs": [
                GITHUB_URL,
                LINKEDIN_URL
            ]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
