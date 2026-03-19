import React from 'react';
import Script from 'next/script';
import { PERSON_NAME, PERSON_JOB_TITLE } from '../lib/constants';

/**
 * Server component: adds meta tags and structured data scripts for Google indexing.
 */
export default function GoogleIndexingVerification() {
    return (
        <>
            <meta name="google-site-verification" content="googleff785c31669eafd5" />
            <meta name="googlebot" content="index,follow" />
            <meta name="googlebot-news" content="index,follow" />
            <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />


            <Script id="person-structured-data" type="application/ld+json" strategy="afterInteractive">
                {`{
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": "${PERSON_NAME}",
                    "jobTitle": "${PERSON_JOB_TITLE}",
                    "url": "https://pphat.me/",
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
