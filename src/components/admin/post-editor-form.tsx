"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { MarkdownEditor } from '@components/admin/markdown-editor';
import { ModeratorSelector } from '@components/admin/moderator-selector';
import type { PostEntry } from '@lib/content';

type SelectedModerator = {
    id: string;
    name: string;
    profile: string;
    url: string;
};

export function PostEditorForm({ post }: { post?: PostEntry | null; }) {
    const router = useRouter();
    const { data: session } = useSession();
    const isEditing = Boolean(post);
    const [title, setTitle] = useState(post?.title ?? '');
    const [slug, setSlug] = useState(post?.slug ?? '');
    const [description, setDescription] = useState(post?.description ?? '');
    const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? '');
    const [content, setContent] = useState(post?.content ?? '');
    const [tags, setTags] = useState((post?.tags ?? []).join(', '));
    const [moderatorIds, setModeratorIds] = useState<string[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<SelectedModerator[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);
    const isSubmitting = isSaving || isDrafting;

    async function savePost(publishedValue: boolean) {
        const setLoading = publishedValue ? setIsSaving : setIsDrafting;
        setLoading(true);

        try {
            const currentAuthor = selectedModerators.length > 0
                ? selectedModerators.map((moderator) => ({
                    name: moderator.name,
                    profile: moderator.profile,
                    url: moderator.url,
                }))
                : (isEditing
                    ? (post?.authors ?? [])
                    : (session?.user.name
                        ? [{
                            name: session.user.name,
                            profile: session.user.image ?? '',
                            url: '',
                        }]
                        : []));

            const payload = {
                title,
                slug,
                description,
                thumbnail,
                content,
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                authors: currentAuthor,
                moderatorId: moderatorIds[0] ?? null,
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
                toast.error(responsePayload.error || 'Failed to save blog post');
                return;
            }

            toast.success(publishedValue
                ? (isEditing ? 'Blog post updated' : 'Blog post published')
                : 'Saved as draft');
            router.push('/admin/blogs');
            router.refresh();
        } catch (error) {
            console.error('Failed to save blog post', error);
            toast.error('Failed to save blog post');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await savePost(true);
    }

    return (
        <form className="grid gap-5" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <div className="flex items-center absolute top-10 p-1 border rounded-full right-10 gap-1 bg-background">
                <Button type="button" variant="outline" className="mt-0 rounded-full" onClick={() => router.back()} disabled={isSubmitting}>Back</Button>
                <Button type="button" className="mt-0 rounded-full" disabled={isSubmitting} onClick={() => savePost(false)}>
                    {isDrafting && <LoaderCircle className="size-4 animate-spin" />}
                    Save Draft
                </Button>
                <Button type="submit" className="mt-0 rounded-full border bg-primary/5 ring-primary/50" disabled={isSubmitting}>
                    {isSaving && <LoaderCircle className="size-4 animate-spin" />}
                    {isEditing ? 'Update Live' : 'Publish'}
                </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <Card className="rounded-2xl col-span-2">
                    <CardContent className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2.5">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" className="rounded-xl" value={title} onChange={(event) => setTitle(event.target.value)} autoComplete="off" required />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" className="rounded-xl" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="leave blank to auto-generate" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" className="rounded-xl shadow-none drop-shadow-none" value={description} onChange={(event) => setDescription(event.target.value)} rows={1} required />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2.5">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                <Input id="thumbnail" className="rounded-xl" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} placeholder="/assets/cover/example.webp" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <Label htmlFor="tags">Tags</Label>
                                <Input id="tags" className="rounded-xl" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="nextjs, sqlite, drizzle" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-5">
                    <Card className="rounded-2xl">
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                {session?.user && (
                                    <ModeratorSelector
                                        selectedModeratorIds={moderatorIds}
                                        onModeratorChange={(ids, moderators) => {
                                            setModeratorIds(ids);
                                            setSelectedModerators(moderators.map((moderator) => ({
                                                id: moderator.id,
                                                name: moderator.name,
                                                profile: moderator.image ?? '',
                                                url: '',
                                            })));
                                        }}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="content">Content</Label>
                <MarkdownEditor
                    id="content"
                    value={content}
                    onChange={setContent}
                    required
                    className="rounded-xl"
                />
            </div>
        </form>
    );
}