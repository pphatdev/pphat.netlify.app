'use client';

import React from 'react';
import Script from 'next/script';
import { PERSON_NAME, PERSON_JOB_TITLE } from '../lib/constants';

/**
 * This component adds special meta tags and scripts to help with Google indexing
 * It provides additional signals to Google that the site is ready for indexing
 */
export default function GoogleIndexingVerification() {
    return (
        <>
            {/* Google Indexing-specific meta tags */}
            <meta name="google-site-verification" content="googleff785c31669eafd5" />
            <meta name="googlebot" content="index,follow" />
            <meta name="googlebot-news" content="index,follow" />

            {/* Instruct Google to render the page with JavaScript enabled */}
            <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

            {/* Structured data script for better search visibility */}
            <Script id="google-indexing-helper" type="application/ld+json">
                {`{
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "url": "https://pphat.top/",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://pphat.top/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                }`}
            </Script>
            <Script id="person-structured-data" type="application/ld+json">
                {`{
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": "${PERSON_NAME}",
                    "jobTitle": "${PERSON_JOB_TITLE}",
                    "url": "https://pphat.top/",
                    "sameAs": [
                    "https://github.com/pphatdev",
                    "https://kh.linkedin.com/in/pphatdev",
                    "https://x.com/pphatdev",
                    "https://figma.com/@PPhat"
                    ]
                }`}
            </Script>
        </>
    );
}
