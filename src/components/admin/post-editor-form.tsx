"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@components/ui/checkbox';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { DeleteContentButton } from '@components/admin/delete-content-button';
import type { PostEntry } from '@lib/content';

function authorsToTextarea(authors: PostEntry['authors']): string {
    return authors.map((author) => [author.name, author.profile, author.url].join('|')).join('\n');
}

function parseAuthors(value: string) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [name, profile = '', url = ''] = line.split('|').map((item) => item.trim());
            return { name, profile, url };
        })
        .filter((author) => author.name.length > 0);
}

export function PostEditorForm({ post }: { post?: PostEntry | null; }) {
    const router = useRouter();
    const isEditing = Boolean(post);
    const [title, setTitle] = useState(post?.title ?? '');
    const [slug, setSlug] = useState(post?.slug ?? '');
    const [description, setDescription] = useState(post?.description ?? '');
    const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? '');
    const [content, setContent] = useState(post?.content ?? '');
    const [tags, setTags] = useState((post?.tags ?? []).join(', '));
    const [authors, setAuthors] = useState(authorsToTextarea(post?.authors ?? []));
    const [published, setPublished] = useState(post?.published ?? false);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                title,
                slug,
                description,
                thumbnail,
                content,
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                authors: parseAuthors(authors),
                published,
            };

            const endpoint = isEditing ? `/api/posts/${post?.id}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const responsePayload = await response.json().catch(() => ({}));

            if (!response.ok) {
                toast.error(responsePayload.error || 'Failed to save blog');
                return;
            }

            toast.success(isEditing ? 'Blog updated' : 'Blog created');
            router.push('/admin/blogs');
            router.refresh();
        } catch (error) {
            console.error('Failed to save blog', error);
            toast.error('Failed to save blog');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit} aria-busy={isSaving}>
            <div className="sticky top-3 z-10 rounded-2xl border border-border/60 bg-background/95 p-3 shadow-lg shadow-background/20 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="submit"
                            className="mt-0 h-10 px-4"
                            disabled={isSaving}
                        >
                            {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : null}
                            {isEditing ? 'Save Changes' : 'Create Blog'}
                        </Button>
                        <Button asChild type="button" className="mt-0 h-10 px-4" variant="outline" disabled={isSaving}>
                            <Link href="/admin/blogs">Cancel</Link>
                        </Button>
                    </div>
                    {isEditing && post ? (
                        <DeleteContentButton endpoint={`/api/posts/${post.id}`} label="blog" redirectTo="/admin/blogs" />
                    ) : null}
                </div>
            </div>

            <Card className="overflow-hidden rounded-3xl border-border/70 bg-background/90 shadow-sm">
                <CardHeader className="border-b border-border/60 bg-muted/25">
                    <CardTitle>{isEditing ? 'Edit Blog' : 'New Blog'}</CardTitle>
                    <CardDescription>Store the post directly in SQLite and publish it from the admin panel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section className="rounded-2xl border border-border/60 bg-background/80 p-4 sm:p-5">
                        <div className="mb-4 space-y-1">
                            <h3 className="text-sm font-medium text-foreground">Core details</h3>
                            <p className="text-xs text-muted-foreground">Set the article identity, cover asset, and discovery tags.</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} autoComplete="off" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="leave blank to auto-generate" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} required />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <Input id="thumbnail" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} placeholder="/assets/cover/example.webp" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input id="tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="nextjs, sqlite, drizzle" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-border/60 bg-background/80 p-4 sm:p-5">
                        <div className="mb-4 space-y-1">
                            <h3 className="text-sm font-medium text-foreground">Attribution</h3>
                            <p className="text-xs text-muted-foreground">One author per line in the format: Name|Profile|URL</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="authors">Authors</Label>
                            <Textarea
                                id="authors"
                                value={authors}
                                onChange={(event) => setAuthors(event.target.value)}
                                rows={4}
                                placeholder="Name|Profile|URL"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-border/60 bg-background/80 p-4 sm:p-5">
                        <div className="mb-4 space-y-1">
                            <h3 className="text-sm font-medium text-foreground">Markdown content</h3>
                            <p className="text-xs text-muted-foreground">Write complete markdown for the post body.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Markdown Content</Label>
                            <Textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} rows={18} className="min-h-105 font-mono text-sm" required />
                        </div>
                    </section>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">Publishing status</p>
                            <p className="text-xs text-muted-foreground">Enable once the article is ready to appear publicly.</p>
                        </div>
                        <Checkbox id="published" checked={published} onCheckedChange={(value) => setPublished(Boolean(value))} />
                        <Label htmlFor="published" className="sr-only">Published</Label>
                    </div>
                </CardContent>
            </Card>

        </form>
    );
}