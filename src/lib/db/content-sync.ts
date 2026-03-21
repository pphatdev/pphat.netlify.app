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
import { getAllPostsFromMarkdown, getAllProjectsFromMarkdown } from '../content';
import { db, initializeDatabase } from './client';

const INSERT_CHUNK_SIZE = 100;

async function insertInChunks<T extends Record<string, unknown>>(
    values: T[],
    insertChunk: (chunk: T[]) => Promise<void>
): Promise<void> {
    for (let index = 0; index < values.length; index += INSERT_CHUNK_SIZE) {
        await insertChunk(values.slice(index, index + INSERT_CHUNK_SIZE));
    }
}

export async function syncContentToDatabase(): Promise<{
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

    const syncedAt = new Date().toISOString();
    const allPosts = getAllPostsFromMarkdown();
    const allProjects = getAllProjectsFromMarkdown();

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