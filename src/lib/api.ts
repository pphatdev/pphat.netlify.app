import { NEXT_PUBLIC_API } from "./constants";
import { redirect } from 'next/navigation';

export async function fetchFromApi(path: string, options: RequestInit = {}, token?: string) {
    const url = `${NEXT_PUBLIC_API}${path.startsWith('/') ? '' : '/'}${path}`;

    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            const { headers } = await import('next/headers');
            const headersList = await headers();
            const referer = headersList.get('referer');
            let callbackUrl = '/admin';
            try {
                if (referer) callbackUrl = new URL(referer).pathname;
            } catch { /* fallback */ }
            redirect(`/login?error=SessionExpired&callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }

        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
    }

    return response.json();
}
