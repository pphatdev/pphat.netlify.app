import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { ensureDatabaseSchema } from './ensure';
import * as schema from './schema';

const DEFAULT_DATABASE_URL = 'file:./data/pphat.sqlite';

function isServerlessRuntime(): boolean {
    return Boolean(
        process.env.VERCEL
        || process.env.NETLIFY
        || process.env.AWS_LAMBDA_FUNCTION_NAME
        || process.env.LAMBDA_TASK_ROOT
    );
}

function buildTmpDatabaseUrl(originalFileUrl?: string): string {
    const fallbackFileName = 'pphat.sqlite';
    const originalFilePath = originalFileUrl?.slice('file:'.length) ?? '';
    const originalBaseName = path.basename(originalFilePath || fallbackFileName) || fallbackFileName;
    const tmpFilePath = path.join(os.tmpdir(), originalBaseName);
    return `file:${tmpFilePath}`;
}

function isLikelyServerlessReadOnlyPath(filePath: string): boolean {
    if (!filePath) {
        return false;
    }

    const normalizedPath = path.normalize(filePath);

    if (!path.isAbsolute(normalizedPath)) {
        return true;
    }

    if (process.platform === 'win32') {
        return false;
    }

    return normalizedPath.startsWith('/var/task/');
}

function resolveDatabaseUrl(): string {
    const configuredUrl = process.env.DATABASE_URL?.trim();
    const isProductionLike = process.env.NODE_ENV === 'production' || isServerlessRuntime();

    if (!configuredUrl) {
        if (isProductionLike) {
            return buildTmpDatabaseUrl(DEFAULT_DATABASE_URL);
        }

        return DEFAULT_DATABASE_URL;
    }

    if (!isProductionLike || !configuredUrl.startsWith('file:')) {
        return configuredUrl;
    }

    const configuredFilePath = configuredUrl.slice('file:'.length);
    if (!isLikelyServerlessReadOnlyPath(configuredFilePath)) {
        return configuredUrl;
    }

    return buildTmpDatabaseUrl(configuredUrl);
}

const databaseUrl = resolveDatabaseUrl();
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN?.trim()
    || process.env.TURSO_AUTH_TOKEN?.trim()
    || process.env.LIBSQL_AUTH_TOKEN?.trim();

function ensureDatabaseDirectory(url: string): void {
    if (!url.startsWith('file:')) {
        return;
    }

    const filePath = url.slice('file:'.length);
    const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

    try {
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    } catch (error) {
        const isReadonlyServerlessPath = process.platform !== 'win32' && absolutePath.startsWith('/var/task/');
        if (isReadonlyServerlessPath || isServerlessRuntime()) {
            return;
        }

        if (process.env.NODE_ENV !== 'production') {
            throw error;
        }
    }
}

ensureDatabaseDirectory(databaseUrl);

const client = createClient({
    url: databaseUrl,
    authToken: databaseAuthToken,
});

export const db = drizzle(client, { schema });

let initializationPromise: Promise<void> | null = null;

export function getDatabaseUrl(): string {
    return databaseUrl;
}

export function isEphemeralFileDatabaseRuntime(): boolean {
    return isServerlessRuntime() && databaseUrl.startsWith('file:');
}

export async function initializeDatabase(): Promise<void> {
    if (!initializationPromise) {
        initializationPromise = ensureDatabaseSchema(client);
    }

    await initializationPromise;
}