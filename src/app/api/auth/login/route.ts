import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { NEXT_APP_API } from '@lib/constants';

interface LoginRequest {
    email: string
    password: string
}

interface LoginResponse {
    status: number;
    success: boolean
    version: string
    data: {
        type?: string;
        token: string;
        user: {
            id: number | string;
            name: string;
            email: string;
            email_verified?: number | 0 | 1 | boolean;
            role: 'admin' | 'user';
            is_deleted?: number | 0 | 1 | boolean;
            status?: number | 0 | 1 | boolean;
            created_date?: string;
            updated_date?: string;
        }
    };
    message?: string
}

export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json()
        const { email, password } = body

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Call external auth API
        const response = await fetch(`${NEXT_APP_API}/v1/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        const data: LoginResponse = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || 'Authentication failed'
                },
                { status: response.status }
            )
        }

        if (data.success && data.data.token) {
            // Set HTTP-only cookie for the token
            const cookieStore = await cookies()

            cookieStore.set('auth-token', data.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            })

            // Return user data (without token for security)
            return NextResponse.json({
                success: true,
                user: data.data.user,
                message: 'Login successful'
            })
        }

        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
