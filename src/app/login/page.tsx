import { LoginForm } from '@components/login-form';

export default async function LoginPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(110,231,183,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.04),transparent_45%)] px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
                <LoginForm className="w-full max-w-4xl" />
            </div>
        </main>
    );
}