import React from 'react';
import {
    NEXT_PUBLIC_APP_URL,
    appName,
    PERSON_NAME,
    PERSON_ALTERNATE_NAME,
    PERSON_JOB_TITLE,
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
    FIGMA_URL
} from '@lib/constants';

interface OrganizationStructuredDataProps {
    type?: 'Organization' | 'ProfessionalService' | 'LocalBusiness';
    description?: string;
    foundingDate?: string;
    employees?: number;
    services?: string[];
    areas?: string[];
}

export default function OrganizationStructuredData({
    type = 'ProfessionalService',
    description,
    foundingDate = '2021-01-01',
    employees = 1,
    services = [
        'Web Development',
        'Frontend Development',
        'UI/UX Design',
        'React Development',
        'Next.js Development',
        'TypeScript Development'
    ],
    areas = [
        'Phnom Penh',
        'Cambodia',
        'Southeast Asia'
    ]
}: OrganizationStructuredDataProps) {
    const organizationDescription = description ||
        `${COMPANY_NAME || appName} is a professional web development service led by ${PERSON_NAME} (${PERSON_ALTERNATE_NAME}). ` +
        `Specializing in modern web development with expertise in React, Next.js, TypeScript, and UI/UX design. ` +
        `Based in ${ADDRESS_LOCALITY}, ${ADDRESS_COUNTRY}.`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": type,
        "@id": `${NEXT_PUBLIC_APP_URL}#organization`,
        "name": COMPANY_NAME || appName,
        "alternateName": PERSON_ALTERNATE_NAME,
        "description": organizationDescription,
        "url": COMPANY_URL || NEXT_PUBLIC_APP_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${NEXT_PUBLIC_APP_URL}/assets/logo/logo-solid-dark-mode.png`,
            "width": 200,
            "height": 200
        },
        "image": {
            "@type": "ImageObject",
            "url": `${NEXT_PUBLIC_APP_URL}/assets/logo/logo-solid-dark-mode.png`,
            "width": 400,
            "height": 400
        },
        "foundingDate": foundingDate,
        "founder": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`,
            "name": PERSON_NAME,
            "alternateName": PERSON_ALTERNATE_NAME,
            "jobTitle": PERSON_JOB_TITLE
        },
        "employee": {
            "@type": "Person",
            "@id": `${NEXT_PUBLIC_APP_URL}#person`,
            "name": PERSON_NAME,
            "jobTitle": PERSON_JOB_TITLE
        },
        "numberOfEmployees": employees,
        "address": {
            "@type": "PostalAddress",
            "@id": `${NEXT_PUBLIC_APP_URL}#address`,
            "streetAddress": ADDRESS_STREET,
            "addressLocality": ADDRESS_LOCALITY,
            "addressRegion": ADDRESS_REGION,
            "postalCode": ADDRESS_POSTAL_CODE,
            "addressCountry": ADDRESS_COUNTRY
        },
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": CONTACT_PHONE,
                "email": CONTACT_EMAIL,
                "contactType": "Customer Service",
                "availableLanguage": ["English", "Khmer"]
            },
            {
                "@type": "ContactPoint",
                "email": CONTACT_EMAIL,
                "contactType": "Technical Support",
                "availableLanguage": ["English", "Khmer"]
            }
        ],
        "sameAs": [
            GITHUB_URL,
            LINKEDIN_URL,
            TWITTER_URL,
            FIGMA_URL,
            NEXT_PUBLIC_APP_URL
        ].filter(Boolean),
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Web Development Services",
            "itemListElement": services.map((service, index) => ({
                "@type": "Offer",
                "position": index + 1,
                "name": service,
                "description": `Professional ${service.toLowerCase()} services`,
                "category": "Web Development"
            }))
        },
        "serviceArea": areas.map(area => ({
            "@type": "Place",
            "name": area
        })),
        "knowsAbout": [
            "Web Development",
            "Frontend Development",
            "UI/UX Design",
            "React",
            "Next.js",
            "TypeScript",
            "JavaScript",
            "TailwindCSS",
            "Responsive Design",
            "Modern Web Technologies"
        ],
        "areaServed": {
            "@type": "Country",
            "name": ADDRESS_COUNTRY
        },
        "parentOrganization": {
            "@type": "Organization",
            "name": "Independent Developer",
            "description": "Freelance Web Development Services"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "1",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "Professional Client"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
            },
            "reviewBody": "Excellent web development services with modern technologies and professional approach."
        },
        "priceRange": "$$",
        "paymentAccepted": ["Credit Card", "Bank Transfer", "PayPal"],
        "currenciesAccepted": "USD",
        "openingHours": "Mo-Fr 09:00-18:00",
        "telephone": CONTACT_PHONE,
        "email": CONTACT_EMAIL,
        "vatID": null,
        "taxID": null,
        "naics": "541511", // Custom Computer Programming Services
        "isicV4": "6201", // Computer programming activities
        "memberOf": {
            "@type": "Organization",
            "name": "Professional Developers Community"
        },
        "award": [
            "Modern Web Development Expertise",
            "Professional Service Quality"
        ],
        "brand": {
            "@type": "Brand",
            "name": COMPANY_NAME || appName,
            "logo": `${NEXT_PUBLIC_APP_URL}/assets/logo/logo-solid-dark-mode.png`
        },
        "owns": {
            "@type": "WebSite",
            "@id": `${NEXT_PUBLIC_APP_URL}#website`,
            "name": `${PERSON_NAME} - ${PERSON_JOB_TITLE}`,
            "url": NEXT_PUBLIC_APP_URL
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}