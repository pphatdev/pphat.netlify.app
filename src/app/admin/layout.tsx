// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@lib/auth';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@components/ui/sidebar';
import { AdminSidebar } from '@components/sidebar/admin-sidebar';
import { GridPattern } from '@components/ui/grid-pattern';

export default async function AdminLayout({ children }: { children: React.ReactNode; }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const displayUser = {
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role || 'Admin',
    };

    return (
        <SidebarProvider>
            <AdminSidebar
                user={{
                    name: displayUser.name,
                    email: displayUser.email,
                    avatar: displayUser.avatar || '',
                    role: displayUser.role,
                }}
            />
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur">
                    <SidebarTrigger className="mt-0 size-8 rounded-md border border-border/70" />
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Content Administration</p>
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