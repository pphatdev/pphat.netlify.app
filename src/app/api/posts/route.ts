import { NextRequest, NextResponse } from 'next/server';
import { db, Post } from '@lib/db/post';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sort = searchParams.get('sort') || 'asc';
        const search = searchParams.get('search') || '';

        const posts = db.getAll<Post>('posts', search, page, limit, sort);

        return NextResponse.json(posts, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const post = db.create<Post>('posts', {
            title: body.title,
            content: body.content,
            slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
            published: body.published || false,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}