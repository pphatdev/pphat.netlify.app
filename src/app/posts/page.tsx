'use client';
import InfiniteScroll from '@components/infinit-scroll';
import { useState, useEffect } from 'react';
import originData from 'public/data/post.json';
import { staticPaginationJSON } from '@lib/functions/pagination-list';
import { Spinner } from '@components/ui/loading';

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

    const limit = 30;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    // Load initial data when component mounts
    useEffect(() => { next(); }, []);

    const next = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const { posts: postData } = originData;
            const { data } = staticPaginationJSON(
                postData,
                postData.length,
                {
                    page: page,
                    limit: limit,
                    search: null,
                    sort: 'asc',
                }
            );

            setPosts((prev) => [...prev, ...(data as Post[])]);
            setPage((prev) => prev + 1);


            if (data.length < limit) setHasMore(false);

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
                {posts.map((post, id) => (<PostCard key={id} post={post} />))}
                <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                    {hasMore && <div className='col-span-3 flex items-center justify-center overflow-hidden'> <Spinner variant={'bars'} /> </div>}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default InfiniteScrollDemo;
