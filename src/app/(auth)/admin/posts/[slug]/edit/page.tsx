"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { defaultExtensions } from "@components/ui/extensions";
import { slashCommand, suggestionItems } from "@components/ui/slash-command";
import { ColorSelector } from "@components/ui/selector/color-selector";
import { LinkSelector } from "@components/ui/selector/link-selector";
import { MathSelector } from "@components/ui/selector/math-selector";
import { NodeSelector } from "@components/ui/selector/node-selector";
import { TextButtons } from "@components/ui/selector/text-buttons";
import GenerativeMenuSwitch from "@components/generation/generative-menu-switch";
import { EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList, EditorContent, EditorRoot, type JSONContent } from "novel";
import { handleCommandNavigation, ImageResizer } from "novel";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { toast } from "sonner";
import { ImageIcon, Save, X, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import "../../../../../../styles/code-block-node.css"


interface PostFormData {
    id: string;
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
    slug: string;
    createdAt: string;
    authors: Array<{
        name: string;
        profile: string;
        url: string;
    }>;
}

const extensions = [...defaultExtensions, slashCommand];

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [openAI, setOpenAI] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const [formData, setFormData] = useState<PostFormData>({
        id: "",
        title: "",
        content: "",
        thumbnail: "",
        tags: [],
        published: false,
        slug: "",
        createdAt: "",
        authors: []
    });

    const [editorContent, setEditorContent] = useState<JSONContent | undefined>(undefined);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${slug}`);
                if (response.ok) {
                    const post = await response.json();
                    setFormData({
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        thumbnail: post.thumbnail || "",
                        tags: post.tags || [],
                        published: post.published,
                        slug: post.slug,
                        createdAt: post.createdAt,
                        authors: post.authors || []
                    });

                    // Parse content for editor
                    try {
                        const content = JSON.parse(post.content);
                        setEditorContent(content);
                    } catch {
                        // If content is not JSON, create a simple document
                        setEditorContent({
                            type: "doc",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "text",
                                            text: post.content
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                } else {
                    toast.error("Post not found");
                    // router.push("/posts");
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error("Failed to load post");
                // router.push("/posts");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug, router]);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title)
        }));
    };

    const addTag = (tag: string) => {
        if (tag.trim() && !formData.tags.includes(tag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()]
            }));
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const handleSave = async (publish?: boolean) => {
        if (!formData.title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!editorContent) {
            toast.error("Please add some content");
            return;
        }

        setSaving(true);

        try {
            const postData = {
                ...formData,
                content: JSON.stringify(editorContent),
                published: publish !== undefined ? publish : formData.published,
            };

            const response = await fetch(`/api/posts/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                toast.success("Post updated successfully!");
                router.push(`/admin/posts`);
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error("Failed to update post");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const response = await fetch(`/api/posts/${formData.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success("Post deleted successfully!");
                router.push("/posts");
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error("Failed to delete post");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="container max-w-4xl mx-auto py-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Post</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/posts/${formData.slug}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSave()}
                        disabled={saving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    {formData.published ? (
                        <Button
                            variant="outline"
                            onClick={() => handleSave(false)}
                            disabled={saving}
                        >
                            Unpublish
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                        >
                            Publish
                        </Button>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={deleting}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the post
                                    "{formData.title}" and remove it from the database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete Post
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Badge variant={formData.published ? "default" : "secondary"}>
                                {formData.published ? "Published" : "Draft"}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <Label>Created</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(formData.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter post title..."
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            placeholder="post-slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="thumbnail"
                                placeholder="https://example.com/image.jpg"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                            />
                            <Button variant="outline" size="icon">
                                <ImageIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="Add tags (press Enter or comma to add)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => removeTag(tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditorRoot>
                        <EditorContent
                            initialContent={editorContent}
                            extensions={extensions}
                            className="relative min-h-[500px] w-full max-w-screen-lg border-muted sm:rounded-lg"
                            immediatelyRender={false}
                            editorProps={{
                                handleDOMEvents: {
                                    keydown: (_view, event) => handleCommandNavigation(event),
                                },
                                handlePaste: (view, event) => {
                                    const hasFiles = event.clipboardData?.files?.length;
                                    if (hasFiles) {
                                        event.preventDefault();
                                        // Handle file paste
                                        return true;
                                    }
                                    return false;
                                },
                                attributes: {
                                    class: "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
                                },
                            }}
                            onUpdate={({ editor }) => {
                                setEditorContent(editor.getJSON());
                            }}
                            slotAfter={<ImageResizer />}
                        >
                            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                                <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
                                <EditorCommandList>
                                    {suggestionItems.map((item) => (
                                        <EditorCommandItem
                                            value={item.title}
                                            onCommand={(val) => item.command?.(val)}
                                            className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                                            key={item.title}
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                            </div>
                                        </EditorCommandItem>
                                    ))}
                                </EditorCommandList>
                            </EditorCommand>

                            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
                                <Separator orientation="vertical" />
                                <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                                <Separator orientation="vertical" />
                                <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                                <Separator orientation="vertical" />
                                <MathSelector />
                                <Separator orientation="vertical" />
                                <TextButtons />
                                <Separator orientation="vertical" />
                                <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                            </GenerativeMenuSwitch>
                        </EditorContent>
                    </EditorRoot>
                </CardContent>
            </Card>
        </div>
    );
}
