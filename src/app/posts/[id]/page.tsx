import React from 'react';
import { db, Post } from '@lib/db/post';
import Link from 'next/link';
import { Metadata } from 'next';
import { appName, currentDomain } from '@lib/constants';

interface Params {
    params: Promise<{ id: string; }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = db.getById<Post>('posts', params.id);

    if (!post) {
        return {
            title: `Post Not Found | ${appName}`,
            description: 'The requested article could not be found'
        };
    }

    // Truncate content for description
    const description = post.content.substring(0, 160);

    return {
        title: `${post.title} | ${appName}`,
        description,
        authors: [{
            name: appName,
            url: currentDomain
        }],
        openGraph: {
            title: `${post.title} | ${appName}`,
            description,
            type: 'article',
            url: `${currentDomain}/posts/${post.id}`,
            images: post.thumbnail ? [{ url: post.thumbnail.toString() }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${post.title} | ${appName}`,
            description,
            images: post.thumbnail ? [{ url: post.thumbnail.toString() }] : undefined,
        }
    };
}

export default async function PostDetail(props: Params) {
    const params = await props.params;
    // In a Server Component, you can directly access the database
    const post = db.getById<Post>('posts', params.id);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

            <div className="grid gap-4">
                <div className="border rounded p-4">
                    <h2 className="text-xl font-semibold">{post?.title}</h2>
                    <p className="text-gray-600 mt-2">
                        {post?.content.substring(0, 150)}...
                    </p>
                    <Link
                        href={`/posts/${post?.slug}`}
                        className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </div>
    );
}