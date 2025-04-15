'use client';
import InfiniteScroll from '@components/infinit-scroll';
import { useState, useEffect } from 'react';
import originData from 'public/data/post.json';
import { staticPaginationJSON } from '@lib/functions/pagination-list';
import { Spinner } from '@components/ui/loading';
import { PostCard } from '@components/cards/post-card';
import { Post } from '@lib/db/post';


const Blogs = () => {

    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

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

            setPosts((prev) => [...prev, ...(data as unknown as Post[])]);
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
        <main className="w-full flex flex-col max-w-5xl mx-auto overflow-y-auto p-4 sm:px-10">
            <h1 className='mb-4'>Posts</h1>
            <article className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[500px] relative">
                {posts.map((post, index) => (<PostCard key={index} post={post} index={index} />))}
                <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                    {hasMore && (
                        <div className='col-span-full flex justify-center items-center'>
                            <Spinner variant={'bars'} />
                        </div>
                    )}
                </InfiniteScroll>
            </article>
        </main>
    );
};

export default Blogs;
