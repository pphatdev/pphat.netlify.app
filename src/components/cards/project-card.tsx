import React, { useState } from 'react';
import { Badge } from "@components/ui/badge";
import Link from "next/link";
import Image from 'next/image';
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { AvatarCircles } from '../ui/avatar-circles';
import { ProjectResponse } from '../../types/projects';

type ProjectCardProps = ProjectResponse['data'][number];

export const ProjectCard = React.memo(({ data }: { data: ProjectCardProps }) => {
    const [imgError, setImgError] = useState(false);
    const contributors = data.contributors.map((author) => ({
        name: author.name,
        url: author.url,
        profile: author.profile,
    }));
    const projectSlug = data?.slug || data?.id;
    const thumbnailSrc = data?.thumbnail?.replace(/^https?:\/\/[^\/]+/, '');
    const showPlaceholder = !data.thumbnail || imgError || thumbnailSrc?.includes('/thumbnail.');
    const placeholderSrc = '/assets/placeholder/rectangle.png';

    return (
        <div
            className="col-span-1 relative duration-300 bg-foreground/5 group font-sans rounded-3xl p-1 mb-4 border hover:border-primary/50 overflow-hidden transition-all ease-in-out flex flex-col h-full"
            role="article"
            tabIndex={-1}>

            {showPlaceholder ? (
                <Image
                    src={placeholderSrc}
                    alt={data.title}
                    width={800}
                    height={450}
                    className="w-full rounded-[18px] z-0 aspect-video object-top-left object-cover transition-transform duration-500"
                    unoptimized
                />
            ) : (
                <Image
                    src={thumbnailSrc}
                    alt={data.title}
                    width={800}
                    height={450}
                    className="w-full rounded-[18px] z-0 aspect-video object-top-left object-cover transition-transform duration-500"
                    onError={() => setImgError(true)}
                />
            )}

            <div className='bg-foreground/5 ring-1 w-fit ring-foreground/10 justify-end flex absolute top-1/2 right-5 -translate-y-5 rounded-full p-1'>
                {contributors.length > 0 && <AvatarCircles avatars={contributors} />}
            </div>

            <div className="p-2 flex flex-col h-full">
                <div className='bg-background/5 dark:bg-foreground/5 dark:text-foreground text-background ring-1 absolute right-3 top-3 w-fit ml-auto ring-background/5 dark:ring-foreground/10 justify-end flex rounded-full p-1'>
                    <Link
                        href={`/projects/${projectSlug}`}
                        aria-label={'Project details'}
                        title={'Project details'}
                        className="flex rounded-full p-2 bg-accent/10 hover:ring ring-foreground/20 hover:bg-background/10 dark:hover:bg-foreground/10 transition-all items-center justify-center">
                        <ExternalLinkIcon className="size-4" />
                    </Link>
                </div>
                <header className='mb-2 absolute top-3 left-3 flex justify-between items-center drop-shadow-2xl'>
                    <div className="flex gap-2 items-center">
                        {(data?.languages ?? []).slice(0, 3).map((tag, index) => (
                            <Badge key={index} className="font-medium px-2 py-1 font-open-sans">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </header>

                <div className="flex z-10 flex-wrap gap-2 my-1">
                    {(data?.tags ?? []).slice(0, 3).map((tag, index) => (
                        <Badge key={index} className="font-medium px-2 py-1 font-open-sans">
                            {tag.tag}
                        </Badge>
                    ))}
                </div>

                <h2 className="text-lg z-10 my-1 font-semibold font-sans tracking-wide line-clamp-1 pb-1">{data.title} </h2>
                <p className='font-normal z-10 line-clamp-3 font-open-sans text-sm text-foreground/80'>{data.description}</p>
            </div>
        </div>
    );
});

ProjectCard.displayName = 'ProjectCard';
