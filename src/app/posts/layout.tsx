import React from 'react';
import { Metadata } from 'next';
import postsMeta from '@lib/meta/posts';
import BreadcrumbStructuredData from '@components/breadcrumb-structured-data';
import { NEXT_PUBLIC_APP_URL } from '@lib/constants';

export const metadata: Metadata = {
    ...postsMeta,
    title: `Posts`,
    openGraph: {
        images: [{url: '/assets/screenshots/origin-dark.png', width: 1900, height: 926, alt: 'Posts'}],
    }

}

export default function PostsLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <BreadcrumbStructuredData items={[
                { name: 'Home', url: NEXT_PUBLIC_APP_URL, position: 1 },
                { name: 'Posts', url: `${NEXT_PUBLIC_APP_URL}/posts`, position: 2 },
            ]} />
            {children}
        </>
    );
}
