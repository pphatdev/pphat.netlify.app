import Link from 'next/link';
import { CalendarDays, Eye, FileText, Plus } from 'lucide-react';
import { getAllPosts } from '@lib/content';
import { requireUserSession } from '@lib/auth';
import { AdminPageHeader } from '@components/admin/admin-page-header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { PostAuthorsDisplay } from '@components/admin/post-authors-display';

function formatCompact(value: number) {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: value >= 1000 ? 1 : 0 }).format(value);
}
function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default async function AdminBlogsPage() {
    const session = await requireUserSession();
    const posts = await getAllPosts();
    const publishedCount = posts.filter((p) => p.published).length;
    const draftCount = posts.length - publishedCount;
    const totalVisitors = posts.reduce((sum, p) => sum + (p.visitorCount ?? 0), 0);

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Blogs"
                description="Create, review, and update blog entries stored in the database."
                action="New Blog"
                actionHref="/admin/blogs/new"
            />

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {([
                    { label: 'Total blogs', value: posts.length, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Published', value: publishedCount, color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Drafts', value: draftCount, color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'Total visitors', value: formatCompact(totalVisitors), color: 'text-fuchsia-600 dark:text-fuchsia-400' },
                ] as const).map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3.5 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                        <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* List */}
            {posts.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-border/70 bg-background/50 px-6 py-16 text-center">
                    <FileText className="size-10 text-muted-foreground/40" />
                    <p className="mt-4 font-medium text-foreground">No blog posts yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Create your first blog post to get started.</p>
                    <Button asChild className="mt-6">
                        <Link href="/admin/blogs/new"><Plus className="size-4" />New Blog</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/admin/blogs/${post.id}`}
                            className="group flex gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-sm transition-all hover:border-border hover:bg-muted/30 hover:shadow-sm"
                        >
                            {/* Thumbnail */}
                            <div className="relative size-15 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                                {post.thumbnail ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={post.thumbnail} alt="" className="size-full object-cover" />
                                ) : (
                                    <div className="flex size-full items-center justify-center bg-blue-500/10">
                                        <FileText className="size-5 text-blue-500/60" />
                                    </div>
                                )}
                                {/* Status dot */}
                                <span className={`absolute right-1 top-1 size-2 rounded-full border border-background ${
                                    post.published ? 'bg-emerald-500' : 'bg-amber-400'
                                }`} />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-foreground">{post.title}</p>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{post.slug}</p>
                                    </div>
                                    <Badge
                                        variant={post.published ? 'default' : 'outline'}
                                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                                    >
                                        {post.published ? 'Live' : 'Draft'}
                                    </Badge>
                                </div>

                                {post.description && (
                                    <p className="line-clamp-1 text-sm text-muted-foreground">{post.description}</p>
                                )}

                                {/* Tags and Authors Row */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-2">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="rounded-full bg-foreground/6 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">#{tag}</span>
                                        ))}
                                        {post.tags.length > 3 && (
                                            <span className="text-[11px] text-muted-foreground/60">+{post.tags.length - 3}</span>
                                        )}
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Eye className="size-3" />
                                            {formatCompact(post.visitorCount ?? 0)}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <CalendarDays className="size-3" />
                                            {formatDate(post.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Authors Display */}
                                {post.authors && post.authors.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-border/40">
                                        <PostAuthorsDisplay authors={post.authors} compact />
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}