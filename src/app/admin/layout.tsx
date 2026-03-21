import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@components/ui/sidebar';
import { Separator } from '@components/ui/separator';
import { AdminSidebar } from '@components/sidebar/admin-sidebar';
import { GridPattern } from '@components/ui/grid-pattern';
import { buildClearSessionRedirectPath, hasNextAuthSessionCookies, requireUserSession } from '@lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode; }) {
    const session = await requireUserSession();
    const cookieStore = await cookies();

    if (!session?.user && hasNextAuthSessionCookies(cookieStore)) {
        redirect(buildClearSessionRedirectPath('/login?callbackUrl=/admin'));
    }

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin');
    }

    return (
        <SidebarProvider>
            <AdminSidebar
                user={{
                    name: session.user.name || 'Administrator',
                    email: session.user.email || '',
                    avatar: session.user.image || '',
                    role: session.user.role,
                }}
            />
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur">
                    <SidebarTrigger className="mt-0 size-8 rounded-md border border-border/70" />
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Content Administration</p>
                            {/* <p className="text-xs text-muted-foreground">SQLite-backed dashboard for posts and projects</p> */}
                        </div>
                    </div>
                </header>
                <div className="relative flex-1 overflow-hidden">
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        <GridPattern
                            width={30}
                            height={30}
                            x={-1}
                            y={-1}
                            strokeDasharray="4 2"
                            className="mask-[radial-gradient(720px_circle_at_top_center,white,transparent)] absolute inset-0 h-full w-full"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.03),transparent_38%)]" />
                    </div>
                    <div className="relative p-4 md:p-8">{children}</div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}