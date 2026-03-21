import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { getAllPosts, getAllProjects, getPostBySlug, getProjectBySlug, invalidateCache, type PostEntry, type ProjectEntry } from '@lib/content';
import { db, initializeDatabase } from '@lib/db/client';
import {
    contentVisitors,
    postAuthors,
    postTags,
    posts,
    projectAuthors,
    projectLanguages,
    projects,
    projectSources,
    projectTags,
} from '@lib/db/schema';

type AuthorInput = { name: string; profile?: string; url?: string; };
type SourceInput = { name: string; type?: string; url: string; };

export type PostMutationInput = {
    title: string;
    slug?: string;
    description?: string;
    thumbnail?: string;
    content: string;
    tags?: string[];
    authors?: AuthorInput[];
    published?: boolean;
};

export type ProjectMutationInput = {
    title: string;
    slug?: string;
    description?: string;
    image?: string;
    content: string;
    tags?: string[];
    languages?: string[];
    source?: SourceInput[];
    authors?: AuthorInput[];
    published?: boolean;
};

function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || crypto.randomUUID().slice(0, 8);
}

function normalizeTags(values?: string[]): string[] {
    return Array.from(new Set((values ?? [])
        .map((value) => value.trim())
        .filter(Boolean)));
}

function normalizeAuthors(values?: AuthorInput[]): { name: string; profile: string; url: string; }[] {
    return (values ?? [])
        .map((author) => ({
            name: author.name.trim(),
            profile: author.profile?.trim() ?? '',
            url: author.url?.trim() ?? '',
        }))
        .filter((author) => author.name.length > 0);
}

function normalizeSources(values?: SourceInput[]): { name: string; type: string; url: string; }[] {
    return (values ?? [])
        .map((source) => ({
            name: source.name.trim(),
            type: source.type?.trim() ?? '',
            url: source.url.trim(),
        }))
        .filter((source) => source.name.length > 0 && source.url.length > 0);
}

function normalizeLanguages(values?: string[]): string[] {
    return Array.from(new Set((values ?? [])
        .map((value) => value.trim())
        .filter(Boolean)));
}

async function findUniquePostSlug(baseValue: string, excludeId?: string): Promise<string> {
    await initializeDatabase();
    const baseSlug = slugify(baseValue);
    let candidate = baseSlug;
    let index = 1;

    while (true) {
        const [match] = await db.select().from(posts).where(eq(posts.slug, candidate)).limit(1);
        if (!match || match.id === excludeId) {
            return candidate;
        }

        candidate = `${baseSlug}-${index}`;
        index += 1;
    }
}

async function findUniqueProjectSlug(baseValue: string, excludeId?: string): Promise<string> {
    await initializeDatabase();
    const baseSlug = slugify(baseValue);
    let candidate = baseSlug;
    let index = 1;

    while (true) {
        const [match] = await db.select().from(projects).where(eq(projects.slug, candidate)).limit(1);
        if (!match || match.id === excludeId) {
            return candidate;
        }

        candidate = `${baseSlug}-${index}`;
        index += 1;
    }
}

async function findPostRecord(identifier: string) {
    await initializeDatabase();
    const [byId] = await db.select().from(posts).where(eq(posts.id, identifier)).limit(1);
    if (byId) {
        return byId;
    }

    const [bySlug] = await db.select().from(posts).where(eq(posts.slug, identifier)).limit(1);
    return bySlug ?? null;
}

async function findProjectRecord(identifier: string) {
    await initializeDatabase();
    const [byId] = await db.select().from(projects).where(eq(projects.id, identifier)).limit(1);
    if (byId) {
        return byId;
    }

    const [bySlug] = await db.select().from(projects).where(eq(projects.slug, identifier)).limit(1);
    return bySlug ?? null;
}

export async function createPostRecord(input: PostMutationInput) {
    await initializeDatabase();

    const timestamp = new Date().toISOString();
    const slug = await findUniquePostSlug(input.slug || input.title);
    const postId = crypto.randomUUID();
    const tags = normalizeTags(input.tags);
    const authors = normalizeAuthors(input.authors);

    await db.transaction(async (tx) => {
        await tx.insert(posts).values({
            id: postId,
            slug,
            title: input.title.trim(),
            description: input.description?.trim() ?? '',
            thumbnail: input.thumbnail?.trim() ?? '',
            content: input.content,
            filePath: `posts/${slug}/index.md`,
            published: Boolean(input.published),
            createdAt: timestamp,
            updatedAt: timestamp,
            syncedAt: timestamp,
        });

        if (tags.length > 0) {
            await tx.insert(postTags).values(tags.map((tag) => ({ postId, tag })));
        }

        if (authors.length > 0) {
            await tx.insert(postAuthors).values(authors.map((author, index) => ({
                postId,
                position: index,
                name: author.name,
                profile: author.profile,
                url: author.url,
            })));
        }
    });

    invalidateCache();
    return findPostRecord(postId);
}

