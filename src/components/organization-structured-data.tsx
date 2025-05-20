// import { appName } from '@lib/constants';
import Head from 'next/head';
import JsonLd from './JsonLd';

const OrganizationStructuredData = () => {

    // const url = process.env.NEXT_PUBLIC_APP_URL || 'https://pphat.netlify.app';
    // const logoUrl = `${url}/assets/logo/logo-solid-dark-mode.png`;

    return (
        <Head>
            {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": appName,
                        "url": url,
                        "logo": logoUrl,
                        // "contactPoint": {
                        //     "@type": "ContactPoint",
                        //     "telephone": "+1-800-555-5555",
                        //     "contactType": "Customer Service"
                        // },
                        "sameAs": [
                            "https://pphat.netlify.app",
                            "https://figma.com/PPhat",
                            "https://kh.linkedin.com/in/pphatdev",
                            "https://x.com/pphatdev",
                            // "https://www.facebook.com/phathub.am",
                        ]
                    })
                }}
            /> */}
            <JsonLd/>
        </Head>
    );
};

export default OrganizationStructuredData;