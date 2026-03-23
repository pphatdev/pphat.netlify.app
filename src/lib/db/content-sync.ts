import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
    postAuthors,
    postTags,
    posts,
    projectAuthors,
    projectLanguages,
    projectSources,
    projectTags,
    projects,
} from './schema';
import {
    getAllPostsFromMarkdown,
    getAllProjectsFromMarkdown,
    type PostEntry,
    type PostFrontmatter,
    type ProjectEntry,
    type ProjectFrontmatter,
} from '../content';
import { db, initializeDatabase } from './client';

const INSERT_CHUNK_SIZE = 100;
const LOCAL_CONTENT_ROOT = path.join(process.cwd(), 'content');
const DEFAULT_GITHUB_REPOSITORY = 'pphatdev/pphat.me';
const DEFAULT_GITHUB_REF = 'main';
const DEFAULT_GITHUB_CONTENT_ROOT = 'content';

type ContentMarkdownRecord<T> = {
    data: T;
    content: string;
    filePath: string;
};

type GitHubDirectoryEntry = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    download_url: string | null;
};

export type ContentSyncSource =
    | {
        type: 'local';
        contentRoot: string;
    }
    | {
        type: 'github';
        owner: string;
        repo: string;
        ref: string;
        contentRoot: string;
    };

export interface ContentSyncOptions {
    source?: ContentSyncSource;
}

function readContentSyncEnv(name: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : undefined;
}

function splitRepository(repository: string): { owner: string; repo: string } {
    const [owner, repo] = repository.split('/');
    if (!owner || !repo) {
        throw new Error(`Invalid GitHub repository "${repository}". Expected owner/repo.`);
    }

    return { owner, repo };
}

export function createGitHubContentSource(repository = DEFAULT_GITHUB_REPOSITORY, ref = DEFAULT_GITHUB_REF, contentRoot = DEFAULT_GITHUB_CONTENT_ROOT): ContentSyncSource {
    const { owner, repo } = splitRepository(repository);
    return {
        type: 'github',
        owner,
        repo,
        ref,
        contentRoot,
    };
}

function hasLocalContentSource(contentRoot = LOCAL_CONTENT_ROOT): boolean {
    return fs.existsSync(path.join(contentRoot, 'posts')) || fs.existsSync(path.join(contentRoot, 'projects'));
}

function resolveContentSyncSource(source?: ContentSyncSource): ContentSyncSource {
    if (source) {
        return source;
    }

    const forcedSource = readContentSyncEnv('CONTENT_SYNC_SOURCE');
    if (forcedSource === 'local') {
        return {
            type: 'local',
            contentRoot: LOCAL_CONTENT_ROOT,
        };
    }

    if (forcedSource === 'github') {
        return createGitHubContentSource(
            readContentSyncEnv('CONTENT_SYNC_GITHUB_REPO') ?? DEFAULT_GITHUB_REPOSITORY,
            readContentSyncEnv('CONTENT_SYNC_GITHUB_REF') ?? DEFAULT_GITHUB_REF,
            readContentSyncEnv('CONTENT_SYNC_GITHUB_ROOT') ?? DEFAULT_GITHUB_CONTENT_ROOT,
        );
    }

    if (hasLocalContentSource()) {
        return {
            type: 'local',
            contentRoot: LOCAL_CONTENT_ROOT,
        };
    }

    return createGitHubContentSource(
        readContentSyncEnv('CONTENT_SYNC_GITHUB_REPO') ?? DEFAULT_GITHUB_REPOSITORY,
        readContentSyncEnv('CONTENT_SYNC_GITHUB_REF') ?? DEFAULT_GITHUB_REF,
        readContentSyncEnv('CONTENT_SYNC_GITHUB_ROOT') ?? DEFAULT_GITHUB_CONTENT_ROOT,
    );
}

export function describeContentSyncSource(source: ContentSyncSource): string {
    if (source.type === 'local') {
        const relativeRoot = path.relative(process.cwd(), source.contentRoot).replace(/\\/g, '/');
        return relativeRoot || 'content';
    }

    return `github:${source.owner}/${source.repo}@${source.ref}/${source.contentRoot}`;
}

