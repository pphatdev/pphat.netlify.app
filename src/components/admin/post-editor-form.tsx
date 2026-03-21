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
    const [isDrafting, setIsDrafting] = useState(false);
    const isSubmitting = isSaving || isDrafting;

    async function savePost(publishedValue: boolean) {
        const setLoading = publishedValue ? setIsSaving : setIsDrafting;
        setLoading(true);

        try {
            const payload = {
                title,
                slug,
                description,
                thumbnail,
                content,
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                authors: parseAuthors(authors),
                published: publishedValue,
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

            toast.success(publishedValue
                ? (isEditing ? 'Blog updated' : 'Blog published')
                : 'Saved as draft');
            router.push('/admin/blogs');
            router.refresh();
        } catch (error) {
            console.error('Failed to save blog', error);
            toast.error('Failed to save blog');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await savePost(published);
    }

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <section className='flex flex-col gap-5'>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" className='rounded-xl' value={title} onChange={(event) => setTitle(event.target.value)} autoComplete="off" required />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" className='rounded-xl' value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="leave blank to auto-generate" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" className='rounded-xl' value={description} onChange={(event) => setDescription(event.target.value)} rows={3} required />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        <Input id="thumbnail" className='rounded-xl' value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} placeholder="/assets/cover/example.webp" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" className='rounded-xl' value={tags} onChange={(event) => setTags(event.target.value)} placeholder="nextjs, sqlite, drizzle" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="authors">Authors</Label>
                    <Textarea
                        id="authors"
                        value={authors}
                        onChange={(event) => setAuthors(event.target.value)}
                        rows={4}
                        className='rounded-xl'
                        placeholder="Name|Profile|URL"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="content">Markdown Content</Label>
                    <Textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} rows={18} className="min-h-105 font-mono text-sm rounded-xl" required />
                </div>

                <div className="flex border p-1 bg-background/50 rounded-full absolute top-0 right-5 items-center justify-between gap-1">
                    <Button type="button" className='mt-0' onClick={() => router.back()} disabled={isSubmitting}>
                        Back
                    </Button>
                    <Button type="button" className='mt-0 rounded-none' disabled={isSubmitting} onClick={() => savePost(false)}>
                        {isDrafting && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                        Save as Draft
                    </Button>
                    <Button type="submit" variant={'ghost'} className='mt-0 rounded-4xl rounded-l-none bg-primary/20' disabled={isSubmitting}>
                        {isSaving && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                        {isEditing ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </section>
        </form>
    );
}