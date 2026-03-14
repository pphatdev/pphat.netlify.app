import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { formatDistanceToNow } from 'date-fns';
import { appName, NEXT_PUBLIC_APP_URL } from '@lib/constants';
import { getProjectBySlug, getPublishedProjects } from '@lib/content';
import { NavigationBar } from '@components/navbar/navbar';
import { GridPattern } from '@components/ui/grid-pattern';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { ArrowLeftIcon, Calendar, Clock, ExternalLink, Globe, User } from 'lucide-react';
import BreadcrumbStructuredData from '@components/breadcrumb-structured-data';
import SoftwareApplicationStructuredData from '@components/data-structured/software-application';
import { MarkdownRenderer } from '@components/ui/markdown-renderer';
import { ScrollToTopButton } from '@components/ui/scroll-to-top-button';
import { PostCoverImage } from '@components/ui/post-cover-image';
import { cn } from '@lib/utils';

interface Params {
    params: Promise<{ slug: string }>;
}

function isValidDateValue(value?: string) {
    if (!value) return false;
    return !Number.isNaN(new Date(value).getTime());
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const project = getProjectBySlug(params.slug);

    if (!project) {
        return {
            title: `Project Not Found`,
            description: 'The requested project could not be found',
        };
    }

    return {
        title: `${project.title}`,
        description: project.description,
        authors: project.authors?.map((author) => ({
            name: author.name,
            url: author.url,
        })) || [{
            name: appName,
            url: NEXT_PUBLIC_APP_URL,
        }],
        openGraph: {
            title: `${project.title}`,
            description: project.description,
            type: 'website',
            url: `${NEXT_PUBLIC_APP_URL}/projects/${project.slug}`,
            images: project.image ? [{ url: project.image.toString() }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${project.title}`,
            description: project.description,
            images: project.image ? [{ url: project.image.toString() }] : undefined,
        },
    };
}

export async function generateStaticParams() {
    const projects = getPublishedProjects();
    return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetail(props: Params) {
    const params = await props.params;
    const project = getProjectBySlug(params.slug);

    if (!project) {
        return (
            <>
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={'[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] '}
                />

                <NavigationBar className='sticky' />

                <div className='container flex min-h-svh flex-col justify-center items-center mx-auto py-16 text-center'>
                    <h1 className='text-4xl font-bold mb-4'>Project Not Found</h1>
                    <p className='text-muted-foreground mb-8'>
                        The project you are looking for does not exist.
                    </p>

                    <Button asChild className='ring'>
                        <Link href='/projects'>
                            <ArrowLeftIcon className='w-4 h-4 mr-2' /> Back to Projects
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    const createdAtValid = isValidDateValue(project.createdAt);
    const createdDate = createdAtValid ? new Date(project.createdAt) : null;
    const screenshot = project.image ? [project.image] : [];

    return (
        <>
            <SoftwareApplicationStructuredData
                name={project.title}
                description={project.description}
                url={`${NEXT_PUBLIC_APP_URL}/projects/${project.slug}`}
                repositoryUrl={project.source?.find((item) => item.type === 'source')?.url}
                screenshots={screenshot}
                datePublished={project.createdAt}
                keywords={[...(project.tags || []), ...(project.languages || [])]}
            />

            <BreadcrumbStructuredData
                items={[
                    { name: 'Home', url: NEXT_PUBLIC_APP_URL, position: 1 },
                    { name: 'Projects', url: `${NEXT_PUBLIC_APP_URL}/projects`, position: 2 },
                    { name: project.title, url: `${NEXT_PUBLIC_APP_URL}/projects/${project.slug}`, position: 3 },
                ]}
            />

            <NavigationBar className='fixed' />

            <div className='absolute inset-y-0 left-0 right-0 pointer-events-none opacity-60' aria-hidden='true'>
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={'[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] '}
                />
            </div>

            <article className='max-w-5xl sm:px-4 mx-auto max-xs:pt-0 sm:mt-16 py-8'>
                <div className='mb-1'>
                    {project.image && (
                        <div className='relative w-full p-3 ring-1 rounded-3xl ring-foreground/10 h-full max-xs:max-h-96 md:h-[29rem] mb-4 max-xs:rounded-none max-xs:rounded-b-4xl overflow-hidden'>
                            <PostCoverImage src={project.image} alt={project.title} />
                        </div>
                    )}

                    <div className="flex items-center justify-between pb-2">
                        {(project.languages?.length || 0) > 0 && (
                            <div className='flex w-fit max-sm:justify-center rounded-full gap-1 ring-1 ring-foreground/10 ring-offset-2'>
                                {project.languages?.map((language) => (
                                    <Badge key={language} variant='outline' className="py-1">
                                        {language}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {(project.tags?.length || 0) > 0 && (
                            <div className='flex w-fit max-sm:justify-center rounded-full gap-1 mb-0.5 ring-1 ring-foreground/10 ring-offset-2'>
                                {project.tags?.map((tag) => (
                                    <Badge key={tag} variant='secondary'>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className='space-y-4 max-xs:px-3 relative'>
                        <div className='flex justify-between items-center gap-2 flex-wrap'>
                            <Button asChild>
                                <Link href='/projects'>
                                    <ArrowLeftIcon className='w-4 h-4' /> Back to Projects
                                </Link>
                            </Button>

                            <div className='flex items-center gap-2 flex-wrap'>
                                {project.source?.map((source) => (
                                    <Button asChild key={`${source.type}-${source.url}`}>
                                        <Link href={source.url} target='_blank' rel='noopener noreferrer'>
                                            {source.type === 'demo' ? (
                                                <ExternalLink className='w-4 h-4' />
                                            ) : (
                                                <Globe className='w-4 h-4' />
                                            )}
                                            {source.name || (source.type === 'demo' ? 'Live Demo' : 'Source Code')}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>


                        <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
                            {project.title}
                        </h1>



                        <p className='text-base text-foreground/80 leading-relaxed'>
                            {project.description}
                        </p>

                        <div className='flex mt-5 max-sm:flex-col items-center justify-between gap-4'>
                            <div className='flex max-xs:flex-col max-sm:items-center max-sm:justify-center w-full items-center space-x-4'>
                                <div className='flex gap-5 flex-wrap border-t sm:py-3 border-background'>
                                    {project.authors?.map((author, index) => (
                                        <Link
                                            rel='noopener noreferrer'
                                            target='_blank'
                                            href={author.url === '' ? String(author.profile).replace('.png', '') : author.url}
                                            key={index}
                                            className='flex items-center space-x-2'
                                        >
                                            <Avatar className='w-8 h-8'>
                                                <AvatarImage src={author.profile} alt={author.name} />
                                                <AvatarFallback>
                                                    <User className='w-4 h-4' />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='text-sm'>
                                                <p className='font-medium'>{author.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {createdDate && (
                                    <>
                                        <Separator orientation='vertical' className='h-6' />

                                        <div className='flex items-center justify-between max-xs:mt-5 gap-4'>
                                            <div className='flex items-center space-x-1 max-sm:text-xs text-sm text-muted-foreground'>
                                                <Calendar className='w-4 h-4' />
                                                <time dateTime={project.createdAt} className='whitespace-nowrap'>
                                                    {createdDate.toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </time>
                                            </div>

                                            <div className='flex items-center space-x-1 max-sm:text-xs text-sm text-muted-foreground whitespace-nowrap'>
                                                <Clock className='w-4 h-4' />
                                                <span>{formatDistanceToNow(createdDate)} ago</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className='my-8' />

                <div className='mx-auto max-xs:px-3'>
                    <MarkdownRenderer content={project.content} />
                </div>

                <div className='flex items-center mx-auto justify-between max-xs:px-3 mt-8'>
                    <div className='flex flex-wrap gap-2'>
                        {project.tags?.map((tag) => (
                            <Badge key={`${project.slug}-${tag}`} variant='outline'>
                                #{tag}
                            </Badge>
                        ))}
                    </div>

                    <Button asChild>
                        <Link href='/projects'>
                            <ArrowLeftIcon className='w-4 h-4 mr-2' /> All Projects
                        </Link>
                    </Button>
                </div>
            </article>

            <ScrollToTopButton />
        </>
    );
}