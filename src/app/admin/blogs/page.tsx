import Link from 'next/link';
import { IconCalendar, IconFileText, IconPlus } from '@tabler/icons-react';
import { getCurrentUser } from '@lib/auth';
import { fetchFromApi } from '@lib/api';
import { AdminPageHeader } from '../components/page-header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { PostAuthorsDisplay } from 'src/app/admin/components/post-authors-display';
import Image from 'next/image';

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

export default async function AdminBlogsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    let posts: any[] = [];
    let error: string | null = null;

    try {
        const response = await fetchFromApi('/v1/api/articles?page=1', {}, user.backendToken);
        posts = response.data || [];
    } catch (e: any) {
        console.error('Error fetching admin blogs:', e);
        error = e.message;
    }

    const publishedCount = posts.filter((p) => p.published).length;
    const draftCount = posts.length - publishedCount;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Blogs"
                description="Create, review, and update blog entries."
                action="New Blog"
                actionHref="/admin/blogs/new"
            />

            {error && (
                <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    Failed to load blogs: {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {([
                    {
                        label: 'Total blogs',
                        value: posts.length,
                        color: 'text-blue-600 dark:text-blue-400',
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
            {posts.length === 0 && !error ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-border/70 bg-background/50 px-6 py-16 text-center">
                    <IconFileText className="size-10 text-muted-foreground/40" />
                    <p className="mt-4 font-medium text-foreground">No blog posts yet</p>
                    <p className="mt-1 text-sm text-muted-foreground"> Create your first blog post to get started. </p>
                    <Button asChild className="mt-6">
                        <Link href="/admin/blogs/new">
                            <IconPlus className="size-4" />
                            New Blog
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group relative flex gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-sm transition-all hover:border-border hover:bg-muted/30 hover:shadow-sm"
                        >
                            {/* Stretched Link for the entire card */}
                            <Link 
                                href={`/admin/blogs/${post.id}`} 
                                className="absolute inset-0 z-0 rounded-2xl" 
                                aria-label={`View ${post.title}`}
                            />

                            {/* Thumbnail */}
                            <div className="relative z-10 h-24 aspect-video shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                                {post.thumbnail
                                    ? <Image width={100} height={100} alt={post.title} className="size-full object-cover" src={post.thumbnail} />
                                    : <div className="flex size-full items-center justify-center bg-blue-500/10">
                                        <IconFileText className="size-5 text-blue-500/60" />
                                    </div>
                                }

                                {/* Status dot */}
                                <span className={`absolute right-1 top-1 size-2.5 rounded-full border border-background ${post.published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 min-w-0 flex-1 space-y-2">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-foreground">{post.title} </p>
                                    </div>
                                    <Badge variant={post.published ? 'default' : 'outline'} className="shrink-0 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]" >
                                        {post.published ? 'Live' : 'Draft'}
                                    </Badge>
                                </div>

                                {/* Tags and Date Row */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    {post.tags?.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            {post.tags.slice(0, 4).map((tag: any) => (
                                                <span key={typeof tag === 'string' ? tag : tag.tag} className="rounded-full bg-foreground/6 px-2 py-0.5 text-[11px] font-medium text-muted-foreground" >
                                                    #{typeof tag === 'string' ? tag : tag.tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 4 && (<span className="text-[11px] text-muted-foreground/60"> +{post.tags.length - 4} </span>)}
                                        </div>
                                    )}

                                    <div className="ml-auto flex items-center gap-4">
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <IconCalendar className="size-3" />
                                            {formatDate(post.createdAt || post.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Authors Display */}
                                {post.authors && post.authors.length > 0 && (
                                    <div className="pb-2">
                                        <PostAuthorsDisplay authors={post.authors} />
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

