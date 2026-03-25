import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_API, NEXT_PUBLIC_APP_URL, PERSON_NAME } from '@lib/constants';

interface Params {
    params: Promise<{ id: string }>;
}

function normalizeThumbnail(imagePath?: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return `https://phat.website${imagePath}`;
    return imagePath;
}

function normalizePost(post: Record<string, unknown>) {
    return {
        ...post,
        id: String(post.id ?? post.slug ?? ''),
        slug: String(post.slug ?? post.id ?? ''),
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
    };
}

function getProxyHeaders(request: NextRequest): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const authorization = request.headers.get('authorization');
    if (authorization) headers.Authorization = authorization;

    return headers;
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    try {
        const assetName = request.nextUrl.searchParams.get('asset') ?? request.nextUrl.searchParams.get('assets');
        if (assetName) {
            const safeAsset = assetName.split('/').pop();
            if (!safeAsset) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const assetUrl = `https://phat.website/blogs/${encodeURIComponent(params.id)}/${encodeURIComponent(safeAsset)}`;
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

        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles/${encodeURIComponent(params.id)}`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 60 },
        });

        if (response.status === 404) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch post detail: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const post = payload && typeof payload === 'object' && 'data' in payload
            ? (payload as { data?: Record<string, unknown> }).data
            : (payload as Record<string, unknown>);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(normalizePost(post), {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: Params) {
    const params = await props.params;

    try {
        const body = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles/${encodeURIComponent(params.id)}`, {
            method: 'PATCH',
            headers: {
                ...getProxyHeaders(request),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.description ?? body.excerpt,
                author_id: body.author_id,
                category_id: body.category_id,
                published: body.published,
                published_date: body.published_date,
                featured_image: body.thumbnail ?? body.featured_image,
                meta_title: body.meta_title,
                meta_description: body.meta_description,
                meta_keywords: body.meta_keywords,
                is_featured: body.is_featured,
                view_count: body.view_count,
                tags: Array.isArray(body.tags) ? body.tags.join(', ') : body.tags,
            }),
        });

        const payload = await response.json().catch(() => ({ error: 'Invalid response from upstream API' }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, props: Params) {
    const params = await props.params;

    try {
        const body = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles/${encodeURIComponent(params.id)}`, {
            method: 'PATCH',
            headers: {
                ...getProxyHeaders(request),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.description ?? body.excerpt,
                author_id: body.author_id,
                category_id: body.category_id,
                published: body.published,
                published_date: body.published_date,
                featured_image: body.thumbnail ?? body.featured_image,
                meta_title: body.meta_title,
                meta_description: body.meta_description,
                meta_keywords: body.meta_keywords,
                is_featured: body.is_featured,
                view_count: body.view_count,
                tags: Array.isArray(body.tags) ? body.tags.join(', ') : body.tags,
            }),
        });

        const payload = await response.json().catch(() => ({ error: 'Invalid response from upstream API' }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error('Error patching post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: Params) {
    const params = await props.params;

    try {
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles/${encodeURIComponent(params.id)}`, {
            method: 'DELETE',
            headers: getProxyHeaders(request),
        });

        const payload = await response.json().catch(() => ({ success: response.ok }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