export async function updatePostRecord(identifier: string, updates: Partial<PostMutationInput>) {
    await initializeDatabase();

    const existingRecord = await findPostRecord(identifier);
    if (!existingRecord) {
        return null;
    }

    const allPosts = await getAllPosts();
    const existingPost = allPosts.find((post) => post.id === existingRecord.id || post.slug === existingRecord.slug);
    if (!existingPost) {
        return null;
    }

    const nextSlug = updates.slug || updates.title
        ? await findUniquePostSlug(updates.slug || updates.title || existingPost.slug, existingRecord.id)
        : existingRecord.slug;
    const timestamp = new Date().toISOString();
    const nextTags = updates.tags !== undefined ? normalizeTags(updates.tags) : existingPost.tags;
    const nextAuthors = updates.authors !== undefined ? normalizeAuthors(updates.authors) : existingPost.authors;

    await db.transaction(async (tx) => {
        await tx
            .update(posts)
            .set({
                slug: nextSlug,
                title: updates.title?.trim() ?? existingRecord.title,
                description: updates.description?.trim() ?? existingRecord.description,
                thumbnail: updates.thumbnail?.trim() ?? existingRecord.thumbnail,
                content: updates.content ?? existingRecord.content,
                filePath: `posts/${nextSlug}/index.md`,
                published: updates.published ?? existingRecord.published,
                updatedAt: timestamp,
                syncedAt: timestamp,
            })
            .where(eq(posts.id, existingRecord.id));

        await tx.delete(postTags).where(eq(postTags.postId, existingRecord.id));
        await tx.delete(postAuthors).where(eq(postAuthors.postId, existingRecord.id));

        if (nextTags.length > 0) {
            await tx.insert(postTags).values(nextTags.map((tag) => ({ postId: existingRecord.id, tag })));
        }

        if (nextAuthors.length > 0) {
            await tx.insert(postAuthors).values(nextAuthors.map((author, index) => ({
                postId: existingRecord.id,
                position: index,
                name: author.name,
                profile: author.profile,
                url: author.url,
            })));
        }

        if (nextSlug !== existingRecord.slug) {
            await tx
                .update(contentVisitors)
                .set({ contentSlug: nextSlug, updatedAt: timestamp })
                .where(eq(contentVisitors.contentSlug, existingRecord.slug));
        }
    });

    invalidateCache();
    return findPostRecord(existingRecord.id);
}

export async function deletePostRecord(identifier: string) {
    await initializeDatabase();

    const existingRecord = await findPostRecord(identifier);
    if (!existingRecord) {
        return false;
    }

    await db.transaction(async (tx) => {
        await tx.delete(posts).where(eq(posts.id, existingRecord.id));
        await tx.delete(contentVisitors).where(eq(contentVisitors.contentSlug, existingRecord.slug));
    });

    invalidateCache();
    return true;
}

export async function createProjectRecord(input: ProjectMutationInput) {
    await initializeDatabase();

    const timestamp = new Date().toISOString();
    const slug = await findUniqueProjectSlug(input.slug || input.title);
    const projectId = crypto.randomUUID();
    const tags = normalizeTags(input.tags);
    const authors = normalizeAuthors(input.authors);
    const languages = normalizeLanguages(input.languages);
    const sources = normalizeSources(input.source);

    await db.transaction(async (tx) => {
        await tx.insert(projects).values({
            id: projectId,
            slug,
            title: input.title.trim(),
            description: input.description?.trim() ?? '',
            image: input.image?.trim() ?? '',
            content: input.content,
            filePath: `projects/${slug}/index.md`,
            published: Boolean(input.published),
            createdAt: timestamp,
            syncedAt: timestamp,
        });

        if (tags.length > 0) {
            await tx.insert(projectTags).values(tags.map((tag) => ({ projectId, tag })));
        }

        if (languages.length > 0) {
            await tx.insert(projectLanguages).values(languages.map((language) => ({ projectId, language })));
        }

        if (authors.length > 0) {
            await tx.insert(projectAuthors).values(authors.map((author, index) => ({
                projectId,
                position: index,
                name: author.name,
                profile: author.profile,
                url: author.url,
            })));
        }

        if (sources.length > 0) {
            await tx.insert(projectSources).values(sources.map((source, index) => ({
                projectId,
                position: index,
                name: source.name,
                type: source.type,
                url: source.url,
            })));
        }
    });

    invalidateCache();
    return findProjectRecord(projectId);
}

