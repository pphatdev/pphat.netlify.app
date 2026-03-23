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
import type { ProjectEntry } from '@lib/content';

type SelectedModerator = {
    id: string;
    name: string;
    profile: string;
    url: string;
};

export function ProjectEditorForm({ project }: { project?: ProjectEntry | null; }) {
    const router = useRouter();
    const { data: session } = useSession();
    const isEditing = Boolean(project);
    const [title, setTitle] = useState(project?.title ?? '');
    const [slug, setSlug] = useState(project?.slug ?? '');
    const [description, setDescription] = useState(project?.description ?? '');
    const [image, setImage] = useState(project?.image ?? '');
    const [content, setContent] = useState(project?.content ?? '');
    const [tags, setTags] = useState((project?.tags ?? []).join(', '));
    const [moderatorIds, setModeratorIds] = useState<string[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<SelectedModerator[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);
    const isSubmitting = isSaving || isDrafting;

    async function saveProject(publishedValue: boolean) {
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
                    ? (project?.authors ?? [])
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
                image,
                content,
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                languages: project?.languages ?? [],
                source: project?.source ?? [],
                authors: currentAuthor,
                moderatorId: moderatorIds[0] ?? null,
                published: publishedValue,
            };

            const endpoint = isEditing ? `/api/projects/${project?.id}` : '/api/projects';
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
                toast.error(responsePayload.error || 'Failed to save project');
                return;
            }

            toast.success(publishedValue
                ? (isEditing ? 'Project updated' : 'Project published')
                : 'Saved as draft');
            router.push('/admin/projects');
            router.refresh();
        } catch (error) {
            console.error('Failed to save project', error);
            toast.error('Failed to save project');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await saveProject(true);
    }

    return (
        <form className="grid gap-5" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <div className="flex items-center absolute top-0 right-0 gap-2">
                <Button type="button" variant="outline" className="mt-0 rounded-xl" onClick={() => router.back()} disabled={isSubmitting}>Back</Button>
                <Button type="button" variant="outline" className="mt-0 rounded-xl" disabled={isSubmitting} onClick={() => saveProject(false)}>
                    {isDrafting && <LoaderCircle className="size-4 animate-spin" />}
                    Save Draft
                </Button>
                <Button type="submit" className="mt-0 rounded-xl" disabled={isSubmitting}>
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
                            <Textarea id="description" className="rounded-xl" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} required />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2.5">
                                <Label htmlFor="image">Image</Label>
                                <Input id="image" className="rounded-xl" value={image} onChange={(event) => setImage(event.target.value)} placeholder="/assets/cover/example.webp" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
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
                        <CardHeader>
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>

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