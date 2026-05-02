'use server'

import { signIn } from "src/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const callbackUrl = formData.get('callbackUrl') as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || "/admin",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid email or password" }
                default:
                    return { error: "Something went wrong. Please try again." }
            }
        }
        throw error // Rethrow redirect errors (Next.js needs them)
    }
}
