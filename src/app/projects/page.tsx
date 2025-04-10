"use client";

import originData from 'public/data/project.json';
import InfiniteScroll from "@components/infinit-scroll";
import { useEffect, useState } from "react";
import { Spinner } from "@components/ui/loading";
import { staticPaginationJSON } from "@lib/functions/pagination-list";
import { ProjectHero } from "./sections/hero";
import { ProjectCard } from "./sections/project-card";
import { Project } from "./sections/interfaces";

const Projects = () => {
    const limit = 9;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => { next(); }, []);

    const next = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const { posts } = originData;
            const postData = (posts as Project[]).filter(project => project.published === true);

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

            setProjects((prev) => [...prev, ...(data as Project[])]);
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
        <main className="w-full flex flex-col gap-7">
            <ProjectHero />
            <article className="grid max-w-5xl mx-auto  p-4 sm:px-10 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] relative">
                {projects.map((project, index) => (<ProjectCard key={index} project={project} />))}
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

export default Projects;