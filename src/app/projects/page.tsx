"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { EllipsisVertical } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import originData from 'public/data/project.json';
import InfiniteScroll from "@components/infinit-scroll";
import { useEffect, useState } from "react";
import { Spinner } from "@components/ui/loading";
import { staticPaginationJSON } from "@lib/functions/pagination-list";
import { ExternalLinkIcon, GlobeIcon } from "@radix-ui/react-icons";
import Image from "next/image";

interface Project {
    id: string;
    image: string;
    title: string;
    description: string;
    published: boolean;
    tags: string[];
    source: { url: string; name: string, type: string }[];
    authors: { name: string; profile: string; url: string }[];
    [key: string]: any;
}


const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <div
            className="col-span-1 relative overflow-hidden bg-foreground/5 group font-default rounded-2xl p-4 mb-4 ring-1 ring-foreground/10 hover:ring-primary hover:ring-2 transition-all duration-200 ease-in-out flex flex-col h-full"
            role="article"
            tabIndex={-1}>

            <header className='mb-2 relative flex justify-between items-center'>
                <Badge className="font-aladin">JavaScript</Badge>
                <Button
                    variant="outline"
                    size="icon"
                    className="z-10 cursor-pointer bg-foreground/5 rounded-full size-7 p-1.5"
                    aria-label="project options"
                    aria-haspopup="menu">
                    <EllipsisVertical aria-hidden="true" />
                </Button>
            </header>

            <h2 className="text-lg z-10 font-semibold font-default tracking-wide line-clamp-1 pb-1">{project.title}</h2>

            <div className="flex z-10 flex-wrap gap-2 my-2">
                {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border border-primary/50">{tag}</Badge>
                ))}
            </div>

            <p className='font-normal z-10 line-clamp-4 text-foreground/80'>{project.description}</p>

            <footer className="mt-auto flex justify-between pt-2 z-10">
                <div className='bg-foreground/5 ring-1 w-fit ring-foreground/10 justify-end flex rounded-full p-1'>
                    <Link
                        href={`author.url`}
                        className="flex rounded-full hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                        <Image
                            className='rounded-full'
                            src={project.image}
                            alt={project.title}
                            width={32}
                            height={32}
                            priority={false}
                            loading={"lazy"}
                        />
                    </Link>
                </div>
                <div className='bg-foreground/5 ring-1 w-fit ml-auto ring-foreground/10 justify-end flex rounded-full p-1'>
                    {project.source.map((source, index) => (
                        <Link
                            key={index}
                            href={source.url}
                            className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                            {source.type === 'demo' && <ExternalLinkIcon className="size-4"/>}
                            {source.type === 'source' && <GlobeIcon className="size-4"/>}
                        </Link>
                    ))}
                </div>
            </footer>
        </div>
    );
};


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
        <main className="w-full flex flex-col max-w-5xl mx-auto overflow-y-auto p-4 sm:px-10">
            <h1 className='mb-4 text-5xl font-bold'>Projects</h1>
            <article className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] relative">
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