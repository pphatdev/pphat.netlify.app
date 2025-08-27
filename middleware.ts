import { NextRequest, NextResponse } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
    '/admin',
    '/dashboard',
    '/profile',
]

// Define public routes that don't require authentication
const publicRoutes = [
    '/login',
    '/register',
    '/',
    '/about',
    '/contact',
    '/projects',
    '/posts',
    '/gallery',
]

const AUTH_VERIFY_URL = 'https://api.pphatdev.workers.dev/v1/api/auth/verify'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('auth-token')

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // Allow API routes and static files to pass through
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // If it's a protected route and no token exists, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If user has a token and tries to access login page, verify token
    if (pathname === '/login' && token) {
        try {
            // Verify token with external API
            const response = await fetch(AUTH_VERIFY_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                // Token is valid, redirect to dashboard or callback URL
                const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/admin'
                return NextResponse.redirect(new URL(callbackUrl, request.url))
            } else {
                // Token is invalid, clear it and allow access to login page
                const response = NextResponse.next()
                response.cookies.delete('auth-token')
                return response
            }
        } catch (error) {
            console.error('Token verification error in middleware:', error)
            // If verification fails, clear token and allow login
            const response = NextResponse.next()
            response.cookies.delete('auth-token')
            return response
        }
    }

    // For protected routes with token, verify the token
    if (isProtectedRoute && token) {
        try {
            const response = await fetch(AUTH_VERIFY_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                // Token is invalid, clear it and redirect to login
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('callbackUrl', pathname)
                const redirectResponse = NextResponse.redirect(loginUrl)
                redirectResponse.cookies.delete('auth-token')
                return redirectResponse
            }
        } catch (error) {
            console.error('Token verification error in middleware:', error)
            // If verification fails, redirect to login
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', pathname)
            const redirectResponse = NextResponse.redirect(loginUrl)
            redirectResponse.cookies.delete('auth-token')
            return redirectResponse
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)',
    ],
}
