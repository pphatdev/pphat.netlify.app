import React from 'react';
import { Badge } from "@components/ui/badge";
import { Project } from "../../lib/types/interfaces";
import Link from "next/link";
import Image from 'next/image';
import { ExternalLinkIcon, GlobeIcon } from "@radix-ui/react-icons";
import { AvatarCircles } from '../ui/avatar-circles';

export const ProjectCard = React.memo(({ project }: { project: Project }) => {
    const avatars = project.authors.map((author) => ({
        imageUrl: author.profile,
        profileUrl: author.url,
        title: author.name,
    }));
    const projectSlug = project.slug || project.id;

    return (
        <div
            className="col-span-1 relative duration-300 bg-foreground/5 group font-sans rounded-3xl p-1 mb-4 border hover:border-primary/50 overflow-hidden transition-all ease-in-out flex flex-col h-full"
            role="article"
            tabIndex={-1}>

            {project.image && (
                <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={450}
                    className="w-full rounded-[18px] z-0 aspect-video object-top-left object-cover transition-transform duration-500"
                />
            )}

            <div className='bg-foreground/5 ring-1 w-fit ring-foreground/10 justify-end flex absolute top-1/2 right-5 -translate-y-[20px] rounded-full p-1'>
                <AvatarCircles numPeople={avatars.length - 4} avatarUrls={avatars} />
            </div>

            <div className="p-2 flex flex-col h-full">
                <div className='bg-background/5 dark:bg-foreground/5 dark:text-foreground text-background ring-1 absolute right-3 top-3 w-fit ml-auto ring-background/5 dark:ring-foreground/10 justify-end flex rounded-full p-1'>
                    <Link
                        href={`/projects/${projectSlug}`}
                        aria-label={'Project details'}
                        title={'Project details'}
                        className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-background/10 dark:hover:bg-foreground/10 transition-all items-center justify-center">
                        <ExternalLinkIcon className="size-4" />
                    </Link>
                </div>
                <header className='mb-2 absolute top-3 left-3 flex justify-between items-center drop-shadow-2xl'>
                    <div className="flex gap-2 items-center">
                        {(project?.tags).slice(0, 2).map((tag, index) => (
                            <Badge key={index} className="font-medium px-2 font-open-sans">{tag}</Badge>
                        ))}
                    </div>
                </header>

                <div className="flex z-10 flex-wrap gap-2 my-1">
                    {(project.languages ?? []).map((language, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] px-1 leading-5 rounded-md border border-primary/50 font-open-sans">{language}</Badge>
                    ))}
                </div>

                <h2 className="text-lg z-10 my-1 font-semibold font-sans tracking-wide line-clamp-1 pb-1">
                    {project.title}
                </h2>

                <p className='font-normal z-10 line-clamp-3 font-open-sans text-sm text-foreground/80'>{project.description}</p>
            </div>
        </div>
    );
});

ProjectCard.displayName = 'ProjectCard';
