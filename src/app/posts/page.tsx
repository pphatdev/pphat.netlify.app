'use client';

import { Post } from '@lib/db';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const PAGE_SIZE = 10;

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=${PAGE_SIZE}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const { data, metadata } = await response.json();

            setTotal(metadata.total);
            setPosts(prevPosts => [...prevPosts, ...data]);
            setHasMore(page < metadata.pages);
            setPage(prevPage => prevPage + 1);

        } catch (error) {
            console.error("Error fetching posts:", error);

        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 200) return;
            fetchData();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchData]);

    return (
        <div className="container max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Blog Posts {total}</h1>
            <div className="grid gap-4">
                {posts.map((post: Post, id) => (
                    <div key={id} className="border rounded p-4">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-gray-600 mt-2">
                            {post.content.substring(0, 500)}...
                        </p>
                        <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                            Read more
                        </Link>
                    </div>
                ))}
                {loading && <div className="text-center p-4">Loading...</div>}
                {!hasMore && <div className="text-center p-4">No more posts</div>}
            </div>
        </div>
    );
}