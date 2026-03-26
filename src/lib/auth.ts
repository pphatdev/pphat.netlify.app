import { cookies } from 'next/headers';
import { NEXT_PUBLIC_API } from '@lib/constants';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    const res = await fetch(`${NEXT_PUBLIC_API}/v1/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Prevent caching for auth requests
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}
