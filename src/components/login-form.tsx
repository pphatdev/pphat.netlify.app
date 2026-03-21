"use client"

import { startTransition, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@lib/utils"
import { Button } from "@components/ui/button"
import { Card, CardContent } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"

type LoginFormMode = "login" | "signup"

const authErrorMessages: Record<string, string> = {
    CredentialsSignin: "Invalid email or password.",
    AccessDenied: "Access was denied for this sign-in attempt.",
    Configuration: "Authentication is not configured correctly.",
}

export function LoginForm({
    mode = "login",
    callbackUrl = "/admin",
    githubEnabled = false,
    error,
    className,
    ...props
}: React.ComponentProps<"div"> & {
    mode?: LoginFormMode;
    callbackUrl?: string;
    githubEnabled?: boolean;
    error?: string;
}) {
    const router = useRouter()
    const isSignup = mode === "signup"
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const errorMessage = useMemo(() => {
        if (!error) return ""
        return authErrorMessages[error] ?? "Authentication failed."
    }, [error])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            if (isSignup) {
                const signupResponse = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password }),
                })

                const signupPayload = await signupResponse.json()
                if (!signupResponse.ok) {
                    toast.error(signupPayload.error || "Failed to create account")
                    return
                }
            }

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            })

            if (result?.error) {
                toast.error(authErrorMessages[result.error] ?? "Authentication failed")
                return
            }

            toast.success(isSignup ? "Account created" : "Signed in")
            router.push(result?.url || callbackUrl)
            router.refresh()
        } catch (submitError) {
            console.error("Authentication error", submitError)
            toast.error("Failed to complete authentication")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleGitHubSignIn() {
        startTransition(() => {
            signIn("github", { callbackUrl })
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-border/60 bg-background/95 p-0 shadow-xl backdrop-blur">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    {isSignup ? "Create admin access" : "Admin sign in"}
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    {isSignup
                                        ? "Create a local account or continue with GitHub. The first account becomes admin."
                                        : "Sign in with your local account or GitHub to manage posts and projects."}
                                </p>
                            </div>
                            {errorMessage ? (
                                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {errorMessage}
                                </div>
                            ) : null}
                            {isSignup ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        placeholder="Sophat Leat"
                                        required
                                    />
                                </div>
                            ) : null}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    minLength={8}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-0 h-10 w-full justify-center px-4"
                            >
                                {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                                {isSignup ? "Create Account" : "Sign In"}
                            </Button>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <Button
                                type="button"
                                disabled={!githubEnabled || isSubmitting}
                                onClick={handleGitHubSignIn}
                                className="mt-0 h-10 w-full justify-center px-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                                    <path
                                        d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.35-3.88-1.35-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18A11.06 11.06 0 0 1 12 6.1c.98 0 1.96.13 2.88.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Continue with GitHub
                            </Button>
                            {!githubEnabled ? (
                                <p className="text-center text-xs text-muted-foreground">
                                    GitHub login is disabled until GITHUB_ID and GITHUB_SECRET are configured.
                                </p>
                            ) : null}
                            <div className="text-center text-sm">
                                {isSignup ? "Already have an account?" : "Need an account?"}{" "}
                                <Link
                                    href={isSignup ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                                    className="font-medium underline underline-offset-4"
                                >
                                    {isSignup ? "Sign in" : "Sign up"}
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="/assets/placeholder/placeholder.svg"
                            alt="Authentication illustration"
                            fill
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                        <div className="absolute inset-0 bg-linear-to-br from-background/10 via-transparent to-black/40" />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                Admin access is restricted to project managers and content editors for this site.
            </div>
        </div>
    )
}
