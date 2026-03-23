import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL?.trim() || 'file:./data/pphat.sqlite';
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN?.trim()
    || process.env.TURSO_AUTH_TOKEN?.trim()
    || process.env.LIBSQL_AUTH_TOKEN?.trim()
    || undefined;

export default defineConfig(databaseUrl.startsWith('libsql://')
    ? {
        out: './drizzle',
        schema: './src/lib/db/schema.ts',
        dialect: 'turso',
        dbCredentials: {
            url: databaseUrl,
            authToken: databaseAuthToken,
        },
        verbose: true,
        strict: true,
    }
    : {
        out: './drizzle',
        schema: './src/lib/db/schema.ts',
        dialect: 'sqlite',
        dbCredentials: {
            url: databaseUrl,
        },
        verbose: true,
        strict: true,
    });