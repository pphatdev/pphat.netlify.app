'use client';

import { usePathname } from 'next/navigation';
import { currentDomain } from '@lib/constants';
import { useEffect, useState } from 'react';

export default function CanonicalURL() {
    const pathname = usePathname();
    const [canonicalURL, setCanonicalURL] = useState('');

    useEffect(() => {
        // Clean the pathname to avoid trailing slashes and handle index routes
        let path = pathname;
        if (path.endsWith('/') && path !== '/') {
            path = path.slice(0, -1);
        }

        // Normalize the domain to ensure it doesn't have a trailing slash
        const domain = currentDomain.endsWith('/')
            ? currentDomain.slice(0, -1)
            : currentDomain;

        setCanonicalURL(`${domain}${path}`);
    }, [pathname]);

    if (!canonicalURL) return null;

    return <link rel="canonical" href={canonicalURL} />;
}
