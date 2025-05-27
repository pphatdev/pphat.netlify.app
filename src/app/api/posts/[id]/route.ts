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

        // Get existing post first to ensure it exists and preserve certain fields
        const existingPost = db.getById<Post>('posts', params.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Validate required fields if they are being updated
        if (body.title && typeof body.title !== 'string') {
            return NextResponse.json(
                { error: 'Title must be a string' },
                { status: 400 }
            );
        }

        if (body.content && typeof body.content !== 'string') {
            return NextResponse.json(
                { error: 'Content must be a string' },
                { status: 400 }
            );
        }

        // Check for duplicate title if title is being updated
        if (body.title && body.title.trim() !== existingPost.title) {
            const allPosts = db.getAll<Post>('posts', '', 1, -1).data;
            const duplicateTitle = allPosts.find(post =>
                post.id !== params.id && 
                post.title.toLowerCase() === body.title.trim().toLowerCase()
            );

            if (duplicateTitle) {
                return NextResponse.json(
                    { error: 'A post with this title already exists' },
                    { status: 409 }
                );
            }
        }

        // Prepare update data
        const updateData = {
            ...body,
            id: existingPost.id, // Ensure ID doesn't change
            createdAt: existingPost.createdAt, // Preserve creation date
            updatedAt: new Date().toISOString(), // Update modification time
            // Update slug if title is changed
            ...(body.title && {
                slug: body.title.trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
            })
        };

        const updatedPost = db.update<Post>('posts', params.id, updateData);

        return NextResponse.json({
            message: 'Post updated successfully',
            data: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        
        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON format in request body' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        // Check if post exists before deletion
        const existingPost = db.getById<Post>('posts', params.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const deleted = db.delete('posts', params.id);

        if (!deleted) {
            return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
        }

        return NextResponse.json({ 
            message: 'Post deleted successfully',
            success: true 
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const body = await request.json();

        // Get existing post first to ensure it exists
        const existingPost = db.getById<Post>('posts', params.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Validate only the fields being updated
        const updates: Partial<Post> = {};

        // Validate and process title if provided
        if (body.title !== undefined) {
            if (typeof body.title !== 'string' || body.title.trim().length === 0) {
                return NextResponse.json(
                    { error: 'Title must be a non-empty string' },
                    { status: 400 }
                );
            }

            // Check for duplicate title
            if (body.title.trim() !== existingPost.title) {
                const allPosts = db.getAll<Post>('posts', '', 1, -1).data;
                const duplicateTitle = allPosts.find(post =>
                    post.id !== params.id && 
                    post.title.toLowerCase() === body.title.trim().toLowerCase()
                );

                if (duplicateTitle) {
                    return NextResponse.json(
                        { error: 'A post with this title already exists' },
                        { status: 409 }
                    );
                }
            }

            updates.title = body.title.trim();
            // Auto-update slug when title changes
            updates.slug = body.title.trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Validate and process content if provided
        if (body.content !== undefined) {
            if (typeof body.content !== 'string') {
                return NextResponse.json(
                    { error: 'Content must be a string' },
                    { status: 400 }
                );
            }
            updates.content = body.content;
        }

        // Process other optional fields
        if (body.published !== undefined) {
            updates.published = Boolean(body.published);
        }

        if (body.description !== undefined && typeof body.description === 'string') {
            updates.description = body.description.trim();
        }

        if (body.tags !== undefined && Array.isArray(body.tags)) {
            updates.tags = body.tags;
        }

        if (body.authors !== undefined && Array.isArray(body.authors)) {
            updates.authors = body.authors;
        }

        if (body.thumbnail !== undefined && typeof body.thumbnail === 'string') {
            updates.thumbnail = body.thumbnail.trim();
        }

        // Always update the modification time
        updates.updatedAt = new Date().toISOString();

        const updatedPost = db.update<Post>('posts', params.id, updates);

        return NextResponse.json({
            message: 'Post updated successfully',
            data: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        
        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON format in request body' },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}