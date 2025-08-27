"use client";

import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "@components/infinit-scroll";
import { Spinner } from "@components/ui/loading";
import { PostCard } from "@components/cards/post-card";
import { BlurFade } from '@components/ui/blur-fade';
import { NavigationBar } from "@components/navbar/navbar";
import { PostsHero } from "@components/heros/posts-hero";
import axios from "axios"
import { Post } from '../../lib/db/post';
import { NEXT_APP_API } from "@lib/constants";

const Posts = () => {
    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    // This function depends on page state
    const next = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        try {
            const { status, data: responseData } = await axios.get(
                `${NEXT_APP_API}/v1/api/articles?page=${page}&limit=${limit}`,
            );

            if (status !== 200) {
                throw new Error(`HTTP error! status: ${status}`);
            }

            const { data, total } = responseData;
            const calculatedTotalPages = Math.ceil(total / limit);
            setTotalPages(calculatedTotalPages);
            setPosts((prev) => [...prev, ...(data as Post[])]);
            setPage((prev) => prev + 1);
            setHasMore(page < calculatedTotalPages);
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
            <BlurFade delay={0.9} inView={true}>
                <article className="grid max-w-5xl mx-auto p-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] relative">
                    {posts.map((post, index) => (<PostCard key={index} post={{ ...post }} />))}
                    <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}>
                        {hasMore && (
                            <div className='col-span-full flex justify-center items-center'>
                                <Spinner variant={'bars'} />
                            </div>
                        )}
                    </InfiniteScroll>
                </article>
            </BlurFade>
        </main>
    );
};

export default Posts;