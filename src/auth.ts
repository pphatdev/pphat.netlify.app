import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NEXT_PUBLIC_API } from "@lib/constants"

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                try {
                    const res = await fetch(`${NEXT_PUBLIC_API}/v1/api/auth/email/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    })

                    const data = await res.json()
                    const token = data?.accessToken || data?.token || data?.data?.token

                    if (!res.ok || !token) {
                        console.error('Authentication failed:', data?.message || data?.error || 'No token returned')
                        throw new Error(data?.message || data?.error || 'Authentication failed')
                    }

                    const userRes = await fetch(`${NEXT_PUBLIC_API}/v1/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })

                    if (!userRes.ok) {
                        const errorData = await userRes.json()
                        console.error('Failed to fetch user profile:', errorData)
                        return null
                    }

                    const userData = await userRes.json()
                    const user = userData?.data || (userData?.id ? userData : null)

                    if (user) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.avatar,
                            role: user.role,
                            token: token // Attach the backend JWT so we can use it later
                        } as any
                    }
                    return null
                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // First time logging in, `user` will be present
            if (user) {
                token.backendToken = (user as any).token;
                token.role = (user as any).role;
                token.id = user.id; // Explicitly persist the ID
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session as any).backendToken = token.backendToken;
                (session.user as any).role = token.role;
                (session.user as any).id = token.id; // Ensure ID is in the session user object
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    }
})
