// import { appName } from '@lib/constants';
import Head from 'next/head';
import JsonLd from './JsonLd';
import { currentDomain } from "@lib/constants";

const OrganizationStructuredData = () => {
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PPhat Development",
        "url": currentDomain,
        "logo": currentDomain + "/assets/logo/logo-solid-dark-mode.png",
        "founder": {
            "@type": "Person",
            "name": "Leat Sophat"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Phnom Penh",
            "addressCountry": "Cambodia"
        },
        "sameAs": [
            "https://twitter.com/pphatdev",
            "https://github.com/pphatdev"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English", "Khmer"]
        }
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
            />
            <JsonLd/>
        </Head>
    );
};

export default OrganizationStructuredData;