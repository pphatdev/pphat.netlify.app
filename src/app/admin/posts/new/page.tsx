'use client';

import { createPost } from '../actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setSubmitting(true);
        setError(null);

        const result = await createPost(formData);

        if (result.error) {
            setError(result.error);
            setSubmitting(false);
        } else {
            router.push('/admin/posts/new');
            router.refresh();
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form action={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={6}
                        className="w-full px-3 py-2 border rounded"
                        required
                    ></textarea>
                </div>

                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        className="mr-2"
                    />
                    <label htmlFor="published" className="text-sm">
                        Publish immediately
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}