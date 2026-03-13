import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProjects, paginateProjects } from '@lib/content';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');

        const published = getPublishedProjects();
        const tags = Array.from(
            new Set(published.flatMap((project) => project.tags || []))
        ).sort((a, b) => a.localeCompare(b));
        const { data, total, hasMore } = paginateProjects(published, page, limit);

        return NextResponse.json({
            data,
            hasMore,
            total,
            page,
            limit,
            tags
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error in projects API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
