import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const MIME: Record<string, string> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
    svg: 'image/svg+xml',
};

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif';
type FitOption = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

function resolvePublicPath(src: string): string | null {
    // Decode and normalise, then resolve relative to public/
    const decoded = decodeURIComponent(src);
    const resolved = path.resolve(PUBLIC_DIR, decoded.replace(/^\/+/, ''));

    // Guard against path-traversal: the resolved path must stay inside PUBLIC_DIR
    if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== PUBLIC_DIR) {
        return null;
    }
    return resolved;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * GET /api/image
 *
 * Query parameters:
 *  src      – path relative to /public (required), e.g. /assets/logo/logo.png
 *  w        – output width  in px  (1 – 4096)
 *  h        – output height in px  (1 – 4096)
 *  q        – quality 1-100, default 80 (jpeg / webp / avif)
 *  format   – output format: jpeg | png | webp | avif  (default: original ext or webp)
 *  fit      – sharp fit mode: cover | contain | fill | inside | outside  (default: inside)
 *  blur     – gaussian blur radius 0.3 – 1000 (optional)
 *  grayscale– 1 to convert to grayscale (optional)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const src = searchParams.get('src');
    if (!src) {
        return NextResponse.json({ error: 'Missing required param: src' }, { status: 400 });
    }

    const filePath = resolvePublicPath(src);
    if (!filePath) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Stat the file for ETag / Last-Modified
    const stat = fs.statSync(filePath);
    const etag = `"${stat.size}-${stat.mtimeMs}"`;
    const lastModified = stat.mtime.toUTCString();

    // Conditional request support
    if (
        request.headers.get('if-none-match') === etag ||
        request.headers.get('if-modified-since') === lastModified
    ) {
        return new NextResponse(null, { status: 304 });
    }

    const ext = path.extname(filePath).slice(1).toLowerCase();

    // SVG / GIF: pass through without processing
    if (ext === 'svg' || ext === 'gif') {
        const buffer = fs.readFileSync(filePath);
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': MIME[ext] ?? 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
                ETag: etag,
                'Last-Modified': lastModified,
            },
        });
    }

    // Parse optimisation params
    const wRaw = searchParams.get('w');
    const hRaw = searchParams.get('h');
    const qRaw = searchParams.get('q');
    const formatRaw = searchParams.get('format') ?? ext;
    const fitRaw = searchParams.get('fit') ?? 'inside';
    const blurRaw = searchParams.get('blur');
    const grayscale = searchParams.get('grayscale') === '1';

    const width = wRaw ? clamp(parseInt(wRaw, 10), 1, 4096) : undefined;
    const height = hRaw ? clamp(parseInt(hRaw, 10), 1, 4096) : undefined;
    const quality = qRaw ? clamp(parseInt(qRaw, 10), 1, 100) : 80;
    const format: OutputFormat = (['jpeg', 'jpg', 'png', 'webp', 'avif'].includes(formatRaw)
        ? formatRaw === 'jpg' ? 'jpeg' : formatRaw
        : 'webp') as OutputFormat;
    const fit: FitOption = (['cover', 'contain', 'fill', 'inside', 'outside'].includes(fitRaw)
        ? fitRaw
        : 'inside') as FitOption;

    try {
        let pipeline = sharp(filePath);

        if (width || height) {
            pipeline = pipeline.resize({ width, height, fit, withoutEnlargement: true });
        }

        if (grayscale) {
            pipeline = pipeline.grayscale();
        }

        if (blurRaw) {
            const blurVal = clamp(parseFloat(blurRaw), 0.3, 1000);
            pipeline = pipeline.blur(blurVal);
        }

        switch (format) {
            case 'jpeg':
                pipeline = pipeline.jpeg({ quality, mozjpeg: true });
                break;
            case 'png':
                pipeline = pipeline.png({ quality });
                break;
            case 'avif':
                pipeline = pipeline.avif({ quality });
                break;
            case 'webp':
            default:
                pipeline = pipeline.webp({ quality });
                break;
        }

        const outputBuffer = await pipeline.toBuffer();
        const contentType = MIME[format] ?? 'image/webp';

        return new NextResponse(outputBuffer.buffer as ArrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                ETag: etag,
                'Last-Modified': lastModified,
                'X-Image-Width': String(width ?? ''),
                'X-Image-Height': String(height ?? ''),
                'X-Image-Format': format,
            },
        });
    } catch (err) {
        console.error('[api/image] sharp error:', err);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
