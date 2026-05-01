import Link from 'next/link';
import {
    ArrowRight,
    Eye,
    FileClock,
    FolderKanban,
    Inbox,
    Layers3,
    MessageSquareMore,
    PenSquare,
    Rocket,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { headers } from 'next/headers';
import { getCurrentUser } from '@lib/auth';
import { fetchFromApi } from '@lib/api';
import { AdminPageHeader } from './components/page-header';
import { AdminTrafficSpotlight } from './components/dashboard-chart';
import { AdminDashboardLiveTraffic } from './components/dashboard-live-traffic';
import { Badge } from '@components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

function formatCompactNumber(value: number) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: value >= 1000 ? 1 : 0,
    }).format(value);
}

function formatShortDate(value: string) {
    if (!value) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(value));
}

function initialsFromName(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase() ?? '')
        .join('');
}

function MetricCard({
    title,
    value,
    detail,
    icon,
    tone,
}: {
    title: string;
    value: string;
    detail: string;
    icon: React.ReactNode;
    tone: string;
}) {
    return (
        <Card className="overflow-hidden rounded-3xl ring-0 bg-background py-0 backdrop-blur-sm">
            <CardContent className="relative px-5 py-5">
                <div className={`absolute inset-x-0 top-0 h-24 bg-linear-to-br ${tone} opacity-70`} />
                <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
                            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
                        </div>
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-background/90 text-foreground">
                            {icon}
                        </div>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default async function AdminDashboardPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const [dashboard, contactResponse] = await Promise.all([
        // Use the local proxy route as requested
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dashboard/init`, {
            headers: await headers(),
            cache: 'no-store'
        }).then(res => res.json()).catch(() => ({
            blogs: { total: 0, published: 0, draft: 0 },
            projects: { total: 0, published: 0, draft: 0 },
            liveTraffic: 0,
            topPosts: [],
            topProjects: [],
            newestPosts: [],
            newestProjects: [],
            newestContributors: []
        })),
        fetchFromApi('/v1/api/contact?limit=5', {}, user.backendToken).catch(() => ({ data: [], pagination: { total: 0 } }))
    ]);

    const totalVisitors = dashboard.liveTraffic;
    const publishedPosts = dashboard.blogs.published;
    const publishedProjects = dashboard.projects.published;
    const totalEntries = dashboard.blogs.total + dashboard.projects.total;
    const publishedEntries = publishedPosts + publishedProjects;
    const publicationRate = totalEntries === 0 ? 0 : Math.round((publishedEntries / totalEntries) * 100);

    const totalViews = dashboard.topPosts.reduce((sum: number, post: any) => sum + (post.stats?.views || 0), 0);
    const totalReadingMins = dashboard.topPosts.reduce((sum: number, post: any) => sum + (post.stats?.readingMins || 0), 0);

    const contactRows = (contactResponse.data || []).map((c: any) => ({
        id: c.id,
        subject: c.subject || 'No Subject',
        name: c.name,
        email: c.email,
        deliveryStatus: 'received',
        isSpam: false,
        createdAt: c.created_at || c.createdAt
    }));

    const userRows = (dashboard.newestContributors || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email || '',
        image: u.avatarUrl || u.avatar || '',
        bio: u.bio || '',
        role: u.role || 'Contributor',
        provider: u.provider || 'system',
        createdAt: u.createdAt
    }));

    const totalContacts = contactResponse.pagination?.total || contactRows.length;
    const pendingContacts = contactRows.filter((contact: any) => contact.deliveryStatus !== 'delivered' && !contact.isSpam).length;

    const recentActivity = [
        ...dashboard.newestPosts.map((post: any) => ({
            id: post.id,
            type: 'Blog' as const,
            title: post.title,
            thumbnail: post.thumbnail,
            href: `/admin/blogs/${post.id}`,
            slug: post.slug,
            published: post.published,
            date: post.updatedAt || post.createdAt,
        })),
        ...dashboard.newestProjects.map((project: any) => ({
            id: project.id,
            type: 'Project' as const,
            title: project.title,
            thumbnail: project.thumbnail,
            href: `/admin/projects/${project.id}`,
            slug: project.slug,
            published: project.published,
            date: project.createdAt,
        }))
    ]
        .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
        .slice(0, 6);

    const draftQueue = [
        ...dashboard.newestPosts.filter((post: any) => !post.published).map((post: any) => ({
            id: post.id,
            title: post.title,
            href: `/admin/blogs/${post.id}`,
            kind: 'Blog' as const,
            detail: post.slug,
            createdAt: post.createdAt,
        })),
        ...dashboard.newestProjects.filter((project: any) => !project.published).map((project: any) => ({
            id: project.id,
            title: project.title,
            href: `/admin/projects/${project.id}`,
            kind: 'Project' as const,
            detail: project.slug,
            createdAt: project.createdAt,
        }))
    ]
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 5);

    const topPerformers = [
        ...dashboard.topPosts.map((post: any) => ({
            label: post.title,
            visitors: post.stats?.views ?? post.visitorCount ?? 0,
            thumbnail: post.thumbnail,
            type: 'Blog' as const,
            status: post.published ? 'Published' as const : 'Draft' as const,
            href: `/admin/blogs/${post.id}`,
        })),
        ...dashboard.topProjects.map((project: any) => ({
            label: project.title,
            visitors: project.visitorCount ?? 0,
            thumbnail: project.thumbnail,
            type: 'Project' as const,
            status: project.published ? 'Published' as const : 'Draft' as const,
            href: `/admin/projects/${project.id}`,
        }))
    ]
        .sort((left, right) => right.visitors - left.visitors)
        .slice(0, 6);

    const latestContact = contactRows[0];
    const adminUsers = userRows.filter((user: any) => user.role.toLowerCase() === 'admin');
    const editorUsers = userRows.filter((user: any) => user.role.toLowerCase() !== 'admin');
    const githubUsers = userRows.filter((user: any) => user.provider === 'github');

    const tagHighlights: [string, number][] = [];
    const tagMap = new Map<string, number>();
    [...dashboard.topPosts, ...dashboard.topProjects].forEach((item: any) => {
        (item.tags || []).forEach((tag: any) => {
            const tagName = typeof tag === 'string' ? tag : (tag.tag || tag.name);
            tagMap.set(tagName, (tagMap.get(tagName) || 0) + 1);
        });
    });
    Array.from(tagMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(entry => tagHighlights.push(entry));

    const recentPosts = dashboard.newestPosts.slice(0, 4);
    const recentProjects = dashboard.newestProjects.slice(0, 4);


    return (
        <div className="gap-6 grid grid-cols-1">
            <AdminPageHeader
                title="Dashboard"
                description="Monitor publishing momentum, traffic leaders, and admin workflow from one control room."
            />

            <section className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Blogs"
                    value={dashboard.blogs.total.toString()}
                    detail={`${publishedPosts} published · ${dashboard.blogs.draft} draft`}
                    icon={<PenSquare className="size-5" />}
                    tone="from-blue-500/16 via-blue-500/10 to-transparent"
                />
                <MetricCard
                    title="Projects"
                    value={dashboard.projects.total.toString()}
                    detail={`${publishedProjects} live · ${dashboard.projects.draft} private`}
                    icon={<FolderKanban className="size-5" />}
                    tone="from-teal-500/16 via-teal-500/10 to-transparent"
                />
                <MetricCard
                    title="Total Reach"
                    value={formatCompactNumber(totalViews || totalVisitors)}
                    detail={`Across top content · ${totalReadingMins}m read time`}
                    icon={<Eye className="size-5" />}
                    tone="from-amber-500/16 via-amber-500/10 to-transparent"
                />
                <MetricCard
                    title="Inbox"
                    value={totalContacts.toString()}
                    detail={`${pendingContacts} pending messages`}
                    icon={<Inbox className="size-5" />}
                    tone="from-fuchsia-500/14 via-fuchsia-500/10 to-transparent"
                />
            </section>

            <section className="grid gap-6 mt-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
                <Card className="relative overflow-hidden rounded-4xl bg-background/80 py-0 dark:ring-2 ring-primary/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(15,118,110,0.15),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%)]" />

                    <CardContent className="relative px-6 py-6 sm:pt-0 sm:px-7 sm:py-7">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-2xl w-full grid gap-4">
                                    <Badge variant="outline" className="rounded-full border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                                        Live Pulse
                                    </Badge>
                                    <div className="space-y-3">
                                        <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                            Content performance and real-time visitor momentum.
                                        </h2>
                                        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                                            You've published {publishedEntries} items with a {publicationRate}% completion rate.
                                            Currently tracking {totalVisitors} active sessions across the platform.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:min-w-72 sm:grid-cols-2">
                                    <Button asChild variant="outline" className="h-11 rounded-full border-border/60 bg-background/50 backdrop-blur-sm">
                                        <Link href="/admin/projects/new">
                                            <FolderKanban className="size-4 mr-2" />
                                            New Project
                                        </Link>
                                    </Button>
                                    <Button asChild className="h-11 rounded-full shadow-lg shadow-primary/20">
                                        <Link href="/admin/blogs/new">
                                            <PenSquare className="size-4 mr-2" />
                                            New Blog
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-2xl border border-border/40 bg-background/40 p-5 backdrop-blur-md">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Publish Rate</p>
                                    <div className="mt-4 flex items-end gap-3">
                                        <p className="text-4xl font-bold tracking-tighter">{publicationRate}%</p>
                                        <Badge className="mb-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Stable</Badge>
                                    </div>
                                    <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${publicationRate}%` }} />
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border/40 bg-background/40 p-5 backdrop-blur-md">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Team Active</p>
                                    <div className="mt-4 flex items-end gap-3">
                                        <p className="text-4xl font-bold tracking-tighter">{userRows.length}</p>
                                        <p className="mb-1 text-sm text-muted-foreground font-medium">Members</p>
                                    </div>
                                    <div className="mt-5 flex -space-x-2">
                                        {userRows.slice(0, 5).map((user: any) => (
                                            <Avatar key={user.id} className="size-8 border-2 border-background ring-1 ring-border/50">
                                                <AvatarImage src={user.image} alt={user.name} />
                                                <AvatarFallback className="text-[10px]">{initialsFromName(user.name)}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {userRows.length > 5 && (
                                            <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold ring-1 ring-border/50">
                                                +{userRows.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border/40 bg-background/40 p-5 backdrop-blur-md max-lg:col-span-full">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Inbox Pressure</p>
                                    <div className="mt-4 flex items-end gap-3">
                                        <p className="text-4xl font-bold tracking-tighter">{pendingContacts}</p>
                                        <Badge variant="outline" className="mb-1 rounded-full border-amber-500/50 text-amber-600 dark:text-amber-400">Attention</Badge>
                                    </div>
                                    <p className="mt-5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                        Latest: {latestContact?.subject || 'None'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden rounded-4xl bg-background/80 py-0 dark:ring-2 ring-primary/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Real-time</CardDescription>
                                <CardTitle className="text-2xl tracking-tight">Traffic Monitor</CardTitle>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Rocket className="size-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 py-6">
                        <AdminDashboardLiveTraffic initialValue={dashboard.liveTraffic} />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <span>Blogs Live</span>
                                    <span>{publishedPosts}/{dashboard.blogs.total}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted/70 overflow-hidden">
                                    <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${dashboard.blogs.total === 0 ? 0 : (publishedPosts / dashboard.blogs.total) * 100}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <span>Projects Live</span>
                                    <span>{publishedProjects}/{dashboard.projects.total}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted/70 overflow-hidden">
                                    <div className="h-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)] transition-all duration-1000" style={{ width: `${dashboard.projects.total === 0 ? 0 : (publishedProjects / dashboard.projects.total) * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Topic Clusters</p>
                            <div className="flex flex-wrap gap-2">
                                {tagHighlights.length > 0 ? tagHighlights.map(([tag, count]) => (
                                    <Badge key={tag} variant="secondary" className="rounded-lg bg-primary/5 hover:bg-primary/10 border-primary/10 px-2 py-1 text-[11px] font-medium transition-colors">
                                        #{tag} <span className="ml-1 opacity-50">{count}</span>
                                    </Badge>
                                )) : (
                                    <p className="text-[11px] text-muted-foreground italic">No tags identified yet.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.9fr)]">
                <Card className="overflow-hidden rounded-[32px] bg-background/80 py-0 backdrop-blur-sm shadow-xl shadow-black/5">
                    <CardHeader className="border-b border-border/60 px-6 pb-5 pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Content Radar</CardDescription>
                                <CardTitle className="mt-1 text-2xl tracking-tight">Top performing content</CardTitle>
                            </div>
                            <Link href="/admin/blogs" className="group flex items-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                                Full analytics <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 py-6">
                        <AdminTrafficSpotlight items={topPerformers} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[32px] bg-background/80 py-0 backdrop-blur-sm shadow-xl shadow-black/5">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">Timeline</CardDescription>
                        <CardTitle className="mt-1 text-2xl tracking-tight">Recent activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 py-6">
                        {recentActivity.map((item) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                href={item.href}
                                className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-muted/10 p-3 transition-all hover:border-border hover:bg-muted/30"
                            >
                                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-border/40">
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted/50">
                                            {item.type === 'Blog' ? <PenSquare className="size-5 text-muted-foreground" /> : <FolderKanban className="size-5 text-muted-foreground" />}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                                        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{formatShortDate(item.date)}</span>
                                    </div>
                                    <p className="mt-1 truncate text-xs text-muted-foreground">/{item.slug}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge className={`h-4 rounded-full px-1.5 text-[9px] uppercase tracking-tighter ${item.published ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {item.published ? 'Live' : 'Draft'}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{item.type}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 2xl:grid-cols-3">
                <Card className="overflow-hidden rounded-[32px] border-border/60 bg-background/80 py-0 backdrop-blur-sm shadow-xl shadow-black/5 xl:col-span-1">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Queue</CardDescription>
                        <CardTitle className="mt-1 text-2xl tracking-tight">Draft focus</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-6 py-6">
                        {draftQueue.length > 0 ? draftQueue.map((item) => (
                            <Link
                                key={`${item.kind}-${item.id}`}
                                href={item.href}
                                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-3 transition-all hover:border-border hover:bg-muted/20"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shadow-sm">
                                    <FileClock className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                                        <Badge variant="outline" className="h-4 rounded-full px-1.5 text-[9px] uppercase tracking-tighter">
                                            {item.kind}
                                        </Badge>
                                    </div>
                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">Created {formatShortDate(item.createdAt)}</p>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground" />
                            </Link>
                        )) : (
                            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/40 py-12 text-center">
                                <ShieldCheck className="size-10 text-emerald-500/40 mb-3" />
                                <p className="text-sm font-medium text-muted-foreground">Workspace is clean.</p>
                                <p className="text-xs text-muted-foreground/60">Everything has been published.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[32px] border-border/60 bg-background/80 py-0 backdrop-blur-sm shadow-xl shadow-black/5 xl:col-span-1">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Workspace</CardDescription>
                        <CardTitle className="mt-1 text-2xl tracking-tight">Top Contributors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 py-6">
                        <div className="space-y-3">
                            {userRows.slice(0, 5).map((user: any) => (
                                <div key={user.id} className="group flex items-center gap-4 rounded-2xl bg-primary/5 p-3 transition-colors hover:bg-primary/10">
                                    <Avatar className="size-12 rounded-xl ring-2 ring-background ring-offset-1 ring-offset-primary/10">
                                        <AvatarImage src={user.image} alt={user.name} />
                                        <AvatarFallback className="bg-primary/20 text-sm font-bold text-primary">
                                            {initialsFromName(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                                            <Badge className="h-4 rounded-full px-2 text-[9px] bg-primary/10 text-primary border-none">
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground italic font-medium">
                                            {user.bio || `Joined ${formatShortDate(user.createdAt)}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[32px] border-border/60 bg-background/80 py-0 backdrop-blur-sm shadow-xl shadow-black/5 xl:col-span-1">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-500">Inbox</CardDescription>
                                <CardTitle className="mt-1 text-2xl tracking-tight">Recent Interactions</CardTitle>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
                                <MessageSquareMore className="size-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 py-6">
                        {latestContact ? (
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-fuchsia-500/5 p-4 border border-fuchsia-500/10">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <p className="text-sm font-bold text-foreground truncate">{latestContact.subject}</p>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{formatShortDate(latestContact.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {latestContact.name} ({latestContact.email}) reached out regarding your portfolio...
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Badge className="rounded-full bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-none px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                                            New Request
                                        </Badge>
                                        <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider ml-auto">
                                            Reply →
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/admin/contacts" className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-muted/10 p-4 transition-all hover:bg-muted/20">
                                        <Inbox className="size-5 text-muted-foreground mb-2" />
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">View Inbox</p>
                                    </Link>
                                    <Link href="/admin/settings" className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-muted/10 p-4 transition-all hover:bg-muted/20">
                                        <Layers3 className="size-5 text-muted-foreground mb-2" />
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Configs</p>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                                <Inbox className="size-10 mb-3" />
                                <p className="text-sm font-medium">Inbox is empty</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}