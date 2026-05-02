import Link from 'next/link';
import { IconCalendar, IconInbox, IconMail, IconUser } from '@tabler/icons-react';
import { getCurrentUser } from '@lib/auth';
import { fetchFromApi } from '@lib/api';
import { AdminPageHeader } from '../components/page-header';
import { Badge } from '@components/ui/badge';

function formatDate(value: string) {
    if (!value) return 'N/A';
    try {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

export default async function AdminContactsPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return (
        <div className="flex h-[50vh] items-center justify-center">
            <p className="text-muted-foreground">Unauthorized Access</p>
        </div>
    );

    let contacts: any[] = [];
    let total = 0;
    let error: string | null = null;

    try {
        const response = await fetchFromApi('/v1/api/contact?page=1&limit=50', {}, user.backendToken);
        contacts = response.data || [];
        total = response.pagination?.total || 0;
    } catch (e: any) {
        if (e.digest?.includes('NEXT_REDIRECT')) throw e;
        console.error('Error fetching admin contacts:', e);
        error = e.message;
    }

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Contacts"
                description="Review messages sent via the contact form."
            />

            {error && (
                <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    Failed to load contacts: {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {([
                    {
                        label: 'Total messages',
                        value: total,
                        color: 'text-blue-600 dark:text-blue-400',
                    },
                ] as const).map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3.5 backdrop-blur-sm"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"> {stat.label} </p>
                        <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${stat.color}`}> {stat.value} </p>
                    </div>
                ))}
            </div>

            {/* List */}
            {contacts.length === 0 && !error ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-border/70 bg-background/50 px-6 py-16 text-center">
                    <IconInbox className="size-10 text-muted-foreground/40" />
                    <p className="mt-4 font-medium text-foreground">No messages yet</p>
                    <p className="mt-1 text-sm text-muted-foreground"> When people use your contact form, they will show up here. </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-muted/30 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-foreground">{contact.subject || '(No Subject)'}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <IconUser className="size-3.5" />
                                            {contact.name}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <IconMail className="size-3.5" />
                                            {contact.email}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <IconCalendar className="size-3.5" />
                                            {formatDate(contact.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider bg-background/50">
                                    {contact.ip_address}
                                </Badge>
                            </div>

                            <hr className="border-border/40" />

                            <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                                {contact.message}
                            </div>

                            <div className="mt-1 text-[10px] text-muted-foreground/60 italic">
                                UA: {contact.user_agent}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
