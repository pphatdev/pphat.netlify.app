'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@lib/types/interfaces'
import { getCurrentUser, logoutUser } from '@lib/utils/auth'

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (user: User) => void
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            setLoading(true)
            const response = await getCurrentUser()

            if (response.success && response.user) {
                setUser(response.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check error:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = (userData: User) => {
        setUser(userData)
    }

    const logout = async () => {
        try {
            setLoading(true)
            const response = await logoutUser()

            if (response.success) {
                setUser(null)
                // Redirect to login page
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        checkAuth,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
