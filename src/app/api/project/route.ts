import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_API, NEXT_PUBLIC_APP_URL } from '@lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RemoteProject {
    id: string | number;
    name?: string;
    description?: string;
    image?: string;
    published?: boolean;
    tags?: string[];
    source?: string[];
    authors?: string[];
    languages?: string[];
    created_date?: string;
    updated_date?: string;
    status?: boolean;
    is_deleted?: boolean;
}

function normalizeImage(imagePath?: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/')) return `https://phat.website${imagePath}`;
    return imagePath;
}

function normalizeProject(project: RemoteProject) {
    return {
        id: String(project.id),
        slug: project.name || String(project.id),
        title: project.name || '',
        description: project.description || '',
        image: normalizeImage(project.image),
        published: project.published ?? false,
        tags: Array.isArray(project.tags) ? project.tags : [],
        source: Array.isArray(project.source)
            ? project.source.map((url) => ({
                url,
                name: url.includes('github.com') ? 'Source Code' : 'Live Demo',
                type: url.includes('github.com') ? 'source' : 'demo',
            }))
            : [],
        authors: Array.isArray(project.authors)
            ? project.authors.map((name) => ({
                name,
                profile: '',
                url: NEXT_PUBLIC_APP_URL,
            }))
            : [],
        languages: Array.isArray(project.languages) ? project.languages : [],
        createdAt: project.created_date || new Date().toISOString(),
        updatedAt: project.updated_date,
        content: project.description || '',
    };
}

function getProxyHeaders(request: NextRequest): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const authorization = request.headers.get('authorization');
    if (authorization) headers.Authorization = authorization;

    return headers;
}

async function resolveProjectBySlug(slug: string): Promise<RemoteProject | null> {
    const listRes = await fetch(`${NEXT_PUBLIC_API}/v1/api/projects?page=1&limit=500`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
    });

    if (!listRes.ok) return null;

    const listPayload = (await listRes.json()) as { data?: RemoteProject[] };
    const projects = Array.isArray(listPayload.data) ? listPayload.data : [];
    const matched = projects.find((project) => (project.status ?? true) && !(project.is_deleted ?? false) && (project.name === slug || String(project.id) === slug));
    if (!matched) return null;

    const detailRes = await fetch(`${NEXT_PUBLIC_API}/v1/api/projects/${encodeURIComponent(String(matched.id))}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 60 },
    });

    if (!detailRes.ok) return null;

    const detailPayload = (await detailRes.json()) as unknown;
    const detail = detailPayload && typeof detailPayload === 'object' && 'data' in detailPayload
        ? ((detailPayload as { data?: RemoteProject }).data ?? null)
        : (detailPayload as RemoteProject);
    return detail || null;
}

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Missing required slug query parameter' }, { status: 400 });
        }

        const assetName = request.nextUrl.searchParams.get('asset') ?? request.nextUrl.searchParams.get('assets');
        if (assetName) {
            const safeAsset = assetName.split('/').pop();
            if (!safeAsset) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const assetUrl = `https://phat.website/projects/${encodeURIComponent(slug)}/${encodeURIComponent(safeAsset)}`;
            const assetResponse = await fetch(assetUrl, { cache: 'no-store' });
            if (!assetResponse.ok) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const contentType = assetResponse.headers.get('content-type') || 'application/octet-stream';
            const data = await assetResponse.arrayBuffer();
            return new NextResponse(data, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        const project = await resolveProjectBySlug(slug);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(normalizeProject(project), {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');
        if (!slug) {
            return NextResponse.json({ error: 'Missing required slug query parameter' }, { status: 400 });
        }

        const existingProject = await resolveProjectBySlug(slug);
        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const body = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/projects/${encodeURIComponent(String(existingProject.id))}`, {
            method: 'PATCH',
            headers: {
                ...getProxyHeaders(request),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: body.name ?? body.title,
                description: body.description,
                image: body.image,
                published: body.published,
                tags: Array.isArray(body.tags) ? body.tags : undefined,
                source: Array.isArray(body.source)
                    ? body.source.map((item: string | { url?: string }) => typeof item === 'string' ? item : (item.url ?? '')).filter(Boolean)
                    : undefined,
                authors: Array.isArray(body.authors)
                    ? body.authors.map((item: string | { name?: string }) => typeof item === 'string' ? item : (item.name ?? '')).filter(Boolean)
                    : undefined,
                languages: Array.isArray(body.languages) ? body.languages : undefined,
            }),
        });

        const payload = await response.json().catch(() => ({ error: 'Invalid response from upstream API' }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');
        if (!slug) {
            return NextResponse.json({ error: 'Missing required slug query parameter' }, { status: 400 });
        }

        const existingProject = await resolveProjectBySlug(slug);
        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const response = await fetch(`${NEXT_PUBLIC_API}/v1/api/projects/${encodeURIComponent(String(existingProject.id))}`, {
            method: 'DELETE',
            headers: getProxyHeaders(request),
        });

        const payload = await response.json().catch(() => ({ success: response.ok }));
        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
