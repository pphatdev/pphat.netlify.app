import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ── Types ───────────────────────────────────────────────────────────────────

export interface PostFrontmatter {
    title: string;
    slug: string;
    description: string;
    tags: string[];
    authors: { name: string; profile: string; url: string }[];
    thumbnail: string;
    published: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface PostEntry extends PostFrontmatter {
    id: string;
    content: string;      // markdown body
    filePath: string;      // relative path from content root
}

export interface ProjectFrontmatter {
    title: string;
    slug: string;
    description: string;
    image: string;
    tags: string[];
    languages: string[];
    source: { name: string; type: string; url: string }[];
    authors: { name: string; profile: string; url: string }[];
    published: boolean;
    createdAt: string;
}

export interface ProjectEntry extends ProjectFrontmatter {
    id: string;
    content: string;
    filePath: string;
}

// ── Directories ─────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects');

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Recursively find all markdown files in a directory.
 * Supports nested folder structures of any depth.
 */
function findMarkdownFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findMarkdownFiles(fullPath));
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            results.push(fullPath);
        }
    }

    return results;
}

/**
 * Parse a markdown file with frontmatter.
 */
function parseMarkdownFile<T>(filePath: string): { data: T; content: string; filePath: string } | null {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(raw);
        const relativePath = path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/');
        return { data: data as T, content: content.trim(), filePath: relativePath };
    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
        return null;
    }
}

// ── In-memory cache ─────────────────────────────────────────────────────────

let postsCache: PostEntry[] | null = null;
let projectsCache: ProjectEntry[] | null = null;
let postsCacheTime = 0;
let projectsCacheTime = 0;
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 60_000 : 5_000; // 1min prod, 5s dev

export function invalidateCache() {
    postsCache = null;
    projectsCache = null;
}

// ── Posts API ───────────────────────────────────────────────────────────────

export function getAllPosts(): PostEntry[] {
    const now = Date.now();
    if (postsCache && now - postsCacheTime < CACHE_TTL) return postsCache;

    const files = findMarkdownFiles(POSTS_DIR);
    const posts: PostEntry[] = [];

    for (const file of files) {
        const parsed = parseMarkdownFile<PostFrontmatter>(file);
        if (!parsed) continue;

        const { data, content, filePath: fp } = parsed;
        posts.push({
            id: data.slug || path.basename(path.dirname(file)),
            title: data.title || '',
            slug: data.slug || path.basename(path.dirname(file)),
            description: data.description || '',
            tags: data.tags || [],
            authors: data.authors || [],
            thumbnail: data.thumbnail || '',
            published: data.published ?? false,
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt,
            content,
            filePath: fp,
        });
    }

    // Sort by createdAt descending (newest first)
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    postsCache = posts;
    postsCacheTime = now;
    return posts;
}

export function getPublishedPosts(): PostEntry[] {
    return getAllPosts().filter(p => p.published);
}

function normalizeLookupSlug(slug: string): string {
    const decodedSlug = (() => {
        try {
            return decodeURIComponent(slug);
        } catch {
            return slug;
        }
    })();

    return decodedSlug
        .trim()
        .split(/[?#]/)[0]
        .replace(/^\/+|\/+$/g, '');
}

export function getPostBySlug(slug: string): PostEntry | null {
    const normalizedSlug = normalizeLookupSlug(slug);
    return getAllPosts().find(p => p.slug === normalizedSlug) || null;
}

export function getPostsByTag(tag: string): PostEntry[] {
    return getPublishedPosts().filter(p => p.tags.includes(tag));
}

export function getPostsTags(): string[] {
    const tags = new Set<string>();
    for (const post of getPublishedPosts()) {
        for (const tag of post.tags) tags.add(tag);
    }
    return Array.from(tags).sort();
}

export function paginatePosts(
    posts: PostEntry[],
    page: number,
    limit: number
): { data: PostEntry[]; total: number; hasMore: boolean } {
    const start = (page - 1) * limit;
    const data = posts.slice(start, start + limit);
    return {
        data,
        total: posts.length,
        hasMore: start + limit < posts.length,
    };
}

// ── Projects API ────────────────────────────────────────────────────────────

export function getAllProjects(): ProjectEntry[] {
    const now = Date.now();
    if (projectsCache && now - projectsCacheTime < CACHE_TTL) return projectsCache;

    const files = findMarkdownFiles(PROJECTS_DIR);
    const projects: ProjectEntry[] = [];

    for (const file of files) {
        const parsed = parseMarkdownFile<ProjectFrontmatter>(file);
        if (!parsed) continue;

        const { data, content, filePath: fp } = parsed;
        projects.push({
            id: data.slug || path.basename(path.dirname(file)),
            title: data.title || '',
            slug: data.slug || path.basename(path.dirname(file)),
            description: data.description || '',
            image: data.image || '',
            tags: data.tags || [],
            languages: data.languages || [],
            source: data.source || [],
            authors: data.authors || [],
            published: data.published ?? false,
            createdAt: data.createdAt || '',
            content,
            filePath: fp,
        });
    }

    // Sort by createdAt descending
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    projectsCache = projects;
    projectsCacheTime = now;
    return projects;
}

export function getPublishedProjects(): ProjectEntry[] {
    return getAllProjects().filter(p => p.published);
}

export function getProjectBySlug(slug: string): ProjectEntry | null {
    const normalizedSlug = normalizeLookupSlug(slug);
    return getAllProjects().find(p => p.slug === normalizedSlug) || null;
}

export function paginateProjects(
    projects: ProjectEntry[],
    page: number,
    limit: number
): { data: ProjectEntry[]; total: number; hasMore: boolean } {
    const start = (page - 1) * limit;
    const data = projects.slice(start, start + limit);
    return {
        data,
        total: projects.length,
        hasMore: start + limit < projects.length,
    };
}
