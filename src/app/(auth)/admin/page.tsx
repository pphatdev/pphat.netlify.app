'use client'

import { useAuth } from "@components/auth-provider"
import { ProtectedRoute } from "@components/protected-route"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"

export default function AdminPage() {
    const { user, logout } = useAuth()

    return (
        <ProtectedRoute>
            <div className="container mx-auto py-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <Button onClick={logout} variant="outline">
                            Logout
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome, {user?.name || user?.email}!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <strong>Email:</strong> {user?.email}
                                </div>
                                <div>
                                    <strong>User ID:</strong> {user?.id}
                                </div>
                                <div className="pt-4">
                                    <p className="text-muted-foreground">
                                        You are successfully authenticated! This is a protected route 
                                        that requires authentication to access.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Posts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Manage your blog posts</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Manage your projects</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Configure your account</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
