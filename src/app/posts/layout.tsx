import { Metadata } from 'next';
import postsMeta from '@lib/meta/posts';

export const metadata: Metadata = {
    ...postsMeta,
    title: `Posts | ${postsMeta.title}`,
    openGraph: {
        images: [{url: '/assets/screenshots/origin-dark.png', width: 1900, height: 926, alt: 'Posts'}],
    }

}

export default function PostsLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (<> {children} </>);
}
