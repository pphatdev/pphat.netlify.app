import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug } from '@lib/content';
import { requireUserSession, getApiToken } from '@lib/auth';
import { apiUpdateArticle, apiDeleteArticle } from '@lib/api-client';
import fs from 'fs';
import path from 'path';

interface Params {
    params: Promise<{ id: string; }>;
}

function getMimeType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.webp':
            return 'image/webp';
        case '.gif':
            return 'image/gif';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        // Try by slug first, then by id
        const allPosts = await getAllPosts();
        const post = await getPostBySlug(params.id) ?? allPosts.find(p => p.id === params.id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const assetName = request.nextUrl.searchParams.get('asset');
        if (assetName) {
            const safeAssetName = path.basename(assetName);
            const postDir = path.join(process.cwd(), 'content', 'posts', post.slug);
            const assetPath = path.join(postDir, safeAssetName);

            if (safeAssetName !== assetName || !fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const fileBuffer = fs.readFileSync(assetPath);

            return new NextResponse(new Uint8Array(fileBuffer), {
                headers: {
                    'Content-Type': getMimeType(assetPath),
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
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
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const allPosts = await getAllPosts();
        const existingPost = await getPostBySlug(params.id) ?? allPosts.find(p => p.id === params.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (body.title && typeof body.title !== 'string') {
            return NextResponse.json({ error: 'Title must be a string' }, { status: 400 });
        }

        const token = await getApiToken();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await apiUpdateArticle(token, existingPost.id, {
            title: body.title,
            slug: body.slug ?? existingPost.slug,
            content: body.content || existingPost.content,
            excerpt: body.description,
            published: body.published,
            featured_image: body.thumbnail,
            tags: Array.isArray(body.tags) ? body.tags.join(', ') : body.tags,
        });

        return NextResponse.json({
            message: 'Post updated successfully',
            data: result.data
        });
    } catch (error) {
        console.error('Error updating post:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const allPosts = await getAllPosts();
        const existingPost = await getPostBySlug(params.id) ?? allPosts.find(p => p.id === params.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const token = await getApiToken();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await apiDeleteArticle(token, existingPost.id);

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
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const allPosts = await getAllPosts();
        const existingPost = await getPostBySlug(params.id) ?? allPosts.find(p => p.id === params.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const updates: Record<string, unknown> = {};

        if (body.title !== undefined) {
            if (typeof body.title !== 'string' || body.title.trim().length === 0) {
                return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 });
            }
            updates.title = body.title.trim();
        }
        if (body.content !== undefined) updates.content = body.content;
        if (body.published !== undefined) updates.published = Boolean(body.published);
        if (body.description !== undefined) updates.description = String(body.description).trim();
        if (body.tags !== undefined && Array.isArray(body.tags)) updates.tags = body.tags.join(', ');
        if (body.thumbnail !== undefined) updates.featured_image = String(body.thumbnail).trim();

        const token = await getApiToken();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await apiUpdateArticle(token, existingPost.id, updates as Record<string, string | boolean>);

        return NextResponse.json({
            message: 'Post updated successfully',
            data: result.data
        });
    } catch (error) {
        console.error('Error updating post:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}