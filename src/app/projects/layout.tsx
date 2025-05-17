import { Metadata } from 'next';
import { projectsMeta } from '@lib/meta/projects';

export const metadata: Metadata = projectsMeta;

export default function ProjectsLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (<> {children} </>);
}
