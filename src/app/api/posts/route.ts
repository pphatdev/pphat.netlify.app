import { NextRequest, NextResponse } from 'next/server';
import { db, Post } from '@lib/db/post';
import { staticPaginationJSON } from '@lib/functions/pagination-list';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');

        // Use database to get latest posts instead of static import
        const allPosts = db.getAll<Post>('posts', '', 1, -1).data;
        const postData = allPosts.filter(post => post.published === true);

        const { data } = staticPaginationJSON(
            postData,
            postData.length,
            {
                page: page,
                limit: limit,
                search: null,
                sort: 'asc',
            }
        );

        const hasMore = data.length === limit && (page * limit) < postData.length;

        return NextResponse.json({
            data,
            hasMore,
            total: postData.length,
            page,
            limit
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

        // Validate required fields
        const requiredFields = ['title', 'description', 'content', 'tags', 'authors'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Generate ID if not provided
        if (!body.id) {
            body.id = generateUniqueId();
        }

        // Set default values
        const newPost: Post = {
            ...body,
            published: body.published ?? false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slug: body.slug || generateSlug(body.title)
        };

        // Insert the new post
        const result = db.insert('posts', newPost);

        if (result.success) {
            return NextResponse.json({
                success: true,
                data: newPost,
                message: 'Post created successfully'
            }, { status: 201 });
        } else {
            return NextResponse.json(
                { error: 'Failed to create post' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}

// Helper functions
function generateUniqueId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

