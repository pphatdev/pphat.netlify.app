import { NextRequest, NextResponse } from 'next/server';
import originData from 'public/data/post.json';
import { staticPaginationJSON } from '@lib/functions/pagination-list';
import { Post } from '@lib/types/interfaces';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');

        const { posts } = originData;
        const postData = (posts as unknown as Post[]).filter(post => post.published === true);

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
        const { title, content, author } = body;

        // Check for missing required fields
        if (!title || !content || !author) {
            return NextResponse.json(
                { error: 'Missing required fields: title, content, author' },
                { status: 400 }
            );
        }

        // Validate field types and lengths
        if (typeof title !== 'string' || typeof content !== 'string' || typeof author !== 'string') {
            return NextResponse.json(
                { error: 'Invalid field types: title, content, and author must be strings' },
                { status: 400 }
            );
        }

        if (title.trim().length === 0 || content.trim().length === 0 || author.trim().length === 0) {
            return NextResponse.json(
                { error: 'Fields cannot be empty after trimming whitespace' },
                { status: 400 }
            );
        }

        if (title.length > 200 || content.length > 10000 || author.length > 100) {
            return NextResponse.json(
                { error: 'Field length exceeded: title (200), content (10000), author (100)' },
                { status: 400 }
            );
        }

        const { posts } = originData;
        const existingPosts = posts as unknown as Post[];

        // Check for duplicate title
        const duplicateTitle = existingPosts.find(post =>
            post.title.toLowerCase() === title.trim().toLowerCase()
        );

        if (duplicateTitle) {
            return NextResponse.json(
                { error: 'A post with this title already exists' },
                { status: 409 }
            );
        }

        // Generate unique ID (handle empty array case)
        const newId = existingPosts.length > 0
            ? Math.max(...existingPosts.map(post => parseInt(post.id) || 0)) + 1
            : 1;

        // Create new post object with sanitized data
        const currentTime = new Date().toISOString();
        const newPost: Post = {
            id: newId.toString(),
            title: title.trim(),
            content: content.trim(),
            author: author.trim(),
            published: typeof body.published === 'boolean' ? body.published : true,
            createdAt: currentTime,
            updatedAt: currentTime,
            // Include additional optional fields if provided
            ...(body.tags && Array.isArray(body.tags) && { tags: body.tags }),
            ...(body.category && typeof body.category === 'string' && { category: body.category.trim() }),
            ...(body.excerpt && typeof body.excerpt === 'string' && { excerpt: body.excerpt.trim() }),
            ...(body.featuredImage && typeof body.featuredImage === 'string' && { featuredImage: body.featuredImage.trim() })
        };

        return NextResponse.json(
            {
                message: 'Post created successfully',
                data: newPost
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating post:', error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON format in request body' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}