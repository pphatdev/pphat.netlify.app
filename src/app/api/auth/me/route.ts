import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_VERIFY_URL = 'https://api.pphatdev.workers.dev/v1/api/auth/verify'

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No authentication token found' },
                { status: 401 }
            )
        }

        // Verify token with external API
        const response = await fetch(AUTH_VERIFY_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            // Token is invalid, clear it
            cookieStore.delete('auth-token')
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        const data = await response.json()

        return NextResponse.json({
            success: true,
            user: data.user,
            message: 'Token is valid'
        })
    } catch (error) {
        console.error('Token verification error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
