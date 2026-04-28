import { NEXT_PUBLIC_APP_URL, PERSON_ALTERNATE_NAME, PERSON_JOB_TITLE, PERSON_NAME } from '@lib/constants';

export default function WebsiteStructuredData() {
    const websiteImage = `${NEXT_PUBLIC_APP_URL}/assets/screenshots/home-dark.png`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${NEXT_PUBLIC_APP_URL}#website`,
        "name": `${PERSON_NAME} - ${PERSON_JOB_TITLE}`,
        "alternateName": PERSON_ALTERNATE_NAME,
        "url": NEXT_PUBLIC_APP_URL,
        "image": websiteImage,
        "description": `Portfolio of ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}), ${PERSON_JOB_TITLE} from Phnom Penh, Cambodia. Explore projects, technical articles, and professional experience.`,
        "inLanguage": "en-US",
        "author": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`,
            "name": PERSON_NAME
        },
        "creator": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`,
            "name": PERSON_NAME
        },
        "publisher": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`,
            "name": PERSON_NAME
        },
        "copyrightHolder": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`,
            "name": PERSON_NAME
        },
        "copyrightYear": new Date().getFullYear().toString(),
        "potentialAction": [
            {
                "@type": "SearchAction",
                "name": "Search Blog Posts",
                "target": `${NEXT_PUBLIC_APP_URL}/posts?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            },
            {
                "@type": "SearchAction",
                "name": "Search Projects",
                "target": `${NEXT_PUBLIC_APP_URL}/projects?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        ],
        "mainEntity": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`
        }
    };

    return (
        <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
        />
    );
}
