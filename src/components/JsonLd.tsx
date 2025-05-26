'use client';

import {
    currentDomain,
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
    GITHUB_URL,
    LINKEDIN_URL,
    TWITTER_URL,
    FIGMA_URL
} from "@lib/constants";
import Script from "next/script";

export default function JsonLd() {
    return (
        <Script
            type="application/ld+json"
            id="json-ld"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "@id": `${currentDomain}#person`,
                    "name": PERSON_NAME,
                    "alternateName": PERSON_ALTERNATE_NAME,
                    "jobTitle": PERSON_JOB_TITLE,
                    "url": currentDomain,
                    "image": `${currentDomain}${PERSON_IMAGE}`,
                    "email": `mailto:${CONTACT_EMAIL}`,
                    "telephone": CONTACT_PHONE,
                    "address": {
                        "@type": "PostalAddress",
                        "@id": `${currentDomain}#address`,
                        "streetAddress": ADDRESS_STREET,
                        "addressLocality": ADDRESS_LOCALITY,
                        "addressRegion": ADDRESS_REGION,
                        "postalCode": ADDRESS_POSTAL_CODE,
                        "addressCountry": ADDRESS_COUNTRY
                    },
                    "colleague": [
                        "https://turbotech.com.kh/",
                        "https://github.com/pphatdev"
                    ],
                    "sameAs": [
                        GITHUB_URL,
                        `${GITHUB_URL.replace('github.com', 'pphatdev.github.io')}`,
                        currentDomain,
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
                        "Next.js"
                    ],
                    "worksFor": {
                        "@type": "Organization",
                        "name": "TURBOTECH CO., LTD",
                        "url": "https://turbotech.com.kh/"
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": currentDomain
                    },
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${currentDomain}/?search={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                })
            }}
        />
    );
}