'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
    Menu,
    Home,
    FileText,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    LayoutDashboard,
    Image,
    Tag,
    BarChart3
} from 'lucide-react';
import { cn } from '@lib/utils';
import { toast, Toaster } from 'sonner';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    {
        href: '/admin/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: '/admin/posts',
        label: 'Posts',
        icon: FileText,
        children: [
            { href: '/admin/posts', label: 'All Posts', icon: FileText },
            { href: '/admin/posts/new', label: 'New Post', icon: FileText },
        ]
    },
    // {
    //     href: '/admin/media',
    //     label: 'Media',
    //     icon: Image,
    // },
    // {
    //     href: '/admin/categories',
    //     label: 'Categories',
    //     icon: Tag,
    // },
    // {
    //     href: '/admin/users',
    //     label: 'Users',
    //     icon: Users,
    // },
    // {
    //     href: '/admin/analytics',
    //     label: 'Analytics',
    //     icon: BarChart3,
    // },
    // {
    //     href: '/admin/settings',
    //     label: 'Settings',
    //     icon: Settings,
    // },
];

function NavLink({ item, isMobile = false, onClick }: {
    item: NavItem;
    isMobile?: boolean;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
                isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted/50'
            )}
        >
            <Icon className="h-4 w-4" />
            {item.label}
        </Link>
    );
}

function Sidebar({ className }: { className?: string }) {
    return (
        <div className={cn('pb-12 w-64', className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Home className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <h2 className="text-lg font-semibold">Admin Panel</h2>
                    </div>
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <NavLink key={item.href} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Breadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length <= 1) return null;

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
            <span> Admin  </span>
            {segments.slice(1).map((segment, index) => {

                const href = index === 0 ? '/' + segments.slice(0, index + 2).join('/') : `#${index}`;
                const isLast = index === segments.length - 2;
                const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                return (
                    <React.Fragment key={`breadcrumb-${index}-${segment}`}>
                        <ChevronRight className="h-3 w-3" />
                        {isLast ? (
                            <span className="text-foreground font-medium">{label}</span>
                        ) : (
                            <Link href={href} className="hover:text-foreground">
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );

            })}
        </nav>
    );
}


export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Add your logout logic here
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Logged out successfully');
                router.push('/login');
            } else {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    return (
        <div className="flex h-screen bg-background">

            <Toaster />

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block border-r bg-muted/10">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
                        <div className="flex-1">
                            {title && (
                                <div>
                                    <h1 className="text-lg font-semibold">{title}</h1>
                                    {description && (
                                        <p className="text-sm text-muted-foreground">{description}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/pphatdev.png" alt="Admin" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Admin User</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            admin@example.com
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/profile">
                                        <Users className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-4 lg:p-6">
                        <Breadcrumb />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}