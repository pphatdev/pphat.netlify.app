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
import type { ProjectEntry } from '@lib/content';

function authorsToTextarea(authors: ProjectEntry['authors']): string {
    return authors.map((author) => [author.name, author.profile, author.url].join('|')).join('\n');
}

function sourcesToTextarea(sources: ProjectEntry['source']): string {
    return sources.map((source) => [source.name, source.type, source.url].join('|')).join('\n');
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

function parseSources(value: string) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [name, type = '', url = ''] = line.split('|').map((item) => item.trim());
            return { name, type, url };
        })
        .filter((source) => source.name.length > 0 && source.url.length > 0);
}

export function ProjectEditorForm({ project }: { project?: ProjectEntry | null; }) {
    const router = useRouter();
    const isEditing = Boolean(project);
    const [title, setTitle] = useState(project?.title ?? '');
    const [slug, setSlug] = useState(project?.slug ?? '');
    const [description, setDescription] = useState(project?.description ?? '');
    const [image, setImage] = useState(project?.image ?? '');
    const [content, setContent] = useState(project?.content ?? '');
    const [tags, setTags] = useState((project?.tags ?? []).join(', '));
    const [languages, setLanguages] = useState((project?.languages ?? []).join(', '));
    const [authors, setAuthors] = useState(authorsToTextarea(project?.authors ?? []));
    const [sources, setSources] = useState(sourcesToTextarea(project?.source ?? []));
    const [published, setPublished] = useState(project?.published ?? false);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                title,
                slug,
                description,
                image,
                content,
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                languages: languages.split(',').map((language) => language.trim()).filter(Boolean),
                authors: parseAuthors(authors),
                source: parseSources(sources),
                published,
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

            toast.success(isEditing ? 'Project updated' : 'Project created');
            router.push('/admin/projects');
            router.refresh();
        } catch (error) {
            console.error('Failed to save project', error);
            toast.error('Failed to save project');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Project' : 'New Project'}</CardTitle>
                    <CardDescription>Manage project metadata, stack information, and long-form content from SQLite.</CardDescription>
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

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="image">Cover Image</Label>
                            <Input id="image" value={image} onChange={(event) => setImage(event.target.value)} placeholder="/assets/screenshots/project.webp" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="languages">Languages</Label>
                            <Input id="languages" value={languages} onChange={(event) => setLanguages(event.target.value)} placeholder="TypeScript, SQLite" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="cms, portfolio, admin" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="authors">Authors</Label>
                        <Textarea id="authors" value={authors} onChange={(event) => setAuthors(event.target.value)} rows={4} placeholder="Name|Profile|URL" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sources">Sources</Label>
                        <Textarea id="sources" value={sources} onChange={(event) => setSources(event.target.value)} rows={4} placeholder="Source Name|Repository|https://example.com" />
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
                    {isEditing ? 'Save Changes' : 'Create Project'}
                </Button>
                <Button asChild type="button" className="mt-0 h-10 px-4">
                    <Link href="/admin/projects">Cancel</Link>
                </Button>
                {isEditing && project ? (
                    <DeleteContentButton endpoint={`/api/projects/${project.id}`} label="project" redirectTo="/admin/projects" />
                ) : null}
            </div>
        </form>
    );
}