'use client';

import React, { useState } from 'react';
import { deletePost } from '../../actions';
import { useRouter, useParams } from 'next/navigation';

export default function DeletePostPage() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const searchParams = new URL(window.location.href).searchParams;
    const postTitle = searchParams.get('title') || 'this post';

    async function handleSubmit() {
        setSubmitting(true);
        setError(null);

        if (!postId) {
            setError('Post ID is required');
            setSubmitting(false);
            return;
        }

        const result = await deletePost(postId);

        if (result.error) {
            setError(result.error);
            setSubmitting(false);
        } else {
            router.push('/admin/posts');
            router.refresh();
            setSubmitting(false);
        }
    }

    if (!postId) {
        return (
            <div className="max-w-xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    No post ID provided. Cannot delete post.
                </div>
                <button
                    onClick={() => router.push('/admin/posts')}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Return to Posts
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Delete Post</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
                <p className="font-bold">Warning</p>
                <p>Are you sure you want to delete &quot;{postTitle}&quot;? This action cannot be undone.</p>
            </div>

            <form action={handleSubmit}>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/posts')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {submitting ? 'Deleting...' : 'Delete Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}