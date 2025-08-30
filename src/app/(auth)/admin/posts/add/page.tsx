"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { toast } from "sonner";
import { CloudUpload, ImageIcon, Plus, Save, SaveIcon, Search, SparklesIcon, X } from "lucide-react";
import { CloseIcon } from "@components/icons/close-icon";
import { useAuth } from "@components/auth-provider";
import { StringUtils } from "@lib/utils/string";

interface PostFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author_id: number | string;
    category_id: number;
    published: boolean;
    published_date: string;
    featured_image: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    is_featured: boolean;
    view_count: number;
    tags: string[];
}

const extensions = [...defaultExtensions, slashCommand];

export default function AddPostPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [saving, setSaving] = useState(false);
    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [openAI, setOpenAI] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const [formData, setFormData] = useState<PostFormData>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author_id: 0,
        category_id: 1,
        published: false,
        published_date: "",
        featured_image: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: [],
        is_featured: false,
        view_count: 0,
        tags: []
    });

    const [editorContent, setEditorContent] = useState<JSONContent | undefined>(undefined);

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: StringUtils.toSlug(title)
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

    const handleSave = async (e: React.FormEvent<HTMLFormElement> | SubmitEvent) => {

        e.preventDefault();

        // get clicked button
        let submitButton: HTMLButtonElement | undefined;
        if ("nativeEvent" in e) {
            // React.FormEvent
            submitButton = (e.nativeEvent as any).submitter as HTMLButtonElement;
        } else {
            // Native SubmitEvent
            submitButton = (e as SubmitEvent).submitter as HTMLButtonElement;
        }

        const submitData = new FormData(e.target as HTMLFormElement);
        submitData.set('published', String(submitButton?.value));
        submitData.set('author_id', String(user?.id));
        submitData.set('content', JSON.stringify(editorContent || '{}'));

        // get value from content paragraph
        const contentParagraph = editorContent?.content?.[0]?.content?.[0]?.text || '';
        submitData.set('excerpt', contentParagraph);

        // meta description, title + first paragraph of content
        submitData.set('meta_title', formData.title);
        submitData.set('meta_description', formData.title + " - " + contentParagraph);
        submitData.set('meta_keywords', formData.tags.join(', '));

        console.log(Object.fromEntries(submitData.entries()));

        // validate title
        if (!formData.title.trim()) {
            toast.info('Field is required', { description: 'Please enter a title for your post.' });
            const titleInput = document.getElementById('title');
            titleInput?.focus();
            return;
        }

        // validate slug
        if (!formData.slug.trim()) {
            toast.info('Field is required', { description: 'Please enter a slug for your post.' });
            const slugInput = document.getElementById('slug');
            slugInput?.focus();
            return;
        }

        // validate featured image
        if (!formData.featured_image.trim()) {
            toast.info('Field is required', { description: 'Please enter a featured image for your post.' });
            const featuredImageInput = document.getElementById('featured_image');
            featuredImageInput?.focus();
            return;
        }

        // validate tags
        if (formData.tags.length === 0) {
            toast.info('Field is required', { description: 'Please enter at least one tag for your post.' });
            const tagInput = document.getElementById('tags');
            tagInput?.focus();
            return;
        }

        // validate content
        if (String(JSON.stringify(editorContent || '{}')).trim() === '{}') {
            toast.info('Field is required', { description: 'Please enter content for your post.' });
            const contentInput = document.getElementById('content');
            contentInput?.focus();
            return;
        }






        // get data form formdata
        // const form = document.getElementById("post-form") as HTMLFormElement;
        // const formData = new FormData(form);

        // console.log(Object.fromEntries(formData));



        // setSaving(true);

        // try {
        //     const postData = {
        //         title: formData.title,
        //         content: JSON.stringify(editorContent),
        //         description: formData.description,
        //         thumbnail: formData.thumbnail,
        //         tags: formData.tags,
        //         slug: formData.slug,
        //         published: publish,
        //         createdAt: new Date().toISOString(),
        //         authors: [{
        //             name: "PPhat DEv",
        //             profile: "https://github.com/pphatdev.png",
        //             url: "https://pphat.top"
        //         }]
        //     };

        //     const response = await fetch('/api/posts', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(postData)
        //     });

        //     if (response.ok) {
        //         const result = await response.json();
        //         toast.success(publish ? "Post published!" : "Post saved as draft!");
        //         router.push(`/admin/posts`);
        //     } else {
        //         throw new Error('Failed to save post');
        //     }
        // } catch (error) {
        //     console.error('Error saving post:', error);
        //     toast.error("Failed to save post");
        // } finally {
        //     setSaving(false);
        // }
    };

    return (
        <form id="post-form" onSubmit={handleSave} className="container max-w-6xl mx-auto p-2 space-y-6 bg-primary/5 border rounded-4xl">
            <div className="flex items-center justify-between px-2 pt-4">
                <div>
                    <h1 className="text-3xl font-bold">Create New Post</h1>
                    <p className="text-muted-foreground">Manage your blog posts</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        name="publish"
                        value="false"
                        className="rounded-full text-foreground bg-background ring ring-foreground/10 hover:bg-primary/20"
                    >
                        <SaveIcon className="h-4 w-4" />
                        Save Draft
                    </Button>

                    <Button
                        type="submit"
                        disabled={saving}
                        name="publish"
                        value="true"
                        className="rounded-full text-primary-foreground bg-primary ring ring-foreground/10 hover:ring-primary/50"
                    >
                        <CloudUpload className="h-4 w-4" />
                        Publish
                    </Button>
                </div>
            </div>

            <div className='bg-background ring ring-foreground/10 p-4 pt-5 mb-3 rounded-3xl rounded-b-2xl'>
                <div className="flex flex-col gap-4">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="after:content-['*'] after:text-red-500">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter post title..."
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="slug" className="after:content-['*'] after:text-red-500">Slug</Label>
                        <Input
                            id="slug"
                            name="slug"
                            placeholder="post-slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        />
                    </div>

                    {/* <div className="space-y-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter post description..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            rows={3}
                        />
                    </div> */}

                    <div className="space-y-3">
                        <Label htmlFor="featured_image" className="after:content-['*'] after:text-red-500">Thumbnail URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="featured_image"
                                name="featured_image"
                                placeholder="https://example.com/image.jpg"
                                value={formData.featured_image}
                                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                            />
                            <Button variant="outline" size="icon">
                                <ImageIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="tags" className="after:content-['*'] after:text-red-500">Tags</Label>
                        <div className=" relative">
                            <Button variant={'ghost'} title="Auto Generate Tags" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
                                <SparklesIcon className="w-4 h-4" />
                            </Button>
                            <Input
                                id="tags"
                                name="tags"
                                placeholder="Add tags (press Enter or comma to add)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <CloseIcon className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            <div className='bg-background ring ring-foreground/10 p-4 rounded-3xl rounded-t-2xl focus-within:ring-2 focus-within:ring-primary/50'>
                <EditorRoot>
                    <EditorContent
                        initialContent={editorContent}
                        extensions={extensions}
                        className="relative min-h-7 p-1 w-full max-w-screen-lg sm:rounded-lg"
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
            </div>
        </form>
    );
}
