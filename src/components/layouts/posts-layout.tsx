import { Metadata } from 'next';
import postsMeta from '@lib/meta/posts';

export const metadata: Metadata = postsMeta;

export default function PostsLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (<> {children} </>);
}
