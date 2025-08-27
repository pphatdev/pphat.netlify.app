import { LoginForm } from "@components/login-form"
import { ProtectedRoute } from "@components/protected-route"

export default function LoginPage() {
    return (
        <ProtectedRoute requiredAuth={false}>
            <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <LoginForm />
                </div>
            </div>
        </ProtectedRoute>
    )
}
