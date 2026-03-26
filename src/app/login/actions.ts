'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NEXT_PUBLIC_API } from '@lib/constants';

export type LoginState = {
    error?: string;
} | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
        return { error: 'Email and password are required.' };
    }

    let data: { data?: { token: string }; message?: string };

    try {
        const res = await fetch(`${NEXT_PUBLIC_API}/v1/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok && res.status !== 401) {
            return { error: `Auth service returned ${res.status}.` };
        }

        data = await res.json();
    } catch {
        return { error: 'Network error — unable to reach the auth service.' };
    }

    if (!data?.data?.token) {
        return { error: data?.message ?? 'Invalid email or password.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect('/admin');
}

export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Best-effort server-side invalidation
    if (token) {
        try {
            await fetch(`${NEXT_PUBLIC_API}/v1/api/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // Ignore — we'll clear the cookie regardless
        }
    }

    cookieStore.delete('auth_token');
    redirect('/login');
}
