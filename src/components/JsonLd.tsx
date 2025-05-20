'use client';

import { appDescriptions, appName, appPositions, appTitle, currentDomain } from "@lib/constants";
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
                    "@type": "Authorship",
                    "author": {
                        "@type": "Person",
                        "name": appName,
                        "url": currentDomain,
                        "image": `${currentDomain}/assets/avatars/hero.webp`,
                        "jobTitle": appPositions[0],
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Street 123",
                            "addressLocality": "Sangkat Kamboul",
                            "addressRegion": "Phnom Penh",
                            "postalCode": "120905",
                            "addressCountry": "KH"
                        },
                        "telephone": "+855-96-918-3363",
                        "sameAs": [
                            "https://github.com/pphatdev",
                            "https://pphatdev.github.io",
                            currentDomain,
                            "https://figma.com/@PPhat",
                            "https://kh.linkedin.com/in/pphatdev",
                            "https://x.com/pphatdev",
                        ]
                    },
                    "headline": appName,
                    "description": appDescriptions,
                    "image": `${currentDomain}/assets/screenshots/origin-dark.png`,
                    "url": currentDomain,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": currentDomain
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": appTitle,
                        "url": currentDomain,
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${currentDomain}/assets/logo/logo-solid-dark-mode.png`
                        }
                    },
                    "datePublished": "2020-01-10T00:00:00+00:00",
                    "dateModified": new Date().toISOString(),
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