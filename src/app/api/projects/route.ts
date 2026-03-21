import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProjects, paginateProjects } from '@lib/content';
import { requireUserSession } from '@lib/auth';
import { createProjectRecord } from '@lib/db/admin-content';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');

        const published = await getPublishedProjects();
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

export async function POST(request: NextRequest) {
    try {
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const requiredFields = ['title', 'description', 'content'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
            }
        }

        const createdProject = await createProjectRecord({
            title: body.title,
            slug: body.slug,
            description: body.description || '',
            image: body.image || '',
            content: body.content || '',
            tags: body.tags || [],
            languages: body.languages || [],
            source: body.source || [],
            authors: body.authors || [],
            published: body.published ?? false,
        });

        if (!createdProject) {
            return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: createdProject,
            message: 'Project created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
}
