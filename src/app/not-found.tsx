import { Metadata } from 'next';
import { appName, NEXT_PUBLIC_APP_URL } from '@lib/constants';
import Link from 'next/link';

export const metadata: Metadata = {
    title: `Not Found | ${appName}`,
    description: 'The page you were looking for could not be found.',
    openGraph: {
        title: `Not Found | ${appName}`,
        description: 'The page you were looking for could not be found.',
        url: NEXT_PUBLIC_APP_URL,
        images: [{
            url: NEXT_PUBLIC_APP_URL + "/assets/avatars/hero.webp",
        }],
    }
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-5">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6">The page you are looking for does not exist or has been moved.</p>
            <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md transition-colors hover:bg-primary/80">
                Return Home
            </Link>
        </div>
    );
}
