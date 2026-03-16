"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { Spinner } from "@components/ui/loading";
import { PostCard } from "@components/cards/post-card";
import { Post } from "../../lib/types/interfaces";
import { BlurFade } from '@components/ui/blur-fade';
import { NavigationBar } from "@components/navbar/navbar";
import { PostsHero } from "@components/heros/posts-hero";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@lib/utils";
import { Button } from "src/components/ui";
import Footer from '../../components/layouts/footer';

const ITEMS_PER_PAGE = 12;

const PostsContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");

    // Fetch all posts once on mount
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/posts?page=1&limit=999`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const { data, tags } = await response.json();
                setAllPosts(data as Post[]);
                if (Array.isArray(tags)) setAvailableTags(tags);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Sync search/tag from URL and reset visible count
    useEffect(() => {
        const queryParam = searchParams.get('q') || "";
        const tagParam = searchParams.get('tag') || "";
        setSearchQuery(queryParam);
        setSelectedTag(tagParam);
        setVisibleCount(ITEMS_PER_PAGE);
    }, [searchParams]);

    const filteredPosts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const normalizedTag = selectedTag.toLowerCase();
        return allPosts.filter((post) => {
            const matchesSearch = !query ||
                post.title?.toLowerCase().includes(query) ||
                post.description?.toLowerCase().includes(query) ||
                post.tags?.some(tag => tag.toLowerCase().includes(query));
            const matchesTag = !normalizedTag ||
                post.tags?.some(tag => tag.toLowerCase() === normalizedTag);
            return matchesSearch && matchesTag;
        });
    }, [allPosts, searchQuery, selectedTag]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPosts.length;

    const updateSearchParams = useCallback((query: string, tag: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) { params.set('q', query); } else { params.delete('q'); }
        if (tag.trim()) { params.set('tag', tag); } else { params.delete('tag'); }
        params.delete('page');
        const queryString = params.toString();
        router.push(`/posts${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }, [router, searchParams]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        updateSearchParams(value, selectedTag);
    }, [selectedTag, updateSearchParams]);

    const handleTagChange = useCallback((value: string) => {
        setSelectedTag(value);
        updateSearchParams(searchQuery, value);
    }, [searchQuery, updateSearchParams]);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        updateSearchParams("", selectedTag);
    }, [selectedTag, updateSearchParams]);

    const handleLoadMore = useCallback(() => {
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
            setLoadingMore(false);
        }, 300);
    }, []);

    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <NavigationBar />
            <PostsHero
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onClearSearch={clearSearch}
            />
            <BlurFade delay={0.9} inView={true}>
                {availableTags.length > 0 && (
                    <div className="max-w-5xl mx-auto w-full px-5 mb-4">
                        <div className="flex flex-wrap max-sm:justify-center items-center gap-1.5">
                            <p className="text-xs font-medium">Tag: </p>
                            <Button
                                className={cn("mt-0 py-1 sm:py-2 px-2.5 h-fit! text-xs leading-4 text-foreground/80 hover:text-primary transition-all", !selectedTag && "ring-1 px-4! bg-primary/5 text-primary")}
                                onClick={() => handleTagChange("")}
                                aria-pressed={!selectedTag}
                            >
                                All
                            </Button>

                            {availableTags.map((tag) => {
                                const isActive = selectedTag.toLowerCase() === tag.toLowerCase();
                                return (
                                    <Button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleTagChange(isActive ? "" : tag)}
                                        className={cn(
                                            "mt-0 py-1 sm:py-2 px-2.5 h-fit! text-xs leading-4 text-foreground/80 hover:text-primary transition-all",
                                            isActive && "ring-1 bg-primary/5 text-primary"
                                        )}
                                        aria-pressed={isActive}
                                    >
                                        {tag}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* {(searchQuery || selectedTag) && (
                    <div className="max-w-5xl mx-auto w-full px-5">
                        <p className="text-sm text-muted-foreground mb-4">
                            Found {filteredPosts.length} blog{filteredPosts.length !== 1 ? 's' : ''}
                            {selectedTag && ` in ${selectedTag}`}
                        </p>
                    </div>
                )} */}
                <article className="grid max-w-5xl mx-auto p-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-75 relative">
                    {loading && (
                        <div className="col-span-full flex justify-center items-center py-12">
                            <Spinner variant={'bars'} />
                        </div>
                    )}
                    {!loading && visiblePosts.map((post) => (
                        <PostCard key={post.id || post.slug} post={post} />
                    ))}
                    {!loading && filteredPosts.length === 0 && (searchQuery || selectedTag) && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                No blogs found
                                {searchQuery && ` matching "${searchQuery}"`}
                                {selectedTag && ` in ${selectedTag}`}
                            </p>
                        </div>
                    )}
                </article>
                {!loading && hasMore && (
                    <div className="flex justify-center px-5 mt-2 pb-4">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="flex items-center gap-2 px-6 py-2 rounded-full border border-input bg-background text-sm hover:bg-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                            {loadingMore ? <Spinner variant="bars" /> : "Load more"}
                        </button>
                    </div>
                )}
            </BlurFade>
        </main>
    );
};

const Posts = () => {
    return (
        <Suspense fallback={
            <main className="w-full flex flex-col gap-7 pb-5">
                <NavigationBar />
                <div className="flex justify-center items-center min-h-100">
                    <Spinner variant={'bars'} />
                </div>
            </main>
        }>
            <PostsContent />
            <Footer />
        </Suspense>
    );
};

export default Posts;