function buildGitHubHeaders(): HeadersInit {
    const token = readContentSyncEnv('GITHUB_TOKEN')
        ?? readContentSyncEnv('GH_TOKEN');

    return {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'pphat-content-sync',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, { headers: buildGitHubHeaders() });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url, { headers: buildGitHubHeaders() });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
}

function stripContentRoot(fullPath: string, contentRoot: string): string {
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const normalizedRoot = contentRoot.replace(/\\/g, '/').replace(/\/+$/g, '');
    return normalizedPath.startsWith(`${normalizedRoot}/`)
        ? normalizedPath.slice(normalizedRoot.length + 1)
        : normalizedPath;
}

async function listGitHubDirectory(source: Extract<ContentSyncSource, { type: 'github' }>, relativePath: string): Promise<GitHubDirectoryEntry[]> {
    const normalizedRelativePath = relativePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const requestPath = normalizedRelativePath
        ? `${source.contentRoot}/${normalizedRelativePath}`
        : source.contentRoot;
    const url = `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${requestPath}?ref=${encodeURIComponent(source.ref)}`;
    return await fetchJson<GitHubDirectoryEntry[]>(url);
}

async function loadGitHubMarkdownRecords<T>(source: Extract<ContentSyncSource, { type: 'github' }>, collection: 'posts' | 'projects'): Promise<ContentMarkdownRecord<T>[]> {
    const entries = await listGitHubDirectory(source, collection);
    const directories = entries.filter((entry) => entry.type === 'dir');

    const records = await Promise.all(directories.map(async (directory) => {
        const nestedEntries = await listGitHubDirectory(source, stripContentRoot(directory.path, source.contentRoot));
        const markdownEntry = nestedEntries.find((entry) => entry.type === 'file' && /\.mdx?$/i.test(entry.name));

        if (!markdownEntry?.download_url) {
            return null;
        }

        const rawContent = await fetchText(markdownEntry.download_url);
        const { data, content } = matter(rawContent);

        return {
            data: data as T,
            content: content.trim(),
            filePath: stripContentRoot(markdownEntry.path, source.contentRoot),
        } satisfies ContentMarkdownRecord<T>;
    }));

    return records.filter((record): record is ContentMarkdownRecord<T> => record !== null);
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(entries: T[]): T[] {
    return entries.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

async function loadPostsForSync(source: ContentSyncSource): Promise<PostEntry[]> {
    if (source.type === 'local') {
        return getAllPostsFromMarkdown();
    }

    const records = await loadGitHubMarkdownRecords<PostFrontmatter>(source, 'posts');

    return sortByCreatedAtDesc(records.map(({ data, content, filePath }) => ({
        id: data.slug || path.basename(path.dirname(filePath)),
        title: data.title || '',
        slug: data.slug || path.basename(path.dirname(filePath)),
        description: data.description || '',
        tags: data.tags || [],
        authors: data.authors || [],
        thumbnail: data.thumbnail || '',
        published: data.published ?? false,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt,
        content,
        filePath,
        visitorCount: 0,
    })));
}

async function loadProjectsForSync(source: ContentSyncSource): Promise<ProjectEntry[]> {
    if (source.type === 'local') {
        return getAllProjectsFromMarkdown();
    }

    const records = await loadGitHubMarkdownRecords<ProjectFrontmatter>(source, 'projects');

    return sortByCreatedAtDesc(records.map(({ data, content, filePath }) => ({
        id: data.slug || path.basename(path.dirname(filePath)),
        title: data.title || '',
        slug: data.slug || path.basename(path.dirname(filePath)),
        description: data.description || '',
        image: data.image || '',
        tags: data.tags || [],
        languages: data.languages || [],
        source: data.source || [],
        authors: data.authors || [],
        published: data.published ?? false,
        createdAt: data.createdAt || '',
        content,
        filePath,
        visitorCount: 0,
    })));
}

async function insertInChunks<T extends Record<string, unknown>>(
    values: T[],
    insertChunk: (chunk: T[]) => Promise<void>
): Promise<void> {
    for (let index = 0; index < values.length; index += INSERT_CHUNK_SIZE) {
        await insertChunk(values.slice(index, index + INSERT_CHUNK_SIZE));
    }
}

export async function syncContentToDatabase(options: ContentSyncOptions = {}): Promise<{
    source: string;
    posts: number;
    postTags: number;
    postAuthors: number;
    projects: number;
    projectTags: number;
    projectLanguages: number;
    projectAuthors: number;
    projectSources: number;
}> {
    await initializeDatabase();

    const source = resolveContentSyncSource(options.source);
    const syncedAt = new Date().toISOString();
    const [allPosts, allProjects] = await Promise.all([
        loadPostsForSync(source),
        loadProjectsForSync(source),
    ]);

    const postRows: typeof posts.$inferInsert[] = allPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description,
        thumbnail: post.thumbnail,
        content: post.content,
        filePath: post.filePath,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt ?? null,
        syncedAt,
    }));

    const postTagRows: typeof postTags.$inferInsert[] = allPosts.flatMap((post) =>
        (post.tags || []).map((tag) => ({
            postId: post.id,
            tag,
        }))
    );

    const postAuthorRows: typeof postAuthors.$inferInsert[] = allPosts.flatMap((post) =>
        (post.authors || []).map((author, position) => ({
            postId: post.id,
            position,
            name: author.name,
            profile: author.profile,
            url: author.url,
        }))
    );

    const projectRows: typeof projects.$inferInsert[] = allProjects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.description,
        image: project.image,
        content: project.content,
        filePath: project.filePath,
        published: project.published,
        createdAt: project.createdAt,
        syncedAt,
    }));

    const projectTagRows: typeof projectTags.$inferInsert[] = allProjects.flatMap((project) =>
        (project.tags || []).map((tag) => ({
            projectId: project.id,
            tag,
        }))
    );

    const projectLanguageRows: typeof projectLanguages.$inferInsert[] = allProjects.flatMap((project) =>
        (project.languages || []).map((language) => ({
            projectId: project.id,
            language,
        }))
    );

    const projectAuthorRows: typeof projectAuthors.$inferInsert[] = allProjects.flatMap((project) =>
        (project.authors || []).map((author, position) => ({
            projectId: project.id,
            position,
            name: author.name,
            profile: author.profile,
            url: author.url,
        }))
    );

    const projectSourceRows: typeof projectSources.$inferInsert[] = allProjects.flatMap((project) =>
        (project.source || []).map((source, position) => ({
            projectId: project.id,
            position,
            name: source.name,
            type: source.type,
            url: source.url,
        }))
    );

    await db.delete(postAuthors);
    await db.delete(postTags);
    await db.delete(projectSources);
    await db.delete(projectAuthors);
    await db.delete(projectLanguages);
    await db.delete(projectTags);
    await db.delete(posts);
    await db.delete(projects);

    await insertInChunks(postRows, async (chunk) => {
        await db.insert(posts).values(chunk);
    });
    await insertInChunks(postTagRows, async (chunk) => {
        await db.insert(postTags).values(chunk);
    });
    await insertInChunks(postAuthorRows, async (chunk) => {
        await db.insert(postAuthors).values(chunk);
    });
    await insertInChunks(projectRows, async (chunk) => {
        await db.insert(projects).values(chunk);
    });
    await insertInChunks(projectTagRows, async (chunk) => {
        await db.insert(projectTags).values(chunk);
    });
    await insertInChunks(projectLanguageRows, async (chunk) => {
        await db.insert(projectLanguages).values(chunk);
    });
    await insertInChunks(projectAuthorRows, async (chunk) => {
        await db.insert(projectAuthors).values(chunk);
    });
    await insertInChunks(projectSourceRows, async (chunk) => {
        await db.insert(projectSources).values(chunk);
    });

    return {
        source: describeContentSyncSource(source),
        posts: postRows.length,
        postTags: postTagRows.length,
        postAuthors: postAuthorRows.length,
        projects: projectRows.length,
        projectTags: projectTagRows.length,
        projectLanguages: projectLanguageRows.length,
        projectAuthors: projectAuthorRows.length,
        projectSources: projectSourceRows.length,
    };
}