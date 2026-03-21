import { and, eq, inArray, sql } from 'drizzle-orm';
import { contentVisitors } from './schema';
import { db, initializeDatabase } from './client';

export type ContentVisitorType = 'post' | 'project';

export async function getVisitorCountsBySlug(
    contentType: ContentVisitorType,
    slugs: string[]
): Promise<Map<string, number>> {
    await initializeDatabase();

    if (slugs.length === 0) {
        return new Map();
    }

    const rows = await db
        .select()
        .from(contentVisitors)
        .where(
            and(
                eq(contentVisitors.contentType, contentType),
                inArray(contentVisitors.contentSlug, slugs)
            )
        );

    return new Map(rows.map((row) => [row.contentSlug, row.visitorCount]));
}

export async function getVisitorCount(
    contentType: ContentVisitorType,
    slug: string
): Promise<number> {
    const counts = await getVisitorCountsBySlug(contentType, [slug]);
    return counts.get(slug) ?? 0;
}

export async function incrementVisitorCount(
    contentType: ContentVisitorType,
    slug: string
): Promise<number> {
    await initializeDatabase();

    const updatedAt = new Date().toISOString();

    await db
        .insert(contentVisitors)
        .values({
            contentType,
            contentSlug: slug,
            visitorCount: 1,
            updatedAt,
        })
        .onConflictDoUpdate({
            target: [contentVisitors.contentType, contentVisitors.contentSlug],
            set: {
                visitorCount: sql`${contentVisitors.visitorCount} + 1`,
                updatedAt,
            },
        });

    return getVisitorCount(contentType, slug);
}