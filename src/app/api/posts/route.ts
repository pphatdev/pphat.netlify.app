import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_API, NEXT_PUBLIC_APP_URL, PERSON_NAME } from '@lib/constants';

interface RemoteArticle {
    id: string | number;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    author_id?: number;
    category_id?: number;
    tags?: string[] | string;
    featured_image?: string;
    published?: boolean;
    published_date?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    is_featured?: boolean;
    view_count?: number;
    status?: boolean;
    is_deleted?: boolean;
    created_date?: string;
    updated_date?: string;
}

interface RemoteArticlesResponse {
    data?: RemoteArticle[];
    total?: number;
}

function normalizeTags(tags: RemoteArticle['tags']): string[] {
    if (Array.isArray(tags)) return tags.filter(Boolean);
    if (typeof tags === 'string') {
        return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    return [];
}

function normalizeThumbnail(imagePath?: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return `https://phat.website${imagePath}`;
    return imagePath;
}

function normalizeArticle(article: RemoteArticle) {
    return {
        id: String(article.id),
        title: article.title || '',
        content: article.content || '',
        published: article.published ?? false,
        description: article.excerpt || '',
        tags: normalizeTags(article.tags),
        createdAt: article.published_date || article.created_date || article.updated_date || new Date().toISOString(),
        updatedAt: article.updated_date,
        thumbnail: normalizeThumbnail(article.featured_image),
        slug: article.slug || String(article.id),
        authors: [{ name: PERSON_NAME, profile: '', url: NEXT_PUBLIC_APP_URL }],
        visitorCount: article.view_count ?? 0,
        metaTitle: article.meta_title || article.title || '',
        metaDescription: article.meta_description || article.excerpt || '',
        metaKeywords: article.meta_keywords || '',
        isFeatured: article.is_featured ?? false,
    };
}

async function fetchArticles(page: number, limit: number) {
    const url = `${NEXT_PUBLIC_API}/v1/api/articles?page=${page}&limit=${limit}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const payload = (await response.json()) as RemoteArticlesResponse;
    const data = Array.isArray(payload.data)
        ? payload.data
            .filter((article) => (article.status ?? true) && !(article.is_deleted ?? false) && (article.published ?? false))
            .map(normalizeArticle)
        : [];
    const total = typeof payload.total === 'number' ? payload.total : data.length;

    return { data, total };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number.parseInt(searchParams.get('page') || '1', 10);
        const limit = Number.parseInt(searchParams.get('limit') || '9', 10);

        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit !== 0 ? limit : 9;
        const MAX_REMOTE_LIMIT = 100;
        const remoteLimit = safeLimit === -1 ? MAX_REMOTE_LIMIT : Math.min(safeLimit, MAX_REMOTE_LIMIT);
        const { data: published, total } = await fetchArticles(safePage, remoteLimit);
        const tags = Array.from(
            new Set(published.flatMap((post) => post.tags || []))
        ).sort((a, b) => a.localeCompare(b));

        const data = safeLimit === -1 ? published : published;
        const hasMore = safeLimit === -1 ? false : (safePage * remoteLimit < total);

        return NextResponse.json({
            data,
            hasMore,
            total,
            page: safePage,
            limit: safeLimit,
            tags
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });

    } catch (error) {
        console.error('Error in posts API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(request.headers.get('authorization')
                    ? { Authorization: request.headers.get('authorization') as string }
                    : {}),
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
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}

