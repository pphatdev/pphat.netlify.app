import Link from 'next/link';
import Image from 'next/image';
import { IconCalendar, IconEye, IconFolder, IconPlus } from '@tabler/icons-react';
import { getCurrentUser } from '@lib/auth';
import { fetchFromApi } from '@lib/api';
import { AdminPageHeader } from '../components/page-header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';

function formatCompact(value: number) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: value >= 1000 ? 1 : 0,
    }).format(value);
}

function formatDate(value: string) {
    if (!value) return 'N/A';
    try {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function getVisitorCount(item: any) {
    const value = item.visitorCount;
    return typeof value === 'number' ? value : 0;
}

const languageColors: Record<string, string> = {
    TypeScript: 'bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    JavaScript: 'bg-yellow-500/12 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    Python: 'bg-green-500/12 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    Rust: 'bg-orange-500/12 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    Go: 'bg-cyan-500/12 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
    CSS: 'bg-fuchsia-500/12 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400',
    HTML: 'bg-red-500/12 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    Shell: 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
};

function langClass(lang: string) {
    return languageColors[lang] ?? 'bg-foreground/8 text-muted-foreground';
}

export default async function AdminProjectsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    let projects: any[] = [];
    let error: string | null = null;

    try {
        // Fetch all projects (role-based logic can be added here if API supports it)
        const response = await fetchFromApi('/v1/api/projects?page=1&limit=100', {}, user.backendToken);
        projects = response.data || [];
    } catch (e: any) {
        console.error('Error fetching admin projects:', e);
        error = e.message;
    }

    const publishedCount = projects.filter((p) => p.published).length;
    const draftCount = projects.length - publishedCount;
    const totalVisitors = projects.reduce((sum, p) => sum + getVisitorCount(p), 0);

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Projects"
                description="Manage your project records, source links, and publish state from one place."
                action="New Project"
                actionHref="/admin/projects/new"
            />

            {error && (
                <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    Failed to load projects: {error}
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {([
                    {
                        label: 'Total projects',
                        value: projects.length,
                        color: 'text-teal-600 dark:text-teal-400',
                    },
                    {
                        label: 'Published',
                        value: publishedCount,
                        color: 'text-emerald-600 dark:text-emerald-400',
                    },
                    {
                        label: 'Drafts',
                        value: draftCount,
                        color: 'text-amber-600 dark:text-amber-400',
                    },
                    {
                        label: 'Total visitors',
                        value: formatCompact(totalVisitors),
                        color: 'text-fuchsia-600 dark:text-fuchsia-400',
                    },
                ] as const).map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3.5 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {stat.label}
                        </p>
                        <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${stat.color}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {projects.length === 0 && !error ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-border/70 bg-background/50 px-6 py-16 text-center">
                    <IconFolder className="size-10 text-muted-foreground/40" />
                    <p className="mt-4 font-medium text-foreground">No projects yet</p>
                    <p className="mt-1 text-sm text-muted-foreground"> Create your first project to get started. </p>
                    <Button asChild className="mt-6">
                        <Link href="/admin/projects/new">
                            <IconPlus className="size-4" />
                            New Project
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {projects.map((project) => (
                        <div key={project.id} className="group relative flex gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-sm transition-all hover:border-border hover:bg-muted/30 hover:shadow-sm" >
                            <Link href={`/admin/projects/${project.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={`View ${project.title}`} />

                            {/* Thumbnail */}
                            <div className="relative z-10 h-24 aspect-video shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                                {project.thumbnail || project.image ? (
                                    <Image src={project.thumbnail || project.image} alt={project.title} width={160} height={90} className="size-full object-cover" />
                                ) : (
                                    <div className="flex size-full items-center justify-center bg-teal-500/10">
                                        <IconFolder className="size-5 text-teal-500/60" />
                                    </div>
                                )}

                                {/* Status dot */}
                                <span className={`absolute right-1 top-1 size-2.5 rounded-full border border-background ${project.published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 min-w-0 flex-1 space-y-2">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-foreground">{project.title}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        <Badge variant={project.published ? 'default' : 'outline'} className="shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]" >
                                            {project.published ? 'Live' : 'Draft'}
                                        </Badge>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <IconEye className="size-3" />
                                            {formatCompact(getVisitorCount(project))}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <IconCalendar className="size-3" />
                                            {formatDate(project.createdAt || project.created_at)}
                                        </span>
                                    </div>
                                </div>


                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    {(project.languages ?? []).length > 0 && (
                                        <div className="flex items-center gap-1.5">
                                            {(project.languages ?? []).slice(0, 4).map((lang: any) => {
                                                const name = typeof lang === 'string' ? lang : lang.name;
                                                return (
                                                    <span key={name} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${langClass(name)}`}> {name} </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {(project.tags ?? []).length > 0 && (
                                        <div className="flex items-center gap-2">
                                            {(project.tags ?? []).slice(0, 4).map((tag: any) => {
                                                const name = typeof tag === 'string' ? tag : tag.tag;
                                                return (
                                                    <span key={name} className="rounded-full bg-foreground/6 px-2 py-0.5 text-[11px] font-medium text-muted-foreground" > #{name} </span>
                                                );
                                            })}
                                            {(project.tags ?? []).length > 4 && (
                                                <span className="text-[11px] text-muted-foreground/60">
                                                    +{(project.tags ?? []).length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                </div>

                                {project.description && (
                                    <p className="line-clamp-1 text-sm text-muted-foreground">{project.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

