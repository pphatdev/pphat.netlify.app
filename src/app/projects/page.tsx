"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo, Suspense } from "react";
import InfiniteScroll from "@components/infinit-scroll";
import { Spinner } from "@components/ui/loading";
import { ProjectCard } from "@components/cards/project-card";
import { Project } from "../../lib/types/interfaces";
import { BlurFade } from '@components/ui/blur-fade';
import { NavigationBar } from "@components/navbar/navbar";
import ProjectsStructuredData from "@components/projects-structured-data";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "src/components/ui";
import { cn } from "@lib/utils";

const ProjectHero = dynamic(
    () => import("@components/heros/project-hero").then((mod) => mod.ProjectHero),
    { ssr: false }
);

const ProjectsContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const hasFetched = useRef(false);
    const isFetchingRef = useRef(false);

    const next = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;

        isFetchingRef.current = true;
        setLoading(true);
        const currentPage = page;

        try {
            const response = await fetch(`/api/projects?page=${currentPage}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { data, hasMore: apiHasMore, tags } = await response.json();

            setProjects((prev) => {
                const existingIds = new Set(prev.map(p => p.id));
                const newItems = (data as Project[]).filter(p => !existingIds.has(p.id));
                return [...prev, ...newItems];
            });
            setPage((prev) => prev + 1);
            setHasMore(apiHasMore);
            if (Array.isArray(tags)) {
                setAvailableTags(tags);
            }

        } catch (error) {
            console.error('Error fetching projects:', error);
            setHasMore(false);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, [hasMore, page, limit]);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            next();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync search query with URL params on mount and when URL changes
    useEffect(() => {
        const queryParam = searchParams.get('q') || "";
        const tagParam = searchParams.get('tag') || "";
        setSearchQuery(queryParam);
        setSelectedTag(tagParam);
    }, [searchParams]);

    const filteredProjects = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const normalizedTag = selectedTag.toLowerCase();

        return projects.filter((project) => {
            const matchesSearch = !query || (
                project.title?.toLowerCase().includes(query) ||
                project.description?.toLowerCase().includes(query) ||
                project.tags?.some(tag => tag.toLowerCase().includes(query)) ||
                project.languages?.some(language => language.toLowerCase().includes(query))
            );

            const matchesTag = !normalizedTag ||
                project.tags?.some(tag => tag.toLowerCase() === normalizedTag);

            return matchesSearch && matchesTag;
        });
    }, [projects, searchQuery, selectedTag]);

    const updateSearchParams = useCallback((query: string, tag: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (query.trim()) {
            params.set('q', query);
        } else {
            params.delete('q');
        }

        if (tag.trim()) {
            params.set('tag', tag);
        } else {
            params.delete('tag');
        }

        const queryString = params.toString();
        router.push(`/projects${queryString ? `?${queryString}` : ''}`, { scroll: false });
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

    return (
        <main className="w-full flex flex-col gap-7 pb-5">
            <ProjectsStructuredData />
            <NavigationBar />
            <ProjectHero
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onClearSearch={clearSearch}
            />
            <BlurFade delay={0.9} inView={true}>
                {availableTags.length > 0 && (
                    <div className="max-w-5xl mx-auto w-full px-5 mb-4">
                        <div className="flex flex-wrap max-sm:justify-center items-center gap-1.5">
                            {/* <p className="text-xs font-medium">Tag: </p> */}
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
                <article className="grid max-w-5xl mx-auto p-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-75 relative">
                    {filteredProjects.map((project) => (<ProjectCard key={project.id || project.title} project={project} />))}
                    {filteredProjects.length === 0 && (searchQuery || selectedTag) && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                No projects found
                                {searchQuery && ` matching "${searchQuery}"`}
                                {selectedTag && ` in ${selectedTag}`}
                            </p>
                        </div>
                    )}
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

const Projects = () => {
    return (
        <Suspense fallback={
            <main className="w-full flex flex-col gap-7 pb-5">
                <ProjectsStructuredData />
                <NavigationBar />
                <div className="flex justify-center items-center min-h-100">
                    <Spinner variant={'bars'} />
                </div>
            </main>
        }>
        <ProjectsContent />
        </Suspense>
    );
};

export default Projects;