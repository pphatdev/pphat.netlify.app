import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { ensureDatabaseSchema } from './ensure';
import * as schema from './schema';

const DEFAULT_DATABASE_URL = 'file:./data/pphat.sqlite';
const databaseUrl = process.env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;

function ensureDatabaseDirectory(url: string): void {
    if (!url.startsWith('file:')) {
        return;
    }

    const filePath = url.slice('file:'.length);
    const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
}

ensureDatabaseDirectory(databaseUrl);

const client = createClient({
    url: databaseUrl,
});

export const db = drizzle(client, { schema });

let initializationPromise: Promise<void> | null = null;

export function getDatabaseUrl(): string {
    return databaseUrl;
}

export async function initializeDatabase(): Promise<void> {
    if (!initializationPromise) {
        initializationPromise = ensureDatabaseSchema(client);
    }

    await initializationPromise;
}