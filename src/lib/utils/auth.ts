import { AuthResponse, LoginCredentials, User } from '@lib/types/interfaces'

/**
 * Login user with email and password
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            message: 'Network error occurred'
        }
    }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<AuthResponse> {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Logout error:', error)
        return {
            success: false,
            message: 'Network error occurred'
        }
    }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Get current user error:', error)
        return {
            success: false,
            message: 'Network error occurred'
        }
    }
}

/**
 * Check if user is authenticated (client-side check)
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    // This is a simple client-side check
    // For more security, you should always verify with the server
    return document.cookie.includes('auth-token')
}
