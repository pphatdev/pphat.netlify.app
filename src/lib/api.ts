import { NEXT_PUBLIC_API } from "./constants";

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
