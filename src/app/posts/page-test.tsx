"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@components/ui/loading";
import { Post } from "@lib/db/post";
import { BlurFade } from '@components/ui/blur-fade';
import { NavigationBar } from "@components/navbar/navbar";
import { PostsHero } from "@components/heros/posts-hero";
import { PostCard } from "@components/cards/post-card";
import { Button } from "@components/ui";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@lib/utils";

const Posts = () => {
    const limit = 10;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [pagination, setPagination] = useState({
        hasNextPage: false,
        hasPreviousPage: false,
        items: [{
            active: false,
            label: "1",
            url: ""
        }]
    });

    const loadPage = async (pageNumber: number) => {
        setLoading(true);

        try {
            const response = await fetch(`/api/posts?page=${pageNumber}&limit=${limit}&sort=desc&published=true`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const result = await response.json();

            setPosts(result.data);
            setTotalPages(result.metadata.pages);

            setPagination(result.pagination)

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
                <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    size={'icon'}
                    className="rounded-xl hover:rounded-2xl"
                >
                    <ChevronLeft />
                </Button>

                <div className="flex gap-2">
                    {
                        pagination.items?.map((item, index) => (
                            <Button
                                variant={'ghost'}
                                key={index}
                                onClick={() => {
                                    if (item.label === '...') return;
                                    const pageNum = parseInt(item.label);
                                    if (!isNaN(pageNum)) {
                                        handlePageChange(pageNum);
                                    }
                                }}
                                size={'icon'}
                                className={cn('', item.active ? 'bg-foreground/20' : 'bg-foreground/10')}
                                disabled={item.label === '...'}
                            >
                                {item.label}
                            </Button>
                        ))
                    }
                </div>

                <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.hasNextPage}
                    size={'icon'}
                    className="rounded-xl hover:rounded-2xl"
                >
                    <ChevronRight />
                </Button>
            </div>
        );
    };

    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <NavigationBar />
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
                                <PostCard key={index} post={post} className="lg:first:col-span-2 lg:nth-[4]:col-span-2" />
                            ))}
                        </>
                    )}
                </article>
                {!loading && totalPages > 1 && (
                    <PaginationControls />
                )}
            </BlurFade>
        </main>
    );
};

export default Posts;