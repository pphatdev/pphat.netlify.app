'use server';

import { db, Post } from '@lib/db/post';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'on';

    if (!title || !content) {
        return { error: 'Title and content are required' };
    }

    try {
        const slug = title.toLowerCase().replace(/\s+/g, '-');

        db.create<Post>('posts', {
            title,
            content,
            slug,
            published,
            createdAt: new Date().toISOString()
        });

        revalidatePath('/admin/posts');
        revalidatePath('/posts');

        return { success: true };
    } catch (error) {
        console.error('Post creation failed:', error);
        return { error: 'Failed to create post' };
    }
}

export async function deletePost(id: string) {
    try {
        const deleted = db.delete('posts', id);

        if (!deleted) {
            return { error: 'Post not found' };
        }

        revalidatePath('/admin/posts');
        revalidatePath('/posts');

        return { success: true };
    } catch (error) {
        console.error('Post deletion failed:', error);
        return { error: 'Failed to delete post' };
    }
}