import { AdminSidebar } from "@components/sidebar/admin-sidebar";
import { SiteHeader } from "@app/admin/dashboard/utils/site-header";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import React from "react";

const AdminLayout = (
    { children }: Readonly<{ children: React.ReactNode; }>
) => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AdminSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}


export default AdminLayout;