'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Post } from '@lib/db/post';
import Link from 'next/link';
import { Plus, Search, Trash2, EditIcon, EyeIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { toast } from 'sonner';
import { PostCard } from '@components/cards/post-card';

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            if (response.ok) {
                const data = await response.json();
                setPosts(data.data || []);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast('Post deleted successfully', {
                    duration: 3000,
                    description: 'The post has been removed from your list.'
                })
                loadPosts(); // Reload posts
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post');
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'published') return matchesSearch && post.published;
        if (filter === 'draft') return matchesSearch && !post.published;
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="container max-w-6xl mx-auto py-8">
                <div className="text-center">Loading posts...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Posts</h1>
                    <p className="text-muted-foreground">Manage your blog posts</p>
                </div>
                <Button asChild className="rounded-xl">
                    <Link href="/admin/posts/add">
                        <Plus className="h-4 w-4" /> New Post
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className='border-x border-foreground/10 border-dashed bg-background'>
                <div className="max-sm:p-5 p-7 bg-primary/5 border-b border-dashed">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border rounded-lg shadow-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2  overflow-x-auto">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                className='rounded-lg border border-primary/5'
                                onClick={() => setFilter('all')}
                            >
                                All ({posts.length})
                            </Button>
                            <Button
                                variant={filter === 'published' ? 'default' : 'outline'}
                                size="sm"
                                className='rounded-lg border border-primary/5'
                                onClick={() => setFilter('published')}
                            >
                                Published ({posts.filter(p => p.published).length})
                            </Button>
                            <Button
                                variant={filter === 'draft' ? 'default' : 'outline'}
                                size="sm"
                                className='rounded-lg border border-primary/5'
                                onClick={() => setFilter('draft')}
                            >
                                Drafts ({posts.filter(p => !p.published).length})
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='max-sm:p-5 p-7 rounded-b-xl'>
                    {filteredPosts.length === 0 ? (
                        <div className='flex flex-col hover:bg-foreground/5 relative max-w-xl mx-auto border border-dashed rounded-lg gap-2 items-center justify-center min-h-80'>
                            <Link className='absolute inset-0' href="/admin/posts/new" />
                            <div className="text-center text-muted-foreground">
                                {searchTerm ? 'No posts found matching your search.' : 'No posts yet. Create your first post!'}
                            </div>
                            {!searchTerm && (
                                <Button className="mt-4 rounded-none" variant={'ghost'}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Create Post
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[300px] relative'>
                            {filteredPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    isAdmin={true}
                                    actionChildren={
                                        <>
                                            <Link
                                                aria-label={`Preview ${post.title}`}
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="flex cursor-pointer rounded-full p-2 hover:ring hover:text-foreground/80 ring-foreground/20 outline-none hover:bg-foreground/10 transition-all items-center justify-center"
                                            >
                                                <EyeIcon className="size-4" aria-hidden="true" />
                                                <span className="sr-only">Preview</span>
                                            </Link>
                                            <Link
                                                aria-label={`Share ${post.title}`}
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="flex cursor-pointer rounded-full p-2 hover:ring hover:text-foreground/80 ring-foreground/20 outline-none hover:bg-foreground/10 transition-all items-center justify-center"
                                            >
                                                <EditIcon className="size-4" aria-hidden="true" />
                                                <span className="sr-only">Edit</span>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="flex cursor-pointer rounded-full p-2 hover:ring hover:text-foreground/80 ring-foreground/20 outline-none hover:bg-foreground/10 transition-all items-center justify-center">
                                                        <Trash2 className="size-4 text-destructive/80" aria-hidden="true" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className='rounded-2xl'>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(post.id)}
                                                            className="bg-destructive rounded-2xl text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    }
                                    className='rounded-2xl'
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
