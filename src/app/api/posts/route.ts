import { NextRequest, NextResponse } from 'next/server';
import { db, Post } from '@lib/db'

export async function GET() {
    try {
        const posts = db.getAll<Post>('posts');
        return NextResponse.json(posts);
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