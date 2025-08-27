'use client'

import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
    children: React.ReactNode
    redirectTo?: string
    requiredAuth?: boolean
}

export function ProtectedRoute({ 
    children, 
    redirectTo = "/login", 
    requiredAuth = true 
}: ProtectedRouteProps) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (requiredAuth && !user) {
                // User is not authenticated, redirect to login
                router.push(redirectTo)
            } else if (!requiredAuth && user) {
                // User is authenticated but shouldn't be (e.g., on login page)
                router.push("/admin")
            }
        }
    }, [user, loading, requiredAuth, redirectTo, router])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Don't render children if authentication requirements aren't met
    if (requiredAuth && !user) {
        return null
    }

    if (!requiredAuth && user) {
        return null
    }

    return <>{children}</>
}
