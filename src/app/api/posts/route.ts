import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, paginatePosts } from '@lib/content';
import { requireUserSession, getApiToken } from '@lib/auth';
import { apiCreateArticle } from '@lib/api-client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');

        const published = await getPublishedPosts();
        const tags = Array.from(
            new Set(published.flatMap((post) => post.tags || []))
        ).sort((a, b) => a.localeCompare(b));
        const { data, total, hasMore } = paginatePosts(published, page, limit);

        return NextResponse.json({
            data,
            hasMore,
            total,
            page,
            limit,
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
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        const requiredFields = ['title', 'description', 'content', 'tags'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const token = await getApiToken();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await apiCreateArticle(token, {
            title: body.title,
            slug: body.slug || generateSlug(body.title),
            excerpt: body.description || '',
            content: body.content || '',
            tags: (body.tags || []).join(', '),
            published: body.published ?? false,
            featured_image: body.thumbnail || '',
        });

        return NextResponse.json({
            success: true,
            data: result.data,
            message: 'Post created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

