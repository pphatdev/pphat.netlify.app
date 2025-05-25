'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';
import { Card, CardContent } from '@components/ui/card';
import { Post } from '@lib/db/post';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { toast } from 'sonner';

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
                toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    // action: {
                    //     label: "Undo",
                    //     onClick: () => console.log("Undo"),
                    // },
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
        <div className="container max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Posts</h1>
                    <p className="text-muted-foreground">Manage your blog posts</p>
                </div>
                <Button asChild>
                    <Link href="/admin/posts/add">
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('all')}
                            >
                                All ({posts.length})
                            </Button>
                            <Button
                                variant={filter === 'published' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('published')}
                            >
                                Published ({posts.filter(p => p.published).length})
                            </Button>
                            <Button
                                variant={filter === 'draft' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('draft')}
                            >
                                Drafts ({posts.filter(p => !p.published).length})
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                {searchTerm ? 'No posts found matching your search.' : 'No posts yet. Create your first post!'}
                            </p>
                            {!searchTerm && (
                                <Button asChild className="mt-4">
                                    <Link href="/admin/posts/new">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Post
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    filteredPosts.map((post) => (
                        <Card key={post.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold truncate">{post.title}</h3>
                                            <Badge variant={post.published ? 'default' : 'secondary'}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                                            {typeof post.content === 'string'
                                                ? post.content.substring(0, 150) + '...'
                                                : 'Rich content post'}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span>Slug: /{post.slug}</span>
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex gap-1">
                                                    {post.tags.slice(0, 3).map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {post.tags.length > 3 && (
                                                        <span className="text-muted-foreground">+{post.tags.length - 3} more</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/posts/${post.slug}`} target="_blank">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/posts/${post.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
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
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(post.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
