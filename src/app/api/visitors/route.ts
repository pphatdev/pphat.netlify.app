import { NextRequest, NextResponse } from 'next/server';
import {
    getVisitorCount,
    incrementVisitorCount,
    type ContentVisitorType,
} from '@lib/db/visitor-counts';

function parseVisitorParams(request: NextRequest): {
    contentType: ContentVisitorType | null;
    slug: string;
} {
    const contentType = request.nextUrl.searchParams.get('type');
    const slug = request.nextUrl.searchParams.get('slug')?.trim() ?? '';

    if ((contentType !== 'post' && contentType !== 'project') || !slug) {
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

        const visitorCount = await getVisitorCount(contentType, slug);
        return NextResponse.json({ visitorCount });
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        return NextResponse.json({ error: 'Failed to fetch visitor count' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const contentType = body?.type;
        const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';

        if ((contentType !== 'post' && contentType !== 'project') || !slug) {
            return NextResponse.json({ error: 'Missing or invalid type/slug' }, { status: 400 });
        }

        const visitorCount = await incrementVisitorCount(contentType, slug);
        return NextResponse.json({ visitorCount });
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
        return NextResponse.json({ error: 'Failed to increment visitor count' }, { status: 500 });
    }
}