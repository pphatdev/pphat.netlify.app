import { NextRequest, NextResponse } from 'next/server';

type ContentVisitorType = 'post' | 'project';

const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24;

// In-memory visitor counts (resets on server restart)
const visitorCounts = new Map<string, number>();

function getVisitorKey(contentType: ContentVisitorType, slug: string): string {
    return `${contentType}:${slug}`;
}

function getVisitorCount(contentType: ContentVisitorType, slug: string): number {
    return visitorCounts.get(getVisitorKey(contentType, slug)) ?? 0;
}

function incrementVisitorCount(contentType: ContentVisitorType, slug: string): number {
    const key = getVisitorKey(contentType, slug);
    const current = visitorCounts.get(key) ?? 0;
    const newCount = current + 1;
    visitorCounts.set(key, newCount);
    return newCount;
}

function normalizeVisitorType(value: unknown): ContentVisitorType | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === 'post' || normalizedValue === 'posts' || normalizedValue === 'blog' || normalizedValue === 'blogs') {
        return 'post';
    }

    if (normalizedValue === 'project' || normalizedValue === 'projects') {
        return 'project';
    }

    return null;
}

function buildVisitorCookieName(contentType: ContentVisitorType, slug: string): string {
    const normalizedSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '_');
    return `visitor_counted_${contentType}_${normalizedSlug}`;
}

function parseVisitorParams(request: NextRequest): {
    contentType: ContentVisitorType | null;
    slug: string;
} {
    const contentType = normalizeVisitorType(request.nextUrl.searchParams.get('type'));
    const slug = request.nextUrl.searchParams.get('slug')?.trim() ?? '';

    if (!contentType || !slug) {
        return { contentType: null, slug };
    }

    return {
        contentType,
        slug,
    };
}

export async function GET(request: NextRequest) {
    try {
        const { contentType, slug } = parseVisitorParams(request);

        if (!contentType || !slug) {
            return NextResponse.json({ error: 'Missing or invalid type/slug' }, { status: 400 });
        }

        const visitorCount = getVisitorCount(contentType, slug);
        return NextResponse.json({ visitorCount });
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        return NextResponse.json({ error: 'Failed to fetch visitor count' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const contentType = normalizeVisitorType(body?.type);
        const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';

        if (!contentType || !slug) {
            return NextResponse.json({ error: 'Missing or invalid type/slug' }, { status: 400 });
        }

        const cookieName = buildVisitorCookieName(contentType, slug);
        const alreadyCounted = request.cookies.get(cookieName)?.value === '1';
        const visitorCount = alreadyCounted
            ? getVisitorCount(contentType, slug)
            : incrementVisitorCount(contentType, slug);

        const response = NextResponse.json({ visitorCount, counted: !alreadyCounted });

        if (!alreadyCounted) {
            response.cookies.set({
                name: cookieName,
                value: '1',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: VISITOR_COOKIE_MAX_AGE,
                path: '/',
            });
        }

        return response;
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
        return NextResponse.json({ error: 'Failed to increment visitor count' }, { status: 500 });
    }
}