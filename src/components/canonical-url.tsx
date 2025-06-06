'use client';

import { usePathname } from 'next/navigation';
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

        // Always use pphat.top as the canonical domain
        const canonicalDomain = 'https://pphat.top';
        
        setCanonicalURL(`${canonicalDomain}${path}`);
    }, [pathname]);

    if (!canonicalURL) return null;

    return <link rel="canonical" href={canonicalURL} />;
}
