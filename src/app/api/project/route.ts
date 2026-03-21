import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectBySlug } from '@lib/content';

// Force dynamic rendering to prevent caching issues on Netlify
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        case '.avif':
            return 'image/avif';
        default:
            return 'application/octet-stream';
    }
}

function getProjectFolderName(filePath: string): string {
    return path.basename(path.dirname(filePath));
}

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Missing required slug query parameter' }, { status: 400 });
        }

        const allProjects = await getAllProjects();
        const project = await getProjectBySlug(slug)
            ?? allProjects.find((entry) => entry.id === slug || getProjectFolderName(entry.filePath) === slug);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const assetName = request.nextUrl.searchParams.get('asset')
            ?? request.nextUrl.searchParams.get('assets');

        if (assetName) {
            const safeAssetName = path.basename(assetName);
            const projectDir = path.join(process.cwd(), 'content', path.dirname(project.filePath));
            const assetPath = path.join(projectDir, safeAssetName);

            console.log('[API/Project] Asset request:', {
                slug,
                assetName,
                safeAssetName,
                projectDir,
                assetPath,
                exists: fs.existsSync(assetPath),
            });

            if (safeAssetName !== assetName || !fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
                return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
            }

            const fileBuffer = fs.readFileSync(assetPath);
            const etag = crypto.createHash('md5').update(fileBuffer).digest('hex');
            const ifNoneMatch = request.headers.get('if-none-match');

            // Return 304 if ETag matches
            if (ifNoneMatch === etag) {
                return new NextResponse(null, { status: 304 });
            }

            return new NextResponse(new Uint8Array(fileBuffer), {
                headers: {
                    'Content-Type': getMimeType(assetPath),
                    // Browser caching enabled, but CDN will query each time due to force-dynamic
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'ETag': etag,
                },
            });
        }

        return NextResponse.json(project, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}