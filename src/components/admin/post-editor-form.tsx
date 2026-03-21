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
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Blog' : 'New Blog'}</CardTitle>
                    <CardDescription>Store the post directly in SQLite and publish it from the admin panel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="leave blank to auto-generate" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <Input id="thumbnail" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} placeholder="/assets/cover/example.webp" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="nextjs, sqlite, drizzle" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="authors">Authors</Label>
                        <Textarea
                            id="authors"
                            value={authors}
                            onChange={(event) => setAuthors(event.target.value)}
                            rows={4}
                            placeholder="Name|Profile|URL"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Markdown Content</Label>
                        <Textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} rows={18} required />
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-border/60 px-4 py-3">
                        <Checkbox id="published" checked={published} onCheckedChange={(value) => setPublished(Boolean(value))} />
                        <Label htmlFor="published">Published</Label>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="submit"
                    className="mt-0 h-10 px-4"
                    disabled={isSaving}
                >
                    {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : null}
                    {isEditing ? 'Save Changes' : 'Create Blog'}
                </Button>
                <Button asChild type="button" className="mt-0 h-10 px-4">
                    <Link href="/admin/blogs">Cancel</Link>
                </Button>
                {isEditing && post ? (
                    <DeleteContentButton endpoint={`/api/posts/${post.id}`} label="blog" redirectTo="/admin/blogs" />
                ) : null}
            </div>
        </form>
    );
}