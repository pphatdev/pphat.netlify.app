import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_API, NEXT_PUBLIC_APP_URL, PERSON_NAME } from '@lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeThumbnail(imagePath?: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return `https://phat.website${imagePath}`;
    return imagePath;
}

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');
        if (!slug) {
            return NextResponse.json({ error: 'Missing required slug query parameter' }, { status: 400 });
        }

        const assetName = request.nextUrl.searchParams.get('asset') ?? request.nextUrl.searchParams.get('assets');
        if (assetName) {
            const safeAsset = assetName.split('/').pop();
            if (!safeAsset) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const assetUrl = `https://phat.website/blogs/${encodeURIComponent(slug)}/${encodeURIComponent(safeAsset)}`;
            const assetResponse = await fetch(assetUrl, { cache: 'no-store' });
            if (!assetResponse.ok) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const contentType = assetResponse.headers.get('content-type') || 'application/octet-stream';
            const data = await assetResponse.arrayBuffer();
            return new NextResponse(data, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles/${encodeURIComponent(slug)}`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 60 },
        });

        if (response.status === 404) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const payload = (await response.json()) as Record<string, unknown>;
        const post = payload?.data && typeof payload.data === 'object'
            ? payload.data as Record<string, unknown>
            : payload;

        return NextResponse.json({
            ...post,
            id: String(post.id ?? post.slug ?? slug),
            slug: String(post.slug ?? post.id ?? slug),
            title: String(post.title ?? ''),
            content: String(post.content ?? ''),
            description: String(post.excerpt ?? post.description ?? ''),
            tags: Array.isArray(post.tags)
                ? post.tags
                : typeof post.tags === 'string'
                    ? post.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                    : [],
            authors: [{ name: PERSON_NAME, profile: '', url: NEXT_PUBLIC_APP_URL }],
            createdAt: String(post.published_date ?? post.created_date ?? post.updated_date ?? new Date().toISOString()),
            updatedAt: post.updated_date,
            thumbnail: normalizeThumbnail((post.featured_image ?? post.thumbnail) as string | undefined),
            visitorCount: Number(post.view_count ?? 0),
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}