export async function updateProjectRecord(identifier: string, updates: Partial<ProjectMutationInput>) {
    await initializeDatabase();

    const existingRecord = await findProjectRecord(identifier);
    if (!existingRecord) {
        return null;
    }

    const allProjects = await getAllProjects();
    const existingProject = allProjects.find((project) => project.id === existingRecord.id || project.slug === existingRecord.slug);
    if (!existingProject) {
        return null;
    }

    const nextSlug = updates.slug || updates.title
        ? await findUniqueProjectSlug(updates.slug || updates.title || existingProject.slug, existingRecord.id)
        : existingRecord.slug;
    const timestamp = new Date().toISOString();
    const nextTags = updates.tags !== undefined ? normalizeTags(updates.tags) : existingProject.tags;
    const nextAuthors = updates.authors !== undefined ? normalizeAuthors(updates.authors) : existingProject.authors;
    const nextLanguages = updates.languages !== undefined ? normalizeLanguages(updates.languages) : existingProject.languages;
    const nextSources = updates.source !== undefined ? normalizeSources(updates.source) : existingProject.source;

    await db.transaction(async (tx) => {
        await tx
            .update(projects)
            .set({
                slug: nextSlug,
                title: updates.title?.trim() ?? existingRecord.title,
                description: updates.description?.trim() ?? existingRecord.description,
                image: updates.image?.trim() ?? existingRecord.image,
                content: updates.content ?? existingRecord.content,
                filePath: `projects/${nextSlug}/index.md`,
                published: updates.published ?? existingRecord.published,
                syncedAt: timestamp,
            })
            .where(eq(projects.id, existingRecord.id));

        await tx.delete(projectTags).where(eq(projectTags.projectId, existingRecord.id));
        await tx.delete(projectLanguages).where(eq(projectLanguages.projectId, existingRecord.id));
        await tx.delete(projectAuthors).where(eq(projectAuthors.projectId, existingRecord.id));
        await tx.delete(projectSources).where(eq(projectSources.projectId, existingRecord.id));

        if (nextTags.length > 0) {
            await tx.insert(projectTags).values(nextTags.map((tag) => ({ projectId: existingRecord.id, tag })));
        }

        if (nextLanguages.length > 0) {
            await tx.insert(projectLanguages).values(nextLanguages.map((language) => ({ projectId: existingRecord.id, language })));
        }

        if (nextAuthors.length > 0) {
            await tx.insert(projectAuthors).values(nextAuthors.map((author, index) => ({
                projectId: existingRecord.id,
                position: index,
                name: author.name,
                profile: author.profile,
                url: author.url,
            })));
        }

        if (nextSources.length > 0) {
            await tx.insert(projectSources).values(nextSources.map((source, index) => ({
                projectId: existingRecord.id,
                position: index,
                name: source.name,
                type: source.type,
                url: source.url,
            })));
        }

        if (nextSlug !== existingRecord.slug) {
            await tx
                .update(contentVisitors)
                .set({ contentSlug: nextSlug, updatedAt: timestamp })
                .where(eq(contentVisitors.contentSlug, existingRecord.slug));
        }
    });

    invalidateCache();
    return findProjectRecord(existingRecord.id);
}

export async function deleteProjectRecord(identifier: string) {
    await initializeDatabase();

    const existingRecord = await findProjectRecord(identifier);
    if (!existingRecord) {
        return false;
    }

    await db.transaction(async (tx) => {
        await tx.delete(projects).where(eq(projects.id, existingRecord.id));
        await tx.delete(contentVisitors).where(eq(contentVisitors.contentSlug, existingRecord.slug));
    });

    invalidateCache();
    return true;
}

export async function getEditablePost(identifier: string): Promise<PostEntry | null> {
    const post = await getPostBySlug(identifier);
    if (post) {
        return post;
    }

    const allPosts = await getAllPosts();
    return allPosts.find((entry) => entry.id === identifier) ?? null;
}

export async function getEditableProject(identifier: string): Promise<ProjectEntry | null> {
    const project = await getProjectBySlug(identifier);
    if (project) {
        return project;
    }

    const allProjects = await getAllProjects();
    return allProjects.find((entry) => entry.id === identifier) ?? null;
}