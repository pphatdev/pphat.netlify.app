import { NextRequest, NextResponse } from 'next/server';
import { db, Post } from '@lib/db/post';

interface Params {
    params: Promise<{ id: string; }>;
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const post = db.getById<Post>('posts', params.id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const body = await request.json();
        const updatedPost = db.update<Post>('posts', params.id, body);

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const deleted = db.delete('posts', params.id);

        if (!deleted) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}