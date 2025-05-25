"use client";

import React, { useEffect, useState } from "react";
import originData from 'public/data/post.json';
import { Spinner } from "@components/ui/loading";
import { staticPaginationJSON } from "@lib/functions/pagination-list";
import { Post } from "@lib/db/post";
import { BlurFade } from '@components/ui/blur-fade';
import { NavigationBar } from "@components/navbar/navbar";
import { PostsHero } from "@components/heros/posts-hero";
import { PostCard } from "@components/cards/post-card";

const Posts = () => {
    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    // Load data for the current page
    const loadPage = async (pageNumber: number) => {
        setLoading(true);

        try {
            const { posts } = originData;
            const postData = (posts as unknown as Post[]).filter(post => post.published === true);

            const { data, metadata  } = staticPaginationJSON(
                postData,
                postData.length,
                {
                    page: pageNumber,
                    limit: limit,
                    search: null,
                    sort: 'asc',
                }
            );

            setPosts(data as Post[]);
            setTotalPages(Math.ceil(metadata.total / limit));
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
            loadPage(newPage);
            // Scroll to top when changing page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Load initial page
    useEffect(() => {
        loadPage(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pagination controls component
    const PaginationControls = () => {
        return (
            <div className="flex justify-center items-center mt-8 gap-2">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-md bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-md flex items-center justify-center ${pageNum === page
                                ? 'bg-foreground/20 font-bold'
                                : 'bg-foreground/10 hover:bg-foreground/15'
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-md bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <NavigationBar/>
            <PostsHero />
            <BlurFade delay={0.9} inView={true}>
                <article className="grid max-w-5xl mx-auto p-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px] relative">
                    {loading ? (
                        <div className='col-span-full flex justify-center items-center py-20'>
                            <Spinner variant={'bars'} />
                        </div>
                    ) : (
                        <>
                            {posts.map((post, index) => (
                                <PostCard key={index} post={post} />
                            ))}
                            <div className="col-span-full">
                                <PaginationControls />
                            </div>
                        </>
                    )}
                </article>
                {/* <div className="w-xs shrink-0 max-md:hidden order-last duration-300 mt-5 sticky h-[calc(100vh_-10rem)] overflow-y-auto p-5 top-28 bg-foreground/5 group font-sans rounded-3xl mb-4 ring-1 ring-foreground/10">

                </div> */}
            </BlurFade>
        </main>
    );
};

export default Posts;