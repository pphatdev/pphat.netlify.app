import { createHash } from 'crypto';
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { getUserByEmail, upsertGitHubUser } from '@lib/db/auth-users';

type SessionUser = DefaultSession['user'] & {
    id: string;
    role: 'admin' | 'editor';
};

function isSessionUserRole(value: string): value is SessionUser['role'] {
    return value === 'admin' || value === 'editor';
}

function getProfileId(profile: unknown): string | null {
    if (!profile || typeof profile !== 'object' || !('id' in profile)) {
        return null;
    }

    const profileId = (profile as { id?: unknown; }).id;
    return typeof profileId === 'string' || typeof profileId === 'number'
        ? String(profileId)
        : null;
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

            const user = await getUserByEmail(parsedCredentials.data.email);
            if (!user?.passwordHash) {
                return null;
            }

            const isPasswordValid = await compare(parsedCredentials.data.password, user.passwordHash);
            if (!isPasswordValid) {
                return null;
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role as SessionUser['role'],
            };
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
        async signIn({ user, account, profile }) {
            if (account?.provider !== 'github') {
                return true;
            }

            if (!user.email) {
                return false;
            }

            const githubUser = await upsertGitHubUser({
                email: user.email,
                name: user.name || user.email.split('@')[0],
                image: user.image ?? undefined,
                githubId: getProfileId(profile),
            });

            user.id = githubUser.id;
            user.name = githubUser.name;
            user.image = githubUser.image || user.image;
            (user as SessionUser).role = githubUser.role as SessionUser['role'];

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.id;
                token.role = (user as SessionUser).role;
            }

            if ((!token.uid || !token.role) && token.email) {
                const existingUser = await getUserByEmail(token.email);
                if (existingUser) {
                    token.uid = existingUser.id;
                    token.role = isSessionUserRole(existingUser.role) ? existingUser.role : 'editor';
                    token.picture = existingUser.image || token.picture;
                    token.name = existingUser.name || token.name;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.uid || '');
                session.user.role = (token.role as SessionUser['role']) || 'editor';
                session.user.image = typeof token.picture === 'string' ? token.picture : session.user.image;
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