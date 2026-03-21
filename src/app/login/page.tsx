import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from '@components/login-form';
import { buildClearSessionRedirectPath, getServerAuthSession, hasNextAuthSessionCookies } from '@lib/auth';

interface LoginPageProps {
    searchParams: Promise<{ callbackUrl?: string; error?: string; }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const session = await getServerAuthSession();
    const params = await searchParams;
    const cookieStore = await cookies();

    if (!session?.user && hasNextAuthSessionCookies(cookieStore)) {
        redirect(buildClearSessionRedirectPath(`/login?callbackUrl=${encodeURIComponent(params.callbackUrl || '/admin')}`));
    }

    if (session?.user) {
        redirect(params.callbackUrl || '/admin');
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(110,231,183,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.04),transparent_45%)] px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
                <LoginForm
                    mode="login"
                    callbackUrl={params.callbackUrl || '/admin'}
                    githubEnabled={Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET)}
                    error={params.error}
                    className="w-full max-w-4xl"
                />
            </div>
        </main>
    );
}