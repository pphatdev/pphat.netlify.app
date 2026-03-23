import type { Client } from '@libsql/client';

const schemaStatements = [
    'PRAGMA foreign_keys = ON',
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT,
        image TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL DEFAULT 'editor',
        provider TEXT NOT NULL DEFAULT 'credentials',
        github_id TEXT UNIQUE,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )`,
    'CREATE INDEX IF NOT EXISTS users_role_idx ON users (role)',
    `CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT NOT NULL UNIQUE,
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
    )`,
    'CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published)',
    'CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at)',
    `CREATE TABLE IF NOT EXISTS post_tags (
        post_id TEXT NOT NULL,
        tag TEXT NOT NULL,
        PRIMARY KEY (post_id, tag),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`,
    'CREATE INDEX IF NOT EXISTS post_tags_tag_idx ON post_tags (tag)',
    `CREATE TABLE IF NOT EXISTS post_authors (
        post_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        name TEXT NOT NULL,
        profile TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (post_id, position),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        file_path TEXT NOT NULL DEFAULT '',
        published INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        synced_at TEXT NOT NULL
    )`,
    'CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published)',
    'CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at)',
    `CREATE TABLE IF NOT EXISTS project_tags (
        project_id TEXT NOT NULL,
        tag TEXT NOT NULL,
        PRIMARY KEY (project_id, tag),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    'CREATE INDEX IF NOT EXISTS project_tags_tag_idx ON project_tags (tag)',
    `CREATE TABLE IF NOT EXISTS project_languages (
        project_id TEXT NOT NULL,
        language TEXT NOT NULL,
        PRIMARY KEY (project_id, language),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    'CREATE INDEX IF NOT EXISTS project_languages_language_idx ON project_languages (language)',
    `CREATE TABLE IF NOT EXISTS project_authors (
        project_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        name TEXT NOT NULL,
        profile TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (project_id, position),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS project_sources (
        project_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT '',
        url TEXT NOT NULL,
        PRIMARY KEY (project_id, position),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS contact_submissions (
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
    )`,
    'CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions (created_at)',
    'CREATE INDEX IF NOT EXISTS contact_submissions_email_idx ON contact_submissions (email)',
    'CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions (delivery_status)',
    `CREATE TABLE IF NOT EXISTS content_visitors (
        content_type TEXT NOT NULL,
        content_slug TEXT NOT NULL,
        visitor_count INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (content_type, content_slug)
    )`,
    'CREATE INDEX IF NOT EXISTS content_visitors_type_idx ON content_visitors (content_type)',
    'CREATE INDEX IF NOT EXISTS content_visitors_slug_idx ON content_visitors (content_slug)',
];

async function ensurePostsModeratorColumn(client: Client): Promise<void> {
    const result = await client.execute('PRAGMA table_info(posts)');
    const hasModeratorId = result.rows.some((row) => {
        if (!row || typeof row !== 'object') {
            return false;
        }

        const value = (row as Record<string, unknown>).name;
        return typeof value === 'string' && value === 'moderator_id';
    });

    if (!hasModeratorId) {
        await client.execute('ALTER TABLE posts ADD COLUMN moderator_id TEXT');
    }

    await client.execute('CREATE INDEX IF NOT EXISTS posts_moderator_id_idx ON posts (moderator_id)');
}

export async function ensureDatabaseSchema(client: Client): Promise<void> {
    for (const statement of schemaStatements) {
        await client.execute(statement);
    }

    await ensurePostsModeratorColumn(client);
}