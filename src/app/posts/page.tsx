'use client';
import InfiniteScroll from '@components/infinit-scroll';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    content: string;
    slug: string;
    published: boolean;
    createdAt: string;
}

const PostCard = ({ post }: { post: Post }) => {
    return (
        <div className="flex w-full my-2.5 flex-col gap-2 rounded-lg border-2 border-gray-200 p-2">
            <h1 className="font-bold text-foreground"> {post.title} </h1>
            <div className="text-sm text-muted-foreground">{post.createdAt}</div>
        </div>
    );
};

const InfiniteScrollDemo = () => {
    const [page, setPage] = useState(1); // Start from page 1 instead of 0
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const limit = 30;

    // Load initial data when component mounts
    useEffect(() => {
        next();
    }, []);

    const next = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/posts?limit=${limit}&page=${page}`);

            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }

            const { data } = await res.json();

            setPosts((prev) => [...prev, ...data]);
            setPage((prev) => prev + 1);

            // Check if we have fewer results than requested (limit)
            if (data.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto overflow-y-auto px-10">
            <div className="grid grid-cols-3 col-span-1 gap-4">
                {posts.map((post, id) => ( <PostCard key={id} post={post} /> ))}
                <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                    {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default InfiniteScrollDemo;
