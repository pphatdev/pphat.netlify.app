import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { NEXT_APP_API } from '@lib/constants'

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
        const response = await fetch(`${NEXT_APP_API}/v1/api/auth/me`, {
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
            user: data.data,
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
