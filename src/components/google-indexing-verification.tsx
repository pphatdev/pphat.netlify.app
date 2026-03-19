import React from 'react';

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
        </>
    );
}
