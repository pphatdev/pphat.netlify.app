'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@lib/utils';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import Image from 'next/image';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { loginAction, type LoginState } from '@app/login/actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                </>
            ) : (
                <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                </>
            )}
        </Button>
    );
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [state, action] = useActionState<LoginState, FormData>(loginAction, undefined);

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="p-0 overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form action={action} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">
                                    Sign in to your PPhat account
                                </p>
                            </div>

                            {state?.error && (
                                <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{state.error}</span>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <SubmitButton />
                        </div>
                    </form>

                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="/assets/placeholder/placeholder.svg"
                            alt="Image"
                            width={200}
                            height={200}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
