import { NextRequest, NextResponse } from 'next/server';
import { NEXTAUTH_COOKIE_NAMES } from '@lib/auth';

const COOKIE_PATHS = ['/', '/api/auth'];
const COOKIE_SUFFIXES = ['', '.0', '.1', '.2', '.3', '.4'];

function expireCookie(response: NextResponse, name: string, path: string) {
    response.cookies.set({
        name,
        value: '',
        expires: new Date(0),
        path,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}

export async function GET(request: NextRequest) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')?.trim() || '/login';
    const redirectUrl = new URL(callbackUrl, request.url);
    const response = NextResponse.redirect(redirectUrl);

    for (const cookieName of NEXTAUTH_COOKIE_NAMES) {
        for (const suffix of COOKIE_SUFFIXES) {
            const fullCookieName = `${cookieName}${suffix}`;
            response.cookies.delete(fullCookieName);

            for (const path of COOKIE_PATHS) {
                expireCookie(response, fullCookieName, path);
            }
        }
    }

    return response;
}