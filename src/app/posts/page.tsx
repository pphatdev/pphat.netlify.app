import { db, Post } from '@lib/db';
import Link from 'next/link';

export default function PostsPage() {
    // In a Server Component, you can directly access the database
    const posts = db.getAll<Post>('posts').filter(post => post.published);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

            <div className="grid gap-4">
                {posts.map(post => (
                    <div key={post.id} className="border rounded p-4">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-gray-600 mt-2">
                            {post.content.substring(0, 150)}...
                        </p>
                        <Link
                            href={`/posts/${post.slug}`}
                            className="text-blue-600 hover:underline mt-2 inline-block"
                        >
                            Read more
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}