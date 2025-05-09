"use client";

import React, { useEffect, useState, useCallback } from "react";
import originData from 'public/data/post.json';
import InfiniteScroll from "@components/infinit-scroll";
import { Spinner } from "@components/ui/loading";
import { staticPaginationJSON } from "@lib/functions/pagination-list";
import { Post } from "../../lib/types/interfaces";
import { BlurFade } from '@components/ui/blur-fade';
import { NavigationBar } from "@components/navbar/navbar";
import { PostsHero } from "@components/heros/posts-hero";
import { PostCard } from "@components/cards/post-card";

const Posts = () => {
    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPost] = useState<Post[]>([]);

    // This function depends on page state
    const next = useCallback(async () => {
        if (loading) return;

        setLoading(true);

        try {
            const { posts } = originData;
            const postData = (posts as unknown as Post[]).filter(posts => posts.published === true);

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

            setPost((prev) => [...prev, ...(data as Post[])]);
            setPage((prev) => prev + 1);

            if (data.length < limit) setHasMore(false);

        } catch (error) {
            console.error('Error fetching posts:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, page, limit]);

    // Only call next() on initial mount
    useEffect(() => {
        next();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <NavigationBar />
            <PostsHero />
            <BlurFade delay={0.9} inView={true} className="max-w-5xl mx-auto flex gap-5 p-4">
                <article className="flex flex-col md:p-5 gap-5 min-h-[300px] relative">
                    {posts.map((posts, index) => <PostCard key={index} post={posts} />)}
                    <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                        {hasMore && (
                            <div className='col-span-full flex justify-center items-center'>
                                <Spinner variant={'bars'} />
                            </div>
                        )}
                    </InfiniteScroll>
                </article>
                <div className="w-md max-md:hidden order-first duration-300 mt-5 sticky h-screen overflow-y-auto p-5 top-28 bg-foreground/5 group font-sans rounded-3xl mb-4 ring-1 ring-foreground/10">

                </div>
            </BlurFade>
        </main>
    );
};

export default Posts;