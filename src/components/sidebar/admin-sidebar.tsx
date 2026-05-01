"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    IconArrowUpRight,
    IconDashboard,
    IconExternalLink,
    IconFolder,
    IconInbox,
    IconInnerShadowTop,
    IconNews,
} from "@tabler/icons-react"

import { AdminNavUser } from "@components/navbar/admin-nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@components/ui/sidebar"
import { Badge } from "@components/ui/badge"

const navigationItems = [
    { title: "Dashboard", url: "/admin", icon: IconDashboard },
    { title: "Blogs", url: "/admin/blogs", icon: IconNews },
    { title: "Projects", url: "/admin/projects", icon: IconFolder },
    { title: "Contacts", url: "/admin/contacts", icon: IconInbox },
]

const shortcutItems = [
    { title: "Open Site", url: "/", icon: IconExternalLink },
]

function isActivePath(pathname: string, url: string) {
    if (url === "/admin") {
        return pathname === "/admin"
    }

    return pathname === url || pathname.startsWith(`${url}/`)
}

export function AdminSidebar({
    user,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: {
        name: string
        email: string
        avatar?: string
        role: string
    }
}) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="gap-3 p-3">
                <Link
                    href="/admin"
                    className="bg-sidebar-accent/40 border-sidebar-border/60 hover:bg-sidebar-accent/60 flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors"
                >
                    <div className="bg-primary/12 shrink-0 text-primary flex size-10 items-center justify-center rounded-xl border border-current/10">
                        <IconInnerShadowTop className="size-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold tracking-wide">PPhat Admin</span>
                            <Badge variant="outline" className="h-5 rounded-full px-1.5 text-[10px] uppercase">
                                CMS
                            </Badge>
                        </div>
                        <p className="text-sidebar-foreground/70 line-clamp-1 text-xs leading-5">
                            Manage blogs, projects, and publishing workflows.
                        </p>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent className="gap-4 py-2">
                <SidebarGroup className="px-3 py-0">
                    <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActivePath(pathname, item.url)}
                                        className="h-10 rounded-xl px-3"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto px-3 py-0">
                    <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
                        Shortcuts
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {shortcutItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="text-sidebar-foreground/80 h-10 rounded-xl px-3 hover:text-sidebar-accent-foreground"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                            <IconArrowUpRight className="ml-auto size-3.5 opacity-60" />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter className="p-3 pt-2">
                <AdminNavUser user={{ name: user.name, email: user.email, avatar: user.avatar || "", role: user.role }} />
            </SidebarFooter>
        </Sidebar>
    )
}
