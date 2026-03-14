import { Metadata } from 'next';

// This provides a base metadata for gallery dynamic routes
export const metadata: Metadata = {
    title: `Gallery Item`,
    description: 'View this gallery item from my photo collection.',
    robots: {
        index: true,
        follow: true
    }
};

export default function GalleryItemLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (<> {children} </>);
}
