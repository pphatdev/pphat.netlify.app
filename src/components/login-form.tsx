'use client';

import { useActionState } from 'react';
import { loginAction } from '@app/login/actions';
import { cn } from '@lib/utils';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import Image from 'next/image';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';
import { NEXT_PUBLIC_API } from '@lib/constants';

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <Button type="submit" disabled={pending} className="w-full ring-1 ring-foreground/10 mt-5 justify-center text-center">
            {pending
                ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in… </>)
                : (<> <LogIn className="mr-2 h-4 w-4" /> Login </>)
            }
        </Button>
    );
}

export function LoginForm({ className, callbackUrl, ...props }: React.ComponentProps<'div'> & { callbackUrl?: string }) {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="p-0 rounded-3xl bg-background overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form action={formAction} className="p-6 md:p-12">
                        <input type="hidden" name="callbackUrl" value={callbackUrl || ''} />
                        <div className="flex flex-col gap-5 text-foreground/90">
                            <div className="flex flex-col items-center mb-5 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground"> Sign in to your PPhat account </p>
                            </div>

                            {state?.error && (
                                <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{state.error}</span>
                                </div>
                            )}

                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" autoComplete="email" required className='rounded-xl' />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline" > Forgot your password? </a>
                                </div>
                                <Input id="password" name="password" type="password" autoComplete="current-password" required className='rounded-xl' />
                            </div>

                            <SubmitButton pending={isPending} />

                            <div className="relative text-center mt-5 text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>

                            <div className='grid grid-cols-2 gap-1'>
                                <Button type="button" disabled className="w-full ring-1 mt-5 ring-foreground/10 bg-background justify-center text-center rounded-r-none">
                                    <a href={`${NEXT_PUBLIC_API}/v1/api/auth/google`} className="flex items-center justify-center w-full text-foreground/90">
                                        <IconBrandGoogle fill='currentColor' strokeWidth={0} className="mr-2 h-4 w-4" />
                                        Login with Google
                                    </a>
                                </Button>
                                <Button type="button" className="w-full ring-1 mt-5 ring-foreground/10 bg-background justify-center text-center rounded-l-none">
                                    <a href={`${NEXT_PUBLIC_API}/v1/api/auth/github`} className="flex items-center justify-center w-full text-foreground/90">
                                        <IconBrandGithub className="mr-2 h-4 w-4" />
                                        Login with GitHub
                                    </a>
                                </Button>
                            </div>

                        </div>
                    </form>

                    <div className="relative hidden bg-muted md:block">
                        <Image src="/assets/placeholder/placeholder.svg" alt="Image" width={200} height={200} className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
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
