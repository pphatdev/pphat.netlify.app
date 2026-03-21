import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/lib/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_URL?.trim() || 'file:./data/pphat.sqlite',
    },
    verbose: true,
    strict: true,
});