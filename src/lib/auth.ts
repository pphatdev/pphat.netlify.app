import { createHash } from 'crypto';
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import { z } from 'zod';
import { apiLogin, apiGetMe } from '@lib/api-client';

type SessionUser = DefaultSession['user'] & {
    id: string;
    role: 'admin' | 'editor';
    apiToken?: string;
};

function isSessionUserRole(value: string): value is SessionUser['role'] {
    return value === 'admin' || value === 'editor';
}

const DEVELOPMENT_FALLBACK_SECRET = createHash('sha256')
    .update(`pphat.me:${process.cwd()}`)
    .digest('hex');

export const NEXTAUTH_COOKIE_NAMES = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
    'next-auth.pkce.code_verifier',
    '__Secure-next-auth.pkce.code_verifier',
    'next-auth.state',
    '__Secure-next-auth.state',
] as const;

export const NEXTAUTH_SESSION_COOKIE_NAMES = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
] as const;

function getAuthSecret(): string {
    const configuredSecret = process.env.NEXTAUTH_SECRET?.trim();
    if (configuredSecret) {
        return configuredSecret;
    }

    if (process.env.NODE_ENV !== 'production') {
        return DEVELOPMENT_FALLBACK_SECRET;
    }

    throw new Error('NEXTAUTH_SECRET must be configured in production.');
}

type CookieStoreLike = {
    get(name: string): { value?: string; } | undefined;
    getAll?: () => Array<{ name: string; value: string; }>;
};

export function hasNextAuthCookies(cookieStore: CookieStoreLike): boolean {
    return NEXTAUTH_COOKIE_NAMES.some((cookieName) => Boolean(cookieStore.get(cookieName)?.value));
}

export function hasNextAuthSessionCookies(cookieStore: CookieStoreLike): boolean {
    const directMatch = NEXTAUTH_SESSION_COOKIE_NAMES.some((cookieName) => Boolean(cookieStore.get(cookieName)?.value));
    if (directMatch) {
        return true;
    }

    if (!cookieStore.getAll) {
        return false;
    }

    const sessionCookiePrefixes = NEXTAUTH_SESSION_COOKIE_NAMES.map((cookieName) => `${cookieName}.`);

    return cookieStore.getAll().some((cookie) =>
        NEXTAUTH_SESSION_COOKIE_NAMES.includes(cookie.name as typeof NEXTAUTH_SESSION_COOKIE_NAMES[number])
        || sessionCookiePrefixes.some((prefix) => cookie.name.startsWith(prefix))
    );
}

export function buildClearSessionRedirectPath(callbackUrl: string): string {
    return `/api/auth/clear-session?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

const authSecret = getAuthSecret();

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const providers: NextAuthOptions['providers'] = [
    CredentialsProvider({
        name: 'Email and Password',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            const parsedCredentials = credentialsSchema.safeParse(credentials);
            if (!parsedCredentials.success) {
                return null;
            }

            try {
                const loginResponse = await apiLogin({
                    email: parsedCredentials.data.email,
                    password: parsedCredentials.data.password,
                });

                const token = loginResponse.data?.token;
                if (!token) return null;

                const meResponse = await apiGetMe(token);
                const user = meResponse.data;
                if (!user) return null;

                const role = user.role === 'admin' ? 'admin' : 'editor';

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                    image: '',
                    role: role as SessionUser['role'],
                    apiToken: token,
                };
            } catch {
                return null;
            }
        },
    }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

export const authOptions: NextAuthOptions = {
    secret: authSecret,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'github' && !user.email) {
                return false;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.id;
                token.role = (user as SessionUser).role;
                token.apiToken = (user as SessionUser & { apiToken?: string }).apiToken;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.uid || '');
                session.user.role = (token.role as SessionUser['role']) || 'editor';
                session.user.image = typeof token.picture === 'string' ? token.picture : session.user.image;
                session.user.apiToken = typeof token.apiToken === 'string' ? token.apiToken : '';
            }
            return session;
        },
    },
};

export async function getServerAuthSession() {
    return getServerSession(authOptions);
}

export async function requireUserSession() {
    const session = await getServerAuthSession();
    if (!session?.user) {
        return null;
    }

    return session;
}

export async function requireAdminSession() {
    const session = await requireUserSession();
    if (!session?.user || session.user.role !== 'admin') {
        return null;
    }

    return session;
}

export async function getApiToken(): Promise<string | null> {
    const session = await getServerAuthSession();
    return (session?.user as SessionUser | undefined)?.apiToken || null;
}