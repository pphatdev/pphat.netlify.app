import React from 'react';

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

interface FAQPageStructuredDataProps {
    items: FAQItem[];
}

function reactNodeToString(node: React.ReactNode): string {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(reactNodeToString).join('');
    if (typeof node === 'object' && React.isValidElement(node)) {
        return reactNodeToString((node.props as { children?: React.ReactNode }).children);
    }
    return '';
}

export default function FAQPageStructuredData({ items }: FAQPageStructuredDataProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": reactNodeToString(item.answer)
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
