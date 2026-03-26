import { NextRequest, NextResponse } from 'next/server';

const TRACKING_PARAMS = new Set([
    'ref',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
]);

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    let hasTrackingParam = false;

    for (const key of TRACKING_PARAMS) {
        if (url.searchParams.has(key)) {
            hasTrackingParam = true;
            url.searchParams.delete(key);
        }
    }

    if (!hasTrackingParam) {
        return NextResponse.next();
    }

    return NextResponse.redirect(url, 308);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)',
    ],
};