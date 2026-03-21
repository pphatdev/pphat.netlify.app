import crypto from 'crypto';
import { count, eq, or } from 'drizzle-orm';
import { db, initializeDatabase } from '@lib/db/client';
import { users } from '@lib/db/schema';

export type UserRole = 'admin' | 'editor';
export type UserRecord = typeof users.$inferSelect;

type CreateUserInput = {
    email: string;
    name: string;
    passwordHash?: string | null;
    image?: string;
    provider?: string;
    githubId?: string | null;
};

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

async function getNextUserRole(): Promise<UserRole> {
    const [{ value }] = await db.select({ value: count() }).from(users);
    return value === 0 ? 'admin' : 'editor';
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
    await initializeDatabase();
    const normalizedEmail = normalizeEmail(email);
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    return user ?? null;
}

export async function getUserById(userId: string): Promise<UserRecord | null> {
    await initializeDatabase();
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user ?? null;
}

export async function createUser(input: CreateUserInput): Promise<UserRecord> {
    await initializeDatabase();

    const timestamp = new Date().toISOString();
    const role = await getNextUserRole();
    const userId = crypto.randomUUID();
    const normalizedEmail = normalizeEmail(input.email);

    await db.insert(users).values({
        id: userId,
        email: normalizedEmail,
        name: input.name.trim(),
        passwordHash: input.passwordHash ?? null,
        image: input.image?.trim() ?? '',
        role,
        provider: input.provider ?? 'credentials',
        githubId: input.githubId ?? null,
        createdAt: timestamp,
        updatedAt: timestamp,
    });

    const createdUser = await getUserById(userId);
    if (!createdUser) {
        throw new Error('Failed to load created user');
    }

    return createdUser;
}

export async function upsertGitHubUser(input: {
    email: string;
    name: string;
    image?: string;
    githubId?: string | null;
}): Promise<UserRecord> {
    await initializeDatabase();

    const normalizedEmail = normalizeEmail(input.email);
    const trimmedGithubId = input.githubId?.trim() || null;
    const [existingUser] = await db
        .select()
        .from(users)
        .where(
            trimmedGithubId
                ? or(eq(users.email, normalizedEmail), eq(users.githubId, trimmedGithubId))
                : eq(users.email, normalizedEmail)
        )
        .limit(1);

    if (!existingUser) {
        return createUser({
            email: normalizedEmail,
            name: input.name,
            image: input.image,
            provider: 'github',
            githubId: trimmedGithubId,
        });
    }

    const timestamp = new Date().toISOString();
    await db
        .update(users)
        .set({
            name: input.name.trim() || existingUser.name,
            image: input.image?.trim() ?? existingUser.image,
            provider: 'github',
            githubId: trimmedGithubId ?? existingUser.githubId,
            updatedAt: timestamp,
        })
        .where(eq(users.id, existingUser.id));

    const updatedUser = await getUserById(existingUser.id);
    if (!updatedUser) {
        throw new Error('Failed to load GitHub user');
    }

    return updatedUser;
}