'use client';

import { appDescriptions, appName } from "@lib/data";

export default function JsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Authorship",
                    "author": {
                        "@type": "Person",
                        "name": "Sophat LEAT",
                        "url": process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app',
                        "image": `${process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'}/assets/avatars/hero.webp`,
                        "jobTitle": "Senior Frontend Developer",
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
                            "https://pphat.netlify.app",
                            "https://figma.com/PPhat",
                            "https://kh.linkedin.com/in/pphatdev",
                            "https://x.com/pphatdev",
                        ]
                    },
                    "headline": appName,
                    "description": appDescriptions,
                    "image": `${process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'}/assets/screenshots/origin-dark.png`,
                    "url": process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app',
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "PPhat Dev",
                        "url": process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app',
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'}/assets/logo/logo-solid-dark-mode.png`
                        }
                    },
                    "datePublished": "2020-01-10T00:00:00+00:00",
                    "dateModified": "2025-03-04T00:00:00+00:00",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": `${process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app'}/?search={search_term_string}`,
                        "query-input": "required name=search_term_string"
                    }
                })
            }}
        />
    );
}