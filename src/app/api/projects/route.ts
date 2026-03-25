import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_API, NEXT_PUBLIC_APP_URL } from '@lib/constants';

interface RemoteProject {
    id: string | number;
    name?: string;
    description?: string;
    image?: string;
    published?: boolean;
    tags?: string[];
    source?: Array<string | { url?: string; name?: string; type?: string }>;
    authors?: Array<string | { name?: string; profile?: string; url?: string }>;
    languages?: string[];
    created_date?: string;
    updated_date?: string;
    status?: boolean;
    is_deleted?: boolean;
}

interface RemoteProjectsResponse {
    data?: RemoteProject[];
    total?: number;
}

function getProxyHeaders(request: NextRequest): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const authorization = request.headers.get('authorization');
    if (authorization) headers.Authorization = authorization;

    return headers;
}

function normalizeProject(project: RemoteProject) {
    const image = project.image && project.image.startsWith('/')
        ? `https://phat.website${project.image}`
        : (project.image || '');

    return {
        id: String(project.id),
        slug: project.name || String(project.id),
        title: project.name || '',
        description: project.description || '',
        image,
        published: project.published ?? false,
        tags: Array.isArray(project.tags) ? project.tags : [],
        source: Array.isArray(project.source)
            ? project.source
                .map((item) => {
                    const resolvedUrl = typeof item === 'string' ? item : (item?.url ?? '');
                    const name = typeof item === 'string'
                        ? (resolvedUrl.includes('github.com') ? 'Source Code' : 'Live Demo')
                        : (item?.name || (resolvedUrl.includes('github.com') ? 'Source Code' : 'Live Demo'));
                    const type = typeof item === 'string'
                        ? (resolvedUrl.includes('github.com') ? 'source' : 'demo')
                        : (item?.type || (resolvedUrl.includes('github.com') ? 'source' : 'demo'));

                    return {
                        url: resolvedUrl,
                        name,
                        type,
                    };
                })
                .filter((sourceItem) => Boolean(sourceItem.url))
            : [],
        authors: Array.isArray(project.authors)
            ? project.authors.map((item) => ({
                name: typeof item === 'string' ? item : (item?.name || 'Unknown'),
                profile: typeof item === 'string' ? '' : (item?.profile || ''),
                url: typeof item === 'string' ? NEXT_PUBLIC_APP_URL : (item?.url || NEXT_PUBLIC_APP_URL),
            }))
            : [],
        languages: Array.isArray(project.languages) ? project.languages : [],
        createdAt: project.created_date || new Date().toISOString(),
        updatedAt: project.updated_date,
        content: project.description || '',
    };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number.parseInt(searchParams.get('page') || '1', 10);
        const limit = Number.parseInt(searchParams.get('limit') || '9', 10);

        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit !== 0 ? limit : 9;
        const MAX_REMOTE_LIMIT = 100;
        const remoteLimit = safeLimit === -1 ? MAX_REMOTE_LIMIT : Math.min(safeLimit, MAX_REMOTE_LIMIT);

        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/projects?page=${safePage}&limit=${remoteLimit}`, {
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const payload = (await response.json()) as RemoteProjectsResponse;
        const published = (Array.isArray(payload.data) ? payload.data : [])
            .filter((project) => (project.status ?? true) && !(project.is_deleted ?? false) && (project.published ?? false))
            .map(normalizeProject);
        const total = typeof payload.total === 'number' ? payload.total : published.length;

        const tags = Array.from(
            new Set(published.flatMap((project) => project.tags || []))
        ).sort((a, b) => a.localeCompare(b));

        const data = published;
        const hasMore = safeLimit === -1 ? false : (safePage * remoteLimit < total);

        return NextResponse.json({
            data,
            hasMore,
            total,
            page: safePage,
            limit: safeLimit,
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
        const body = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/projects`, {
            method: 'POST',
            headers: {
                ...getProxyHeaders(request),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: body.name ?? body.title,
                description: body.description,
                image: body.image,
                published: body.published,
                tags: Array.isArray(body.tags) ? body.tags : [],
                source: Array.isArray(body.source)
                    ? body.source.map((item: string | { url?: string }) => typeof item === 'string' ? item : (item.url ?? '')).filter(Boolean)
                    : [],
                authors: Array.isArray(body.authors)
                    ? body.authors.map((item: string | { name?: string }) => typeof item === 'string' ? item : (item.name ?? '')).filter(Boolean)
                    : [],
                languages: Array.isArray(body.languages) ? body.languages : [],
            }),
        });

        const payload = await response.json().catch(() => ({ error: 'Invalid response from upstream API' }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
