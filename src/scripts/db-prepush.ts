import { createClient, type Client } from '@libsql/client';
import { getDatabaseUrl, initializeDatabase } from '../lib/db/client';

function getRowValue(row: unknown, key: string): unknown {
    if (!row || typeof row !== 'object') {
        return undefined;
    }

    return (row as Record<string, unknown>)[key];
}

function normalizeDefaultValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value).trim().replace(/^'+|'+$/g, '').toLowerCase();
}

async function tableExists(client: Client, tableName: string): Promise<boolean> {
    const result = await client.execute({
        sql: 'SELECT name FROM sqlite_master WHERE type = ? AND name = ? LIMIT 1',
        args: ['table', tableName],
    });

    return result.rows.length > 0;
}

async function getColumnDefaults(client: Client, tableName: string): Promise<Map<string, string>> {
    const result = await client.execute(`PRAGMA table_info(${tableName})`);
    const defaults = new Map<string, string>();

    for (const row of result.rows) {
        const columnName = getRowValue(row, 'name');
        if (typeof columnName !== 'string') {
            continue;
        }

        defaults.set(columnName, normalizeDefaultValue(getRowValue(row, 'dflt_value')));
    }

    return defaults;
}

async function rebuildContactSubmissionsIfNeeded(client: Client): Promise<void> {
    if (!(await tableExists(client, 'contact_submissions'))) {
        return;
    }

    const defaults = await getColumnDefaults(client, 'contact_submissions');
    if (defaults.get('is_spam') === '0') {
        return;
    }

    await client.execute('DROP TABLE IF EXISTS __new_contact_submissions');
    await client.execute(`CREATE TABLE __new_contact_submissions (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        delivery_status TEXT NOT NULL DEFAULT 'pending',
        is_spam INTEGER NOT NULL DEFAULT 0,
        delivered_at TEXT,
        created_at TEXT NOT NULL
    )`);
    await client.execute(`INSERT INTO __new_contact_submissions (
        id, name, email, subject, message, ip_address, user_agent, delivery_status, is_spam, delivered_at, created_at
    )
    SELECT
        id, name, email, subject, message, ip_address, user_agent, delivery_status, is_spam, delivered_at, created_at
    FROM contact_submissions`);
    await client.execute('DROP TABLE contact_submissions');
    await client.execute('ALTER TABLE __new_contact_submissions RENAME TO contact_submissions');
}

async function rebuildPostsIfNeeded(client: Client): Promise<void> {
    if (!(await tableExists(client, 'posts'))) {
        return;
    }

    const defaults = await getColumnDefaults(client, 'posts');
    const publishedDefault = defaults.get('published');
    const hasModeratorId = defaults.has('moderator_id');

    if (publishedDefault === '0' && hasModeratorId) {
        return;
    }

    await client.execute('DROP TABLE IF EXISTS __new_posts');
    await client.execute(`CREATE TABLE __new_posts (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        thumbnail TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        published INTEGER NOT NULL DEFAULT 0,
        moderator_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        synced_at TEXT NOT NULL,
        FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
    )`);
    if (hasModeratorId) {
        await client.execute(`INSERT INTO __new_posts (
            id, slug, title, description, thumbnail, content, file_path, published, moderator_id, created_at, updated_at, synced_at
        )
        SELECT
            id, slug, title, description, thumbnail, content, file_path, published, moderator_id, created_at, updated_at, synced_at
        FROM posts`);
    } else {
        await client.execute(`INSERT INTO __new_posts (
            id, slug, title, description, thumbnail, content, file_path, published, moderator_id, created_at, updated_at, synced_at
        )
        SELECT
            id, slug, title, description, thumbnail, content, file_path, published, NULL, created_at, updated_at, synced_at
        FROM posts`);
    }
    await client.execute('DROP TABLE posts');
    await client.execute('ALTER TABLE __new_posts RENAME TO posts');
}

async function rebuildProjectsIfNeeded(client: Client): Promise<void> {
    if (!(await tableExists(client, 'projects'))) {
        return;
    }

    const defaults = await getColumnDefaults(client, 'projects');
    if (defaults.get('published') === '0') {
        return;
    }

    await client.execute('DROP TABLE IF EXISTS __new_projects');
    await client.execute(`CREATE TABLE __new_projects (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        published INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        synced_at TEXT NOT NULL
    )`);
    await client.execute(`INSERT INTO __new_projects (
        id, slug, title, description, image, content, file_path, published, created_at, synced_at
    )
    SELECT
        id, slug, title, description, image, content, file_path, published, created_at, synced_at
    FROM projects`);
    await client.execute('DROP TABLE projects');
    await client.execute('ALTER TABLE __new_projects RENAME TO projects');
}

async function ensureNamedIndexes(client: Client): Promise<void> {
    const statements = [
        'CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions (created_at)',
        'CREATE INDEX IF NOT EXISTS contact_submissions_email_idx ON contact_submissions (email)',
        'CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions (delivery_status)',
        'CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique ON posts (slug)',
        'CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published)',
        'CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at)',
        'CREATE INDEX IF NOT EXISTS posts_moderator_id_idx ON posts (moderator_id)',
        'CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique ON projects (slug)',
        'CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published)',
        'CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at)',
        'CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email)',
        'CREATE UNIQUE INDEX IF NOT EXISTS users_github_id_unique ON users (github_id)',
        'CREATE INDEX IF NOT EXISTS users_role_idx ON users (role)',
    ];

    for (const statement of statements) {
        await client.execute(statement);
    }
}

async function normalizeDatabaseForDrizzlePush(client: Client): Promise<void> {
    await client.execute('PRAGMA foreign_keys=OFF');

    try {
        await rebuildContactSubmissionsIfNeeded(client);
        await rebuildPostsIfNeeded(client);
        await rebuildProjectsIfNeeded(client);
        await ensureNamedIndexes(client);
    } finally {
        await client.execute('PRAGMA foreign_keys=ON');
    }
}

async function main(): Promise<void> {
    await initializeDatabase();

    const client = createClient({
        url: getDatabaseUrl(),
    });

    await normalizeDatabaseForDrizzlePush(client);
    await client.close();
}

main().catch((error) => {
    console.error('Failed to run database preflight before drizzle push.');
    console.error(error);
    process.exit(1);
});