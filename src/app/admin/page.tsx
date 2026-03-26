import Link from 'next/link';
import { ArrowRight, Eye, FileClock, FolderKanban, Inbox, Layers3, MessageSquareMore, PenSquare, Rocket, ShieldCheck, Sparkles, UserRound, } from 'lucide-react';
import { getAllPosts, getAllProjects } from '@lib/content';
import { AdminPageHeader } from './components/page-header';
import { AdminTrafficSpotlight } from './components/dashboard-chart';
import { Badge } from '@components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
// import { Separator } from '@components/ui/separator';

function formatCompactNumber(value: number) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: value >= 1000 ? 1 : 0,
    }).format(value);
}

function formatShortDate(value: string) {
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
    const [posts, projects] = await Promise.all([
        getAllPosts(),
        getAllProjects(),
    ]);

    const totalVisitors = [...posts, ...projects].reduce((sum, entry) => sum + (entry.visitorCount ?? 0), 0);
    const publishedPosts = posts.filter((post) => post.published).length;
    const publishedProjects = projects.filter((project) => project.published).length;
    const totalEntries = posts.length + projects.length;
    const publishedEntries = publishedPosts + publishedProjects;
    const publicationRate = totalEntries === 0 ? 0 : Math.round((publishedEntries / totalEntries) * 100);
    const userRows: { id: string; name: string; email: string; image: string; role: string; provider: string }[] = [];
    const contactRows: { id: string; subject: string; name: string; email: string; deliveryStatus: string; isSpam: boolean; createdAt: string }[] = [];
    const adminUsers = userRows.filter((user) => user.role === 'admin');
    const editorUsers = userRows.filter((user) => user.role !== 'admin');
    const githubUsers = userRows.filter((user) => user.provider === 'github');
    const pendingContacts = contactRows.filter((contact) => contact.deliveryStatus !== 'delivered' && !contact.isSpam).length;
    const deliveredContacts = contactRows.filter((contact) => contact.deliveryStatus === 'delivered').length;
    const spamContacts = contactRows.filter((contact) => contact.isSpam).length;
    const recentPosts = posts.slice(0, 4);
    const recentProjects = projects.slice(0, 4);
    const recentActivity = [...posts.map((post) => ({
        id: post.id,
        type: 'Blog' as const,
        title: post.title,
        href: `/admin/blogs/${post.id}`,
        slug: post.slug,
        published: post.published,
        date: post.updatedAt || post.createdAt,
    })), ...projects.map((project) => ({
        id: project.id,
        type: 'Project' as const,
        title: project.title,
        href: `/admin/projects/${project.id}`,
        slug: project.slug,
        published: project.published,
        date: project.createdAt,
    }))]
        .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
        .slice(0, 6);
    const draftQueue = [...posts.filter((post) => !post.published).map((post) => ({
        id: post.id,
        title: post.title,
        href: `/admin/blogs/${post.id}`,
        kind: 'Blog' as const,
        detail: post.slug,
        createdAt: post.createdAt,
    })), ...projects.filter((project) => !project.published).map((project) => ({
        id: project.id,
        title: project.title,
        href: `/admin/projects/${project.id}`,
        kind: 'Project' as const,
        detail: project.slug,
        createdAt: project.createdAt,
    }))]
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 5);
    const topPerformers = [...posts.map((post) => ({
        label: post.title,
        visitors: post.visitorCount ?? 0,
        type: 'Blog' as const,
        status: post.published ? 'Published' as const : 'Draft' as const,
        href: `/admin/blogs/${post.id}`,
    })), ...projects.map((project) => ({
        label: project.title,
        visitors: project.visitorCount ?? 0,
        type: 'Project' as const,
        status: project.published ? 'Published' as const : 'Draft' as const,
        href: `/admin/projects/${project.id}`,
    }))]
        .sort((left, right) => right.visitors - left.visitors)
        .slice(0, 6);
    const topTags = new Map<string, number>();

    for (const post of posts) {
        for (const tag of post.tags.slice(0, 5)) {
            topTags.set(tag, (topTags.get(tag) ?? 0) + 1);
        }
    }

    for (const project of projects) {
        for (const tag of project.tags.slice(0, 5)) {
            topTags.set(tag, (topTags.get(tag) ?? 0) + 1);
        }
    }

    const tagHighlights = Array.from(topTags.entries())
        .sort((left, right) => right[1] - left[1])
        .slice(0, 5);
    const latestContact = [...contactRows].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )[0];

    return (
        <div className="gap-6 grid grid-cols-1">
            <AdminPageHeader
                title="Dashboard"
                description="Monitor publishing momentum, traffic leaders, and admin workflow from one control room."
            />

            <section className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Blogs"
                    value={posts.length.toString()}
                    detail={`${publishedPosts} published, ${posts.length - publishedPosts} in draft review`}
                    icon={<PenSquare className="size-5" />}
                    tone="from-blue-500/16 via-blue-500/10 to-transparent"
                />
                <MetricCard
                    title="Projects"
                    value={projects.length.toString()}
                    detail={`${publishedProjects} published, ${projects.length - publishedProjects} still private`}
                    icon={<FolderKanban className="size-5" />}
                    tone="from-teal-500/16 via-teal-500/10 to-transparent"
                />
                <MetricCard
                    title="Tracked Visitors"
                    value={formatCompactNumber(totalVisitors)}
                    detail="Combined traffic across all public blog and project pages"
                    icon={<Eye className="size-5" />}
                    tone="from-amber-500/16 via-amber-500/10 to-transparent"
                />
                <MetricCard
                    title="Inbox"
                    value={contactRows.length.toString()}
                    detail={`${pendingContacts} pending follow-up, ${deliveredContacts} already delivered`}
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
                                        Live CMS Overview
                                    </Badge>
                                    <div className="space-y-3">
                                        <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                            Publishing looks sharper when the dashboard behaves like a control room.
                                        </h2>
                                        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                                            You have {publishedEntries} live entries out of {totalEntries}, {formatCompactNumber(totalVisitors)} tracked visitors,
                                            and {pendingContacts} inbox items still waiting for follow-up.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:min-w-72 sm:grid-cols-2">
                                    <Button asChild className="mt-0 h-11 w-full justify-center rounded-full border bg-foreground/5 border-primary px-4">
                                        <Link href="/admin/projects/new">
                                            <FolderKanban className="size-4" />
                                            New Project
                                        </Link>
                                    </Button>
                                    <Button asChild className="mt-0 h-11 w-full justify-center px-4">
                                        <Link href="/admin/blogs/new">
                                            <PenSquare className="size-4" />
                                            New Blog
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-2xl rounded-t-3xl rounded-r-3xl from-primary/10 bg-linear-to-b to-primary/30 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Publish Rate</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight">{publicationRate}%</p>
                                    <div className="mt-4 h-2 rounded-full bg-foreground/10">
                                        <div className="h-2 rounded-full bg-primary" style={{ width: `${publicationRate}%` }} />
                                    </div>
                                </div>
                                <div className="rounded-2xl rounded-t-3xl rounded-r-3xl from-primary/10 bg-linear-to-b to-primary/30 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Team Access</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight">{userRows.length}</p>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        {adminUsers.length} admins, {editorUsers.length} editors
                                    </p>
                                </div>
                                <div className="rounded-2xl rounded-t-3xl rounded-l-3xl max-lg:col-span-full from-primary/10 bg-linear-to-b to-primary/30 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Inbox Pressure</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight">{pendingContacts}</p>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        {deliveredContacts} delivered, {spamContacts} filtered as spam
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden rounded-4xl bg-background/80 py-0 dark:ring-2 ring-primary/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Workflow health</CardDescription>
                        <CardTitle className="text-2xl tracking-tight">Publishing stack</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-6 py-6 pt-0">
                        <div className="space-y-3 rounded-3xl bg-primary/5 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Access model</p>
                                        <p className="text-sm text-muted-foreground">{githubUsers.length} GitHub-linked users active</p>
                                    </div>
                                </div>
                                <Badge className="rounded-full bg-primary/30 px-2.5 py-1">Stable</Badge>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Blogs live</span>
                                <span className="font-medium text-foreground">{publishedPosts}/{posts.length}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/70">
                                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${posts.length === 0 ? 0 : (publishedPosts / posts.length) * 100}%` }} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Projects live</span>
                                <span className="font-medium text-foreground">{publishedProjects}/{projects.length}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/70">
                                <div className="h-2 rounded-full bg-teal-700" style={{ width: `${projects.length === 0 ? 0 : (publishedProjects / projects.length) * 100}%` }} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-foreground">Tag pressure</p>
                                    <p className="text-sm text-muted-foreground">What shows up most across your content mix.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tagHighlights.length > 0 ? tagHighlights.map(([tag, count]) => (
                                    <Badge key={tag} variant="outline" className="rounded-full border-border/70 bg-background/70 px-3 py-1 text-xs">
                                        {tag} · {count}
                                    </Badge>
                                )) : (
                                    <p className="text-sm text-muted-foreground">Add more tagged content to build topic clusters.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.9fr)]">
                <Card className="overflow-hidden rounded-[28px] bg-background/80 py-0 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/60 px-6 pb-5 pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Traffic spotlight</CardDescription>
                                <CardTitle className="mt-2 text-2xl tracking-tight">Top content by visitors</CardTitle>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-blue-600" />
                                    <span className="text-xs text-muted-foreground">Blog</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-teal-600" />
                                    <span className="text-xs text-muted-foreground">Project</span>
                                </div>
                                <Link href="/admin/blogs" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                                    View all →
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 py-5">
                        <AdminTrafficSpotlight items={topPerformers} />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[28px] bg-background/80 py-0 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Recent activity</CardDescription>
                        <CardTitle className="text-2xl tracking-tight">Latest edits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-6 py-6 pt-0">
                        {recentActivity.map((item) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                href={item.href}
                                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-foreground/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/35"
                            >
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/90 text-foreground">
                                    {item.type === 'Blog' ? <PenSquare className="size-4" /> : <FolderKanban className="size-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="truncate font-medium text-foreground">{item.title}</p>
                                        <span className="text-xs text-muted-foreground">{formatShortDate(item.date)}</span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-muted-foreground">{item.slug}</p>
                                </div>
                                <Badge variant={item.published ? 'default' : 'outline'} className="shrink-0 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                                    {item.published ? 'Published' : 'Draft'}
                                </Badge>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 2xl:grid-cols-3">
                <Card className="overflow-hidden rounded-[28px] border-border/60 bg-background/80 py-0 backdrop-blur-sm xl:col-span-1">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Draft focus</CardDescription>
                        <CardTitle className="text-2xl tracking-tight">What still needs publishing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-6 py-6 pt-0">
                        {draftQueue.length > 0 ? draftQueue.map((item) => (
                            <Link
                                key={`${item.kind}-${item.id}`}
                                href={item.href}
                                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-foreground/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/35"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background/90 text-foreground shadow-sm">
                                    <FileClock className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate font-medium text-foreground">{item.title}</p>
                                        <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]">
                                            {item.kind}
                                        </Badge>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-muted-foreground">{item.detail}</p>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground" />
                            </Link>
                        )) : (
                            <div className="rounded-3xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
                                Everything is already published.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[28px] border-border/60 bg-background/80 py-0 backdrop-blur-sm xl:col-span-1">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Content lanes</CardDescription>
                        <CardTitle className="text-2xl tracking-tight">Fresh items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 py-6 pt-0">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-foreground">Recent blogs</h3>
                                <Link href="/admin/blogs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">View all</Link>
                            </div>
                            {recentPosts.map((post) => (
                                <Link key={post.id} href={`/admin/blogs/${post.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-foreground/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/35">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-foreground">{post.title}</p>
                                        <p className="mt-1 truncate text-sm text-muted-foreground">{post.slug}</p>
                                    </div>
                                    <Badge variant={post.published ? 'default' : 'outline'} className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                                        {post.published ? 'Live' : 'Draft'}
                                    </Badge>
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-foreground">Recent projects</h3>
                                <Link href="/admin/projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">View all</Link>
                            </div>
                            {recentProjects.map((project) => (
                                <Link key={project.id} href={`/admin/projects/${project.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-foreground/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/35">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-foreground">{project.title}</p>
                                        <p className="mt-1 truncate text-sm text-muted-foreground">{project.slug}</p>
                                    </div>
                                    <Badge variant={project.published ? 'default' : 'outline'} className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                                        {project.published ? 'Live' : 'Draft'}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-[28px] border-border/60 bg-background/80 py-0 backdrop-blur-sm xl:col-span-1">
                    <CardHeader className="border-b border-border/60 px-6 pt-6">
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">Team & inbox</CardDescription>
                        <CardTitle className="text-2xl tracking-tight">People in the loop</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 py-6 pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-foreground">Workspace members</p>
                                    <p className="text-sm text-muted-foreground">Editors and admins with dashboard access.</p>
                                </div>
                                <Layers3 className="size-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-3">
                                {userRows.slice(0, 4).map((user) => (
                                    <div key={user.id} className="flex items-center gap-3 rounded-2xl bg-primary/5 px-4 py-3">
                                        <Avatar className="size-11">
                                            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                                            <AvatarFallback className="bg-primary/20 text-sm font-semibold text-foreground">
                                                {initialsFromName(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-foreground">{user.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <Badge className="rounded-full px-2.5 py-1 text-[11px] bg-primary/20 uppercase tracking-[0.16em]">
                                            {user.role}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* <Separator className="bg-border/60" /> */}

                        <div className="space-y-3 rounded-2xl bg-primary/10 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium text-foreground">Latest message</p>
                                    <p className="text-sm text-muted-foreground">Newest contact event stored in the database.</p>
                                </div>
                                <MessageSquareMore className="size-4 text-muted-foreground" />
                            </div>
                            {latestContact ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-medium text-foreground">{latestContact.subject}</p>
                                        <span className="text-xs text-muted-foreground">{formatShortDate(latestContact.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{latestContact.name} • {latestContact.email}</p>
                                    <Badge variant={latestContact.isSpam ? 'destructive' : 'outline'} className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                                        {latestContact.isSpam ? 'Spam' : latestContact.deliveryStatus}
                                    </Badge>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No contact submissions yet.</p>
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link href="/admin/blogs" className="rounded-2xl border border-border/60 bg-foreground/5 p-4 transition-colors hover:border-border hover:bg-muted/30">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Rocket className="size-4" />
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground" />
                                </div>
                                <p className="mt-4 font-medium text-foreground">Open blog desk</p>
                                <p className="mt-1 text-sm text-muted-foreground">Jump into editorial work.</p>
                            </Link>
                            <Link href="/admin/projects" className="rounded-2xl border border-border/60 bg-foreground/5 p-4 transition-colors hover:border-border hover:bg-muted/30">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                        <UserRound className="size-4" />
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground" />
                                </div>
                                <p className="mt-4 font-medium text-foreground">Open project desk</p>
                                <p className="mt-1 text-sm text-muted-foreground">Review sources, tags, and visibility.</p>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}