import { db, Post } from '@lib/db';
import Link from 'next/link';

interface Params {
    params: Promise<{ id: string; }>;
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