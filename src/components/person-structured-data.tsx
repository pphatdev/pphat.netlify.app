import { currentDomain } from "@lib/constants";

export default function PersonStructuredData() {
    const personData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Leat Sophat",
        "alternateName": "PPhat",
        "url": currentDomain,
        "image": currentDomain + "/assets/avatars/hero.webp",
        "jobTitle": "Senior Front-end Developer",
        "worksFor": {
            "@type": "Organization",
            "name": "TURBOTECH"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Phnom Penh",
            "addressCountry": "Cambodia"
        },
        "sameAs": [
            "https://twitter.com/pphatdev",
            "https://github.com/pphatdev",
            "https://linkedin.com/in/pphatdev"
        ],
        "knowsAbout": [
            "JavaScript",
            "TypeScript",
            "React",
            "Next.js",
            "UI/UX Design",
            "Web Development"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
        />
    );
}
