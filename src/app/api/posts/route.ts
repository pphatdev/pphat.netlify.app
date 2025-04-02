import { NextRequest, NextResponse } from 'next/server';
import { db, Post } from '@lib/db/post';
import { FileCache } from '@lib/caches/file-cache';

// Initialize cache with 10 minute TTL
const cache = new FileCache({ ttl: 600 });

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sort = searchParams.get('sort') || 'asc';
        const search = searchParams.get('search') || '';

        // Create a sanitized cache key based on request parameters
        const cacheKey = `posts_${search.replace(/[^a-z0-9]/gi, '_')}_p${page}_l${limit}_${sort}`;

        try {
            // Try to get data from cache first
            const cachedPosts = await cache.get<Post[]>(cacheKey);
            if (cachedPosts) {
                return NextResponse.json(cachedPosts, { status: 200 });
            }
        } catch (cacheError) {
            // Log error but continue with database fetch
            console.error('Cache retrieval error:', cacheError);
        }

        // Cache miss or error - fetch from database
        const posts = db.getAll<Post>('posts', search, page, limit, sort);

        // Store in cache (don't block response with await)
        cache.set(cacheKey, posts).catch(err =>
            console.error('Failed to cache posts:', err)
        );

        return NextResponse.json(posts, { status: 200 });
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